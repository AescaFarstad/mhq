<template>
  <div 
    class="crystal-ball-container"
    :class="{ 'clickable': hasWords, 'glowing': hasWords }"
    @click="handleClick"
  >
    <div class="crystal-ball">
      <img src="/img/ball.webp" alt="Crystal Ball Layer 1" class="ball-layer layer-1" />
      <img src="/img/ball (1).webp" alt="Crystal Ball Layer 2" class="ball-layer layer-2" />
      <img src="/img/ball (2).webp" alt="Crystal Ball Layer 3" class="ball-layer layer-3" />
      <img src="/img/ball (3).webp" alt="Crystal Ball Layer 4" class="ball-layer layer-4" />
      <img src="/img/ball (4).webp" alt="Crystal Ball Layer 5" class="ball-layer layer-5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { GameState } from '../logic/GameState';

const gameState = inject<GameState>('gameState');

const hasWords = computed(() => {
  return gameState?.uiState.crystalBallWords.length ?? 0 > 0;
});

const handleClick = () => {
  if (hasWords.value && gameState) {
    gameState.toggleCrystalView();
  }
};
</script>

<style scoped>
.crystal-ball-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
  transition: all 0.3s ease;
}

.crystal-ball-container.clickable {
  cursor: pointer;
}

.crystal-ball-container.glowing {
  filter: drop-shadow(0 0 20px rgba(147, 112, 219, 0.6));
}

.crystal-ball-container.clickable:hover {
  transform: scale(1.02);
  filter: drop-shadow(0 0 25px rgba(147, 112, 219, 0.8));
}

.crystal-ball {
  position: relative;
  width: 466px;
  height: 470px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ball-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  transform-origin: center center;
}

.layer-1 {
  z-index: 1;
  animation: rotate-clockwise-slow 20s linear infinite, opacity-pulse-1 8s ease-in-out infinite;
}

.layer-2 {
  z-index: 2;
  animation: rotate-counter-clockwise-medium 15s linear infinite, opacity-pulse-2 6s ease-in-out infinite;
}

.layer-3 {
  z-index: 3;
  animation: rotate-clockwise-fast 10s linear infinite, opacity-pulse-3 7s ease-in-out infinite;
}

.layer-4 {
  z-index: 4;
  animation: rotate-counter-clockwise-fast 8s linear infinite, opacity-pulse-4 5s ease-in-out infinite;
}

.layer-5 {
  z-index: 5;
  animation: rotate-clockwise-very-fast 6s linear infinite, opacity-pulse-5 9s ease-in-out infinite;
}

.clickable .layer-1,
.clickable .layer-2,
.clickable .layer-3,
.clickable .layer-4,
.clickable .layer-5 {
  transition: opacity 0.3s ease;
}

.clickable:hover .layer-1 {
  animation: rotate-clockwise-slow 15s linear infinite, opacity-pulse-1 6s ease-in-out infinite;
}

.clickable:hover .layer-2 {
  animation: rotate-counter-clockwise-medium 12s linear infinite, opacity-pulse-2 4s ease-in-out infinite;
}

.clickable:hover .layer-3 {
  animation: rotate-clockwise-fast 8s linear infinite, opacity-pulse-3 5s ease-in-out infinite;
}

.clickable:hover .layer-4 {
  animation: rotate-counter-clockwise-fast 6s linear infinite, opacity-pulse-4 3s ease-in-out infinite;
}

.clickable:hover .layer-5 {
  animation: rotate-clockwise-very-fast 4s linear infinite, opacity-pulse-5 7s ease-in-out infinite;
}

/* Rotation animations */
@keyframes rotate-clockwise-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-counter-clockwise-medium {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes rotate-clockwise-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-counter-clockwise-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes rotate-clockwise-very-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Opacity pulse animations - each layer has different opacity ranges */
@keyframes opacity-pulse-1 {
  0% { opacity: 0.9; }
  25% { opacity: 1; }
  50% { opacity: 0.7; }
  75% { opacity: 0.95; }
  100% { opacity: 0.9; }
}

@keyframes opacity-pulse-2 {
  0% { opacity: 0.6; }
  33% { opacity: 0.9; }
  66% { opacity: 0.4; }
  100% { opacity: 0.6; }
}

@keyframes opacity-pulse-3 {
  0% { opacity: 0.3; }
  20% { opacity: 0.8; }
  40% { opacity: 0.2; }
  60% { opacity: 0.7; }
  80% { opacity: 0.1; }
  100% { opacity: 0.3; }
}

@keyframes opacity-pulse-4 {
  0% { opacity: 0.5; }
  40% { opacity: 0.2; }
  80% { opacity: 0.8; }
  100% { opacity: 0.5; }
}

@keyframes opacity-pulse-5 {
  0% { opacity: 0.1; }
  30% { opacity: 0.6; }
  60% { opacity: 0.05; }
  90% { opacity: 0.4; }
  100% { opacity: 0.1; }
}
</style> 