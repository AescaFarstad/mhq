<template>
  <div class="attributes-section">
    <div v-if="!attributes || attributes.length === 0" class="no-attribute-data">
      No attribute data available.
    </div>
    <div v-else class="attribute-boxes">
      <div 
        v-for="category in attributes" 
        :key="category.key" 
        class="attribute-box"
        :class="{ 
          'selected': selectedTab === category.key,
          [`attribute-box-${category.key.toLowerCase()}`]: true 
        }"
        @click="selectTab(category.key)"
      >
        <div 
          class="box-header"
          @mouseenter="$emit('set-hint', gameState && gameState.isDiscovered(category.key) ? category.definition.description || null : obfuscateString(category.definition.description || ''))"
          @mouseleave="$emit('set-hint', null)"
        >
          <span class="box-name">{{ gameState && gameState.isDiscovered(category.key) ? category.definition.displayName : obfuscateString(category.definition.displayName) }}</span>
          <span class="box-value">{{ category.stat.value }}</span>
        </div>
        <div class="box-details">
          <!-- Show affected summary as an overlay on affected tabs -->
          <div v-if="hasAffected(category.key)" class="affected-summary-overlay">
            <div v-if="affectedCountsByCategory[category.key].skills > 0">
              <span class="affected-count">{{ affectedCountsByCategory[category.key].skills }}</span> skills
            </div>
            <div v-if="affectedCountsByCategory[category.key].specs > 0">
              <span class="affected-count">{{ affectedCountsByCategory[category.key].specs }}</span> specializations
            </div>
            <div>are affected</div>
          </div>

          <!-- Default view: list of secondary attributes. -->
          <div
            v-for="attribute in category.attributes" 
            :key="attribute.key" 
            class="attribute-detail" 
            :class="{ 
              'highlighted': currentHint === attribute.definition.description || currentHint === obfuscateString(attribute.definition.description || ''),
              'highlighted-by-skill': highlightedAttributes && highlightedAttributes.includes(attribute.key)
            }"
            @mouseenter="$emit('set-hint', gameState && gameState.isDiscovered(attribute.key) ? attribute.definition.description || null : obfuscateString(attribute.definition.description || ''))"
            @mouseleave="$emit('set-hint', null)"
          >
            <span class="attribute-name">{{ gameState && gameState.isDiscovered(attribute.key) ? attribute.definition.displayName : obfuscateString(attribute.definition.displayName) }}</span>
            <div class="attribute-value-container">
              <SpendPointButton 
                v-if="attributePoints > 0"
                @click.stop="spendAttributePoint(attribute)"
                @mouseenter="showHypothetical(attribute)"
                @mouseleave="clearHypothetical()"
                title="Spend attribute point"
              />
              <span class="attribute-value">{{ attribute.stat.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, inject, computed } from 'vue';
import { AttributeCategoryUIInfo, AttributeUIInfo } from '../../types/uiTypes';
import { obfuscateString } from '../../utils/stringUtils';
import { GameState, globalInputQueue } from '../../logic/GameState';
import type { CmdSpendAttributePoint } from '../../logic/input/InputCommands';
import SpendPointButton from '../common/SpendPointButton.vue';
import { Hypothetical } from '../../logic/core/Hypothetical';
import { Stats } from '../../logic/core/Stats';

const gameState = inject<GameState>('gameState');

const highlightedAttributes = computed(() => {
  return gameState?.uiState ? (gameState.uiState as any).highlightedAttributes : null;
});

const props = defineProps({
  attributes: {
    type: Array as PropType<AttributeCategoryUIInfo[]>,
    required: true
  },
  currentHint: {
    type: String as PropType<string | null>,
    default: null
  },
  attributePoints: {
    type: Number,
    required: true
  },
  selectedTab: {
    type: String,
    required: true
  },
  characterId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['set-hint', 'tab-selected']);

const selectTab = (tabKey: string) => {
  emit('tab-selected', tabKey);
};

const spendAttributePoint = (attribute: AttributeUIInfo) => {
  if (props.attributePoints > 0) {
    const willHavePointsAfterSpend = props.attributePoints > 1;
    
    // Clear hypothetical before spending point
    clearHypothetical();
    
    const command: CmdSpendAttributePoint = {
      name: "CmdSpendAttributePoint",
      characterId: props.characterId,
      attributeId: attribute.key,
    };
    globalInputQueue.push(command);
    
    // If we'll still have points after this spend, create a new hypothetical
    // The upgrade is queued but hasn't happened yet, so show +2 (current +1 queued +1 next)
    if (willHavePointsAfterSpend) {
      Hypothetical.createHypotheticalForAttributeUpgrade(gameState!, attribute.stat, 2);
    }
  }
};

const showHypothetical = (attribute: AttributeUIInfo) => {
  if (gameState && props.characterId && props.attributePoints > 0) {
    Hypothetical.createHypotheticalForAttributeUpgrade(gameState, attribute.stat, 1);
  }
};

const clearHypothetical = () => {
  if (gameState) {
    Hypothetical.clearHypothetical(gameState);
  }
};

// -------------------------------------------------------------
// Affected Skills / Specializations counts for non-selected tabs
// -------------------------------------------------------------
const affectedCountsByCategory = computed<Record<string, { skills: number; specs: number }>>(() => {
  const result: Record<string, { skills: number; specs: number }> = {};

  if (!gameState || !(gameState.uiState as any).hypotheticalConnections) {
    return result;
  }

  // Find the current character data in uiState to access its skills
  const charData = gameState.uiState.characters.find(c => c.id === props.characterId);
  if (!charData) {
    return result;
  }

  const hypConn = (gameState.uiState as any).hypotheticalConnections;

  for (const skill of charData.skills) {
    const catKey = skill.definition.attribute;
    if (!catKey) continue;

    // Ensure entry exists
    if (!result[catKey]) {
      result[catKey] = { skills: 0, specs: 0 };
    }

    // Check skill proficiency change
    const hypProf = Stats.getStat(skill.proficiencyStat.name, hypConn);
    if (hypProf && Math.abs(hypProf.value - skill.proficiencyStat.value) > 0.05) {
      result[catKey].skills += 1;
    }

    // Check specializations under this skill
    for (const spec of skill.specializations) {
      const hypSpecProf = Stats.getStat(spec.proficiencyStat.name, hypConn);
      if (hypSpecProf && Math.abs(hypSpecProf.value - spec.proficiencyStat.value) > 0.05) {
        result[catKey].specs += 1;
      }
    }
  }

  return result;
});

const hasAffected = (catKey: string): boolean => {
  const counts = affectedCountsByCategory.value[catKey];
  return !!counts && (counts.skills > 0 || counts.specs > 0);
};
</script>

<style scoped>

.attributes-section {
  padding-top: 6px;
  position: relative;
  z-index: 1;
}

.attributes-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.unspent-points {
  font-size: 0.85em;
  color: #0056b3;
  font-weight: 500;
}

.no-attribute-data {
    color: #888;
    font-style: italic;
}

.attribute-boxes {
  display: flex;
  max-width: 800px;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: -1px; /* To pull the skills section up */
}

.attribute-box {
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #dee2e6;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-right: 4px;
  overflow: visible; /* Allow pseudo-elements to show */
  padding: 0;
}

.attribute-box::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 0;
  border-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.attribute-box:hover {
  background-color: #ffffff;
  border-color: #c9d2da;
}

.attribute-box.selected {
  background-color: #ffffff;
  border-color: #dee2e6;
  border-bottom-color: transparent;
  transform: none;
  box-shadow: none;
}

.attribute-box.selected::before {
  opacity: 1;
}

.attribute-box-physique.selected::before {
  background: linear-gradient(to bottom, #C0392B 0%, #ffccbc 35%, rgba(255, 255, 255, 0) 100%);
}

.attribute-box-mind.selected::before {
  background: linear-gradient(to bottom, #1F618D 0%, #b2ebf2 35%, rgba(255, 255, 255, 0) 100%);
}

.attribute-box-social.selected::before {
  background: linear-gradient(to bottom, #B7950B 0%, #fff9c4 35%, rgba(255, 255, 255, 0) 100%);
}

.attribute-box-spirit.selected::before {
  background: linear-gradient(to bottom, #7D3C98 0%, #e1bee7 35%, rgba(255, 255, 255, 0) 100%);
}

.box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 8px 12px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  min-height: 32px;
}

.box-name {
  color: #2c3e50;
  flex-grow: 1;
  font-size: 0.9em;
}

.box-value {
  color: #0056b3;
  font-size: 1.1em;
  margin-left: 12px;
  text-align: right;
  white-space: nowrap;
}

.box-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  background-color: #ffffff;
  min-width: 180px;
}

.attribute-detail {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 3px 12px;
  transition: background-color 0.2s ease;
  cursor: default;
}

.attribute-detail:last-child {
  padding-bottom: 8px;
}

.attribute-detail.highlighted {
  background-color: #f1f3f4;
  color: #333;
}

.attribute-detail.highlighted-by-skill {
  background-color: #fff9e6;
  font-weight: 600;
}

.attribute-name {
  color: #555;
  flex-grow: 1;
}

.attribute-value-container {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.attribute-value {
  color: #333;
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
}

.affected-summary-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
  
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start; /* Aligns content to the top */
  padding: 8px 12px;
  font-size: 0.9em;
  gap: 2px;
  
  background-color: rgba(248, 249, 250, 0.85); /* Match tab bg color with transparency */
}

.affected-count {
  font-weight: 700;
  color: #28a745;
}
</style>
