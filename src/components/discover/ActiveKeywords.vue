<template>
  <div class="active-keywords-container">
    <h3 class="keywords-title">Active Keywords</h3>
    <div class="keywords-list" v-if="activeKeywords.length > 0">
      <div 
        v-for="[keyword, relatedItemIds] in activeKeywords" 
        :key="keyword"
        class="keyword-item"
        :title="`Related to ${relatedItemIds.length} undiscovered items`"
      >
        <span class="keyword-text">{{ keyword }}</span>
        <span class="keyword-count">{{ relatedItemIds.length }}</span>
      </div>
    </div>
    <div v-else class="no-keywords">
      <p class="no-keywords-text">No active keywords yet. Try typing single words related to skills and abilities!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameState } from '../../composables/useGameState';

const { gameState } = useGameState();

const activeKeywords = computed(() => {
  if (!gameState.value) {
    return [];
  }
  
  const keywords = Array.from(gameState.value.uiState.activeKeywords.entries())
    .sort(([a], [b]) => a.localeCompare(b)); // Sort alphabetically
  
  return keywords;
});
</script>

<style scoped>
.active-keywords-container {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.keywords-title {
  margin: 0 0 12px 0;
  font-size: 1.1em;
  font-weight: 600;
  color: #495057;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-item {
  display: inline-flex;
  align-items: center;
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.9em;
  cursor: help;
  transition: background-color 0.2s;
}

.keyword-item:hover {
  background: #0056b3;
}

.keyword-text {
  margin-right: 6px;
}

.keyword-count {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  font-weight: bold;
}

.no-keywords {
  text-align: center;
  padding: 20px;
}

.no-keywords-text {
  color: #6c757d;
  font-style: italic;
  margin: 0;
}
</style> 