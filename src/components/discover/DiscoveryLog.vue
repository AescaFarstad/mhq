<template>
  <div v-if="hasAnalysisEntries" class="discovery-analysis-log" ref="logContainer">
    <div ref="contentWrapper" class="log-content-wrapper">
      <div
        v-for="attempt in recentAnalysisLog"
        :key="`discovery-${attempt.tick}`"
        class="analysis-entry-group"
        :class="{ 'multiple-actions': attempt.actions.length > 1 }"
      >
        <!-- XP Reward Display - appears to the left of the blue line -->
        <div 
          v-if="getChainXpFromGroup(attempt.actions)"
          class="chain-xp-display"
        >
          <div class="chain-label">Chain of {{ getChainLength(attempt.actions) }}:</div>
          <div class="inline-xp-display">+ {{ getChainXpFromGroup(attempt.actions) }}xp</div>
        </div>
        
        <div
          v-for="(action, actionIndex) in attempt.actions.filter((a: any) => a.type !== 'CHAIN_XP_REWARD')"
          :key="`discovery-${attempt.tick}-action-${actionIndex}`"
          class="analysis-entry"
          :class="[getActionClass(action), { 'first-action': actionIndex === 0, 'last-action': actionIndex === attempt.actions.filter((a: any) => a.type !== 'CHAIN_XP_REWARD').length - 1 }]"
        >
          <!-- Left spacer for consistent layout -->
          <div class="entry-left">
            <!-- Empty space to maintain layout consistency -->
          </div>
          
          <!-- Main content area -->
          <div class="entry-content">
            <span v-html="formatActionMessage(action)"></span>
          </div>
          
          <!-- Right section for XP only (removed info icon) -->
          <div class="entry-right">
            <!-- Individual Discovery XP Display -->
            <div 
              v-if="(action.type === 'DIRECT_DISCOVERY' || action.type === 'BRAINSTORM_DISCOVERY') && action.xpAwarded"
              class="inline-xp-display"
            >
              + {{ action.xpAwarded }}xp
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Item Tooltip -->
  <ItemDiscoveryTooltip
    :visible="tooltipVisible"
    :x="tooltipX"
    :y="tooltipY"
    :item-id="tooltipItemId"
    :item-name="tooltipItemName"
    :image-type="tooltipImageType"
    :content="tooltipContent"
    :description-only="tooltipDescriptionOnly"
    :keywords="tooltipKeywords"
  />
</template>

