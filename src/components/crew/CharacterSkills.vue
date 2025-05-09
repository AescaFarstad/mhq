<script setup lang="ts">
import { SkillUIInfo, SkillSpecializationUIInfo } from '../../types/uiTypes';

const props = defineProps<{
  skills: SkillUIInfo[]; // Character's skills with levels
}>();

// Helper function to format numbers with undefined check
const formatValue = (value: number | string | undefined): string => {
  if (value === undefined) return '0';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  return value.toString();
};
</script>

<template>
  <div class="skills-section">
    <h4>Skills</h4>
    
    <div v-if="!skills || skills.length === 0" class="no-skills-data">
      No skills data available.
    </div>
    <div v-else class="skill-list">
      <div v-for="skill in skills" :key="skill.id" class="skill-item">
        <div class="skill-header">
          <span class="skill-name">{{ skill.displayName }}</span>
          <span class="skill-value">Level {{ formatValue(skill.level) }}</span>
        </div>
        <div class="skill-description">{{ skill.description }}</div>
        
        <!-- Display specializations if any -->
        <div v-if="skill.specializations && skill.specializations.length > 0" class="specializations">
          <div v-for="spec in skill.specializations" :key="spec.id" class="specialization-row">
            <span class="specialization-name">{{ spec.displayName }}</span>
            <span class="specialization-value">Level {{ formatValue(spec.level) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style to match AttributesSection but in vertical list */
.skills-section {
  margin-top: 25px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.skills-section h4 {
  margin-bottom: 15px;
  font-size: 1.2em; /* Slightly larger heading */
  color: #333;
}

.no-skills-data {
  color: #888;
  font-style: italic;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 600px; /* Limit width for better readability */
}

.skill-item {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #fdfdfd;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: 5px;
}

.skill-item:hover {
  background-color: #f8faff;
  border-color: #c0d8ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
}

.skill-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 12px 15px 8px;
  border-bottom: 1px dashed #eee;
}

.skill-name {
  color: #2c3e50;
  flex-grow: 1;
}

.skill-value {
  color: #0056b3;
  font-size: 1.05em;
  margin-left: 10px;
  text-align: right;
  white-space: nowrap;
}

.skill-description {
  padding: 8px 15px;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
  border-bottom: 1px dotted #eee;
}

.specializations {
  padding: 5px 0;
}

.specialization-row {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 5px 15px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.specialization-row:hover {
  background-color: #f0f7ff;
}

.specialization-name {
  color: #444;
  flex-grow: 1;
  padding-left: 15px; /* Indent specializations */
}

.specialization-value {
  color: #333;
  font-weight: 500;
  margin-left: 10px;
  text-align: right;
  white-space: nowrap;
}

.no-skills {
  font-style: italic;
  color: #999;
  text-align: center;
  padding: 15px;
}
</style> 