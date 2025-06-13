<template>
  <div class="tasks-view-container">
    <BuffBar />
    
    <!-- Fixed Header Row -->
    <div class="task-headers">
      <div class="task-header">Completed</div>
      <div class="task-header">Active</div>
      <div class="task-header">Queued</div>
      <div class="task-header">Maintenance</div>
      <div class="task-header">Opportunity</div>
      <div class="task-header">Endeavour</div>
      <div class="task-header">Quest</div>
    </div>
    
    <!-- Scrollable Content Area -->
    <div class="task-columns">
      <div class="task-column">
        <TaskCard
          v-for="task in gameState?.uiState.uiCompletedTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <TaskCard
          v-for="task in gameState?.uiState.uiActiveTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <TaskCard 
          v-for="task in gameState?.uiState.uiQueuedTasks" 
          :key="task.uid" 
          :task="task" 
        />
      </div>
      <div class="task-column">
        <TaskCard
          v-for="task in gameState?.uiState.uiMaintenanceTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <TaskCard
          v-for="task in gameState?.uiState.uiOpportunityTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
        <TaskCard
          v-for="task in gameState?.uiState.uiEndeavourTasks"
          :key="task.uid"
          :task="task"
        />
      </div>
      <div class="task-column">
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
.tasks-view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.task-headers {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
}

.task-header {
  flex: 1;
  text-align: center;
  font-size: 1em;
  font-weight: bold;
  padding: 10px 5px;
  border-right: 1px solid #eee;
  color: #333;
}

.task-header:last-child {
  border-right: none;
}

.task-columns {
  display: flex;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.task-column {
  flex: 1;
  border-right: 1px solid #eee;
  min-width: 150px;
  padding: 8px;
  overflow: visible;
}

.task-column:last-child {
  border-right: none;
}


</style> 