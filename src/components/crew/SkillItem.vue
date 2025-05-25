<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import { SkillUIInfo, SkillSpecializationUIInfo } from '../../types/uiTypes';
import ImageHolder from '../common/ImageHolder.vue';
import { globalInputQueue } from '../../logic/GameState';
import { CmdCheatSkillUp } from '../../logic/input/InputCommands';

const props = defineProps<{
  skill: SkillUIInfo;
  characterId: string;
}>();

const currentHint = ref<string>('');

const skillAttributeClass = computed(() => {
  if (!props.skill || !props.skill.attribute) {
    return '';
  }
  return `skill-attribute-${props.skill.attribute.toLowerCase()}`;
});

const formatValue = (value: number | string | undefined): string => {
  if (value === undefined) return '0';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  return value.toString();
};

const showSkillHint = (description: string | undefined) => {
  currentHint.value = description || '';
};

const showSpecializationHint = (description: string | undefined) => {
  currentHint.value = description || '';
};

const clearHint = () => {
  currentHint.value = '';
};

const increaseSkillLevel = () => {
  if (props.skill && props.characterId) {
    const command: CmdCheatSkillUp = {
      name: "CmdCheatSkillUp",
      characterId: props.characterId,
      skillId: props.skill.id,
      amount: 1,
    };
    globalInputQueue.push(command);
  }
};
</script>

<template>
  <div 
    class="skill-item"
    :class="skillAttributeClass"
    @mouseleave="clearHint"
  >
    <div 
      class="skill-image-container" 
      @mouseover="showSkillHint(props.skill.description)"
      @click="increaseSkillLevel"
    >
      <ImageHolder 
        atlasName="skills"
        :imageName="props.skill.id" 
        :displayWidth="128"
        :displayHeight="128"
        class="skill-icon"
      />
      <div class="image-overlay skill-name-overlay">{{ props.skill.displayName }}</div>
      <div class="image-overlay level-overlay">{{ formatValue(props.skill.level) }}</div>
    </div>
    
    <div class="skill-details-container">
      <div class="hint-line">{{ currentHint }}&nbsp;</div>
      
      <div v-if="props.skill.specializations && props.skill.specializations.length > 0" class="specializations-row">
        <div 
          v-for="spec in props.skill.specializations" 
          :key="spec.id" 
          class="specialization-item"
          @mouseover="showSpecializationHint(spec.description)"
        >
          <ImageHolder 
            atlasName="skills"
            :imageName="spec.id" 
            :displayWidth="128"
            :displayHeight="96"
            class="specialization-icon"
          />
          <div class="image-overlay spec-name-overlay">{{ spec.displayName }}</div>
          <div class="image-overlay level-overlay spec-level-overlay">{{ formatValue(spec.level) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles specific to SkillItem will be moved here later */
.skill-item {
  display: flex; /* Main layout: image on left, details on right */
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #fdfdfd;
  position: relative;
  min-height: 128px; /* Ensure item is at least as tall as the skill image */
  /* transition: background-color 0.3s ease; Smooth transition for hover */
}

/* Hover states based on attribute */
.skill-item.skill-attribute-physique:hover {
  background: linear-gradient(110deg, #C0392B 0%, #ffccbc 15%, rgba(255, 255, 255, 0) 100%);
}

.skill-item.skill-attribute-mind:hover {
  background: linear-gradient(110deg, #1F618D 0%, #b2ebf2 15%, rgba(255, 255, 255, 0) 100%);
}

.skill-item.skill-attribute-social:hover {
  background: linear-gradient(110deg, #B7950B 0%, #fff9c4 15%, rgba(255, 255, 255, 0) 100%);
}

.skill-item.skill-attribute-spirit:hover {
  background: linear-gradient(110deg, #7D3C98 0%, #e1bee7 15%, rgba(255, 255, 255, 0) 100%);
}

.skill-image-container {
  position: relative; /* For overlay positioning */
  width: 128px;
  height: 128px;
  flex-shrink: 0; /* Prevent shrinking */
  margin-right: 15px; /* Space between image and details */
}

.skill-icon {
  display: block; /* Remove extra space below image */
  border-radius: 4px 0 0 4px; /* Rounded corners on the left side */
}

.skill-details-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Take remaining space */
  padding: 0 10px; /* Removed vertical padding, kept horizontal */
  min-width: 0; /* Prevent overflow issues with flex children */
}

.hint-line {
  width: 100%;
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #555;
  font-size: 0.9em;
}

.specializations-row {
  display: flex;
  flex-direction: row; /* Specializations in a row */
  gap: 10px; /* Gap between specializations */
  flex-wrap: wrap; /* Allow wrapping if not enough space */
}

.specialization-item {
  position: relative; /* For overlay positioning */
  width: 128px;
  height: 96px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  overflow: hidden; /* Clip content like overlays if they exceed bounds */
}

.specialization-icon {
  display: block; /* Remove extra space */
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure image covers the area */
}

/* Overlays for names and levels */
.image-overlay {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  padding: 2px 5px;
  font-size: 0.85em;
  overflow: hidden; /* Keep this to prevent overflow if text is extremely long */
  /* text-overflow: ellipsis; Removed for multi-line */
  /* white-space: nowrap; Removed for multi-line */
}

.skill-name-overlay {
  bottom: 0;
  border-radius: 0 0 0 4px; /* Match parent container rounding if any */
}

.spec-name-overlay {
  bottom: 0;
}

.level-overlay {
  top: 0px;
  left: 0px;
  right: auto; /* Override default 'right: 0' */
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 3px 5px;
  font-size: 0.9em;
  font-weight: bold;
  border-radius: 0 0 5px 0; /* Rounded corner bottom right */
  min-width: 20px; /* Ensure it's visible even for single digit */
  text-align: center;
}
.spec-level-overlay {
   border-radius: 0 0 5px 0; /* Rounded corner bottom right */
}
</style> 