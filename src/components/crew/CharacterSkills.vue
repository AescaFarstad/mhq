<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { SkillUIInfo } from '../../types/uiTypes'; 
import SkillItem from './SkillItem.vue'; // Import the new component

const props = defineProps<{
  skills: SkillUIInfo[];
  characterId: string; // Added characterId prop
  skillPoints: number;
  specPoints: number;
  selectedAttribute?: string; // Optional prop for displaying current attribute
}>();

// Computed property to determine what points text to show
const pointsText = computed(() => {
  const hasSkillPoints = props.skillPoints > 0;
  const hasSpecPoints = props.specPoints > 0;
  
  if (hasSkillPoints && hasSpecPoints) {
    return `skill points: ${props.skillPoints} spec points: ${props.specPoints}`;
  } else if (hasSkillPoints) {
    return `skill points: ${props.skillPoints}`;
  } else if (hasSpecPoints) {
    return `spec points: ${props.specPoints}`;
  }
  return '';
});

// Computed property for header text
const headerText = computed(() => {
  if (props.selectedAttribute) {
    const attributeDisplayNames: Record<string, string> = {
      'physique': 'Physique',
      'mind': 'Mind', 
      'social': 'Social',
      'spirit': 'Spirit'
    };
    const displayName = attributeDisplayNames[props.selectedAttribute] || props.selectedAttribute;
    return `${displayName} Skills:`;
  }
  return 'Skills:';
});

// currentHint, formatValue, showSkillHint, showSpecializationHint, clearHint are removed.
</script>

<template>
  <div class="skills-section">
    
    <div v-if="!props.skills || props.skills.length === 0" class="no-skills-data">
      <span v-if="props.selectedAttribute">No {{ props.selectedAttribute }} skills available.</span>
      <span v-else>No skills data available.</span>
    </div>
    <div v-else class="skill-list">
      <SkillItem 
        v-for="skill in props.skills" 
        :key="skill.id" 
        :skill="skill"
        :characterId="props.characterId"
        :skillPoints="props.skillPoints"
        :specPoints="props.specPoints"
      />
    </div>
  </div>
</template>

<style scoped>
.skills-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.skills-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.points-info {
  font-size: 0.85em;
  color: #0056b3;
  font-weight: 500;
}

.no-skills-data {
  color: #888;
  font-style: italic;
  padding: 8px 0;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
}
</style> 