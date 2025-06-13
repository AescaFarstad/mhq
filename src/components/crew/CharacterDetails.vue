<template>
  <div v-if="!selectedCharacter" class="no-selection">
    <p>Select a character to view details</p>
  </div>
  <div v-else class="character-details-container">
    <!-- Top Row: Portrait, Character Info + XP, Bio -->
    <div class="character-top-row">
      <!-- Portrait (128x128) -->
      <div class="portrait-section">
        <div class="image-holder-placeholder">
          <span>128x128 Image Placeholder</span>
        </div>
      </div>

      <!-- Character Info + XP Bar -->
      <div class="character-info-section">
        <div class="character-header">
          <h3>{{ selectedCharacter.name }}</h3>
          <!-- Unspent Points Indicators -->
          <div class="unspent-points-container">
            <span 
              v-if="selectedCharacter.attributePoints > 0"
              class="unspent-points-badge"
              @mouseenter="$emit('set-hint', `You have unspent attribute points: ${selectedCharacter.attributePoints}`)"
              @mouseleave="$emit('set-hint', null)"
            >
              +{{ selectedCharacter.attributePoints }}
            </span>
            <span 
              v-if="selectedCharacter.skillPoints > 0"
              class="unspent-points-badge"
              @mouseenter="$emit('set-hint', `You have unspent skill points: ${selectedCharacter.skillPoints}`)"
              @mouseleave="$emit('set-hint', null)"
            >
              +{{ selectedCharacter.skillPoints }}
            </span>
            <span 
              v-if="selectedCharacter.specPoints > 0"
              class="unspent-points-badge"
              @mouseenter="$emit('set-hint', `You have unspent specialization points: ${selectedCharacter.specPoints}`)"
              @mouseleave="$emit('set-hint', null)"
            >
              +{{ selectedCharacter.specPoints }}
            </span>
          </div>
          <div class="character-stats">
            <span class="stat-badge">Level {{ selectedCharacter.level }}</span>
            <span class="stat-badge">Upkeep: {{ selectedCharacter.upkeep.toFixed(1) }} gold</span>
            <button class="fire-button" @click="fireCharacter">Fire</button>
          </div>
        </div>
        <!-- XP Progress Bar -->
        <XpProgressBar
          v-if="selectedCharacter.xp"
          :xpProgress="selectedCharacter.xp.progress"
          :nextLevelDelta="selectedCharacter.xp.nextLevelDelta"
        />
      </div>

      <!-- Bio Section Wrapper -->
      <div class="bio-section-wrapper">
        <div class="bio-section" :class="{ 'keywords-mode': currentHint && currentHint.includes('\n') }">
          <p v-if="currentHint" :class="{ 'keywords-text': currentHint && currentHint.includes('\n') }">{{ currentHint }}</p>
          <p v-else-if="selectedCharacter.bio" class="bio-text">{{ selectedCharacter.bio }}</p>
          <p v-else class="bio-placeholder">No description available.</p>
        </div>
      </div>
    </div>

    <!-- Attribute Tabs -->
    <div class="attribute-tabs-section">
      <CharacterAttributes
        v-if="selectedCharacter.attributes"
        :attributes="selectedCharacter.attributes"
        :attributePoints="selectedCharacter.attributePoints"
        :current-hint="currentHint"
        :selectedTab="selectedAttributeTab"
        :characterId="selectedCharacter.id"
        @set-hint="$emit('set-hint', $event)"
        @tab-selected="selectedAttributeTab = $event"
      />
      <div v-else class="no-attributes">
        No attribute data available.
      </div>
    </div>

    <!-- Skills Section (Filtered by Selected Attribute) -->
    <div class="character-skills-section">
              <CharacterSkills
          v-if="selectedCharacter.skills && selectedCharacter.skills.length > 0"
          :skills="filteredSkills"
          :characterId="selectedCharacter.id"
          :skillPoints="selectedCharacter.skillPoints"
          :specPoints="selectedCharacter.specPoints"
          :selectedAttribute="selectedAttributeTab"
          @set-hint="$emit('set-hint', $event)"
        />
      <div v-else class="no-skills">
        No skills data available.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from 'vue';
