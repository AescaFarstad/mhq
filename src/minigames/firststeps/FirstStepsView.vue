<script setup lang="ts">
import { inject, computed, ref, watch, onBeforeUnmount } from 'vue';
import type { GameState } from '../../logic/GameState';
import { DialogNode, DialogNodeDef, ChoiceDNode, SkillCheckNodeDef } from '../../logic/dialog/DialogTreeNodes';
import FirstStepsNodeView from './components/FirstStepsNodeView.vue';
import { firstStepsDialogRaw } from '../../logic/data/firstStepsDialog';
import type { BaseMinigame, MinigameState } from '../../logic/minigames/MinigameTypes';

const gameState = inject<GameState>('gameState');

const activeMinigame = computed(() => {
  return gameState?.activeMinigame as BaseMinigame<MinigameState> | null;
});

const dialogState = computed(() => {
  if (!activeMinigame.value || !gameState?.uiState.activeMinigameState) return null;
  return (gameState.uiState.activeMinigameState as any).dialogState;
});

const dialogDef = computed(() => {
  const defId = (dialogState.value as any)?.definitionId as string | undefined;
  if (!defId) return null;
  return gameState?.lib.dialogs.getDialog(defId) ?? null;
});

// Use processed dialog definition to resolve active nodes (ensures generated IDs, etc.)
const activeNodes = computed(() => {
  if (!dialogState.value || !dialogDef.value) return [] as DialogNode[];
  const defNodes = dialogDef.value.nodes; // Record<string, DialogNode>
  const activeNodeIds = dialogState.value.nodes as string[];
  return activeNodeIds
    .map(id => defNodes[id])
    .filter((n): n is DialogNode => !!n);
});

const dialogTree = computed(() => {
  if (!dialogDef.value) return null;

  // Build subtree traversal from processed definition
  const defNodes = dialogDef.value.nodes; // Record<string, DialogNode>

  const getSubtree = (startNodeId: string): DialogNode[] => {
    const subtree: DialogNode[] = [];
    const queue: string[] = [startNodeId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const node = defNodes[currentId];
      if (!node) continue;

      subtree.push(node);

      if (node.type === 'message' && node.next) {
        queue.push(node.next);
      } else if (node.type === 'choice') {
        (node as any as ChoiceDNode).choices.forEach(c => c.next && queue.push(c.next));
      } else if (node.type === 'skill_check') {
        const sc = node as any as SkillCheckNodeDef;
        if (sc.successNext) queue.push(sc.successNext);
        if (sc.failureNext) queue.push(sc.failureNext);
      }
    }
    return subtree;
  };

  const levelGatedSubtrees = levelGatedNodes.value.map(lgNode => {
    return {
      ...lgNode,
      subtree: getSubtree(lgNode.id!).slice(1)
    }
  });

  return {
    main: getSubtree('initial_arrival'),
    levelGated: levelGatedSubtrees
  }
});

const mainThreadNodes = computed(() => {
  if (!dialogTree.value) return [] as DialogNode[];
  const levelGatedNodeIds = new Set(levelGatedNodes.value.map(n => n.id));
  return activeNodes.value.filter(n => !levelGatedNodeIds.has(n.id!) && !isNodeInAnySubtree(n.id!));
});

const isNodeInAnySubtree = (nodeId: string) => {
  if (!dialogTree.value) return false;
  return dialogTree.value.levelGated.some(lg => lg.subtree.some((n: any) => n.id === nodeId));
}

const levelGatedNodes = computed(() => {
  // Use raw ordering but rely on processed IDs existing the same
  return (firstStepsDialogRaw.nodes as DialogNodeDef[])
    .filter(node => node.data?.level)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
});

const getActiveNodesForSubtree = (subtree: DialogNode[]) => {
  const activeIds = new Set(activeNodes.value.map(n => n.id));
  return subtree.filter(n => activeIds.has(n.id!));
}

const isRevealed = (nodeId: string) => activeNodes.value.some(n => n.id === nodeId);

// Stable two-column assignment: 1-based odd index to left, even to right
const leftColumnNodes = computed(() => dialogTree.value ? dialogTree.value.levelGated.filter((_, idx) => idx % 2 === 0) : []);
const rightColumnNodes = computed(() => dialogTree.value ? dialogTree.value.levelGated.filter((_, idx) => idx % 2 === 1) : []);

// Pending indicator logic: show animated dots for 1s after a subtree grows
const subtreeCounts = ref<Map<string, number>>(new Map());
const subtreePending = ref<Set<string>>(new Set());
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

const computeSubtreeCount = (rootId: string): number => {
  const lg = dialogTree.value?.levelGated.find(l => l.id === rootId) as any;
  if (!lg) return 0;
  return getActiveNodesForSubtree(lg.subtree).length;
};

const getLastActiveNodeInSubtree = (rootId: string): DialogNode | undefined => {
  const lg = dialogTree.value?.levelGated.find(l => l.id === rootId) as any;
  if (!lg) return undefined;
  const activeIds = new Set(activeNodes.value.map(n => n.id));
  // Walk subtree in reverse order to find the last active node by definition order
  for (let i = lg.subtree.length - 1; i >= 0; i--) {
    const node = lg.subtree[i] as DialogNode;
    if (node?.id && activeIds.has(node.id)) {
      return node;
    }
  }
  return undefined;
};

