<script setup lang="ts">
import { inject, computed } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { ClickCounterState } from './ClickCounterTypes';
import { ClickCounterGame } from './ClickCounterGame';

const gameState = inject<GameState>('gameState');

const minigameState = computed(() => {
  if (gameState?.activeMinigame?.type === 'ClickCounter') {
    return gameState.uiState.activeMinigameState as ClickCounterState | null;
  }
  return null;
});

const handleClick = () => {
  if (gameState && gameState.activeMinigame instanceof ClickCounterGame) {
    gameState.activeMinigame.recordClick(gameState);
  }
};

const buttonText = computed(() => {
  if (minigameState.value) {
    const remaining = minigameState.value.clicksToWin - minigameState.value.clickCount;
    return `Close (${remaining} more clicks)`;
  }
  return 'Close';
});

</script>

<template>
  <div v-if="minigameState" class="click-counter-overlay">
    <div class="click-counter-content">
      <h2>Click Counter Minigame</h2>
      <p>You have clicked {{ minigameState.clickCount }} times.</p>
      <p>You need to click {{ minigameState.clicksToWin }} times to close this.</p>
      <button @click="handleClick">{{ buttonText }}</button>
    </div>
  </div>
</template>

<style scoped>
.click-counter-overlay {
  position: fixed; /* Use fixed to overlay the entire viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* Ensure it's on top of other UI elements */
}

.click-counter-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 350px;
}

.click-counter-content h2 {
  margin-top: 0;
  color: #333;
}

.click-counter-content p {
  margin: 10px 0;
  color: #555;
  font-size: 1.1em;
}

.click-counter-content button {
  margin-top: 20px;
  padding: 12px 25px;
  font-size: 1em;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.click-counter-content button:hover {
  background-color: #0056b3;
}
</style> 