<template>
  <div class="crystal-view-container">
    <div class="crystal-view-header">
      <button class="close-button" @click="closeCrystalView">✕</button>
    </div>
    
    <div class="crystal-ball-large">
      <CrystalBall />
    </div>
    
    <div class="crystal-instruction">
      Words accumulated through possession or inspiration.
    </div>
    <div class="crystal-instruction">
      Click to try them, right click to dismiss.
    </div>
    
    <div class="crystal-words-container">
      <div 
        v-for="word in crystalWords" 
        :key="word"
        class="crystal-word"
        @click="submitWord(word)"
        @contextmenu.prevent="removeWord(word)"
      >
        {{ word }}
      </div>
      <div v-if="crystalWords.length === 0" class="no-words-message">
        No words available. Need an inspiration.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { GameState } from '../logic/GameState';
import { globalInputQueue } from '../logic/GameState';
import type { CmdSubmitDiscovery, CmdRemoveCrystalWord } from '../logic/input/InputCommands';
import CrystalBall from './CrystalBall.vue';

const gameState = inject<GameState>('gameState');

const crystalWords = computed(() => {
  return gameState?.uiState.crystalBallWords ?? [];
});

const submitWord = (word: string) => {
  if (!gameState) return;
  
  const command: CmdSubmitDiscovery = {
    name: "CmdSubmitDiscovery",
    input: word
  };
  
  globalInputQueue.push(command);
};

const removeWord = (word: string) => {
  if (!gameState) return;
  
  const command: CmdRemoveCrystalWord = {
    name: "CmdRemoveCrystalWord",
    word: word
  };
  
  globalInputQueue.push(command);
};

const closeCrystalView = () => {
  if (gameState) {
    gameState.closeCrystalView();
  }
};
</script>

<style scoped>
.crystal-view-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60vh; /* Only take 60% of viewport height */
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.95), rgba(52, 73, 94, 0.95)); /* Dark theme background */
  border: 2px solid #566a80;
  border-radius: 20px 20px 0 0; /* Rounded corners only on top */
  box-shadow: 0 -20px 40px rgba(0, 0, 0, 0.8); /* Shadow pointing upward */
  overflow-y: auto;
  padding: 30px;
  z-index: 10;
  backdrop-filter: blur(10px); /* Add blur effect for better transparency */
}

.crystal-view-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.close-button {
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: #c53030;
}

.crystal-ball-large {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.crystal-ball-large :deep(.crystal-ball-container) {
  height: 150px;
}

.crystal-ball-large :deep(.crystal-ball) {
  width: 233px !important;
  height: 235px !important;
  transform: scale(0.5);
}

.crystal-instruction {
  text-align: center;
  color: #e2e8f0;
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.4;
  font-style: italic;
}

.crystal-words-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 15px;
  border: 1px solid #566a80;
  border-radius: 10px;
  background: rgba(44, 62, 80, 0.7);
}

.crystal-word {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  user-select: none;
  /* Prevent layout shifts by keeping consistent sizing */
  min-height: 26px;
  display: flex;
  align-items: center;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  /* Use box-shadow instead of transform to avoid layout shifts */
}

.crystal-word:hover {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.crystal-word:active {
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3);
}

.no-words-message {
  color: #a0aec0;
  font-style: italic;
  text-align: center;
  width: 100%;
  padding: 20px;
  font-size: 12px;
}

/* Custom scrollbar for the words container */
.crystal-words-container::-webkit-scrollbar {
  width: 4px;
}

.crystal-words-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.crystal-words-container::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 2px;
}

.crystal-words-container::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}
</style> 