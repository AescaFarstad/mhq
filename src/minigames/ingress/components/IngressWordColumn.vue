<template>
  <div class="ingress-word-column-component" :class="{ condensed: words.length > 25 }">
    <p class="column-title">{{ title }}</p>
    <div class="word-list-container">
      <ul class="word-list">
        <li v-for="(word, index) in words" :key="index" class="word-item-wrapper" :id="getWordId(word) ? `word-li-${getWordId(word)}` : undefined" @mouseover="onMouseOver(word, $event)" @mouseleave="onMouseLeave()">
          <div class="word-item">
            <div class="word-item-edge">
              <div class="badge-placeholder">
                  <div 
                      v-if="getCharacterCount(word) > 0"
                      class="character-badge" 
                      :class="{ 
                          'animate-pulse-glow': !anyBadgeHovered,
                          'static-badge': anyBadgeHovered
                      }">
                      <span>{{ getCharacterCount(word) }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                  </div>
              </div>
            </div>
            <span class="word-name">{{ getWordName(word) }}</span>
            <span class="stars" v-if="getStars(word) > 0">{{ '★'.repeat(getStars(word)) }}</span>
          </div>
          <div v-if="wasTypo(word)" class="typo-sticker">TYPO</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SubmittedWord } from '../IngressTypes';

defineProps<{
  title: string;
  words: (SubmittedWord | string)[];
  anyBadgeHovered: boolean;
}>();

const emit = defineEmits(['word-hover', 'word-leave']);

const getWordId = (word: SubmittedWord | string): string | null => {
  if (typeof word === 'object') {
    return word.definition.id;
  }
  return null;
};

const getWordName = (word: SubmittedWord | string): string => {
  if (typeof word === 'string') {
    return word;
  }
  return word.definition.name;
};

const getStars = (word: SubmittedWord | string): number => {
  if (typeof word === 'string') {
    return 0;
  }
  return Math.min(word.pointsEarned, 4);
};

const wasTypo = (word: SubmittedWord | string): boolean => {
  if (typeof word === 'string') {
    return false;
  }
  return word.wasTypo;
};

const getCharacterCount = (word: SubmittedWord | string): number => {
  if (typeof word === 'object' && word.sourceCharacterIds) {
    return word.sourceCharacterIds.length;
  }
  return 0;
};

const onMouseOver = (word: SubmittedWord | string, event: MouseEvent) => {
    if (typeof word === 'object' && word.sourceCharacterIds && word.sourceCharacterIds.length > 0) {
        emit('word-hover', { word, event });
    }
};

const onMouseLeave = () => {
    emit('word-leave');
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
  overflow-y: hidden; /* Hide overflow */
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
  position: relative;
  padding: 0;
  margin-bottom: 5px;
}

.word-item-wrapper:last-child {
  margin-bottom: 0;
}

.word-item {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #34495e;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
}

.word-item-edge {
    background-color: #405469; /* Slightly lighter than word-item */
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 8px 0 8px 4px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.badge-placeholder {
    width: 28px;
    height: 16px;
    flex-shrink: 0;
    margin-right: 0px;
    position: relative;
}

.word-name {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  padding-left: 4px; /* Space between edge and name */
}

@keyframes pulse-glow {
    0% {
        transform: translateY(-50%) scale(1);
        box-shadow: 0 0 5px rgba(20, 220, 190, 0.4);
    }
    50% {
        transform: translateY(-50%) scale(1.05);
        box-shadow: 0 0 15px rgba(20, 220, 190, 0.8);
    }
    100% {
        transform: translateY(-50%) scale(1);
        box-shadow: 0 0 5px rgba(20, 220, 190, 0.4);
    }
}

.animate-pulse-glow {
    animation: pulse-glow 2.5s infinite ease-in-out;
}

.stars {
  color: #f1c40f;
  margin-left: 10px;
  flex-shrink: 0;
  padding-right: 12px;
}

.character-badge {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0px;
    font-size: 0.9em;
    font-weight: bold;
    transition: all 0.2s ease-in-out;
    z-index: 2;
}

.animate-pulse-glow.character-badge {
    background: linear-gradient(145deg, #5c67e8, #434ed6);
    padding: 2px 6px;
    border-radius: 10px;
    color: #ffffff;
    border: 1px solid #7a82f0;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    left: -6px; /* Offset to align content */
}

.character-badge:hover {
    transform: translateY(-50%) scale(1.1);
    animation-play-state: paused;
}

.animate-pulse-glow.character-badge:hover {
    background: linear-gradient(145deg, #7a82f0, #5c67e8);
    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
}

.static-badge {
    color: currentColor;
    cursor: default;
    padding: 0;
}

.character-badge svg {
    width: 1em;
    height: 1em;
}

.typo-sticker {
  position: absolute;
  top: -2px;
  right: -6px;
  background-color: #e74c3c;
  color: white;
  padding: 3px 4px;
  font-size: 10px;
  font-weight: bold;
  transform: rotate(15deg);
  border-radius: 3px;
  z-index: 1;
  text-transform: uppercase;
  line-height: 1;
  padding-bottom: 3px;
}

.condensed .word-item-wrapper {
  margin-bottom: 2px;
}

.condensed .word-item-edge {
  padding-top: 3px;
  padding-bottom: 3px;
}
</style> 