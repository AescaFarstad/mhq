<template>
  <div 
    :class="['character-item', { 'selected': isSelected }]"
    @click="$emit('select')"
  >
    <div class="char-name">{{ character.name }}</div>
    <div class="char-stats">
      <span class="char-level">Level {{ character.level }}</span>
      <span class="char-upkeep">Upkeep: {{ character.upkeep.toFixed(1) }}</span>
    </div>
    <!-- Assigned Task Display -->
    <div v-if="assignedTask" class="assigned-task-container">
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
  padding: 8px 10px; /* Slightly increased padding */
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Subtle shadow */
  display: flex; /* Added to allow flex-direction */
  flex-direction: column; /* Stack children vertically */
}

.character-item:hover {
  background-color: #f0f7ff;
  border-color: #a0c0ff;
  transform: translateY(-1px); /* Slight lift effect */
  box-shadow: 0 2px 4px rgba(0,0,0,0.07); /* Increased shadow on hover */
}

.character-item.selected {
  background-color: #e0f0ff;
  border-color: #70a0ff;
  box-shadow: 0 0 5px rgba(100, 150, 255, 0.3); /* Highlight shadow */
  transform: translateY(0); /* Reset transform */
}

.char-name {
  font-weight: bold;
  margin-bottom: 5px; /* Increased spacing */
  color: #333;
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis if name is too long */
}

.char-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #555; /* Slightly darker grey */
}

.char-level {
    /* Specific styles for level if needed */
}

.char-upkeep {
    /* Specific styles for upkeep if needed */
}

.assigned-task-container {
  margin-top: 8px; /* Add some space above the task display */
  margin-right: -11px; /* Counteract parent padding-right */
  margin-bottom: -8px; /* Counteract parent padding-bottom */
  margin-left: -11px;  /* Counteract parent padding-left */
  display: flex;
  justify-content: flex-end;
}

.assigned-task-container > * {
  max-width: 100%;
  box-sizing: border-box;
}
</style>