import CharacterAttributes from './CharacterAttributes.vue';
import CharacterSkills from './CharacterSkills.vue';
import XpProgressBar from '../shared/XpProgressBar.vue';
import { SelectedCharacterInfo } from '../../types/uiTypes';
import { globalInputQueue } from '../../logic/GameState';
import type { CmdFireCharacter } from '../../logic/input/InputCommands';

const props = defineProps({
  selectedCharacter: {
    type: Object as PropType<SelectedCharacterInfo | null>,
    default: null,
  },
  currentHint: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits(['set-hint']);

// Track selected attribute tab
const selectedAttributeTab = ref<string>('physique'); // Default to physique initially

// No automatic tab switching when character changes - let user's selection persist

// Filter skills by the selected attribute
const filteredSkills = computed(() => {
  if (!props.selectedCharacter?.skills || !selectedAttributeTab.value) {
    return props.selectedCharacter?.skills || [];
  }
  
  // Filter skills by the selected attribute
  return props.selectedCharacter.skills.filter(skill => 
    skill.definition.attribute === selectedAttributeTab.value
  );
});

const fireCharacter = () => {
  if (props.selectedCharacter) {
    const command: CmdFireCharacter = {
      name: "CmdFireCharacter",
      characterId: props.selectedCharacter.id
    };
    globalInputQueue.push(command);
  }
};
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

.character-details-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px;
  height: 100%;
  overflow: hidden;
}

.character-top-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.portrait-section {
  flex-shrink: 0;
}

.image-holder-placeholder {
  width: 128px;
  height: 128px;
  background-color: #e0e0e0;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 0.8em;
  border-radius: 4px;
}

.character-info-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.character-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.character-header h3 {
  margin: 0;
  font-size: 1.4em;
  color: #2c3e50;
}

.unspent-points-container {
  display: flex;
  gap: 4px;
  align-items: center;
}

.unspent-points-badge {
  background: linear-gradient(145deg, #32d74b, #28a745);
  border: 1px solid #20c997;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.8em;
  color: white;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.unspent-points-badge:hover {
  background: linear-gradient(145deg, #3ae158, #32d74b);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.unspent-points-badge:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(40, 167, 69, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.character-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-badge {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.85em;
  color: #495057;
  white-space: nowrap;
}

.fire-button {
  background-color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.85em;
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.fire-button:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.bio-section-wrapper {
  flex: 1;
  min-width: 200px;
  position: relative; /* Allow absolute positioning of children */
  height: 128px; /* Fixed height to maintain layout */
}

.bio-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9em;
  color: #333;
  border: 1px solid #eee;
  height: 128px; /* Default height */
  overflow-y: auto;
  white-space: pre-line; /* Allow line breaks for keywords */
  transition: all 0.3s ease; /* Smooth transition for expansion */
  z-index: 10; /* Ensure it appears above other content when expanded */
}

/* Keywords mode: expand downward without affecting layout */
.bio-section.keywords-mode {
  height: auto; /* Allow natural height */
  min-height: 128px; /* Maintain minimum height */
  max-height: 300px; /* Reasonable maximum to prevent infinite growth */
}

.keywords-text {
  font-size: 0.75em !important; /* Smaller font for keywords */
  line-height: 1.3;
  color: #444;
}

.bio-section p {
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.bio-section p:last-child {
  margin-bottom: 0;
}

.bio-placeholder {
  color: #6c757d;
  font-style: italic;
}

.bio-text {
  color: #333;
}

.attribute-tabs-section {
  margin-top: 8px;
}

.character-skills-section {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0 4px 4px 4px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.no-attributes,
.no-skills {
  padding: 16px;
  color: #888;
  font-style: italic;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin-top: 8px;
}
</style>
