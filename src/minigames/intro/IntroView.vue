<script setup lang="ts">
import { onMounted } from 'vue';
import { inject, computed } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { IntroState } from './IntroGame';
import { IntroGame } from './IntroGame';

const gameState = inject<GameState>('gameState');

const minigameState = computed(() => {
  if (gameState?.activeMinigame?.type === 'Intro' && gameState.uiState.activeMinigameState) {
    return gameState.uiState.activeMinigameState as IntroState;
  }
  return null;
});

const introGame = computed(() => {
  if (gameState?.activeMinigame?.type === 'Intro') {
    return gameState.activeMinigame as IntroGame;
  }
  return null;
});

const handleNextStep = () => {
  introGame.value?.nextStep();
};

const handleCompleteIntro = () => {
  if (introGame.value && gameState) {
    introGame.value.completeIntro(gameState);
  } else {
    console.error('IntroGame instance or gameState not available for handleCompleteIntro');
  }
};

onMounted(() => {
  // Initialize intro if needed
  introGame.value?.startIntro();
});
</script>

<template>
  <div class="intro-view-container">
    <div v-if="minigameState" class="intro-content">
      <h1>Introduction</h1>
      <div class="intro-progress">
        <p>Progress: {{ minigameState.introProgress.toFixed(2) }}</p>  
        <p>Current Step: {{ minigameState.currentStep }}</p>
      </div>
      
      <div class="intro-actions">
        <button 
          @click="handleNextStep" 
          :disabled="minigameState.isCompleted"
          class="next-step-btn"
        >
          Next Step
        </button>
        <button 
          @click="handleCompleteIntro" 
          class="complete-btn"
        >
          Complete Intro
        </button>
      </div>
      
      <div v-if="minigameState.isCompleted" class="completion-message">
        <p>Introduction completed!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-view-container {
  width: 100%;
  height: 100%;
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-content {
  text-align: center;
  padding: 2rem;
  background-color: #34495e;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.intro-progress {
  margin: 1rem 0;
}

.intro-actions {
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.next-step-btn,
.complete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.next-step-btn {
  background-color: #3498db;
  color: white;
}

.next-step-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.next-step-btn:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.complete-btn {
  background-color: #e74c3c;
  color: white;
}

.complete-btn:hover {
  background-color: #c0392b;
}

.completion-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #27ae60;
  border-radius: 5px;
}
</style> 