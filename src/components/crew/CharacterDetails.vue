<template>
  <div v-if="!selectedCharacter" class="no-selection">
    <p>Select a character to view details</p>
  </div>
  <div v-else class="character-details-grid">
    <!-- Column 1: Info & Image -->
    <div class="character-info-column">
      <!-- Character Header -->
      <div class="character-header">
        <h3>{{ selectedCharacter.name }}</h3>
        <div class="character-stats">
          <span class="stat-badge">Level {{ selectedCharacter.level }}</span>
          <span class="stat-badge">Upkeep: {{ selectedCharacter.upkeep.toFixed(1) }} gold</span>
        </div>
      </div>

      <!-- New Row for Image and Bio -->
      <div class="image-bio-row">
        <!-- Image Holder Placeholder -->
        <div class="image-holder-placeholder">
          <!-- ImageHolder component will go here -->
          <span>256x256 Image Placeholder</span>
        </div>
        <!-- Bio Section -->
        <div class="bio-section">
          <p v-if="currentHint">{{ currentHint }}</p>
          <p v-else-if="selectedCharacter.bio" class="bio-placeholder">{{ selectedCharacter.bio }}</p>
          <p v-else class="bio-placeholder">No description available.</p>
        </div>
      </div>
    </div>

    <!-- Column 2: Attributes -->
    <div class="character-attributes-column">
      <CharacterAttributes
        v-if="selectedCharacter.attributes"
        :attributes="selectedCharacter.attributes"
        :current-hint="currentHint"
        @set-hint="$emit('set-hint', $event)"
      />
      <div v-else class="no-attributes">
        No attribute data available.
      </div>
    </div>

    <!-- Skills Section (Full Span Below Columns) -->
    <div class="character-skills-row">
      <CharacterSkills
        v-if="selectedCharacter.skills && selectedCharacter.skills.length > 0"
        :skills="selectedCharacter.skills"
        :characterId="selectedCharacter.id"
      />
      <div v-else class="no-skills">
        No skills data available.
      </div>
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
.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 10px;
}

.character-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "info attributes"
    "skills skills";
}

.character-info-column {
  grid-area: info;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.image-bio-row {
  display: flex;
  flex-direction: row;
  gap: 15px; /* Space between image and bio */
  align-items: flex-start; /* Align items to the top if heights differ */
}

.character-attributes-column {
  grid-area: attributes;
  padding: 10px;
  padding-bottom: 0px;
}

.character-skills-row {
  grid-area: skills;
  margin-top: 0;
  padding: 10px;
  padding-top: 0px;
}


.character-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.character-header h3 {
  margin: 0;
  font-size: 1.6em;
  color: #2c3e50;
}

.character-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.9em;
  color: #495057;
  white-space: nowrap;
}

.bio-section {
  padding: 10px; /* Adjusted padding for consistency */
  background-color: #f8f9fa;
  border-radius: 4px;
  /* min-height: 60px; */ /* min-height might conflict with alignment, let content define height */
  display: flex;
  flex-direction: column;
  /* justify-content: center; */ /* Removed justify content to align text to top */
  font-size: 0.95em;
  color: #333;
  border: 1px solid #eee;
  flex-grow: 1; /* Allow bio section to take available space next to image */
  min-width: 0; /* Prevent overflow issues with flex-grow */
}

.bio-section p {
    margin: 0 0 5px 0; /* Add some margin between paragraphs if multiple */
    line-height: 1.4;
}
.bio-section p:last-child {
    margin-bottom: 0;
}


.bio-placeholder { /* Renamed from hint-placeholder */
  color: #6c757d;
  font-style: italic;
}

.image-holder-placeholder {
  width: 256px;
  height: 256px;
  background-color: #e0e0e0;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 0.9em;
  border-radius: 4px;
  flex-shrink: 0; /* Prevent image placeholder from shrinking */
}

.no-attributes,
.no-skills {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;
    /* margin-top: 20px; */ /* Handled by grid gap or specific row margin */
}
</style>
