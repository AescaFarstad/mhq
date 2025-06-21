<template>
  <div v-if="hasAnalysisEntries" class="discovery-analysis-log">
    <div
      v-for="(actionsArray, index) in recentAnalysisLog"
      :key="`discovery-${index}`"
      class="analysis-entry-group"
      :class="{ 'multiple-actions': actionsArray.length > 1 }"
    >
      <div
        v-for="(action, actionIndex) in actionsArray"
        :key="`discovery-${index}-action-${actionIndex}`"
        class="analysis-entry"
        :class="[getActionClass(action), { 'first-action': actionIndex === 0, 'last-action': actionIndex === actionsArray.length - 1 }]"
      >
        <span v-html="formatActionMessage(action)"></span>
        <div 
          v-if="hasAdditionalInfo(action)"
          class="info-icon-container"
          @mouseenter="showTooltip($event, action)"
          @mouseleave="hideTooltip"
        >
          <span class="info-icon">ℹ</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Custom Tooltip -->
  <div
    v-if="tooltipVisible"
    class="custom-tooltip"
    :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
  >
    <div class="tooltip-content" v-html="tooltipContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { DiscoveryAction } from '../../types/discoveryTypes';

const gameState = inject<GameState>('gameState');

// Force reactivity by watching the discoveredItemsCount which we know is reactive
const forceUpdate = ref(0);

// Tooltip state
const tooltipVisible = ref(false);
const tooltipX = ref(0);
const tooltipY = ref(0);
const tooltipContent = ref('');

// Watch the reactive discoveredItemsCount to trigger updates
watch(() => gameState?.uiState?.discoveredItemsCount ?? 0, () => {
  forceUpdate.value += 1;
}, { immediate: true });

const hasAnalysisEntries = computed(() => {
  // Force dependency on forceUpdate to ensure reactivity
  forceUpdate.value;
  const hasEntries = gameState && gameState.uiState.discoveryAnalysisLog && gameState.uiState.discoveryAnalysisLog.length > 0;
  return hasEntries;
});

// Show the most recent 10 analysis entries, oldest first (newest at bottom)
const recentAnalysisLog = computed(() => {
  // Force dependency on forceUpdate to ensure reactivity
  forceUpdate.value;
  if (!gameState || !gameState.uiState.discoveryAnalysisLog) return [];
  // Take last 10 entries without reversing to show newest at bottom
  const entries = gameState.uiState.discoveryAnalysisLog.slice(-10);
  return entries;
});

const hasAdditionalInfo = (action: DiscoveryAction & { isBrainstorm?: boolean }): boolean => {
  if (!action || !action.type) return false;
  
  switch (action.type) {
    case 'DIRECT_DISCOVERY':
      return action.isBrainstorm === true;
    default:
      return false;
  }
};

const getAdditionalInfo = (action: DiscoveryAction & { isBrainstorm?: boolean; leadingKeywords?: string[] }): string => {
  if (!action || !action.type) return '';
  
  switch (action.type) {
    case 'DIRECT_DISCOVERY':
      if (action.isBrainstorm) {
        // Use the stored leading keywords from the brainstorm discovery
        const leadingKeywords = (action as any).leadingKeywords || [];
        
        if (leadingKeywords.length > 0) {
          return `Keywords that led to this discovery:<br/>` +
                 leadingKeywords.map((k: string) => `<span class="keyword-highlight">${k}</span>`).join(', ');
        }
        return 'This item was discovered through brainstorming from accumulated keywords.';
      }
      break;
  }
  
  return '';
};

const showTooltip = (event: MouseEvent, action: DiscoveryAction & { isBrainstorm?: boolean; leadingKeywords?: string[] }) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  tooltipX.value = rect.left - 200; // Position to the left of the icon
  tooltipY.value = rect.top - 10; // Slightly above the icon
  tooltipContent.value = getAdditionalInfo(action);
  tooltipVisible.value = true;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

