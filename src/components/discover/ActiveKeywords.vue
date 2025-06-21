<template>
  <div v-if="activeKeywords.length > 0" class="active-keywords-container">
    <h3 class="keywords-title">Active Keywords</h3>
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
  background: #2c3e50;
  border: 1px solid #566a80;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.keywords-title {
  margin: 0 0 10px 0;
  font-size: 1em;
  font-weight: 600;
  color: #e2e8f0;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(86, 106, 128, 0.3);
}

.keywords-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword-entry {
  display: inline-flex;
  align-items: center;
  background: rgba(52, 152, 219, 0.15);
  border: 1px solid rgba(93, 173, 226, 0.3);
  border-radius: 14px;
  padding: 3px 8px;
  font-size: 0.85em;
  transition: all 0.2s ease;
}

.keyword-text {
  font-weight: 600;
  color: #5dade2;
  margin-right: 6px;
}

.keyword-count {
  background: rgba(93, 173, 226, 0.8);
  color: white;
  padding: 1px 5px;
  border-radius: 10px;
  font-size: 0.75em;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
  line-height: 1.2;
}
</style> 