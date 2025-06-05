<script setup lang="ts">
import { onMounted } from 'vue';
import { inject, computed } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { WelcomeState } from './WelcomeTypes';
import { WelcomeGame } from './WelcomeGame';
import WelcomeChoices from './WelcomeChoices.vue';

const gameState = inject<GameState>('gameState');

const minigameState = computed(() => {
  if (gameState?.activeMinigame?.type === 'Welcome' && gameState.uiState.activeMinigameState) {
    return gameState.uiState.activeMinigameState as WelcomeState;
  }
  return null;
});

const welcomeGame = computed(() => {
  if (gameState?.activeMinigame?.type === 'Welcome') {
    return gameState.activeMinigame as WelcomeGame;
  }
  return null;
});

const handleChoiceMade = (choiceId: string) => {
  if (welcomeGame.value && gameState) {
    welcomeGame.value.makeChoiceAndPrepareExit(choiceId, gameState);
  } else {
    console.error('WelcomeGame instance or gameState not available for handleChoiceMade');
  }
};

const handleStartExploration = (choiceId: string) => {
  welcomeGame.value?.startExploration(choiceId);
};

onMounted(() => {
  if (!minigameState.value?.lib?.isLoaded) {
    // Lib not loaded, consider logging or handling
  }
  if (minigameState.value) {
    // selectedLocation is managed by WelcomeGame.ts upon choice and exit
    // minigameState.value.selectedLocation = undefined; // This might not be necessary if WelcomeGame handles state correctly on init/exit
  }
});
</script>

<template>
  <div class="connection-view-container">
    <WelcomeChoices
      v-if="minigameState && minigameState.lib && minigameState.explorableChoices"
      :explorableChoices="minigameState.explorableChoices"
      @choiceMade="handleChoiceMade"
      @startExploration="handleStartExploration"
    />
    <!-- <button @click="toggleStageDev">Dev: Toggle Stage (Current: {{ currentStage }})</button> -->
  </div>
</template>

<style scoped>
.connection-view-container {
  width: 100%;
  height: 100%;
  /* display: flex; */ /* Commented out to allow stage containers to control their own centering/width */
  /* flex-direction: column; */
  /* align-items: center; */
  /* justify-content: center; */
  padding-top: 20px; /* Add some padding at the top */
  background-color: #2c3e50; /* Darker background for the overall view */
  color: #ecf0f1; /* Light text color for contrast */
}

/* Styling for the dev button if you re-enable it */
/*
.connection-view-container > button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  padding: 8px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.connection-view-container > button:hover {
  background-color: #c0392b;
}
*/
</style> 