const formatActionMessage = (action: DiscoveryAction & { isBrainstorm?: boolean }): string => {
  if (!action || !action.type) return 'No action';
  
  switch (action.type) {
    case 'DIRECT_DISCOVERY':
      const itemName = action.item.originalItem.displayName || action.item.originalItem.name || action.item.id;
      const itemType = action.item.type;
      
      // Check if this is a brainstorm discovery
      if (action.isBrainstorm) {
        return `Brainstormed: ${itemName} (+5 XP)`;
      }
      
      if (itemType === 'skill_specialization') {
        return `New specialization: ${itemName} (+10 XP)`;
      } else if (itemType === 'skill') {
        return `New skill: ${itemName} (+10 XP)`;
      } else if (itemType === 'building') {
        return `New building: ${itemName} (+10 XP)`;
      } else if (itemType === 'attribute' || itemType === 'attribute_category') {
        return `New attribute: ${itemName} (+10 XP)`;
      } else if (itemType === 'resource') {
        return `New resource: ${itemName} (+10 XP)`;
      } else if (itemType === 'tab') {
        return `New tab: ${itemName} (+10 XP)`;
      } else {
        return `Discovery: ${itemName} (+10 XP)`;
      }
      
    case 'ADD_ACTIVE_KEYWORD':
      return `New keyword <span class="keyword-highlight">${action.keyword}</span> relates to <span class="number-highlight">${action.relatedItemIds.length}</span> undiscovered items`;
      
    case 'ALREADY_DISCOVERED':
      const discoveredItemName = action.item.originalItem.displayName || action.item.originalItem.name || action.item.id;
      return `Already discovered: ${discoveredItemName}`;
      
    case 'KEYWORD_ALREADY_ACTIVE':
      const relatedItems = gameState?.activeKeywords.get(action.keyword) || [];
      return `Keyword <span class="keyword-highlight">${action.keyword}</span> is already active with <span class="number-highlight">${relatedItems.length}</span> related items`;
      
    case 'KEYWORD_ALREADY_DISCARDED':
      return `Keyword <span class="keyword-highlight">${action.keyword}</span> was previously discarded`;
      
    case 'ADD_DISCARDED_KEYWORD':
      return `Keyword <span class="keyword-highlight">${action.keyword}</span> exists but all related items are discovered`;
      
    case 'NO_MATCH':
      return `No matches found for <span class="error-highlight">${action.input}</span>`;
      
    case 'INVALID_INPUT':
      return `Invalid input: ${action.reason}`;
      
    default:
      return `Unknown action: ${JSON.stringify(action)}`;
  }
};

const getActionClass = (action: DiscoveryAction): string => {
  if (!action || !action.type) return 'analysis-error';
  
  switch (action.type) {
    case 'DIRECT_DISCOVERY':
    case 'ADD_ACTIVE_KEYWORD':
      return 'analysis-success';
      
    case 'ALREADY_DISCOVERED':
    case 'KEYWORD_ALREADY_ACTIVE':
    case 'KEYWORD_ALREADY_DISCARDED':
    case 'ADD_DISCARDED_KEYWORD':
      return 'analysis-info';
      
    case 'NO_MATCH':
    case 'INVALID_INPUT':
      return 'analysis-error';
      
    default:
      return 'analysis-info';
  }
};
</script>

<style scoped>
.discovery-analysis-log {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  left: -12px;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #4a90e2;
  border-radius: 2px;
}

.analysis-entry-group.multiple-actions::after {
  content: '';
  position: absolute;
  left: -12px;
  top: 0;
  height: 8px;
  width: 8px;
  border-left: 3px solid #4a90e2;
  border-top: 3px solid #4a90e2;
  border-radius: 3px 0 0 0;
}

.analysis-entry-group.multiple-actions .analysis-entry:last-child::after {
  content: '';
  position: absolute;
  left: -12px;
  bottom: 0;
  height: 8px;
  width: 8px;
  border-left: 3px solid #4a90e2;
  border-bottom: 3px solid #4a90e2;
  border-radius: 0 0 0 3px;
}

.analysis-entry {
  position: relative;
  color: #333;
  font-size: 14px;
  text-align: center;
  margin: 0;
  padding: 4px 8px;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.analysis-success {
  background-color: rgba(46, 204, 113, 0.1);
  color: #333;
}

.analysis-info {
  background-color: rgba(52, 152, 219, 0.1);
  color: #333;
}

.analysis-error {
  background-color: rgba(231, 76, 60, 0.1);
  color: #333;
}

.analysis-entry :deep(.keyword-highlight) {
  font-weight: bold;
  color: #007bff;
}

.analysis-entry :deep(.number-highlight) {
  font-weight: bold;
}

.analysis-entry :deep(.error-highlight) {
  font-weight: bold;
  color: #dc3545;
}

.info-icon-container {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.info-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.info-icon:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

.custom-tooltip {
  position: fixed;
  z-index: 1000;
  max-width: 400px;
  background-color: #2c3e50;
  color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: 0.95;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 0.95;
    transform: translateY(0);
  }
}

.tooltip-content {
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
}

.tooltip-content :deep(.keyword-highlight) {
  color: #a4d7fe;
  font-weight: bold;
}

.tooltip-content :deep(strong) {
  color: white;
}
</style> 