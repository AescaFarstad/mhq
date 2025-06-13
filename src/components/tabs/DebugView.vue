<template>
    <div class="debug-view">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          @click="setDebugTab('main')" 
          :class="{ active: debugActiveTab === 'main' }" 
          class="tab-btn"
        >
          Main
        </button>
        <button 
          @click="setDebugTab('stats')" 
          :class="{ active: debugActiveTab === 'stats' }" 
          class="tab-btn"
        >
          Stats
        </button>
        <button 
          @click="setDebugTab('discover')" 
          :class="{ active: debugActiveTab === 'discover' }" 
          class="tab-btn"
        >
          Discover
        </button>
        <button 
          @click="setDebugTab('explore')" 
          :class="{ active: debugActiveTab === 'explore' }" 
          class="tab-btn"
        >
          Explore
        </button>
      </div>

      <!-- Render active tab component -->
      <div class="debug-tab-content">
        <DebugMainTab v-if="debugActiveTab === 'main'" />
        <DebugStatsTab v-if="debugActiveTab === 'stats'" :stats="stats" />
        <DebugDiscoverTab v-if="debugActiveTab === 'discover'" />
        <DebugExploreTab v-if="debugActiveTab === 'explore'" />
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed, PropType, inject } from 'vue';
import { GameState } from '../../logic/GameState';
import type { DebugStatInfo } from '../../types/uiTypes';

// Child components
import DebugMainTab from './DebugMainTab.vue';
import DebugStatsTab from './DebugStatsTab.vue';
import DebugDiscoverTab from './DebugDiscoverTab.vue';
import DebugExploreTab from './DebugExploreTab.vue';

const props = defineProps({
  stats: {
    type: Object as PropType<Record<string, DebugStatInfo> | null | undefined>,
    required: true,
  },
});

// Persist active tab on the global game state so it survives hot-reloads / UI updates
const gameState = inject<GameState>('gameState');
const debugActiveTab = computed(() => (gameState?.uiState as any)?.debugActiveTab || 'main');

const setDebugTab = (name: string) => {
  if (!gameState) return;
  if (!(gameState.uiState as any).debugActiveTab) (gameState.uiState as any).debugActiveTab = 'main';
  (gameState.uiState as any).debugActiveTab = name;
};
</script>

<style>
/* Styles originally defined in the monolithic DebugView have been kept here so that the child
   tab components continue to use the same class names. These rules are now global (unscoped). */

.debug-view {
  padding: 0.5rem;
  font-family: monospace;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.stats-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 10px;
  overflow-x: auto;
  font-size: 0.9em;
  color: #212529;
  width: 100%;
}

.stat-row {
  display: flex;
  align-items: center;
  padding: 4px 0;
  line-height: 1.5;
  white-space: nowrap;
}

.stat-controls {
  display: flex;
  align-items: center;
  margin-right: 8px;
  width: 220px; /* Fixed exact width for consistent alignment - increased for explore button */
  flex-shrink: 0;
}

.placeholder-controls {
  width: 220px; /* Must match .stat-controls width exactly */
}

.placeholder-controls-without-explore {
  width: 148px; /* Original width minus explore button */
}

.control-btn {
  padding: 2px 6px;
  margin: 0 2px;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.9em;
}

.control-btn:hover {
  background-color: #dee2e6;
}

.explore-btn {
  background-color: #4b72b0 !important;
  color: white !important;
  font-weight: bold;
}

.explore-btn:hover {
  background-color: #3a5b8c !important;
}

.stat-input {
  width: 60px;
  padding: 2px 4px;
  margin: 0 2px;
  font-family: monospace;
  font-size: 0.9em;
  border: 1px solid #ced4da;
  border-radius: 3px;
}

.stat-name {
  flex: 0 0 auto;
  min-width: 220px;
  padding-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-separator {
  flex: 0 0 auto;
  margin-right: 10px;
}

.stat-value {
  flex: 1 1 auto;
  white-space: nowrap;
}

.stat-params {
  color: #6c757d;
  margin-left: 10px;
}

h2 {
  margin-bottom: 1rem;
  color: #495057;
}

p {
  color: #6c757d;
}

.button-container {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap */
  gap: 10px;
  margin-bottom: 15px;
}

.action-btn {
  padding: 8px 12px;
  background-color: #4b72b0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #3a5b8c;
}

.action-btn.copy-success {
  background-color: #4caf50;
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.filter-input {
  width: calc(50% - 10px); /* Adjust width considering gap */
  padding: 8px;
  font-family: monospace;
}

.filter-input.invalid-regex {
  border-color: red;
}

.filter-inputs {
    display: flex;
    align-items: center; /* Align items vertically */
    gap: 10px; /* Add gap between input fields */
    margin-bottom: 15px; /* Add some space below the filter section */
}

.clear-btn {
  padding: 6px 10px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.8em;
  height: fit-content; /* Adjust height to match input boxes better */
}

.clear-btn.clear-all-btn {
    width: auto; /* Allow button to size to its content */
    flex-shrink: 0; /* Prevent shrinking if space is tight */
    margin-left: 5px; /* A bit of space from the last input */
}

.clear-btn:hover {
  background-color: #e9ecef;
}

/* Tab Navigation Styles */
.tab-navigation {
  display: flex;
  gap: 3px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
}

.tab-btn {
  padding: 4px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.3s;
}

.tab-btn:hover {
  background-color: #e9ecef;
}

.tab-btn.active {
  background-color: #4b72b0;
  color: white;
  border-color: #4b72b0;
}

.tab-content {
  margin-top: 5px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.debug-tab-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* Discover Tab Styles */
.discover-header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px 0;
}

.discover-count {
  font-weight: bold;
  color: #495057;
  white-space: nowrap;
  font-size: 0.9em;
  min-width: 35px;
  text-align: right;
}

.discover-buttons {
  display: flex;
  gap: 5px;
  align-items: center;
}

.bigger-btn {
  padding: 6px 12px;
  font-size: 0.85em;
}

.discover-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 8px;
  font-size: 0.9em;
  color: #212529;
  width: 100%;
}

.discover-columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 2px;
  line-height: 1.2;
}

.discover-item {
  font-family: monospace;
  font-size: 1.1em;
  padding: 2px 0;
  word-break: break-word;
}

.filter-input.discover-filter {
  width: 500px;
  flex-shrink: 1;
}

.discover-type-btn {
  padding: 6px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.3s;
}

.discover-type-btn:hover {
  background-color: #5a6268;
}

.clear-discover-btn {
  padding: 6px 12px;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.3s;
}

.clear-discover-btn:hover {
  background-color: #e9ecef;
}

/* Explore Tab Styles */
.explore-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.explore-input:focus {
  outline: none;
  border-color: #4b72b0;
  box-shadow: 0 0 0 2px rgba(75, 114, 176, 0.2);
}

/* Main tab content display styles */
.content-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #e9ecef;
  border-bottom: 1px solid #dee2e6;
}

.content-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #495057;
}

.clear-content-btn {
  padding: 4px 8px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.clear-content-btn:hover {
  background-color: #5a6268;
}

.content-text {
  flex: 1;
  padding: 15px;
  margin: 0;
  font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #212529;
  background-color: white;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.no-content-message {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-style: italic;
  padding: 40px 20px;
}
</style>