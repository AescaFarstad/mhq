<script setup lang="ts">
import { ref, inject, computed, onMounted, onUnmounted } from 'vue';
import { GameState } from './logic/GameState';
import { Resource } from './logic/core/Resource';

// Inject the game state provided in main.ts
const gameState = inject<GameState>('gameState');

// Reactive references for display
const goldDisplay = ref("0");
const maxGoldDisplay = ref("0");
const goldIncomeDisplay = ref("0");

let intervalId: number | undefined;

// Function to update the display values from gameState
const updateDisplay = () => {
  if (gameState) {
    const goldResource = gameState.resourceManager.getResource('gold');
    if (goldResource) {
      goldDisplay.value = goldResource.current.value.toFixed(1);
      maxGoldDisplay.value = goldResource.max.value.toFixed(0);
      goldIncomeDisplay.value = goldResource.income.value.toFixed(2);
    } else {
        // Handle case where resource might not exist yet
        goldDisplay.value = "N/A";
        maxGoldDisplay.value = "N/A";
        goldIncomeDisplay.value = "N/A";
    }
  } else {
    console.error("GameState not injected!");
  }
};

// Update the display periodically (e.g., 10 times per second)
// We don't need to update *every* frame, just often enough for the UI
onMounted(() => {
  updateDisplay(); // Initial update
  intervalId = window.setInterval(updateDisplay, 100); // Update 10 times/sec
});

// Clean up the interval when the component is unmounted
onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});

</script>

<template>
  <div>
    <h1>Resource Monitor</h1>
    <div class="resource-display">
      <span>Gold:</span>
      <span>{{ goldDisplay }} / {{ maxGoldDisplay }}</span>
      <span>(+{{ goldIncomeDisplay }}/sec)</span>
    </div>
    <!-- You can add more UI elements here -->
  </div>
</template>

<style scoped>
.resource-display {
  font-family: monospace;
  font-size: 1.2em;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  display: inline-block;
}

.resource-display span {
  margin: 0 5px;
}
</style> 