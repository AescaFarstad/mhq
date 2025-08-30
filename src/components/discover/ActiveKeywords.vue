<template>
  <div v-if="activeKeywords.length > 0" class="active-keywords-container">
  <h3 v-if="!shouldHideHeader" class="keywords-title">Active Keywords</h3>
  <div class="keywords-grid">
    <div 
    v-for="[keyword, relatedItemIds] in activeKeywords" 
    :key="keyword"
    class="keyword-entry"
    >
    <span class="keyword-text">{{ keyword }}</span>
    <span class="keyword-count">{{ relatedItemIds.length }}</span>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameState } from '../../composables/useGameState';
import { C } from '../../logic/lib/C';

const { gameState } = useGameState();

const activeKeywords = computed(() => {
  if (!gameState.value) {
  return [];
  }
  
  const keywords = Array.from(gameState.value.uiState.activeKeywords.entries())
  .sort(([a], [b]) => a.localeCompare(b)); // Sort alphabetically
  
  return keywords;
});

const shouldHideHeader = computed(() => {
  if (!gameState.value) {
  return false;
  }
  
  // Depend on discoveredItemsCount for reactivity
  // Trigger reactivity on discoveredItemsCount changes
  gameState.value.uiState.discoveredItemsCount;
  
  // Check if the specific keywords overflow discovery has been triggered
  return gameState.value.isDiscovered(C.DISCOVERY_KEYWORDS_OVERFLOW);
});
</script>

<style scoped>
.active-keywords-container {
  background: #2c3e50;
  max-height: 50vh;
  overflow-y: auto;
}

.keywords-title {
  margin: 0 0 6px 0;
  font-size: 0.9em;
  font-weight: 600;
  color: #e2e8f0;
  text-align: center;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(86, 106, 128, 0.3);
}

.keywords-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.keyword-entry {
  display: inline-flex;
  align-items: center;
  background: rgba(60, 153, 215, 0.138);
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 0.85em;
  transition: all 0.2s ease;
  min-height: 18px;
}

.keyword-text {
  font-weight: 500;
  color: #93c2df;
  margin-right: 4px;
  line-height: 1.1;
}

.keyword-count {
  background: rgba(51, 136, 192, 0.6);
  color: #e8f4f8;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: 600;
  min-width: 14px;
  text-align: center;
  line-height: 1.1;
}
</style> 