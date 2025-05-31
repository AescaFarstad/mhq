<template>
  <div class="mini-task-display">
    <div class="task-name">{{ task.name }}</div>
    <EffortBar
      :investedEffort="task.investedEffort"
      :totalEffort="task.totalEffort"
      :speed="task.speed"
      :status="task.status"
    />
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { GameTask } from '../../logic/TaskTypes';
import { defineComponent as _defineComponent } from "vue";
import EffortBar from "../shared/EffortBar.vue";

defineProps({
  task: {
    type: Object as PropType<GameTask>,
    required: true,
  },
});

</script>

<style scoped>
.mini-task-display {
  padding: 4px 6px; /* Reverted from 2px 4px */
  font-size: 0.8em;
  display: flex;
  flex-direction: column;
  gap: 4px; /* Reverted from 2px */
  border: 1px solid #eee;
  border-radius: 3px;
  margin-top: 5px; /* Reverted from 3px */
}

.task-name {
  font-weight: bold;
  font-size: 0.9em; /* Reverted from 0.85em */
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0; /* Reverted from 1px, original MiniTaskDisplay didn't have margin-bottom here */
}
</style> 