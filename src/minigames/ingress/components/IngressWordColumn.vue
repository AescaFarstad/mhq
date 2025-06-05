<template>
  <div class="ingress-word-column-component">
    <p class="column-title">{{ title }}</p>
    <div class="word-list-container">
      <ul class="word-list">
        <li v-for="(word, index) in words" :key="index" class="word-item-wrapper">
          <div class="word-item">
            <span class="word-name">{{ getWordName(word) }}</span>
            <span class="stars" v-if="getStars(word) > 0">{{ '★'.repeat(getStars(word)) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WordDefinition } from '../lib/definitions/WordDefinition';

const props = defineProps<{
  title: string;
  words: (WordDefinition | string)[];
}>();

const getWordName = (word: WordDefinition | string): string => {
  if (typeof word === 'string') {
    return word;
  }
  return word.name;
};

const getStars = (word: WordDefinition | string): number => {
  if (typeof word === 'string') {
    return 0;
  }
  return Math.min(word.points, 3);
};
</script>

<style scoped>
.ingress-word-column-component {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #2c3e50;
  border: 1px solid #3e4f61;
  border-radius: 6px;
  box-sizing: border-box;
  color: white;
  overflow: hidden; /* Hide overflow */
}

.column-title {
  padding: 10px;
  margin: 0;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #bdc3c7;
  background-color: #3e4f61;
  flex-shrink: 0;
}

.word-list-container {
  overflow-y: auto; /* Make list scrollable */
  flex-grow: 1;
}

.word-list {
  list-style-type: none;
  padding: 10px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

.word-item-wrapper {
  padding: 0;
  margin-bottom: 5px;
}

.word-item-wrapper:last-child {
  margin-bottom: 0;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  background-color: #34495e;
  border-radius: 4px;
  box-sizing: border-box;
}

.word-name {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}

.stars {
  color: #f1c40f;
  margin-left: 10px;
  flex-shrink: 0;
}
</style> 