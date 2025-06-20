<template>
  <div class="task-card">
    <!-- Task Name (Centered) -->
    <div class="task-name">{{ task.name }}</div>

    <!-- Current Step Text -->
    <div v-if="!isCompleted && task.currentStepResolvedText" class="current-step-text">
      {{ task.currentStepResolvedText }}
    </div>

    <!-- Progress Bar and Overlay -->
    <EffortBar
      v-if="!isCompleted"
      :investedEffort="task.investedEffort"
      :totalEffort="task.totalEffort"
      :speed="task.speed"
      :status="task.status"
    />

    <!-- Skills and Character Portrait Area -->
    <div v-if="!isCompleted && task.resolvedDefinitionDetails.skills && task.resolvedDefinitionDetails.skills.length > 0"
         class="skills-character-container"
         :class="{ 'boxed-layout': assignedCharacterName }">

      <!-- Character Portrait Area (Left) -->
      <div v-if="assignedCharacterName" class="character-portrait-area">
        P
      </div>

      <!-- Skills Area (Right or Full Width) -->
      <div class="skills-area">
        <div v-for="(skillName, index) in task.resolvedDefinitionDetails.skills" :key="skillName" class="skill-pill">
          <span class="skill-pill-name">{{ getSkillDisplayName(skillName) }}</span>
          <span class="skill-pill-value">
            <template v-if="assignedCharacterName && task.assignedCharacterEffectiveScores && task.assignedCharacterEffectiveScores[skillName] !== undefined">
              {{ task.assignedCharacterEffectiveScores[skillName].toFixed(1) }}
            </template>
            <template v-else-if="task.resolvedDefinitionDetails.skills">
              x{{ (getSkillMultipliers(task.resolvedDefinitionDetails.skills.length)[index] || C.DEFAULT_LAST_SKILL_MULTIPLIER).toFixed(1) }}
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- Separator and Results -->
    <template v-if="!isCompleted">
        <div class="separator-container" v-if="(task.clutterReduction && task.clutterReduction < 0) || totalTaskXp > 0">
            <hr class="separator-line">
            <span class="separator-text">Results</span>
            <hr class="separator-line">
        </div>
        <div v-if="task.clutterReduction && task.clutterReduction < 0" class="task-result-item">
            Clutter Reduction: {{ (-task.clutterReduction).toFixed(1) }}
        </div>
        <div v-if="totalTaskXp > 0" class="task-result-item">
            Total task XP: {{ Math.round(totalTaskXp) }}
        </div>
    </template>

    <!-- Separator and Actions -->
    <div v-if="!isCompleted" class="separator-container-actions">
      <hr class="separator-line-full">
    </div>

    <div class="task-actions" v-if="!isCompleted">
      <button v-if="isQueueable">Enqueue</button>
      <button v-if="isActive">Put off</button>
    </div>

     <!-- Display for Completed Tasks -->
    <div v-if="isCompleted" class="completed-task-info">
      <span v-if="task.clutterReduction && task.clutterReduction < 0" class="completed-task-effect">
        Clutter: {{ (task.clutterReduction).toFixed(1) }}
      </span>
       <span v-else>Completed</span> <!-- Placeholder for completed tasks without clutter effect -->
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { GameTask } from '../../logic/TaskTypes';
import { GameTaskType, GameTaskStatus } from '../../logic/TaskTypes';
import { useGameState } from '../../composables/useGameState';
import { getSkillMultipliers } from '../../logic/Task';
import EffortBar from '../shared/EffortBar.vue';
import { obfuscateString } from '../../utils/stringUtils';
import { C } from '../../logic/lib/C';

const props = defineProps({
  task: {
    type: Object as PropType<GameTask>,
    required: true,
  },
});

const { gameState } = useGameState();

const assignedCharacterName = computed(() => {
  if (!props.task.assignedCharacterIds || props.task.assignedCharacterIds.length === 0 || !gameState.value) {
    return null;
  }
  const charId = props.task.assignedCharacterIds[0];
  const character = gameState.value.characters.find(c => c.characterId === charId);
  if (character) {
      return character.name;
  }
  const characterDef = gameState.value.lib.characters.getCharacter(charId);
  return characterDef?.name || 'Unknown';
});

const totalTaskXp = computed(() => {
  return props.task.totalEffort * props.task.xpMultiplier;
});

const isCompleted = computed(() => {
  return props.task.status === GameTaskStatus.Complete;
});

const isQueueable = computed(() => {
  return [
    GameTaskType.Opportunity,
    GameTaskType.Endeavour,
    GameTaskType.Quest,
  ].includes(props.task.type) && props.task.status === GameTaskStatus.Available;
});

const isActive = computed(() => {
  return props.task.status === GameTaskStatus.Processing;
});

const getSkillDisplayName = (skillOrSpecKey: string): string => {
  if (!gameState.value) return 'Unknown Skill'; // Should not happen if gameState is properly initialized
  const skillDisplayName = gameState.value.lib.skills.items[skillOrSpecKey]?.displayName || 'Unknown Skill';
  return gameState.value.isDiscovered(skillOrSpecKey) ? skillDisplayName : obfuscateString(skillDisplayName);
};

</script>

<style scoped>
.task-card {
  border: 1px solid #ccc;
  padding: 6px 8px;
  font-size: 0.85em;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #f8f9fa; /* Slightly different background to distinguish from character info */
  box-sizing: border-box; /* Ensure proper box model */
}

.task-name {
  font-weight: bold;
  font-size: 1em;
  text-align: center;
  margin-bottom: 3px;
}

.current-step-text {
  color: #555;
  text-align: left;
  margin-bottom: 5px;
  font-size: 0.8em;
  padding: 2px 4px;
  border: 1px dashed #eee;
  background-color: #f9f9f9;
}

.skills-character-container {
  display: flex;
  gap: 6px;
  margin-bottom: 5px;
}

.skills-character-container.boxed-layout {
  border: 1px solid #ccc;
  padding: 3px;
}

.skills-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column; 
  gap: 3px;
  min-width: 0; 
}

.skill-pill {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 3px 8px;
  font-size: 0.8em;
  box-sizing: border-box;
  width: 100%; 
  white-space: nowrap;
}

.skill-pill-name {
  margin-right: 6px;
  font-weight: 500;
  overflow: hidden; 
  text-overflow: ellipsis; 
}

.skill-pill-value {
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.character-portrait-area {
  width: 35%;
  min-height: 60px;
  background-color: #e9e9e9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
  color: #777;
  padding: 2px;
  flex-shrink: 0; 
}

.separator-container {
  display: flex;
  align-items: center;
  margin: 0px 0;
}

.separator-container-actions {
    display: flex;
    align-items: center;
    margin: 3px 0;
}

.separator-line {
  flex-grow: 1;
  border: none;
  border-top: 1px solid #ddd;
}

.separator-line-full {
  width: 100%;
  border: none;
  border-top: 1px solid #ddd;
}

.separator-text {
  font-size: 0.85em;
  color: #777;
  font-weight: bold;
  white-space: nowrap;
}

.task-result-item {
  font-size: 0.7em;
  text-align: left;
}

.task-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.task-actions button {
  font-size: 0.85em;
  padding: 3px 7px;
}

.completed-task-info {
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  text-align: left; 
  padding: 4px 6px;
  font-size: 0.85em;
}

.completed-task-effect {
  font-size: 0.9em; 
  color: #333;
  white-space: nowrap;
  flex-grow: 1; 
  text-align: center; 
}

</style> 