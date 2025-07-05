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
  pointer-events: auto; /* Ensure it's clickable */
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