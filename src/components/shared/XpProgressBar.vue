<template>
  <div class="xp-progress-section">
    <progress
      :value="xpProgress"
      :max="nextLevelDelta"
      class="xp-progress"
      :style="{ '--progress-bar-color': progressBarColor }"
    ></progress>
    <div class="progress-overlay-text-container">
      <span class="progress-text">{{ Math.round(xpProgress) }}/{{ Math.round(nextLevelDelta) }} XP</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  xpProgress: {
    type: Number,
    required: true,
  },
  nextLevelDelta: {
    type: Number,
    required: true,
  }
});

const progressBarColor = computed(() => {
  if (props.xpProgress >= props.nextLevelDelta) {
    return 'rgb(0, 200, 0)'; // Green when at max
  }
  
  // Blue progress bar for XP
  const progress = Math.min(1, props.xpProgress / props.nextLevelDelta);
  const intensity = Math.round(100 + (progress * 155)); // From dark blue to bright blue
  return `rgb(0, ${Math.round(intensity * 0.7)}, ${intensity})`;
});

</script>

<style scoped>
.xp-progress-section {
  position: relative;
  height: 20px;
}

.xp-progress {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  -webkit-appearance: none;
  appearance: none;
}

.xp-progress::-webkit-progress-bar {
  background-color: #e0e0e0;
  border-radius: 3px;
}
.xp-progress::-webkit-progress-value {
  background-color: var(--progress-bar-color);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.xp-progress::-moz-progress-bar {
  background-color: var(--progress-bar-color);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.progress-overlay-text-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  box-sizing: border-box;
  pointer-events: none;
  font-size: 0.75em;
  font-weight: bold;
  color: black;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
}

.progress-text {
  text-align: center;
}
</style> 