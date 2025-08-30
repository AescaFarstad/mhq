<script setup lang="ts">
import { useMusic } from '../composables/useMusic';

const { toggleVolume, getCurrentVolumePercent, showVolumeControl } = useMusic();
</script>

<template>
  <div v-if="showVolumeControl" class="volume-control-button" @click="toggleVolume">
  <div class="music-note">♪</div>
  <div class="volume-percent">{{ getCurrentVolumePercent }}%</div>
  </div>
</template>

<style scoped>
.volume-control-button {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10000; /* Very high z-index to be on top of everything */
  backdrop-filter: blur(10px);
  pointer-events: auto;
  animation: flash-and-settle 1s ease-out, gentle-pulse 5s ease-out 0.2s;
  user-select: none;
}

@keyframes flash-and-settle {
  0% {
  transform: scale(0.8);
  opacity: 0.5;
  }
  30% {
  transform: scale(1.2);
  box-shadow: 0 0 25px 10px rgba(255, 255, 255, 0.7);
  }
  60% {
  transform: scale(0.95);
  box-shadow: none;
  }
  100% {
  transform: scale(1);
  opacity: 1;
  }
}

@keyframes gentle-pulse {
  0% {
  box-shadow: 0 0 12px 6px rgba(255, 255, 255, 0.35);
  }
  15% {
  box-shadow: 0 0 12px 6px rgba(255, 255, 255, 0);
  }
  30% {
  box-shadow: 0 0 12px 6px rgba(255, 255, 255, 0.35);
  }
  45% {
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
  60% {
  box-shadow: 0 0 12px 6px rgba(255, 255, 255, 0.35);
  }
  80% {
  box-shadow: 0 0 16px 8px rgba(255, 255, 255, 0.85);
  }
  100% {
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.volume-control-button:hover {
  background-color: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

.music-note {
  font-size: 18px;
  color: #ecf0f1;
  line-height: 1;
  margin-bottom: 2px;
}

.volume-percent {
  font-size: 10px;
  color: #ecf0f1;
  line-height: 1;
  font-weight: bold;
}
</style> 