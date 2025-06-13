<template>
  <div class="skill-browser">
    <div class="skill-grid">
      <div 
        v-for="skillData in displaySkills" 
        :key="skillData.id"
        class="skill-box"
        :class="{ 'not-leveled': !skillData.hasLevels }"
      >
        <div class="skill-header">
          {{ skillData.displayName }}
        </div>
        <div v-if="skillData.specializations.length > 0" class="specializations">
          <div 
            v-for="spec in skillData.specializations"
            :key="spec.id"
            class="specialization"
            :class="{ 'not-leveled': !spec.hasLevels }"
          >
            {{ spec.displayName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue';
import type { GameState } from '../../logic/GameState';
import { obfuscateString } from '../../utils/stringUtils';

interface SkillBrowserData {
  id: string;
  displayName: string;
  hasLevels: boolean;
  specializations: {
    id: string;
    displayName: string;
    hasLevels: boolean;
  }[];
}

const gameState = inject<GameState>('gameState');

// Use a ref to control when the computed property should recalculate
const lastDiscoveredCount = ref<number>(0);
const forceRecalculate = ref<number>(0);

/**
 * Computes which skills and specializations to display based on:
 * - At least one character has levels in them, OR
 * - They are discovered
 * 
 * This computation is optimized to only run when:
 * - Component is mounted (initial calculation)
 * - Number of discovered items changes
 */
const displaySkills = computed((): SkillBrowserData[] => {
  if (!gameState) return [];

  // Force reactivity dependency on our control variables
  const _ = forceRecalculate.value;
  
  const result: SkillBrowserData[] = [];
  const allSkills = gameState.lib.skills.getAllSkills();
  
  for (const [skillId, skillDef] of Object.entries(allSkills)) {
    // Check if any character has levels in this skill
    const hasSkillLevels = gameState.characters.some(char => 
      char.skills[skillId] && char.skills[skillId].value > 0
    );
    
    // Check if skill is discovered
    const isSkillDiscovered = gameState.isDiscovered(skillId);
    
    // Only include skill if it has levels or is discovered
    if (!hasSkillLevels && !isSkillDiscovered) {
      continue;
    }
    
    // Process specializations
    const specializations: SkillBrowserData['specializations'] = [];
    
    for (const specId of skillDef.specializations) {
      const specDef = gameState.lib.skills.getSpecialization(specId);
      if (!specDef) continue;
      
      // Check if any character has levels in this specialization
      const hasSpecLevels = gameState.characters.some(char => 
        char.specializations[specId] && char.specializations[specId].value > 0
      );
      
      // Check if specialization is discovered
      const isSpecDiscovered = gameState.isDiscovered(specId);
      
      // Only include specialization if it has levels or is discovered
      if (hasSpecLevels || isSpecDiscovered) {
        specializations.push({
          id: specId,
          displayName: isSpecDiscovered 
            ? specDef.displayName 
            : obfuscateString(specDef.displayName),
          hasLevels: hasSpecLevels
        });
      }
    }
    
    result.push({
      id: skillId,
      displayName: isSkillDiscovered 
        ? skillDef.displayName 
        : obfuscateString(skillDef.displayName),
      hasLevels: hasSkillLevels,
      specializations
    });
  }
  
  return result;
});

// Component lifecycle - calculate on mount
onMounted(() => {
  console.log('SkillBrowser mounted, calculating initial skills');
  if (gameState) {
    lastDiscoveredCount.value = gameState.uiState.discoveredItemsCount;
    forceRecalculate.value += 1; // Trigger initial calculation
  }
});

// Watch for changes in discovered items count - only recalculate when this changes
watch(() => gameState?.uiState.discoveredItemsCount, (newCount) => {
  if (newCount !== undefined && newCount !== lastDiscoveredCount.value) {
    console.log(`SkillBrowser: Discovered items changed from ${lastDiscoveredCount.value} to ${newCount}, recalculating skills`);
    lastDiscoveredCount.value = newCount;
    forceRecalculate.value += 1; // Trigger recalculation
  }
});
</script>

<style scoped>
.skill-browser {
  width: fit-content;
  height: 100%;
  overflow-y: auto;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(4, 140px); /* Fixed width columns for uniform boxes */
  grid-auto-rows: min-content; /* Auto-size rows based on content */
}

.skill-box {
  border: 1px solid #dee2e6;
  background: #ffffff;
  padding: 4px;
  min-height: 40px;
  display: flex;
  flex-direction: column;
}

.skill-box.not-leveled {
  color: #888;
  background: #f8f9fa;
}

.skill-header {
  font-weight: bold;
  font-size: 0.85em;
  margin-bottom: 2px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1px;
  color: #2c3e50;
}

.skill-box.not-leveled .skill-header {
  border-bottom-color: #dee2e6;
  color: #6c757d;
}

.specializations {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex-grow: 1;
}

.specialization {
  font-size: 0.75em;
  padding: 1px 2px;
  background: #f8f9fa;
  color: #555;
  line-height: 1.1;
}

.specialization.not-leveled {
  color: #6c757d;
  background: #ffffff;
}
</style> 