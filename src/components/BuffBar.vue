<template>
  <div class="buff-bar-container">
    <span
      class="work-speed-buff"
      @mouseover="showTooltip = true"
      @mouseleave="showTooltip = false"
      ref="workSpeedBuffElement"
    >
      Work Speed: {{ formattedWorkSpeed }}
    </span>
    <TooltipBubble :visible="showTooltip" :targetElement="workSpeedBuffElement">
      {{ workSpeedTooltipContent }}
    </TooltipBubble>
    <!-- Add more buffs here as needed -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGameState } from '../composables/useGameState';
import TooltipBubble from './TooltipBubble.vue'; // Import the new TooltipBubble component

const { gameState } = useGameState();

const formattedWorkSpeed = computed(() => {
  return gameState.value?.uiState.uiWorkSpeed.toFixed(2) || '0.00';
});

const workSpeedTooltipContent = computed(() => {
  const clutterRatioPercentage = Math.round(((gameState.value?.uiState.uiClutterRatio || 0) - 1) * 100);
  return `From clutter: ${clutterRatioPercentage}%`;
});

const showTooltip = ref(false);
const workSpeedBuffElement = ref<HTMLElement | null>(null);
</script>

<style scoped>
.buff-bar-container {
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc; /* Added border */
  position: relative; /* Needed for potential absolute positioning of tooltips if not using fixed */
}

.work-speed-buff {
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: blue;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
</style> 