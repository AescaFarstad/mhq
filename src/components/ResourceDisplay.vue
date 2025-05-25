<script setup lang="ts">
import { inject, computed } from 'vue';
import { GameState } from '../logic/GameState';
// No need for Resource type import since we're using the simplified UI data

// Inject the game state
const gameState = inject<GameState>('gameState');

// Computed property to get resources from the reactive uiState
const resourceEntries = computed(() => {
  if (!gameState) return [];
  // Use the reactive uiState object
  return Object.entries(gameState.uiState.resources);
});
</script>

<template>
  <div class="resource-panel">
    <h2>Resources</h2>
    <div v-if="!gameState">Loading resources...</div>
    <div v-else-if="resourceEntries.length === 0">No resources defined.</div>
    <div v-else>
      <div v-for="[key, resource] in resourceEntries" :key="key" class="resource-item">
        <span class="resource-name">{{ key.charAt(0).toUpperCase() + key.slice(1) }}:</span>
        <div class="resource-amount-group">
            <!-- Access properties directly from the reactive object -->
            <span class="resource-current">{{ resource.current.toFixed(1) }}</span>
            <span class="resource-separator">/</span>
            <span class="resource-max">{{ resource.max.toFixed(0) }}</span>
        </div>
        <span class="resource-income">
          <!-- Simplified income display -->
          +{{ resource.income.toFixed(2) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-panel {
  padding: 2px;
  width: 250px;
}

.resource-panel h2 {
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
  font-size: 1.2em;
}

.resource-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-family: monospace;
  font-size: 1.0em;
  padding: 4px 6px;
  border: 1px solid #ddd;
  background-color: #fff;
  margin-bottom: 5px;
  border-radius: 4px;
}

.resource-name {
  font-weight: bold;
  margin-right: 10px;
  text-align: left;
  flex-shrink: 0;
  min-width: 40px;
}

.resource-amount-group {
  display: inline-flex;
  justify-content: center;
  align-items: baseline;
  flex-grow: 1;
  text-align: center;
  margin: 0 5px;
}

.resource-current {
  text-align: right;
}

.resource-separator {
  margin: 0 3px;
  color: #888;
}

.resource-max {
  text-align: left;
}

.resource-income {
  font-size: 0.9em;
  color: #3a8a3a;
  text-align: right;
  flex-shrink: 0;
  min-width: 30px;
}

</style> 