<script setup lang="ts">
import { defineProps, ref, computed, inject } from 'vue';
import { SkillUIInfo } from '../../types/uiTypes';
import ImageHolder from '../common/ImageHolder.vue';
import SpendPointButton from '../common/SpendPointButton.vue';
import { globalInputQueue, GameState } from '../../logic/GameState';

import type { CmdSpendSkillPoint, CmdSpendSpecPoint } from '../../logic/input/InputCommands';
import { obfuscateString } from '../../utils/stringUtils';
import { Hypothetical } from '../../logic/core/Hypothetical';
import { Stats } from '../../logic/core/Stats';

const props = defineProps<{
  skill: SkillUIInfo;
  characterId: string;
  skillPoints?: number;
  specPoints?: number;
}>();

const emit = defineEmits(['set-hint']);

const currentHint = ref<string>('');

const skillAttributeClass = computed(() => {
  if (!props.skill || !props.skill.definition.attribute) {
    return '';
  }
  return `skill-attribute-${props.skill.definition.attribute.toLowerCase()}`;
});

const formatValue = (value: number | string | undefined, roundToInt: boolean = false): string => {
  if (value === undefined) return '0';
  if (typeof value === 'number') {
    if (roundToInt) return Math.round(value).toString();
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  return value.toString();
};

const formatKeywords = (keywords: string[][] | undefined): string => {
  if (!keywords || keywords.length === 0) {
    return 'No keywords available';
  }
  // Join each keyword array with commas, then join all arrays with line breaks
  return keywords.map(keywordArray => keywordArray.join(', ')).join('\n');
};

const showSkillHint = (description: string | undefined) => {
  // Show local hint with description
  if (props.skill && gameState && !gameState.isDiscovered(props.skill.id)) {
    currentHint.value = obfuscateString(description || '');
  } else {
    currentHint.value = description || '';
  }
  
  // Also emit keywords to bio box
  if (props.skill && gameState && !gameState.isDiscovered(props.skill.id)) {
    const keywordsText = formatKeywords(props.skill.definition.keywords);
    emit('set-hint', obfuscateString(keywordsText));
  } else {
    emit('set-hint', formatKeywords(props.skill.definition.keywords));
  }
};

const showSpecializationHint = (description: string | undefined, specId: string) => {
  // Show local hint with description
  if (gameState && !gameState.isDiscovered(specId)) {
    currentHint.value = obfuscateString(description || '');
  } else {
    currentHint.value = description || '';
  }
  
  // Also emit keywords to bio box
  const spec = props.skill.specializations.find(s => s.id === specId);
  if (spec) {
    if (gameState && !gameState.isDiscovered(specId)) {
      const keywordsText = formatKeywords(spec.definition.keywords);
      emit('set-hint', obfuscateString(keywordsText));
    } else {
      emit('set-hint', formatKeywords(spec.definition.keywords));
    }
  }
};

const clearHint = () => {
  currentHint.value = '';
  emit('set-hint', null);
};

const gameState = inject<GameState>('gameState');

const handleMouseEnter = () => {
  if (gameState && props.skill.definition.governedBy) {
    (gameState.uiState as any).highlightedAttributes = props.skill.definition.governedBy;
  }
};

const handleMouseLeave = () => {
  if (gameState) {
    (gameState.uiState as any).highlightedAttributes = null;
  }
  clearHint();
};

const spendSkillPoint = () => {
  if (props.skill && props.characterId && (props.skillPoints || 0) > 0) {
    const willHavePointsAfterSpend = (props.skillPoints || 0) > 1;
    
    // Clear hypothetical before spending point
    clearHypothetical();
    
    const command: CmdSpendSkillPoint = {
      name: "CmdSpendSkillPoint",
      characterId: props.characterId,
      skillId: props.skill.id,
    };
    globalInputQueue.push(command);
    
    // If we'll still have points after this spend, create a new hypothetical
    // The upgrade is queued but hasn't happened yet, so show +2 (current +1 queued +1 next)
    if (willHavePointsAfterSpend) {
      Hypothetical.createHypotheticalForSkillUpgrade(gameState!, props.skill.stat, 2);
    }
  }
};

const spendSpecPoint = (spec: SkillUIInfo['specializations'][0]) => {
  if (props.characterId && (props.specPoints || 0) > 0) {
    const willHavePointsAfterSpend = (props.specPoints || 0) > 1;
    
    // Clear hypothetical before spending point
    clearHypothetical();
    
    const command: CmdSpendSpecPoint = {
      name: "CmdSpendSpecPoint",
      characterId: props.characterId,
      specId: spec.id,
    };
    globalInputQueue.push(command);
    
    // If we'll still have points after this spend, create a new hypothetical
    // The upgrade is queued but hasn't happened yet, so show +2 (current +1 queued +1 next)
    if (willHavePointsAfterSpend) {
      Hypothetical.createHypotheticalForSpecUpgrade(gameState!, spec.stat, 2);
    }
  }
};

const showSkillHypothetical = () => {
  if (gameState && props.characterId && (props.skillPoints || 0) > 0) {
    Hypothetical.createHypotheticalForSkillUpgrade(gameState, props.skill.stat, 1);
  }
};

const showSpecHypothetical = (spec: SkillUIInfo['specializations'][0]) => {
  if (gameState && props.characterId && (props.specPoints || 0) > 0) {
    Hypothetical.createHypotheticalForSpecUpgrade(gameState, spec.stat, 1);
  }
};

const getHypotheticalProficiency = (proficiencyStat: any): number | undefined => {
  if (!gameState || !(gameState.uiState as any).hypotheticalConnections) {
    return undefined;
  }
  const hypotheticalProfStat = Stats.getStat(proficiencyStat.name, (gameState.uiState as any).hypotheticalConnections);
  return hypotheticalProfStat?.value;
};

const skillProficiencyHypothetical = computed(() => {
  const currentProficiency = props.skill.proficiencyStat.value;
  const hypotheticalValue = getHypotheticalProficiency(props.skill.proficiencyStat);
  
  if (hypotheticalValue !== undefined && Math.abs(hypotheticalValue - currentProficiency) > 0.05) {
    return hypotheticalValue;
  }
  return undefined;
});

const getSpecProficiencyHypothetical = (spec: SkillUIInfo['specializations'][0]): number | undefined => {
  const currentProficiency = spec.proficiencyStat.value;
  const hypotheticalValue = getHypotheticalProficiency(spec.proficiencyStat);

  if (hypotheticalValue !== undefined && Math.abs(hypotheticalValue - currentProficiency) > 0.05) {
    return hypotheticalValue;
  }
  return undefined;
};

const clearHypothetical = () => {
  if (gameState) {
    Hypothetical.clearHypothetical(gameState);
  }
};
</script>

<template>
  <div 
    class="skill-item"
    :class="skillAttributeClass"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
          <div 
        class="skill-image-container" 
        @mouseover="showSkillHint(props.skill.definition.description)"
      >
      <ImageHolder 
        atlasName="skills"
        :imageName="props.skill.id" 
        :displayWidth="128"
        :displayHeight="128"
        class="skill-icon"
      />
      <div class="image-overlay skill-name-overlay">{{ gameState && gameState.isDiscovered(props.skill.id) ? props.skill.definition.displayName : obfuscateString(props.skill.definition.displayName) }}</div>
      <div class="image-overlay level-overlay">{{ formatValue(props.skill.stat.value) }}</div>
      <SpendPointButton 
        v-if="skillPoints && skillPoints > 0"
        class="skill-level-btn"
        @click.stop="spendSkillPoint()"
        @mouseenter="showSkillHypothetical()"
        @mouseleave="clearHypothetical()"
        title="Spend skill point"
      />
      <div v-if="props.skill.proficiencyStat" class="image-overlay proficiency-overlay">
        <div class="proficiency-current">{{ formatValue(props.skill.proficiencyStat.value, false) }}</div>
        <div v-if="skillProficiencyHypothetical" class="proficiency-hypothetical">{{ formatValue(skillProficiencyHypothetical, false) }}</div>
      </div>
    </div>
    
    <div class="skill-details-container">
      <div class="hint-line">{{ currentHint }}&nbsp;</div>
      
      <div v-if="props.skill.specializations && props.skill.specializations.length > 0" class="specializations-row">
        <div 
          v-for="spec in props.skill.specializations" 
          :key="spec.id" 
          class="specialization-item"
          @mouseover="showSpecializationHint(spec.definition.description, spec.id)"
        >
          <ImageHolder 
            atlasName="skills"
            :imageName="spec.id" 
            :displayWidth="128"
            :displayHeight="96"
            class="specialization-icon"
          />
          <div class="image-overlay spec-name-overlay">{{ gameState && gameState.isDiscovered(spec.id) ? spec.definition.displayName : obfuscateString(spec.definition.displayName) }}</div>
          <div class="image-overlay level-overlay spec-level-overlay">{{ formatValue(spec.stat.value) }}</div>
          <SpendPointButton 
            v-if="specPoints && specPoints > 0"
            class="spec-level-btn"
            @click.stop="spendSpecPoint(spec)"
            @mouseenter="showSpecHypothetical(spec)"
            @mouseleave="clearHypothetical()"
            title="Spend specialization point"
          />
          <div v-if="spec.proficiencyStat" class="image-overlay proficiency-overlay spec-proficiency-overlay">
            <div class="proficiency-current">{{ formatValue(spec.proficiencyStat.value, false) }}</div>
            <div v-if="getSpecProficiencyHypothetical(spec)" class="proficiency-hypothetical">{{ formatValue(getSpecProficiencyHypothetical(spec)!, false) }}</div>
          </div>
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

.proficiency-overlay {
  top: 0px;
  right: 0px;
  left: auto; /* Ensure it doesn't stretch full width */
  background-color: rgba(0, 0, 0, 0.7); /* Changed to match level-overlay */
  color: #fff;
  padding: 3px 5px;
  font-size: 0.9em;
  font-weight: bold;
  border-radius: 0 0 0 5px; /* Rounded corner bottom left */
  min-width: 20px;
  text-align: center;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
}

.proficiency-current {
  line-height: 1.1;
}

.proficiency-hypothetical {
  line-height: 1.1;
  color: #90EE90; /* Light green to indicate hypothetical value */
  font-weight: bold;
  margin-top: 1px;
}

.spec-level-overlay {
   border-radius: 0 0 5px 0; /* Rounded corner bottom right */
}

.spec-proficiency-overlay {
  border-radius: 0 0 0 5px; /* Rounded corner bottom left */
}

.skill-level-btn {
  position: absolute;
  top: 4px;
  left: 25px;
  z-index: 10;
}

.spec-level-btn {
  position: absolute;
  top: 4px;
  left: 25px;
  z-index: 10;
}
</style> 