<template>
  <div class="attributes-section">
    <h4>Attributes:</h4>
    <div v-if="!attributes || attributes.length === 0" class="no-attribute-data">
      No attribute data available.
    </div>
    <div v-else class="attribute-categories">
      <div 
        v-for="category in attributes" 
        :key="category.key" 
        class="attribute-category"
        :class="`attribute-category-${category.key.toLowerCase()}`"
        @mouseenter="$emit('set-hint', gameState && gameState.isDiscovered(category.key) ? category.description || null : obfuscateString(category.description || ''))"
        @mouseleave="$emit('set-hint', null)"
      >
        <div 
          class="category-header"
          @mouseenter="$emit('set-hint', gameState && gameState.isDiscovered(category.key) ? category.description || null : obfuscateString(category.description || ''))" 
          @mouseleave="$emit('set-hint', null)" 
        >
          <span class="category-name">{{ gameState && gameState.isDiscovered(category.key) ? category.displayName : obfuscateString(category.displayName) }}</span>
          <span class="category-value">{{ category.value }}</span>
        </div>
        <div class="secondary-attributes">
          <div 
            v-for="attribute in category.attributes" 
            :key="attribute.key" 
            class="attribute-row" 
            :class="{ 'highlighted': currentHint === attribute.description || currentHint === obfuscateString(attribute.description || '') }"
            @mouseenter="$emit('set-hint', gameState && gameState.isDiscovered(attribute.key) ? attribute.description || null : obfuscateString(attribute.description || ''))"
            @mouseleave="$emit('set-hint', null)"
          >
            <span class="attribute-name">{{ gameState && gameState.isDiscovered(attribute.key) ? attribute.displayName : obfuscateString(attribute.displayName) }}</span>
            <span class="attribute-value">{{ attribute.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, inject } from 'vue';
import { AttributeCategoryUIInfo } from '../../types/uiTypes';
import { obfuscateString } from '../../utils/stringUtils';
import { GameState } from '../../logic/GameState';

const gameState = inject<GameState>('gameState');

defineProps({
  attributes: {
    type: Array as PropType<AttributeCategoryUIInfo[]>,
    required: true
  },
  currentHint: {
    type: String as PropType<string | null>,
    default: null
  }
});

defineEmits(['set-hint']);
</script>

<style scoped>

.attributes-section {
  padding-top: 10px;
}

.attributes-section h4 {
  margin-bottom: 10px;
  font-size: 1.2em;
  color: #333;
}

.no-attribute-data {
    color: #888;
    font-style: italic;
}

.attribute-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.attribute-category {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #fdfdfd;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.attribute-category::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 0;
  border-radius: inherit;
}

.attribute-category:hover {
  border-color: #c0d8ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
}

.attribute-category:hover::before {
  opacity: 1;
}

.attribute-category-physique::before {
  background: linear-gradient(to bottom, #C0392B 0%, #ffccbc 35%, rgba(255, 255, 255, 0) 100%);
}

.attribute-category-mind::before {
  background: linear-gradient(to bottom, #1F618D 0%, #b2ebf2 35%, rgba(255, 255, 255, 0) 100%);
}

.attribute-category-social::before {
  background: linear-gradient(to bottom, #B7950B 0%, #fff9c4 35%, rgba(255, 255, 255, 0) 100%);
}

.attribute-category-spirit::before {
  background: linear-gradient(to bottom, #7D3C98 0%, #e1bee7 35%, rgba(255, 255, 255, 0) 100%);
}

.category-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  padding-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
  cursor: default;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.category-name {
    color: #2c3e50;
    flex-grow: 1;
}

.category-value {
    color: #0056b3;
    font-size: 1.05em;
    margin-left: 10px;
    text-align: right;
    white-space: nowrap;
}

.secondary-attributes {
  padding-bottom: 4px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.attribute-row {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 5px 15px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  cursor: default;
}

.attribute-row:last-child {
  /* margin-bottom: 0; */
}

.attribute-row.highlighted {
  background-color: #f4f4f4;
  color: #333;
}

.attribute-row.highlighted .attribute-name,
.attribute-row.highlighted .attribute-value {
  /* font-weight: 500; */
}

.attribute-name {
  color: #444;
  flex-grow: 1;
}

.attribute-value {
  color: #333;
  font-weight: 500;
  margin-left: 10px;
  text-align: right;
  white-space: nowrap;
}
</style>
