<template>
  <div v-if="hasDiscoveryEntries" class="discovery-log-section">
    <div class="discovery-log">
      <div
        v-for="(entry, index) in recentDiscoveryLog"
        :key="`${entry.type}-${index}`"
        class="discovery-log-entry"
        :class="`log-${entry.type}`"
      >
        <span class="log-message">{{ formatDiscoveryLogEntry(entry) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { DiscoveryEvent } from '../../types/discoveryTypes';

const gameState = inject<GameState>('gameState');

// Force reactivity by watching the discoveredItemsCount which we know is reactive
const forceUpdate = ref(0);

// Watch the reactive discoveredItemsCount to trigger updates
watch(() => gameState?.uiState?.discoveredItemsCount ?? 0, () => {
  forceUpdate.value += 1;
}, { immediate: true });

const hasDiscoveryEntries = computed(() => {
  // Force dependency on forceUpdate to ensure reactivity
  const _ = forceUpdate.value;
  const hasEntries = gameState && gameState.discoveryLog && gameState.discoveryLog.length > 0;
  console.log(`[DiscoveryLog] hasDiscoveryEntries computed - forceUpdate: ${forceUpdate.value}, hasEntries: ${hasEntries}, logLength: ${gameState?.discoveryLog?.length ?? 0}`);
  return hasEntries;
});

// Show the most recent 10 log entries, newest first
const recentDiscoveryLog = computed(() => {
  // Force dependency on forceUpdate to ensure reactivity
  const _ = forceUpdate.value;
  if (!gameState || !gameState.discoveryLog) return [];
  const entries = gameState.discoveryLog.slice(-10).reverse();
  console.log(`[DiscoveryLog] recentDiscoveryLog computed - entries count: ${entries.length}`);
  return entries;
});

const formatDiscoveryLogEntry = (entry: DiscoveryEvent): string => {
  switch (entry.type) {
    case 'direct_discovery':
      const itemName = entry.details?.itemName || entry.details?.itemId || 'Unknown';
      const itemType = entry.details?.itemType;
      
      // Try to determine the type of discovery based on the item type or name
      if (itemType === 'skill_specialization') {
        return `New specialization: ${itemName} (+10 XP)`;
      } else if (itemType === 'skill' || itemName.toLowerCase().includes('skill')) {
        return `New skill: ${itemName} (+10 XP)`;
      } else if (itemType === 'building' || itemName.toLowerCase().includes('building')) {
        return `New building: ${itemName} (+10 XP)`;
      } else if (itemType === 'attribute' || itemType === 'attribute_category' || itemName.toLowerCase().includes('attribute')) {
        return `New attribute: ${itemName} (+10 XP)`;
      } else if (itemType === 'resource' || itemName.toLowerCase().includes('resource')) {
        return `New resource: ${itemName} (+10 XP)`;
      } else if (itemType === 'tab' || itemName.toLowerCase().includes('tab')) {
        return `New tab: ${itemName} (+10 XP)`;
      } else {
        return `Discovery: ${itemName} (+10 XP)`;
      }
    case 'brainstorm_discovery':
      return `Brainstormed: ${entry.details?.itemName || entry.details?.itemId || 'Unknown concept'} (+5 XP)`;
    default:
      return `${entry.type}: ${JSON.stringify(entry.details)}`;
  }
};
</script>

<style scoped>
.discovery-log-section {
  flex: 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.discovery-log {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  background: #f9f9f9;
  overflow-y: auto;
}

.discovery-log-entry {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  line-height: 1.3;
}

.discovery-log-entry:last-child {
  border-bottom: none;
}

.log-direct_discovery {
  color: #28a745;
  font-weight: bold;
}

.log-event_discovery {
  color: #6f42c1;
}

.log-brainstorm_discovery {
  color: #fd7e14;
  font-weight: bold;
}

.log-no_match {
  color: #6c757d;
}

.log-invalid_input {
  color: #dc3545;
}

.log-already_discovered {
  color: #17a2b8;
}
</style> 