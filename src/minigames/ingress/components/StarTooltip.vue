<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  show: boolean;
  position?: { x: number; y: number } | null;
}>();

const tooltipRef = ref<HTMLDivElement | null>(null);
</script>

<template>
  <div 
  v-if="show && position"
  ref="tooltipRef"
  class="star-tooltip"
  :style="{
    left: `${position.x}px`,
    top: `${position.y}px`,
  }"
  >
  Need more ☆
  </div>
</template>

<style scoped>
.star-tooltip {
  position: fixed;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #7f8c8d;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 1000;
  pointer-events: none;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  white-space: nowrap;
}
</style> 