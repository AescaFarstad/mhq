<template>
  <div class="tab-content">
    <div class="filter-inputs">
      <input type="text" v-model="includeFilter" placeholder="Include Regex (e.g., ^Player)" class="filter-input" :class="{ 'invalid-regex': !isIncludeRegexValid }" />
      <input type="text" v-model="excludeFilter" placeholder="Exclude Regex (e.g., Mana$)" class="filter-input" :class="{ 'invalid-regex': !isExcludeRegexValid }" />
      <button @click="clearAllFilters" class="clear-btn clear-all-btn">Clear Filters</button>
    </div>
    <div v-if="hasStats" class="stats-container">
      <div v-for="(stat, name) in sortedStats" :key="name" class="stat-row">
        <div class="stat-controls">
          <button @click="exploreStat(name)" class="control-btn explore-btn">Explore</button>
          <template v-if="isIndependentStat(stat)">
            <button @click="modifyStat(name, -1)" class="control-btn">-</button>
            <button @click="modifyStat(name, 1)" class="control-btn">+</button>
            <input type="text" v-model="statInputValues[name]" class="stat-input" @keyup.enter="setStatValue(name)" />
            <button @click="setStatValue(name)" class="control-btn">Set</button>
          </template>
          <template v-else>
            <div class="placeholder-controls-without-explore"></div>
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
import { computed, PropType, ref, reactive, inject } from 'vue';
import { GameState } from '../../logic/GameState';
import type { DebugStatInfo } from '../../types/uiTypes';
import { Stats } from '../../logic/core/Stats';
import { IndependentStat } from '../../logic/core/Stat';
import * as UIStateManager from '../../logic/UIStateManager';

const props = defineProps({
  stats: {
    type: Object as PropType<Record<string, DebugStatInfo> | null | undefined>,
    required: true,
  },
});

const gameState = inject<GameState>('gameState');

// Store input values for setting stat values
const statInputValues = reactive<Record<string, string>>({});

// Filters
const includeFilter = ref('');
const excludeFilter = ref('');
const isIncludeRegexValid = ref(true);
const isExcludeRegexValid = ref(true);

// ---------- Stat helpers ----------
const hasStats = computed(() => props.stats && Object.keys(props.stats).length > 0);

const sortedStats = computed(() => {
  if (!props.stats) return {};
  let filteredKeys = Object.keys(props.stats);
  isIncludeRegexValid.value = true;
  isExcludeRegexValid.value = true;

  // Include filter
  if (includeFilter.value.trim()) {
    try {
      const r = new RegExp(includeFilter.value.trim(), 'i');
      filteredKeys = filteredKeys.filter((k) => r.test(k));
    } catch {
      isIncludeRegexValid.value = false;
    }
  }

  // Exclude filter
  if (excludeFilter.value.trim()) {
    try {
      const r = new RegExp(excludeFilter.value.trim(), 'i');
      filteredKeys = filteredKeys.filter((k) => !r.test(k));
    } catch {
      isExcludeRegexValid.value = false;
    }
  }

  const res: Record<string, DebugStatInfo> = {};
  filteredKeys.sort().forEach((k) => {
    res[k] = props.stats![k];
    if (statInputValues[k] === undefined) statInputValues[k] = String(props.stats![k].value);
  });
  return res;
});

const isIndependentStat = (stat: DebugStatInfo) => !stat.params;

const formatParams = (params: Record<string, number>): string => {
  if ('add' in params && 'multiCache' in params) return `${params.add} * ${params.multiCache}`;
  if ('argument' in params) return `formula(${params.argument})`;
  return Object.entries(params)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
};

const modifyStat = (name: string, delta: number) => {
  if (!gameState) return;
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    gameState.modifyIndependentStat(name, delta);
    statInputValues[name] = String(stat.value + delta);
  }
};

const setStatValue = (name: string) => {
  if (!gameState) return;
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    const v = Number(statInputValues[name]);
    if (gameState && gameState.connections) {
      Stats.setIndependentStat(stat as IndependentStat, v, gameState.connections);
      UIStateManager.updateDebugView(gameState);
    }
  }
};

// Explore stat - switches to explore tab with this stat
const exploreStat = (name: string) => {
  if (!gameState) return;
  
  // Set the explore input in the UI state
  gameState.uiState.debugExploreInput = name;
  
  // Switch to explore tab
  (gameState.uiState as any).debugActiveTab = 'explore';
};

// Clear filters
const clearAllFilters = () => {
  includeFilter.value = '';
  excludeFilter.value = '';
  isIncludeRegexValid.value = true;
  isExcludeRegexValid.value = true;
};
</script> 