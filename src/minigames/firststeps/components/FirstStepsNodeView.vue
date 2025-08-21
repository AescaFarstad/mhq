<script setup lang="ts">
import { defineProps, computed, inject } from 'vue';
import type { DialogNode, MessageDNode, ChoiceDNode, SkillCheckNode, DialogChoice } from '../../../logic/dialog/DialogTreeNodes';
import type { GameState } from '../../../logic/GameState';
import { makeDialogChoice } from '../../../logic/dialog/Dialog';

const props = defineProps<{
  node: DialogNode;
  choicesMade: string[];
}>();

const gameState = inject<GameState>('gameState');

const messageNode = computed(() => props.node as MessageDNode);
const choiceNode = computed(() => props.node as ChoiceDNode);
const skillCheckNode = computed(() => props.node as SkillCheckNode);

const madeChoice = computed(() => {
    if (props.node.type !== 'choice') return undefined;
    return choiceNode.value.choices.find(c => props.choicesMade.includes(c.id!));
});

const handleChoiceClick = (choice: DialogChoice) => {
    if (!gameState || !gameState.activeMinigame) {
        return;
    }
    makeDialogChoice(gameState.activeMinigame.id, choice.id!, gameState);
};

</script>

<template>
  <div class="dialog-node-view">
    <div v-if="node.type === 'message'" class="node-content message-node">
      <p class="message-text">{{ messageNode.text }}</p>
    </div>
    <div v-else-if="node.type === 'choice'" class="node-content choice-node">
      <ul class="choices-list">
        <li v-for="choice in choiceNode.choices" :key="choice.id" class="choice-line">
          <template v-if="!madeChoice">
            <button class="choice-btn" @click="handleChoiceClick(choice)">{{ choice.text }}</button>
          </template>
          <template v-else>
            <span v-if="madeChoice.id === choice.id" class="made-choice same-size">{{ madeChoice.text }}</span>
            <span v-else class="choice-placeholder same-size">{{ choice.text }}</span>
          </template>
        </li>
      </ul>
    </div>
    <div v-else-if="node.type === 'skill_check'" class="node-content skill-check-node">
      <p class="message-text">{{ skillCheckNode.text }}</p>
      <small>Skill check: {{ skillCheckNode.skillIds.join(', ') }}</small>
    </div>
  </div>
</template>

<style scoped>
.dialog-node-view {
  border: none;
  background: transparent;
  padding: 4px 2px;
  margin: 2px 0;
  color: #e2e8f0;
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.message-text {
  margin: 0;
  line-height: 1.3;
  font-size: 15px;
  color: #ffffff;
}

/* Single-column list to keep rows stable */
.choices-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-auto-rows: min-content;
  row-gap: 6px;
}

.choice-line {
  display: flex;
  align-items: flex-start;
}

/* Button-styled choices sized to content */
.choice-btn {
  padding: 6px 10px;
  background: linear-gradient(135deg, #3d566e 0%, #34495e 100%);
  border: 1px solid #566a80;
  color: #f39c12; /* vivid orange for choice text */
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.choice-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  border-color: #ffb24a; /* lighter orange accent on hover */
  color: #ffb24a;
}

.choice-btn:active {
  transform: translateY(0);
}

/* Match made-choice and placeholder to the button size without the box */
.same-size {
  display: inline-block;
  padding: 6px 10px;
  font-size: 14px;
  white-space: nowrap;
}

.made-choice {
  background: transparent;
  border: none;
  color: #f39c12; /* vivid orange for chosen text */
}

.choice-placeholder {
  visibility: hidden; /* reserve space without showing */
}

.skill-check-node small {
  color: #b6c3d1;
  font-size: 13px;
}
</style> 