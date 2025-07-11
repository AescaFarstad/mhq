<script setup lang="ts">
import { inject } from 'vue';
import type { GameState } from '../../logic/GameState';

const gameState = inject<GameState>('gameState');

const exitMinigame = () => {
  if (gameState) { // gameState is already checked by inject, but good practice
    gameState.exitMinigame();
  }
};

</script>

<template>
  <div class="firststeps-view-container">
    <h1>FirstSteps Minigame</h1>
    <p>This is the FirstSteps minigame. Build your UI here!</p>
    
    <!-- FirstSteps: Displaying a piece of state (ensure 'score' exists in FirstStepsState if used) -->
    <!-- <p v-if="firstStepsState">Score: {{ firstStepsState.score || 0 }}</p> -->

    <!-- FirstSteps: Button to trigger a minigame action -->
    <!-- <button @click="performFirstStepsAction">Perform Action</button> -->

    <button @click="exitMinigame">Exit Minigame</button>
  </div>
</template>

<style scoped>
.firststeps-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #2c3e50; /* FirstSteps: different background */
  color: #ecf0f1; /* FirstSteps: different text color */
  text-align: center;
}

.firststeps-view-container h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.firststeps-view-container p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

.firststeps-view-container button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #3498db; /* FirstSteps: different button color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.firststeps-view-container button:hover {
  background-color: #2980b9; /* FirstSteps: different button hover color */
}
</style> 