<template>
  <div class="tab-content">
    <div class="discover-header-controls">
      <div class="discover-count">{{ filteredDiscoveredItems.length }}</div>
      <input
        type="text"
        v-model="discoverIncludeFilter"
        placeholder="Include Regex (e.g., ^skill)"
        class="filter-input discover-filter"
        :class="{ 'invalid-regex': !isDiscoverIncludeRegexValid }"
      />
      <div class="discover-buttons">
        <button @click="discoverAllItems" class="discover-type-btn">All</button>
        <button @click="discoverNoneItems" class="discover-type-btn">None</button>
        <button @click="discoverSkills" class="discover-type-btn">Skills</button>
        <button @click="discoverBuildings" class="discover-type-btn">Buildings</button>
        <button @click="discoverResources" class="discover-type-btn">Resources</button>
        <button @click="discoverAttributes" class="discover-type-btn">Attributes</button>
        <button @click="discoverTabs" class="discover-type-btn">Tabs</button>
        <button @click="clearDiscoverFilters" class="clear-discover-btn">Clear</button>
        <button @click="copyDiscoveredItemsToClipboard($event)" class="action-btn bigger-btn" :class="{ 'copy-success': copyAnimationButton === 'discoveredItems' }">Copy</button>
      </div>
    </div>

    <div v-if="hasDiscoveredItems" class="discover-container">
      <div class="discover-columns">
        <div v-for="item in filteredDiscoveredItems" :key="item" class="discover-item">
          {{ item }}
        </div>
      </div>
    </div>
    <p v-else>No discovered items available.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue';
import { GameState } from '../../logic/GameState';

const gameState = inject<GameState>('gameState');

// Filters & validation
const discoverIncludeFilter = ref('');
const isDiscoverIncludeRegexValid = ref(true);

// Animation state for copy feedback
const copyAnimationButton = ref<string | null>(null);
const triggerCopyAnimation = (key: string) => {
  copyAnimationButton.value = key;
  setTimeout(() => (copyAnimationButton.value = null), 1000);
};

// ---------- Computed helpers ----------
const hasDiscoveredItems = computed(() => {
  return gameState && gameState.discoveredItems && Object.keys(gameState.discoveredItems).length > 0;
});

const filteredDiscoveredItems = computed(() => {
  if (!gameState || !gameState.discoveredItems) return [];
  let items = Object.keys(gameState.discoveredItems).filter((k) => gameState.discoveredItems[k]);
  isDiscoverIncludeRegexValid.value = true;
  if (discoverIncludeFilter.value.trim()) {
    try {
      const r = new RegExp(discoverIncludeFilter.value.trim(), 'i');
      items = items.filter((i) => r.test(i));
    } catch {
      isDiscoverIncludeRegexValid.value = false;
    }
  }
  return items.sort();
});

// ---------- Actions ----------
const clearDiscoverFilters = () => {
  discoverIncludeFilter.value = '';
  isDiscoverIncludeRegexValid.value = true;
};

const copyDiscoveredItemsToClipboard = (_e?: Event) => {
  if (!gameState || !gameState.discoveredItems) return;
  const list = Object.keys(gameState.discoveredItems).filter((k) => gameState.discoveredItems[k]).sort();
  let text = 'Discovered Items:\n\n' + list.join('\n');
  navigator.clipboard.writeText(text.trim())
    .then(() => triggerCopyAnimation('discoveredItems'))
    .catch((err) => console.error('Failed to copy discovered items:', err));
};

const discoverAllItems = () => {
  if (!gameState) return;
  import('../../logic/effects').then((eff) => eff.discoverAll(gameState));
};

const discoverNoneItems = () => {
  if (!gameState) return;
  gameState.discoveredItems = {} as any;
  gameState.uiState.discoveredItemsCount = 0;
};

const discoverSkills = () => gameState && import('../../logic/effects').then((eff) => eff.discoverAllSkills(gameState));
const discoverBuildings = () => gameState && import('../../logic/effects').then((eff) => eff.discoverAllBuildings(gameState));
const discoverResources = () => gameState && import('../../logic/effects').then((eff) => eff.discoverAllResources(gameState));
const discoverAttributes = () => gameState && import('../../logic/effects').then((eff) => eff.discoverAllAttributes(gameState));
const discoverTabs = () => gameState && import('../../logic/effects').then((eff) => eff.discoverAllTabs(gameState));
</script> 