<script setup lang="ts">
import { computed, inject, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { DiscoveryAction } from '../../types/discoveryTypes';
import { C } from '../../logic/lib/C';
import ItemDiscoveryTooltip from '../common/ItemDiscoveryTooltip.vue';
import { useItemTooltip } from '../../composables/useItemTooltip';

const gameState = inject<GameState>('gameState');

// Use the tooltip composable
const {
  tooltipVisible,
  tooltipX,
  tooltipY,
  tooltipContent,
  tooltipItemId,
  tooltipItemName,
  tooltipImageType,
  tooltipDescriptionOnly,
  tooltipKeywords,
  setupItemNameHoverListeners
} = useItemTooltip();

// Reference to the log container
const logContainer = ref<HTMLDivElement>();
const contentWrapper = ref<HTMLDivElement>();
let resizeObserver: ResizeObserver | null = null;

// Use a ResizeObserver to automatically scroll when the content size changes.
// This is more robust than watching data changes and using timeouts, especially
// for large updates and animations that affect layout.
onMounted(() => {
  if (logContainer.value && contentWrapper.value) {
    resizeObserver = new ResizeObserver(() => {
      if (logContainer.value) {
        // Always scroll to the bottom when content size changes.
        logContainer.value.scrollTop = logContainer.value.scrollHeight;
      }
    });

    resizeObserver.observe(contentWrapper.value);
  }

  // Add event listeners for dynamically created item names
  nextTick(() => {
    setupItemNameHoverListeners(gameState?.uiState.discoveryAnalysisLog);
  });
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});



// React directly to the reactive UI state data
const hasAnalysisEntries = computed(() => {
  const hasEntries = gameState && gameState.uiState.discoveryAnalysisLog && gameState.uiState.discoveryAnalysisLog.length > 0;
  return hasEntries;
});

// Show the most recent 10 analysis entries, oldest first (newest at bottom)
const recentAnalysisLog = computed(() => {
  if (!gameState || !gameState.uiState.discoveryAnalysisLog) {
    return [];
  }
  // Take last 10 entries without reversing to show newest at bottom
  const entries = gameState.uiState.discoveryAnalysisLog.slice(-10);
  
  // Setup hover listeners whenever the log updates
  nextTick(() => {
    setupItemNameHoverListeners(gameState?.uiState.discoveryAnalysisLog);
  });
  
  return entries;
});





const formatActionMessage = (action: DiscoveryAction): string => {
  if (!action || !action.type) return 'No action';
  
  switch (action.type) {
    case 'DIRECT_DISCOVERY':
      const itemName = action.item.originalItem.displayName || action.item.originalItem.name || action.item.id;
      const itemType = action.item.type;
      
      // Special case for Keywords Overflow
      if (action.item.id === C.DISCOVERY_KEYWORDS_OVERFLOW) {
        return `You have more than <span class="number-highlight">${C.KEYWORDS_HEADER_HIDE_THRESHOLD}</span> active keywords. Nice!`;
      }
      
      const hoverableItemName = `<span class="hoverable-item-name" data-item-id="${action.item.id}" data-item-type="${itemType}">${itemName}</span>`;
      
      if (itemType === 'skill_specialization') {
        return `New specialization: ${hoverableItemName}`;
      } else if (itemType === 'skill') {
        return `New skill: ${hoverableItemName}`;
      } else if (itemType === 'building') {
        return `New building: ${hoverableItemName}`;
      } else if (itemType === 'attribute_category') {
        return `New attribute category: ${hoverableItemName}`;
      } else if (itemType === 'attribute') {
        return `New attribute: ${hoverableItemName}`;
      } else if (itemType === 'resource') {
        return `New resource: ${hoverableItemName}`;
      } else if (itemType === 'tab') {
        return `New tab: ${hoverableItemName}`;
      } else {
        return `Discovery: ${hoverableItemName}`;
      }
      
    case 'BRAINSTORM_DISCOVERY':
      const brainstormItemName = action.item.originalItem.displayName || action.item.originalItem.name || action.item.id;
      const brainstormItemType = action.item.type;
      
      const hoverableBrainstormName = `<span class="hoverable-item-name" data-item-id="${action.item.id}" data-item-type="${brainstormItemType}">${brainstormItemName}</span>`;
      
      if (brainstormItemType === 'skill_specialization') {
        return `Brainstormed specialization: ${hoverableBrainstormName}`;
      } else if (brainstormItemType === 'skill') {
        return `Brainstormed skill: ${hoverableBrainstormName}`;
      } else if (brainstormItemType === 'attribute_category') {
        return `Brainstormed attribute category: ${hoverableBrainstormName}`;
      } else if (brainstormItemType === 'attribute') {
        return `Brainstormed attribute: ${hoverableBrainstormName}`;
      } else if (brainstormItemType === 'building') {
        return `Brainstormed building: ${hoverableBrainstormName}`;
      } else {
        return `Brainstormed: ${hoverableBrainstormName}`;
      }
      
    case 'ADD_ACTIVE_KEYWORD':
      return `New keyword <span class="keyword-highlight">${action.keyword}</span> relates to <span class="number-highlight">${action.relatedItemIds.length}</span> undiscovered items`;
      
    case 'ALREADY_DISCOVERED':
      const discoveredItemName = action.item.originalItem.displayName || action.item.originalItem.name || action.item.id;
      const discoveredItemType = action.item.type;
      const hoverableDiscoveredName = `<span class="hoverable-item-name" data-item-id="${action.item.id}" data-item-type="${discoveredItemType}">${discoveredItemName}</span>`;
      return `Already discovered: ${hoverableDiscoveredName}`;
      
    case 'KEYWORD_ALREADY_ACTIVE':
      return `Keyword <span class="keyword-highlight">${action.keyword}</span> is already active`;
      
    case 'KEYWORD_ALREADY_DISCARDED':
      return `Keyword <span class="keyword-highlight">${action.keyword}</span> was previously discarded`;
      
    case 'ADD_DISCARDED_KEYWORD':
      return `Keyword <span class="keyword-highlight">${action.keyword}</span> exists but all related items are discovered`;
      
    case 'NO_MATCH':
      return `No matches found for <span class="error-highlight">${action.input}</span>`;
      
    case 'INVALID_INPUT':
      return `Invalid input: ${action.reason}`;
      
    case 'TOO_MANY_WORDS':
      return `A human mind can only hold <span class="number-highlight">3</span> items at once. You entered <span class="number-highlight">${action.wordCount}</span>`;
      
    default:
      return `Unknown action: ${JSON.stringify(action)}`;
  }
};

const getActionClass = (action: DiscoveryAction): string => {
  if (!action || !action.type) return 'analysis-error';
  
  switch (action.type) {
    case 'DIRECT_DISCOVERY':
    case 'BRAINSTORM_DISCOVERY':
    case 'ADD_ACTIVE_KEYWORD':
    case 'CHAIN_XP_REWARD':
      return 'analysis-success';
      
    case 'ALREADY_DISCOVERED':
    case 'KEYWORD_ALREADY_ACTIVE':
    case 'KEYWORD_ALREADY_DISCARDED':
    case 'ADD_DISCARDED_KEYWORD':
      return 'analysis-info';
      
    case 'NO_MATCH':
    case 'INVALID_INPUT':
    case 'TOO_MANY_WORDS':
      return 'analysis-error';
      
    default:
      return 'analysis-info';
  }
};

const getChainXpFromGroup = (actionsArray: DiscoveryAction[]): number | null => {
  const chainXpAction = actionsArray.find(action => action.type === 'CHAIN_XP_REWARD') as { type: 'CHAIN_XP_REWARD'; xpAwarded: number } | undefined;
  return chainXpAction ? chainXpAction.xpAwarded : null;
};

const getChainLength = (actionsArray: DiscoveryAction[]): number => {
  return actionsArray.filter(action => action.type !== 'CHAIN_XP_REWARD').length;
};



</script>

<style scoped>
.discovery-analysis-log {
  width: 100%;
  max-width: 550px;
  max-height: 50vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-left: 80px;
  padding-right: 12px;
  margin-right: 58px;
  scrollbar-gutter: stable;
}

.log-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.analysis-entry-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.analysis-entry-group.multiple-actions::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #4a90e2;
  border-radius: 1px;
}

