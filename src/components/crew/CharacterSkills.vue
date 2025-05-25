<script setup lang="ts">
import { defineProps } from 'vue';
import { SkillUIInfo } from '../../types/uiTypes'; 
// ImageHolder might be removable if not directly used in CharacterSkills template after refactor
import SkillItem from './SkillItem.vue'; // Import the new component

const props = defineProps<{
  skills: SkillUIInfo[];
  characterId: string; // Added characterId prop
}>();

// currentHint, formatValue, showSkillHint, showSpecializationHint, clearHint are removed.
</script>

<template>
  <div class="skills-section">
    <h4>Skills:</h4>
    
    <div v-if="!props.skills || props.skills.length === 0" class="no-skills-data">
      No skills data available.
    </div>
    <div v-else class="skill-list">
      <SkillItem 
        v-for="skill in props.skills" 
        :key="skill.id" 
        :skill="skill"
        :characterId="props.characterId"
      />
    </div>
  </div>
</template>

<style scoped>

.skills-section {
}

.skills-section h4 {
  margin-bottom: 8px;
  font-size: 1.2em;
  color: #333;
}

.no-skills-data {
  color: #888;
  font-style: italic;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style> 