<template>
  <div class="tasks-view-container">
    <BuffBar />
    <div class="task-columns">
      <div class="task-column">
        <h3>Completed</h3>
        <TaskCard
          v-for="task in gameState?.uiState.uiCompletedTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <h3>Active</h3>
        <TaskCard
          v-for="task in gameState?.uiState.uiActiveTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <h3>Queued</h3>
        <TaskCard 
          v-for="task in gameState?.uiState.uiQueuedTasks" 
          :key="task.uid" 
          :task="task" 
        />
      </div>
      <div class="task-column">
        <h3>Maintenance</h3>
        <TaskCard
          v-for="task in gameState?.uiState.uiMaintenanceTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <h3>Opportunity</h3>
        <TaskCard
          v-for="task in gameState?.uiState.uiOpportunityTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <h3>Endeavour</h3>
        <TaskCard
          v-for="task in gameState?.uiState.uiEndeavourTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <h3>Quest</h3>
        <TaskCard 
          v-for="task in gameState?.uiState.uiQuestTasks" 
          :key="task.uid" 
          :task="task" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent as _defineComponent } from "vue";
import TaskCard from "../common/TaskCard.vue";
import BuffBar from "../BuffBar.vue";
import { useGameState } from '../../composables/useGameState';

const { gameState } = useGameState();

</script>

<style scoped>

.task-columns {
  display: flex;
}

.task-column {
  flex: 1;
  border-right: 1px solid #eee;
  min-width: 150px;
}

.task-column h3 {
  font-size: 1em;
  margin-top: 0;
  text-align: center;
  padding: 5px;
}
</style> 