.chain-xp-display {
  position: absolute;
  left: -85px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  z-index: 5;
  min-width: 80px;
}

.chain-label {
  font-size: 10px;
  font-weight: bold;
  color: #e2e8f0;
  text-align: center;
}

.inline-xp-display {
  font-size: 12px;
  font-weight: bold;
  color: #f39c12;
  background-color: rgba(243, 156, 18, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(243, 156, 18, 0.3);
  white-space: nowrap;
}

.analysis-entry {
  position: relative;
  color: #e2e8f0;
  font-size: 14px;
  margin: 0;
  padding: 4px 8px;
  min-height: 20px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: rgba(52, 73, 94, 0.3);
  transition: all 0.3s ease;
  animation: slideInUp 0.3s ease-out;
}

.entry-left {
  flex: 0 0 auto;
  width: 0; /* Takes no space when empty */
}

.entry-content {
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.entry-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
    margin-bottom: -20px;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    margin-bottom: 0;
  }
}

.analysis-success {
  background-color: rgba(46, 204, 113, 0.2);
  color: #e2e8f0;
}

.analysis-info {
  background-color: rgba(52, 152, 219, 0.2);
  color: #e2e8f0;
}

.analysis-error {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e2e8f0;
}

.analysis-entry :deep(.keyword-highlight) {
  font-weight: bold;
  color: #5dade2; /* Brighter blue for better visibility */
}

.analysis-entry :deep(.hoverable-item-name) {
  font-weight: bold;
  color: #ffd700; /* Yellow highlight for discovered items */
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 2px;
}

.analysis-entry :deep(.hoverable-item-name:hover) {
  color: #ffed4e; /* Slightly brighter on hover */
}

.analysis-entry :deep(.number-highlight) {
  font-weight: bold;
}

.analysis-entry :deep(.error-highlight) {
  font-weight: bold;
  color: #e74c3c;
}

.analysis-entry :deep(.xp-reward) {
  font-weight: bold;
  color: #f39c12; /* Orange/gold color for XP rewards */
}


</style> 