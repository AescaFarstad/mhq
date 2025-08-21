<template>
  <div
    class="debug-overlay"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
  >
    <div class="header" @mousedown="startDrag">
      <span>Debug Overlay</span>
      <button @click="$emit('close')">X</button>
    </div>
    <div class="content">
      <p>Debug content here.</p>
      <button @click="copyDialogsToClipboard">Copy Dialogs</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onUnmounted, inject } from 'vue';
import type { GameState } from '../../logic/GameState';

defineEmits(['close']);

const gameState = inject<GameState>('gameState');

const position = reactive({ x: 10, y: 10 });
// Using a simple object for dragging state to avoid complexities with event listeners and refs.
const dragging = { value: false };
const offset = reactive({ x: 0, y: 0 });

const copyDialogsToClipboard = () => {
  if (gameState) {
    const dialogsJson = JSON.stringify(gameState.dialogs, null, 2);
    navigator.clipboard.writeText(dialogsJson).then(() => {
      console.log('Dialogs copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy dialogs: ', err);
    });
  }
};

const startDrag = (event: MouseEvent) => {
  // Only allow dragging with the left mouse button.
  if (event.button !== 0) return;
  
  dragging.value = true;
  offset.x = event.clientX - position.x;
  offset.y = event.clientY - position.y;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (event: MouseEvent) => {
  if (dragging.value) {
    position.x = event.clientX - offset.x;
    position.y = event.clientY - offset.y;
  }
};

const stopDrag = () => {
  dragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

onUnmounted(() => {
  // Clean up event listeners when the component is unmounted.
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.debug-overlay {
  position: absolute;
  z-index: 9999;
  background-color: rgba(40, 40, 40, 0.9);
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  min-width: 300px;
  color: #eee;
  display: flex;
  flex-direction: column;
  font-family: monospace;
}

.header {
  padding: 8px 12px;
  cursor: move;
  background-color: #333;
  border-bottom: 1px solid #555;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
}

.header button {
    cursor: pointer;
    background: #555;
    border: 1px solid #777;
    color: white;
    border-radius: 4px;
    padding: 2px 6px;
}

.content {
  padding: 12px;
}
</style> 