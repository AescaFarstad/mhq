<script setup lang="ts">
import { inject, computed } from 'vue';
import type { GameState } from '../../logic/GameState';
import { EXAMPLE_TYPE, type ExampleState } from './ExampleTypes';
import type { ExampleGame } from './ExampleGame';

const gameState = inject<GameState>('gameState');

const exampleState = computed(() => {
  if (gameState?.activeMinigame?.type === EXAMPLE_TYPE && gameState.uiState.activeMinigameState) {
    return gameState.uiState.activeMinigameState as ExampleState;
  }
  return null;
});

const exampleGame = computed(() => {
  if (gameState?.activeMinigame?.type === EXAMPLE_TYPE) {
    return gameState.activeMinigame as ExampleGame;
  }
  return null;
});

const exitMinigame = () => {
  if (gameState) { // gameState is already checked by inject, but good practice
    gameState.exitMinigame();
  }
};

// Example of an action that could call a method on the ExampleGame instance
const performExampleAction = () => {
  if (exampleGame.value) {
    // exampleGame.value.someExampleSpecificMethod(); // Example call
    console.log('Example action performed via exampleGame.value');
  }
};

</script>

<template>
  <div class="example-view-container">
    <h1>Example Minigame</h1>
    <p>This is the Example minigame. Build your UI here!</p>
    
    <!-- Example: Displaying a piece of state (ensure 'score' exists in ExampleState if used) -->
    <!-- <p v-if="exampleState">Score: {{ exampleState.score || 0 }}</p> -->

    <!-- Example: Button to trigger a minigame action -->
    <!-- <button @click="performExampleAction">Perform Action</button> -->

    <button @click="exitMinigame">Exit Minigame</button>
  </div>
</template>

<style scoped>
.example-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #2c3e50; /* Example: different background */
  color: #ecf0f1; /* Example: different text color */
  text-align: center;
}

.example-view-container h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.example-view-container p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

.example-view-container button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #3498db; /* Example: different button color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.example-view-container button:hover {
  background-color: #2980b9; /* Example: different button hover color */
}
</style> 