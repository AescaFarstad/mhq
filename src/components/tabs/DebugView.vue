<template>
    <div class="debug-view">
      <h2>Debug Stats</h2>
      <div v-if="hasStats" class="stats-container">
        <div v-for="(stat, name) in sortedStats" :key="name" class="stat-row">
          <div class="stat-controls">
            <template v-if="isIndependentStat(stat)">
              <button @click="modifyStat(name, -1)" class="control-btn">-</button>
              <button @click="modifyStat(name, 1)" class="control-btn">+</button>
              <input type="text" v-model="statInputValues[name]" class="stat-input" @keyup.enter="setStatValue(name)" />
              <button @click="setStatValue(name)" class="control-btn">Set</button>
            </template>
            <template v-else>
              <div class="placeholder-controls"></div>
            </template>
          </div>
          <div class="stat-name">{{ name }}</div>
          <div class="stat-separator">:</div>
          <div class="stat-value">
            {{ stat.value }}
            <span v-if="stat.params" class="stat-params">
              = {{ formatParams(stat.params) }}
            </span>
          </div>
        </div>
      </div>
      <p v-else>No stats available.</p>
    </div>
  </template>
  
<script setup lang="ts">
import { computed, PropType, ref, reactive, onMounted, inject } from 'vue';
import { GameState } from '../logic/GameState';

// Define the expected structure for stats data from GameState.uiState.debugStats
interface DebugStatInfo {
  value: number;
  params?: Record<string, number>;
}

const props = defineProps({
  // Make stats potentially null or undefined if gameState might not be ready
  stats: {
    type: Object as PropType<Record<string, DebugStatInfo> | null | undefined>,
    required: true // Still required, but can be null/undefined initially
  }
});

// Inject the game state to modify stat values
const gameState = inject<GameState>('gameState');

// Store input values for setting stat values
const statInputValues = reactive<Record<string, string>>({});

// Check if there are any stats to display
const hasStats = computed(() => {
  return props.stats && Object.keys(props.stats).length > 0;
});

// Sort the stats and return them
const sortedStats = computed(() => {
  if (!props.stats) {
    return {};
  }
  // Sort keys alphabetically for consistent display
  const sortedKeys = Object.keys(props.stats).sort();
  const result: Record<string, DebugStatInfo> = {};
  sortedKeys.forEach(key => {
    result[key] = props.stats![key];
    
    // Initialize input values if not set
    if (statInputValues[key] === undefined) {
      statInputValues[key] = String(props.stats![key].value);
    }
  });
  return result;
});

// Determine if a stat is independent (no params)
const isIndependentStat = (stat: DebugStatInfo): boolean => {
  return !stat.params;
};

// Format parameters for display
const formatParams = (params: Record<string, number>): string => {
  if ('add' in params && 'multiCache' in params) {
    return `${params.add} * ${params.multiCache}`;
  } else if ('argument' in params) {
    return `formula(${params.argument})`;
  } else {
    return Object.entries(params)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
};

// Modify a stat by delta
const modifyStat = (name: string, delta: number) => {
  if (!gameState) return;
  
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    // Use Stats.modifyStat via GameState
    gameState.modifyIndependentStat(name, delta);
    // Update the input value
    statInputValues[name] = String(stat.value + delta);
  }
};

// Set a stat to a specific value
const setStatValue = (name: string) => {
  if (!gameState) return;
  
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    // Convert input to number and set stat value
    const numericValue = Number(statInputValues[name]);
    gameState.setIndependentStat(name, numericValue);
  }
};
</script>

<style scoped>
.debug-view {
  padding: 1rem;
  font-family: monospace;
  overflow-x: auto; /* Prevent wide content from breaking layout */
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
  width: 148px; /* Fixed exact width for consistent alignment */
  flex-shrink: 0;
}

.placeholder-controls {
  width: 148px; /* Must match .stat-controls width exactly */
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
</style>