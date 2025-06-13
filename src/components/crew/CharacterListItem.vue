<template>
  <div 
    :class="['character-item', { 'selected': isSelected }]"
    @click="$emit('select')"
  >
    <!-- Character Info Section with padding -->
    <div class="character-info">
      <div class="char-name">{{ character.name }}</div>
      <div class="char-stats">
        <span class="char-level">Level {{ character.level }}</span>
        <span class="char-upkeep">Upkeep: {{ character.upkeep.toFixed(1) }}</span>
      </div>
    </div>
    
    <!-- Task Section - full width minus 1px on each side -->
    <div v-if="assignedTask" class="task-section">
      <TaskCard v-if="isSelected" :task="assignedTask" />
      <MiniTaskDisplay v-else :task="assignedTask" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { SimpleCharacterInfo } from '../../types/uiTypes';
import { defineComponent as _defineComponent } from "vue";
import TaskCard from "../common/TaskCard.vue";
import MiniTaskDisplay from "../common/MiniTaskDisplay.vue";
import type { GameTask } from '../../logic/TaskTypes';
import { useGameState } from '../../composables/useGameState';

const props = defineProps({
  character: {
    type: Object as PropType<SimpleCharacterInfo>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  // assignedTask: { // This will be replaced by a computed property
  //   type: Object as PropType<GameTask | null>,
  //   default: null,
  // }
});

defineEmits(['select']);

const { gameState } = useGameState();

const assignedTask = computed(() => {
  if (!gameState.value) return null;

  const taskInProgress = gameState.value.processingTasks.find(
    (t) => t.assignedCharacterIds.includes(props.character.id)
  );

  if (taskInProgress) {
    // Return a new object (shallow clone) using spread syntax.
    // This ensures reactivity for child components when task properties change.
    return { ...taskInProgress } as GameTask;
  }
  
  return null;
});

</script>

<style scoped>
.character-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent content from spilling outside the card */
}

.character-item:hover {
  background-color: #f0f7ff;
  border-color: #a0c0ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.07);
}

.character-item.selected {
  background-color: #e0f0ff;
  border-color: #70a0ff;
  box-shadow: 0 0 5px rgba(100, 150, 255, 0.3);
  transform: translateY(0);
}

/* Character info section with proper padding */
.character-info {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
}

.char-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.char-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #555;
}

.char-level {
    /* Specific styles for level if needed */
}

.char-upkeep {
    /* Specific styles for upkeep if needed */
}

/* Task section takes full width minus 1px on each side */
.task-section {
  margin: 0 1px 1px 1px; /* 1px margin on sides and bottom */
  display: flex;
  flex-direction: column;
}

/* Ensure task components don't add extra margins/borders that break layout */
.task-section :deep(.task-card),
.task-section :deep(.mini-task-display) {
  margin: 0; /* Remove any external margins */
  border-radius: 0 0 3px 3px; /* Match the parent card's bottom radius */
}
</style>
