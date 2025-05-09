<template>
  <div v-if="!selectedCharacter" class="no-selection">
    <p>Select a character to view details</p>
  </div>
  <div v-else class="character-info">
    <!-- Character Header -->
    <div class="character-header">
      <h3>{{ selectedCharacter.name }}</h3>
      <div class="character-stats">
        <span class="stat-badge">Level {{ selectedCharacter.level }}</span>
        <span class="stat-badge">Upkeep: {{ selectedCharacter.upkeep.toFixed(1) }} gold</span>
      </div>
    </div>

    <!-- Hint Information / Bio Section -->
    <div class="hint-section">
      <p v-if="currentHint">{{ currentHint }}</p>
      <p v-else-if="selectedCharacter.bio" class="hint-placeholder">{{ selectedCharacter.bio }}</p>
      <p v-else class="hint-placeholder">No description available.</p>
    </div>

    <!-- Attributes Section -->
    <CharacterAttributes
      v-if="selectedCharacter.attributes"
      :attributes="selectedCharacter.attributes"
      :current-hint="currentHint" 
      @set-hint="$emit('set-hint', $event)"
    />
    <div v-else class="no-attributes">
      No attribute data available.
    </div>
    
    <!-- Skills Section -->
    <CharacterSkills
      v-if="selectedCharacter.skills && selectedCharacter.skills.length > 0"
      :skills="selectedCharacter.skills"
    />
    <div v-else class="no-skills">
      No skills data available.
    </div>

  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import CharacterAttributes from './CharacterAttributes.vue';
import CharacterSkills from './CharacterSkills.vue';
import { SelectedCharacterInfo } from '../../types/uiTypes';

defineProps({
  selectedCharacter: {
    type: Object as PropType<SelectedCharacterInfo | null>,
    default: null,
  },
  currentHint: {
    type: String as PropType<string | null>,
    default: null,
  },
});

defineEmits(['set-hint']);

</script>

<style scoped>
/* Styles moved/adapted from CrewView.vue for the details panel */
.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.character-info {
}

/* Character Header Styles */
.character-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.character-header h3 {
  margin: 0;
  font-size: 1.6em; /* Slightly larger name */
  color: #2c3e50;
}

.character-stats {
  display: flex;
  gap: 12px; /* Increased gap */
}

.stat-badge {
  background-color: #e9ecef; /* Lighter gray badge */
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 5px 10px; /* Slightly larger padding */
  font-size: 0.9em;
  color: #495057; /* Darker gray text */
  white-space: nowrap;
}

/* Hint/Bio Section Styles */
.hint-section {
  margin-bottom: 25px; /* Increased margin */
  padding: 10px;
  background-color: #f8f9fa; /* Very light background */
  border-radius: 4px;
  min-height: 40px; /* Ensure consistent height */
  display: flex;
  align-items: center;
  font-size: 0.95em;
  color: #333;
  border: 1px solid #eee;
}

.hint-section p {
    margin: 0;
    line-height: 1.4;
}

.hint-placeholder {
  color: #6c757d; /* Bootstrap muted color */
  font-style: italic;
}

.no-attributes,
.no-skills {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;
    margin-top: 20px;
}

/* Remove the .character-info > * + * spacing since the component has its own margin */
</style>