watch([activeNodes, dialogTree], () => {
  if (!dialogTree.value) return;
  for (const lg of dialogTree.value.levelGated) {
    const rootId = lg.id!;
    const prev = subtreeCounts.value.get(rootId);
    const current = computeSubtreeCount(rootId);
    if (prev === undefined) {
      subtreeCounts.value.set(rootId, current);
      continue;
    }
    if (current > prev) {
      const lastNode = getLastActiveNodeInSubtree(rootId) as any;
      const isLeaf = lastNode?.leaf === true;
      if (!isLeaf) {
        subtreePending.value.add(rootId);
        const existing = pendingTimers.get(rootId);
        if (existing) clearTimeout(existing);
        const t = setTimeout(() => {
          subtreePending.value.delete(rootId);
          pendingTimers.delete(rootId);
        }, 1000);
        pendingTimers.set(rootId, t);
      } else {
        // Ensure pending is cleared if last node is a leaf
        subtreePending.value.delete(rootId);
        const existing = pendingTimers.get(rootId);
        if (existing) {
          clearTimeout(existing);
          pendingTimers.delete(rootId);
        }
      }
    }
    subtreeCounts.value.set(rootId, current);
  }
}, { immediate: true });

const isPending = (rootId: string) => subtreePending.value.has(rootId);

onBeforeUnmount(() => {
  for (const t of pendingTimers.values()) clearTimeout(t);
  pendingTimers.clear();
});
</script>

<template>
  <div class="firststeps-container">
    <div class="content-layout compact">
      <div class="journal-panel subtle block-bg">
        <div class="journal-content">
          <FirstStepsNodeView
            v-for="node in mainThreadNodes"
            :key="node.id"
            :node="(node as DialogNode)"
            :choices-made="dialogState?.choicesMade ?? []"
          />
        </div>
      </div>

      <div class="chambers-panel subtle">
        <div class="chambers-two-cols">
          <div class="col-stack">
            <template v-for="lgNodeDef in leftColumnNodes" :key="lgNodeDef.id">
              <div class="chamber-card minimal" :class="{ revealed: isRevealed(lgNodeDef.id!) }">
                <FirstStepsNodeView
                  v-if="isRevealed(lgNodeDef.id!)"
                  :node="(activeNodes.find(n => n.id === lgNodeDef.id) as DialogNode)!"
                  :choices-made="dialogState?.choicesMade ?? []"
                />
                <div v-else class="node-placeholder invisible-placeholder" aria-hidden="true"></div>

                <div class="subtree">
                  <FirstStepsNodeView
                    v-for="node in getActiveNodesForSubtree((lgNodeDef as any).subtree)"
                    :key="node.id"
                    :node="node"
                    :choices-made="dialogState?.choicesMade ?? []"
                  />
                </div>
                <div v-if="isPending(lgNodeDef.id!)" class="pending-dots" aria-hidden="true">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            </template>
          </div>
          <div class="col-stack">
            <template v-for="lgNodeDef in rightColumnNodes" :key="lgNodeDef.id">
              <div class="chamber-card minimal" :class="{ revealed: isRevealed(lgNodeDef.id!) }">
                <FirstStepsNodeView
                  v-if="isRevealed(lgNodeDef.id!)"
                  :node="(activeNodes.find(n => n.id === lgNodeDef.id) as DialogNode)!"
                  :choices-made="dialogState?.choicesMade ?? []"
                />
                <div v-else class="node-placeholder invisible-placeholder" aria-hidden="true"></div>

                <div class="subtree">
                  <FirstStepsNodeView
                    v-for="node in getActiveNodesForSubtree((lgNodeDef as any).subtree)"
                    :key="node.id"
                    :node="node"
                    :choices-made="dialogState?.choicesMade ?? []"
                  />
                </div>
                <div v-if="isPending(lgNodeDef.id!)" class="pending-dots" aria-hidden="true">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.firststeps-container {
  width: 100%;
  height: 100%;
  padding: 10px 10px 20px;
  background-color: #2c3e50;
  color: #e2e8f0;
  overflow: auto;
  box-sizing: border-box;
}

.content-layout.compact {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 10px;
}

.subtle {
  background: transparent;
  border: none;
  padding: 6px;
}

/* Subtle blocking background for the starting/main thread */
.block-bg {
  background: rgba(52, 73, 94, 0.22);
  border-radius: 8px;
}

.journal-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding: 6px 6px 6px 6px;
}

/* Stable two-column layout for exploration options */
.chambers-two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.col-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chamber-card.minimal {
  background: transparent;
  border-radius: 8px;
  padding: 4px;
}

/* Revealed subtrees get a subtle blocking background (no border) */
.chamber-card.revealed {
  background: rgba(64, 88, 111, 0.22);
}

.subtree {
  display: flex;
  flex-direction: column;
  gap: 2px; /* tighter, terminal-like spacing within a subtree */
}

/* Animated ellipsis indicator */
.pending-dots {
  display: inline-flex;
  gap: 2px;
  padding: 2px 0 0 2px;
  color: #e2e8f0;
  opacity: 0.85;
}

.pending-dots span {
  animation: blink 1s infinite ease-in-out;
}

.pending-dots span:nth-child(2) { animation-delay: 0.15s; }
.pending-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes blink {
  0%, 20% { opacity: 0; }
  30%, 70% { opacity: 1; }
  80%, 100% { opacity: 0; }
}

.node-placeholder {
  min-width: 140px;
  min-height: 42px;
  border-radius: 6px;
}

.invisible-placeholder {
  visibility: hidden;
}
</style> 