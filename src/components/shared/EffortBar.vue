<template>
  <div class="progress-section">
    <progress
      :value="investedEffort"
      :max="totalEffort"
      class="task-progress"
      :style="{ '--progress-bar-color': progressBarColor }"
    ></progress>
    <div class="progress-overlay-text-container">
      <span class="progress-effort-text">{{ Math.round(investedEffort) }}/{{ Math.round(totalEffort) }}</span>
      <span class="progress-speed-text" v-if="status === 'Processing' && speed !== undefined && speed > 0">+{{ effectiveSpeed.toFixed(1) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { GameTaskStatus } from '../../logic/TaskTypes';
import { useGameState } from '../../composables/useGameState';

const props = defineProps({
  investedEffort: {
    type: Number,
    required: true,
  },
  totalEffort: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    default: 0,
  },
  status: {
    type: String as PropType<GameTaskStatus>,
    required: true,
  }
});

const { gameState } = useGameState();

const effectiveSpeed = computed(() => {
  if (!gameState.value) return props.speed;
  return props.speed * gameState.value.workSpeed.value;
});

const PROGRESS_COLOR_MAP = [
  { time: 0, color: { r: 0, g: 255, b: 0 } },
  { time: 60, color: { r: 0, g: 255, b: 0 } },
  { time: 300, color: { r: 255, g: 255, b: 0 } },
  { time: 1200, color: { r: 255, g: 0, b: 0 } },
  { time: 2400, color: { r: 139, g: 0, b: 0 } },
];

function interpolateColor(color1: {r:number,g:number,b:number}, color2: {r:number,g:number,b:number}, factor: number) {
  const r = Math.round(color1.r + factor * (color2.r - color1.r));
  const g = Math.round(color1.g + factor * (color2.g - color1.g));
  const b = Math.round(color1.b + factor * (color2.b - color1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

function getProgressColor(timeToComplete: number): string {
  if (timeToComplete <= PROGRESS_COLOR_MAP[0].time) {
    const c = PROGRESS_COLOR_MAP[0].color;
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
  }

  for (let i = 0; i < PROGRESS_COLOR_MAP.length - 1; i++) {
    const lowerBound = PROGRESS_COLOR_MAP[i];
    const upperBound = PROGRESS_COLOR_MAP[i+1];
    if (timeToComplete >= lowerBound.time && timeToComplete <= upperBound.time) {
      const factor = (timeToComplete - lowerBound.time) / (upperBound.time - lowerBound.time);
      return interpolateColor(lowerBound.color, upperBound.color, factor);
    }
  }
  const lastColor = PROGRESS_COLOR_MAP[PROGRESS_COLOR_MAP.length - 1].color;
  return `rgb(${lastColor.r}, ${lastColor.g}, ${lastColor.b})`;
}

const timeToComplete = computed(() => {
  if (effectiveSpeed.value && effectiveSpeed.value > 0 && props.totalEffort > props.investedEffort) {
    return (props.totalEffort - props.investedEffort) / effectiveSpeed.value;
  }
  return Infinity;
});

const progressBarColor = computed(() => {
  if (props.investedEffort >= props.totalEffort || props.status === GameTaskStatus.Complete) {
    return 'rgb(100, 100, 100)';
  }
  return getProgressColor(timeToComplete.value);
});

</script>

<style scoped>
.progress-section {
  position: relative;
  height: 18px;
  margin-bottom: 5px;
}

.task-progress {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  -webkit-appearance: none;
  appearance: none;
}

.task-progress::-webkit-progress-bar {
  background-color: #e0e0e0;
  border-radius: 3px;
}
.task-progress::-webkit-progress-value {
  background-color: var(--progress-bar-color);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.task-progress::-moz-progress-bar {
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
  justify-content: space-between;
  padding: 0 5px;
  box-sizing: border-box;
  pointer-events: none;
  font-size: 0.8em;
  font-weight: bold;
  color: black;
}

.progress-effort-text {
  flex-grow: 1;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.progress-speed-text {
  white-space: nowrap;
}
</style> 