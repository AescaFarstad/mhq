<template>
  <div class="skill-browser">
    <div class="skill-browser-header">
      <div class="settings-row">
        <label class="checkbox-label">
          <input type="checkbox" v-model="showDiscovered" />
          Discovered
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showNotOwned" />
          Not owned
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="sortByProgress" />
          Sort by progress
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useSymbols" />
          Symbols
        </label>
      </div>
    </div>
    <div class="skill-grid">
      <div 
        v-for="skillData in displaySkills" 
        :key="skillData.id"
        class="skill-box"
        :class="{ 'not-leveled': !skillData.hasLevels }"
      >
        <div class="skill-header"
             :class="{
               [`keyword-level-${skillData.keywordStars}`]: skillData.keywordStars > 0 && !skillData.isDiscovered
             }">
          {{ skillData.displayName }}
          <span 
            v-if="skillData.relationCount > 0 && !skillData.isDiscovered" 
            class="relation-badge"
            @mouseenter="showTooltip($event, skillData.relationDetails)"
            @mouseleave="hideTooltip"
          >
            {{ skillData.relationCount }}
          </span>
        </div>
        <div v-if="skillData.specializations.length > 0" class="specializations">
          <div 
            v-for="spec in skillData.specializations"
            :key="spec.id"
            class="specialization"
            :class="{ 
              'not-leveled': !spec.hasLevels,
              [`keyword-level-${spec.keywordStars}`]: spec.keywordStars > 0 && !spec.isDiscovered
            }"
          >
            {{ spec.displayName }}
            <span 
              v-if="spec.relationCount > 0 && !spec.isDiscovered" 
              class="relation-badge"
              @mouseenter="showTooltip($event, spec.relationDetails)"
              @mouseleave="hideTooltip"
            >
              {{ spec.relationCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Tooltip -->
  <div 
    v-if="tooltipVisible" 
    class="relation-tooltip"
    :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
  >
    <div v-for="relation in tooltipContent" :key="`${relation.type}-${relation.name}`" class="tooltip-item">
      <span v-if="relation.type === 'character'">
        Mastered by {{ relation.name }} (Lv {{ relation.level }})
      </span>
      <span v-else>
        Relevant to: <span class="tooltip-item-name">{{ relation.name }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue';
import type { GameState } from '../../logic/GameState';
import { obfuscateString } from '../../utils/stringUtils';
import { countActiveKeywordsForItem } from '../../logic/Discovery';

interface SkillBrowserData {
  id: string;
  displayName: string;
  hasLevels: boolean;
  isDiscovered: boolean;
  specializations: {
    id: string;
    displayName: string;
    hasLevels: boolean;
    isDiscovered: boolean;
    keywordStars: number;
    relationCount: number;
    relationDetails: RelationDetail[];
  }[];
  keywordStars: number;
  progressRatio: number;
  relationCount: number;
  relationDetails: RelationDetail[];
}

interface RelationDetail {
  type: 'character' | 'task';
  name: string;
  level?: number; // For characters
}

const gameState = inject<GameState>('gameState');

// Settings for filtering and sorting
const showDiscovered = ref<boolean>(false);
const showNotOwned = ref<boolean>(true);
const sortByProgress = ref<boolean>(true);
const useSymbols = ref<boolean>(false);

// Use a ref to control when the computed property should recalculate
const lastDiscoveredCount = ref<number>(0);
const lastEncounteredCount = ref<number>(0);
const lastActiveKeywordsCount = ref<number>(0);
const forceRecalculate = ref<number>(0);

// Tooltip state
const tooltipVisible = ref<boolean>(false);
const tooltipContent = ref<RelationDetail[]>([]);
const tooltipPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

/**
 * Get obfuscation percentage based on keyword count
 */
function getObfuscationPercentage(keywordCount: number): number {
  switch (keywordCount) {
    case 0: return 1.0;   // 100%
    case 1: return 0.85;  // 85%
    case 2: return 0.70;  // 70%
    case 3: return 0.60;  // 60%
    case 4: return 0.50;  // 50%
    default: return 0.50; // 50% for 5+ keywords
  }
}

/**
 * Calculate progress ratio for a skill
 * +1 for each active keyword for each undiscovered item
 * +5 for each discovered item
 */
function calculateProgressRatio(skillData: SkillBrowserData): number {
  let ratio = 0;
  
  // Main skill contribution
  if (skillData.isDiscovered) {
    ratio += 5;
  } else {
    ratio += skillData.keywordStars;
  }
  
  // Specializations contribution
  for (const spec of skillData.specializations) {
    if (spec.isDiscovered) {
      ratio += 5;
    } else {
      ratio += spec.keywordStars;
    }
  }
  
  return ratio;
}

/**
 * Calculate relation count and details for a skill or specialization
 * Relations include characters that have it and tasks that require it
 */
function calculateRelations(skillOrSpecId: string): { count: number; details: RelationDetail[] } {
  if (!gameState) return { count: 0, details: [] };
  
  const details: RelationDetail[] = [];
  
  // Check characters
  for (const character of gameState.characters) {
    // Check skills
    if (character.skills[skillOrSpecId] && character.skills[skillOrSpecId].value > 0) {
      details.push({
        type: 'character',
        name: character.name,
        level: character.skills[skillOrSpecId].value
      });
    }
    
    // Check specializations
    if (character.specializations[skillOrSpecId] && character.specializations[skillOrSpecId].value > 0) {
      details.push({
        type: 'character',
        name: character.name,
        level: character.specializations[skillOrSpecId].value
      });
    }
  }
  
  // Check tasks (all task lists)
  const allTasks = [
    ...gameState.availableTasks,
    ...gameState.queuedTasks,
    ...gameState.processingTasks,
    ...gameState.completedTasks
  ];
  
  for (const task of allTasks) {
    if (task.resolvedDefinitionDetails.skills && 
        task.resolvedDefinitionDetails.skills.includes(skillOrSpecId)) {
      // Avoid duplicate task names
      if (!details.some(d => d.type === 'task' && d.name === task.name)) {
        details.push({
          type: 'task',
          name: task.name
        });
      }
    }
  }
  
  return { count: details.length, details };
}

/**
 * Show tooltip with relation details
 */
function showTooltip(event: MouseEvent, relations: RelationDetail[]): void {
  tooltipContent.value = relations;
  tooltipPosition.value = {
    x: event.clientX + 10,
    y: event.clientY + 10
  };
  tooltipVisible.value = true;
}

/**
 * Hide tooltip
 */
function hideTooltip(): void {
  tooltipVisible.value = false;
}

/**
 * Check if skill is fully discovered (skill and all specializations discovered)
 */
function isFullyDiscovered(skillData: SkillBrowserData): boolean {
  if (!skillData.isDiscovered) return false;
  return skillData.specializations.every(spec => spec.isDiscovered);
}

/**
 * Computes which skills and specializations to display based on:
 * - They are encountered (through characters, tasks, keywords, or discovery)
 * - Settings filters
 * 
 * This computation is optimized to only run when:
 * - Component is mounted (initial calculation)
 * - Number of discovered items changes
 * - Number of encountered items changes
 * - Number of active keywords changes
 * - Settings change
 */
const displaySkills = computed((): SkillBrowserData[] => {
  if (!gameState) return [];

  // Force reactivity dependency on our control variables and settings
  forceRecalculate.value;
  showDiscovered.value;
  showNotOwned.value;
  sortByProgress.value;
  useSymbols.value;
  
  const result: SkillBrowserData[] = [];
  const allSkills = gameState.lib.skills.getAllSkills();
  
  for (const [skillId, skillDef] of Object.entries(allSkills)) {
    // Check if skill is encountered
    const isSkillEncountered = gameState.isEncountered(skillId);
    
    // Only include skill if it is encountered
    if (!isSkillEncountered) {
      continue;
    }
    
    // Check if any character has levels in this skill
    const hasSkillLevels = gameState.characters.some(char => 
      char.skills[skillId] && char.skills[skillId].value > 0
    );
    
    // Check if skill is discovered
    const isSkillDiscovered = gameState.isDiscovered(skillId);
    
    // Get keyword count for obfuscation
    const skillKeywordCount = !isSkillDiscovered ? countActiveKeywordsForItem(skillId, gameState) : 0;
    const obfuscationLevel = getObfuscationPercentage(skillKeywordCount);
    
    // Process specializations
    const specializations: SkillBrowserData['specializations'] = [];
    
    for (const specId of skillDef.specializations) {
      const specDef = gameState.lib.skills.getSpecialization(specId);
      if (!specDef) continue;
      
      // Check if specialization is encountered
      const isSpecEncountered = gameState.isEncountered(specId);
      
      // Only include specialization if it is encountered
      if (isSpecEncountered) {
        // Check if any character has levels in this specialization
        const hasSpecLevels = gameState.characters.some(char => 
          char.specializations[specId] && char.specializations[specId].value > 0
        );
        
        // Check if specialization is discovered
        const isSpecDiscovered = gameState.isDiscovered(specId);
        
        const specKeywordCount = !isSpecDiscovered ? countActiveKeywordsForItem(specId, gameState) : 0;
        const specObfuscationLevel = getObfuscationPercentage(specKeywordCount);
        
        specializations.push({
          id: specId,
          displayName: isSpecDiscovered 
            ? specDef.displayName 
            : obfuscateString(specDef.displayName, specObfuscationLevel, 0, useSymbols.value),
          hasLevels: hasSpecLevels,
          isDiscovered: isSpecDiscovered,
          keywordStars: specKeywordCount,
          relationCount: 0,
          relationDetails: []
        });
      }
    }
    
    const skillData: SkillBrowserData = {
      id: skillId,
      displayName: isSkillDiscovered 
        ? skillDef.displayName 
        : obfuscateString(skillDef.displayName, obfuscationLevel, 0, useSymbols.value),
      hasLevels: hasSkillLevels,
      isDiscovered: isSkillDiscovered,
      specializations,
      keywordStars: skillKeywordCount,
      progressRatio: 0, // Will be calculated below
      relationCount: 0,
      relationDetails: []
    };
    
    // Calculate progress ratio
    skillData.progressRatio = calculateProgressRatio(skillData);
    
    // Calculate relations for the skill (only if not discovered)
    if (!isSkillDiscovered) {
      const skillRelations = calculateRelations(skillId);
      skillData.relationCount = skillRelations.count;
      skillData.relationDetails = skillRelations.details;
    }
    
    // Calculate relations for specializations (only if not discovered)
    for (const spec of skillData.specializations) {
      if (!spec.isDiscovered) {
        const specRelations = calculateRelations(spec.id);
        spec.relationCount = specRelations.count;
        spec.relationDetails = specRelations.details;
      }
    }
    
    result.push(skillData);
  }
  
  // Apply filters
  let filteredResult = result.filter(skillData => {
    // Filter by discovered setting
    if (!showDiscovered.value && isFullyDiscovered(skillData)) {
      return false;
    }
    
    // Filter by not owned setting
    if (!showNotOwned.value && !skillData.hasLevels && !skillData.specializations.some(spec => spec.hasLevels)) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  if (sortByProgress.value) {
    filteredResult.sort((a, b) => b.progressRatio - a.progressRatio);
  }
  
  return filteredResult;
});

// Component lifecycle - calculate on mount
onMounted(() => {
  if (gameState) {
    lastDiscoveredCount.value = gameState.uiState.discoveredItemsCount;
    lastEncounteredCount.value = gameState.uiState.encounteredItemsCount;
    lastActiveKeywordsCount.value = gameState.uiState.activeKeywords.size;
    forceRecalculate.value += 1; // Trigger initial calculation
  }
});

// Watch for changes in discovered items count and active keywords count
watch(() => gameState?.uiState.discoveredItemsCount, (newCount) => {
  if (newCount !== undefined && newCount !== lastDiscoveredCount.value) {
    lastDiscoveredCount.value = newCount;
    forceRecalculate.value += 1; // Trigger recalculation
  }
});

watch(() => gameState?.uiState.encounteredItemsCount, (newCount) => {
  if (newCount !== undefined && newCount !== lastEncounteredCount.value) {
    lastEncounteredCount.value = newCount;
    forceRecalculate.value += 1; // Trigger recalculation
  }
});

watch(() => gameState?.uiState.activeKeywords.size, (newCount) => {
  if (newCount !== undefined && newCount !== lastActiveKeywordsCount.value) {
    lastActiveKeywordsCount.value = newCount;
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

.skill-browser-header {
  width: 562px; /* Same width as skill-grid (4 * 140px) */
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-bottom: none;
  padding: 8px;
  margin-bottom: 0;
}

.settings-row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85em;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(4, 140px); /* Fixed width columns for uniform boxes */
  grid-auto-rows: min-content; /* Auto-size rows based on content */
  border: 1px solid #dee2e6;
  border-top: none;
}

.skill-box {
  border: 1px solid #dee2e6;
  border-radius: 2px;
  background: #ffffff;
  padding: 0px 0px 0px 2px;
  margin: 2px;
  min-height: 40px;
  display: flex;
  flex-direction: column;
  position: relative; /* Add relative positioning for badge placement */
}

.skill-box.not-leveled {
  color: #888;
  background: #f8f9fa;
}

.skill-header {
  font-weight: bold;
  font-size: 0.8em;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 2px;
  padding-top: 2px;
  color: #2c3e50;
  position: relative; /* Add relative positioning for badge placement */
}

.skill-box.not-leveled .skill-header {
  border-bottom-color: #dee2e6;
  color: #6c757d;
}

/* Keyword-based background colors for skill headers */
.skill-header.keyword-level-1 {
  background: #ffe4cc; /* Light orange */
}

.skill-header.keyword-level-2 {
  background: #fff4cc; /* Light yellow */
}

.skill-header.keyword-level-3 {
  background: #e6f7e6; /* Light green */
}

.skill-header.keyword-level-4,
.skill-header.keyword-level-5 {
  background: #e6f2ff; /* Light blue */
}

.specializations {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.specialization {
  font-size: 0.75em;
  padding: 2px 2px;
  color: #555;
  line-height: 1.1;
  position: relative; /* Add relative positioning for badge placement */
  border-top: 1px solid #e9ecef;
}

.specialization.not-leveled {
  color: #6c757d;
}

/* Keyword-based background colors for specializations */
.specialization.keyword-level-1 {
  background: #ffe4cc; /* Light orange */
}

.specialization.keyword-level-2 {
  background: #fff4cc; /* Light yellow */
}

.specialization.keyword-level-3 {
  background: #e6f7e6; /* Light green */
}

.specialization.keyword-level-4,
.specialization.keyword-level-5 {
  background: #e6f2ff; /* Light blue */
}

/* Relation Badge Styles */
.relation-badge {
  background: #818181; /* Dark gray instead of bright blue */
  color: white;
  border-radius: 2px; /* Square corners instead of circular */
  padding: 2px 6px;
  font-size: 0.7em;
  font-weight: bold;
  cursor: default;
  display: inline-block;
  min-width: 16px;
  text-align: center;
  line-height: 1;
  position: absolute;
  right: 0px;
  top: 0px;
}

/* Tooltip Styles */
.relation-tooltip {
  position: fixed;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 450px;
  pointer-events: none;
}

.tooltip-item {
  margin: 2px 0;
  line-height: 1.3;
}

.tooltip-item:not(:last-child) {
  border-bottom: 1px solid #555;
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.tooltip-item-name {
  color: #ffd700;
}
</style> 