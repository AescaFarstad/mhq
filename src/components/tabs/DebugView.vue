<template>
    <div class="debug-view">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          @click="setDebugTab('main')" 
          :class="{ active: debugActiveTab === 'main' }" 
          class="tab-btn"
        >
          Main
        </button>
        <button 
          @click="setDebugTab('discover')" 
          :class="{ active: debugActiveTab === 'discover' }" 
          class="tab-btn"
        >
          Discover
        </button>
      </div>

      <!-- Main Tab Content -->
      <div v-if="debugActiveTab === 'main'" class="tab-content">
        <div class="button-container">
          <button @click="copySkillsToClipboard(false, $event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'basic' }">Skills (Basic)</button>
          <button @click="copySkillsToClipboard(true, $event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributes' }">Skills (With Attributes)</button>
          <button @click="copyAttributesToClipboard($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributesCopy' }">Attributes</button>
          <button @click="copyAttributeSkillStats($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributeStats' }">Attribute Skill Stats</button>
          <button @click="copyAllSkillNames($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillNames' }">Skill Names</button>
          <button @click="copySkillKeywordStats($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillKeywords' }">Skill Keyword Stats</button>
          <button @click="copySkillNamesAndDescriptions($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillNameDesc' }">Skill Names & Descriptions</button>
          <button @click="copySkillIds($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillIds' }">Skill IDs</button>
          <button @click="copyGameStateToClipboard($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'gameState' }">Game State (JSON)</button>
          <button @click="replaceSkillNamesWithIdsInClipboard($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'replaceNamesWithIds' }">Replace Names with IDs</button>
          <button @click="simplifyClipboardText($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'simplifyClipboard' }">Simplify Clipboard Text</button>
          <button @click="copyCharacterNamesAndBios($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'characterNamesAndBios' }">Character Names & Bios</button>
        </div>
        <div class="filter-inputs">
          <input type="text" v-model="includeFilter" placeholder="Include Regex (e.g., ^Player)" class="filter-input" :class="{ 'invalid-regex': !isIncludeRegexValid }" />
          <input type="text" v-model="excludeFilter" placeholder="Exclude Regex (e.g., Mana$)" class="filter-input" :class="{ 'invalid-regex': !isExcludeRegexValid }" />
          <button @click="clearAllFilters" class="clear-btn clear-all-btn">Clear Filters</button>
        </div>
        <div v-if="hasStats" class="stats-container">
          <div v-for="(stat, name) in sortedStats" :key="name" class="stat-row">
            <div class="stat-controls">
              <template v-if="isIndependentStat(stat)">
                <button @click="modifyStat(name, -1)" class="control-btn">-</button>
                <button @click="modifyStat(name, 1)" class="control-btn">+</button>
                <input type="text" v-model="statInputValues[name]" class="stat-input" @keyup.enter="setStatValue(name)" />
                <button @click="setStatValue(name)" class="control-btn">Set</button>
              </template>
              <template v-else>
                <div class="placeholder-controls"></div>
              </template>
            </div>
            <div class="stat-name">{{ name }}</div>
            <div class="stat-separator">:</div>
            <div class="stat-value">
              {{ stat.value }}
              <span v-if="stat.params" class="stat-params">
                = {{ formatParams(stat.params) }}
              </span>
            </div>
          </div>
        </div>
        <p v-else>No stats available.</p>
      </div>

      <!-- Discover Tab Content -->
      <div v-if="debugActiveTab === 'discover'" class="tab-content">
        <div class="discover-header-controls">
          <div class="discover-count">{{ filteredDiscoveredItems.length }}</div>
          <input type="text" v-model="discoverIncludeFilter" placeholder="Include Regex (e.g., ^skill)" class="filter-input discover-filter" :class="{ 'invalid-regex': !isDiscoverIncludeRegexValid }" />
          <div class="discover-buttons">
            <button @click="discoverAllItems" class="discover-type-btn">All</button>
            <button @click="discoverNoneItems" class="discover-type-btn">None</button>
            <button @click="discoverSkills" class="discover-type-btn">Skills</button>
            <button @click="discoverBuildings" class="discover-type-btn">Buildings</button>
            <button @click="discoverResources" class="discover-type-btn">Resources</button>
            <button @click="discoverAttributes" class="discover-type-btn">Attributes</button>
            <button @click="discoverTabs" class="discover-type-btn">Tabs</button>
            <button @click="clearDiscoverFilters" class="clear-discover-btn">Clear</button>
            <button @click="copyDiscoveredItemsToClipboard($event)" class="action-btn bigger-btn" :class="{ 'copy-success': copyAnimationButton === 'discoveredItems' }">Copy</button>
          </div>
        </div>
        <div v-if="hasDiscoveredItems" class="discover-container">
          <div class="discover-columns">
            <div v-for="item in filteredDiscoveredItems" :key="item" class="discover-item">
              {{ item }}
            </div>
          </div>
        </div>
        <p v-else>No discovered items available.</p>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { computed, PropType, ref, reactive, inject } from 'vue';
import { GameState } from '../../logic/GameState';
import { Skill, SkillSpecialization } from '../../logic/lib/definitions/SkillDefinition';
import type { DebugStatInfo } from '../../types/uiTypes'; // Import centralized type
import { Stats } from '../../logic/core/Stats';
import { IndependentStat } from '../../logic/core/Stat'; // Import IndependentStat for type assertion
import * as UIStateManager from '../../logic/UIStateManager'; // Added import
import { CharacterLib } from '../../logic/lib/CharacterLib'; // Corrected import for CharacterLib

const props = defineProps({
  // Make stats potentially null or undefined if gameState might not be ready
  stats: {
    type: Object as PropType<Record<string, DebugStatInfo> | null | undefined>,
    required: true // Still required, but can be null/undefined initially
  }
});

// Inject the game state to modify stat values
const gameState = inject<GameState>('gameState');

// Store input values for setting stat values
const statInputValues = reactive<Record<string, string>>({});

// New reactive properties for include/exclude filters
const includeFilter = ref('');
const excludeFilter = ref('');
const isIncludeRegexValid = ref(true);
const isExcludeRegexValid = ref(true);

// Add new reactive properties for discover filtering
const discoverIncludeFilter = ref('');
const isDiscoverIncludeRegexValid = ref(true);

// Debug tab management using gameState
const debugActiveTab = computed(() => {
  // Use a specific debug tab state from gameState, defaulting to 'main'
  return (gameState?.uiState as any)?.debugActiveTab || 'main';
});

const setDebugTab = (tabName: string) => {
  if (gameState) {
    // Store debug tab state in gameState to persist across UI updates
    if (!(gameState.uiState as any).debugActiveTab) {
      (gameState.uiState as any).debugActiveTab = 'main';
    }
    (gameState.uiState as any).debugActiveTab = tabName;
  }
};

// Check if there are any stats to display
const hasStats = computed(() => {
  return props.stats && Object.keys(props.stats).length > 0;
});

// Sort the stats and return them
const sortedStats = computed(() => {
  if (!props.stats) {
    return {};
  }

  let filteredKeys = Object.keys(props.stats);
  isIncludeRegexValid.value = true; // Reset validity before check
  isExcludeRegexValid.value = true; // Reset validity before check

  // Apply include filter
  if (includeFilter.value.trim() !== '') {
    try {
      const includeRegex = new RegExp(includeFilter.value.trim(), 'i');
      filteredKeys = filteredKeys.filter(key => includeRegex.test(key));
    } catch (e) {
      console.warn("Invalid include regex:", e);
      isIncludeRegexValid.value = false; // Mark as invalid
      // Do not filter if regex is invalid
    }
  }

  // Apply exclude filter
  if (excludeFilter.value.trim() !== '') {
    try {
      const excludeRegex = new RegExp(excludeFilter.value.trim(), 'i');
      filteredKeys = filteredKeys.filter(key => !excludeRegex.test(key));
    } catch (e) {
      console.warn("Invalid exclude regex:", e);
      isExcludeRegexValid.value = false; // Mark as invalid
      // Do not filter if regex is invalid
    }
  }

  // Sort keys alphabetically for consistent display
  const sortedKeys = filteredKeys.sort();
  const result: Record<string, DebugStatInfo> = {};
  sortedKeys.forEach(key => {
    result[key] = props.stats![key];
    
    // Initialize input values if not set
    if (statInputValues[key] === undefined) {
      statInputValues[key] = String(props.stats![key].value);
    }
  });
  return result;
});

// Determine if a stat is independent (no params)
const isIndependentStat = (stat: DebugStatInfo): boolean => {
  return !stat.params;
};

// Format parameters for display
const formatParams = (params: Record<string, number>): string => {
  if ('add' in params && 'multiCache' in params) {
    return `${params.add} * ${params.multiCache}`;
  } else if ('argument' in params) {
    return `formula(${params.argument})`;
  } else {
    return Object.entries(params)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
};

// Modify a stat by delta
const modifyStat = (name: string, delta: number) => {
  if (!gameState) return;
  
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    gameState.modifyIndependentStat(name, delta);
    statInputValues[name] = String(stat.value + delta);
  }
};

// Set a stat to a specific value
const setStatValue = (name: string) => {
  if (!gameState) return;
  
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    const numericValue = Number(statInputValues[name]);
    if (gameState && gameState.connections) {
        Stats.setIndependentStat(stat as IndependentStat, numericValue, gameState.connections);
        UIStateManager.updateDebugView(gameState); 
    }
  }
};

// Ref to track which button to animate
const copyAnimationButton = ref<string | null>(null);

// Helper function for copy feedback
const triggerCopyAnimation = (buttonId: string) => {
  copyAnimationButton.value = buttonId;
  setTimeout(() => {
    copyAnimationButton.value = null;
  }, 1000); // Animation duration
};

// Function to copy skills to clipboard (using gameState now)
const copySkillsToClipboard = (includeAttributes: boolean, _event?: Event) => {
  if (!gameState || !gameState.lib?.getSkillLib || !gameState.lib?.getAttributeLib) {
    console.error("GameState, SkillLib, or AttributeLib not available via getters");
    return;
  }
  let clipboardText = '';
  const skillLib = gameState.lib.getSkillLib();
  const attributeLib = gameState.lib.getAttributeLib();
  const skillsData = skillLib.getAllSkills(); // Changed to getAllSkills()
  const attributeDefinitions = attributeLib.getAttributeDefinitions();

  const findAttributeDisplayName = (attrKey: string): string => {
    for (const category of Object.values(attributeDefinitions)) {
      if (category.attributes[attrKey]) {
        return category.attributes[attrKey].displayName;
      }
    }
    return attrKey; 
  };

  Object.values(skillsData).forEach((skill: Skill) => { // skillsData is Record<string, Skill>, so value is Skill
    clipboardText += `${skill.displayName}: ${skill.description}\n`;

    if (includeAttributes) {
      const governedBy = skill.governedBy?.map((attrKey: string) => findAttributeDisplayName(attrKey)).join(', ') || 'none';
      const assistedBy = skill.assistedBy?.map((attrKey: string) => findAttributeDisplayName(attrKey)).join(', ') || 'none';
      clipboardText += `Governed by: ${governedBy}\n`;
      clipboardText += `Assisted by: ${assistedBy}\n`;
    }

    if (skill.specializations && skill.specializations.length > 0) {
      skill.specializations.forEach((specId: string) => { // skill.specializations is string[]
        const spec = skillLib.getSpecialization(specId);
        if (spec) {
          clipboardText += `* ${spec.displayName}: ${spec.description}\n`;
        }
      });
    }

    clipboardText += '\n';
  });

  navigator.clipboard.writeText(clipboardText)
    .then(() => {
      triggerCopyAnimation(includeAttributes ? 'attributes' : 'basic');
    })
    .catch(err => {
      console.error('Failed to copy skills to clipboard:', err);
    });
};

// Function to copy attributes to clipboard (using gameState now)
const copyAttributesToClipboard = (_event?: Event) => {
  if (!gameState || !gameState.lib?.getAttributeLib) {
    console.error("GameState or AttributeLib not available via getter");
    return;
  }
  let clipboardText = '';
  const attributeDefinitions = gameState.lib.getAttributeLib().getAttributeDefinitions();

  Object.entries(attributeDefinitions).forEach(([, category]) => {
    clipboardText += `${category.displayName}: ${category.description}\n`;

    Object.entries(category.attributes).forEach(([, attr]) => {
      clipboardText += `* ${attr.displayName}: ${attr.description}\n`;
    });

    clipboardText += '\n';
  });

  navigator.clipboard.writeText(clipboardText)
    .then(() => {
      triggerCopyAnimation('attributesCopy');
    })
    .catch(err => {
      console.error('Failed to copy attributes to clipboard:', err);
    });
};

// Function to copy attribute skill governance statistics to clipboard (using gameState now)
const copyAttributeSkillStats = (_event?: Event) => {
   if (!gameState || !gameState.lib?.getSkillLib || !gameState.lib?.getAttributeLib) {
    console.error("GameState, SkillLib, or AttributeLib not available via getters");
    return;
  }
  const skillLib = gameState.lib.getSkillLib(); // get skillLib instance
  const skillsData = skillLib.getAllSkills(); // Changed to getAllSkills()
  const attributeDefinitions = gameState.lib.getAttributeLib().getAttributeDefinitions();

  const attributeStats: Record<string, { governs: number; assists: number }> = {};

  Object.entries(attributeDefinitions).forEach(([, category]) => {
    Object.keys(category.attributes).forEach(attrKey => {
      attributeStats[attrKey] = { governs: 0, assists: 0 };
    });
  });

  const skillsByAttribute: Record<string, string[]> = {};

  Object.values(skillsData).forEach((skill: Skill) => { // skillsData is Record<string, Skill>, so value is Skill
    if (skill.governedBy) {
      skill.governedBy.forEach(attrKey => {
        if (attributeStats[attrKey]) {
          attributeStats[attrKey].governs++;
          if (!skillsByAttribute[attrKey]) skillsByAttribute[attrKey] = [];
          if (!skillsByAttribute[attrKey].includes(`${skill.displayName} (Governs)`)) {
             skillsByAttribute[attrKey].push(`${skill.displayName} (Governs)`);
          }
        }
      });
    }
    if (skill.assistedBy) {
      skill.assistedBy.forEach(attrKey => {
        if (attributeStats[attrKey]) {
          attributeStats[attrKey].assists++;
           if (!skillsByAttribute[attrKey]) skillsByAttribute[attrKey] = [];
           if (!skillsByAttribute[attrKey].includes(`${skill.displayName} (Assists)`)) {
            skillsByAttribute[attrKey].push(`${skill.displayName} (Assists)`);
           }
        }
      });
    }
  });

  let clipboardText = 'Attribute Skill Governance Stats:\n\n';
  const findAttributeDisplayName = (attrKey: string): string => {
    for (const category of Object.values(attributeDefinitions)) {
      if (category.attributes[attrKey]) {
        return category.attributes[attrKey].displayName;
      }
    }
    return attrKey;
  };
  
  Object.entries(attributeStats).sort(([, a], [, b]) => (b.governs + b.assists) - (a.governs + a.assists)).forEach(([attrKey, stats]) => {
    const displayName = findAttributeDisplayName(attrKey);
    clipboardText += `${displayName} - Governs: ${stats.governs}, Assists: ${stats.assists}\n`;
    if (skillsByAttribute[attrKey] && skillsByAttribute[attrKey].length > 0) {
        skillsByAttribute[attrKey].sort().forEach(skillName => {
            clipboardText += `  - ${skillName}\n`;
        });
    }
  });

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => {
      triggerCopyAnimation('attributeStats');
    })
    .catch(err => {
      console.error('Failed to copy attribute skill stats to clipboard:', err);
    });
};

const copyAllSkillNames = (_event?: Event) => {
  if (!gameState || !gameState.lib?.getSkillLib) {
    console.error("GameState or SkillLib not available");
    return;
  }
  const skillLib = gameState.lib.getSkillLib();
  const skillsData = skillLib.getAllSkills(); // Changed to getAllSkills()
  let clipboardText = '';

  Object.values(skillsData).forEach((skill: Skill) => { // skillsData is Record<string, Skill>, so value is Skill
    clipboardText += `${skill.displayName}\n`;
    if (skill.specializations && skill.specializations.length > 0) {
      skill.specializations.forEach((specId: string) => { // skill.specializations is string[]
        const spec = skillLib.getSpecialization(specId);
        if (spec) {
          clipboardText += `* ${spec.displayName}\n`;
        }
      });
    }
  });

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => {
      triggerCopyAnimation('skillNames');
    })
    .catch(err => {
      console.error('Failed to copy skill names to clipboard:', err);
    });
};

const copySkillKeywordStats = (_event?: Event) => {
  if (!gameState || !gameState.lib?.getSkillLib) {
    console.error("GameState or SkillLib not available for keyword stats");
    return;
  }

  const skillLib = gameState.lib.getSkillLib();
  const skillsData = skillLib.getAllSkills(); // Changed to getAllSkills()
  const keywordLookup = skillLib.keywordLookup;

  let clipboardText = "Skill Keyword Statistics:\n\n";
  
  const keywordCounts: Record<string, number> = {};
  const keywordToSkills: Record<string, string[]> = {};

  Object.values(skillsData).forEach((skill: Skill) => { // Iterate over Skill objects
    const processKeywords = (item: Skill | SkillSpecialization, itemName: string) => {
      if (item.keywords && Array.isArray(item.keywords)) {
        item.keywords.flat().forEach(keyword => {
          const lowerKeyword = keyword.toLowerCase();
          keywordCounts[lowerKeyword] = (keywordCounts[lowerKeyword] || 0) + 1;
          if (!keywordToSkills[lowerKeyword]) {
            keywordToSkills[lowerKeyword] = [];
          }
          if (!keywordToSkills[lowerKeyword].includes(itemName)) {
            keywordToSkills[lowerKeyword].push(itemName);
          }
        });
      }
    };

    processKeywords(skill, skill.displayName);
    if (skill.specializations && skill.specializations.length > 0) {
      skill.specializations.forEach((specId: string) => { // Iterate over spec IDs
        const spec = skillLib.getSpecialization(specId); // Get spec object
        if (spec) {
          processKeywords(spec, `${skill.displayName} > ${spec.displayName}`);
        }
      });
    }
  });
  
  // Sort keywords by count (descending)
  const sortedKeywords = Object.entries(keywordCounts).sort(([,a],[,b]) => b-a);
  
  sortedKeywords.forEach(([keyword, count]) => {
    clipboardText += `${keyword} (${count}):\n`;
    const skills = keywordToSkills[keyword] || [];
    skills.sort().forEach(skillName => {
      clipboardText += `  - ${skillName}\n`;
    });
    clipboardText += '\n';
  });

  // Add unused keywords (from keywordLookup that are not in keywordCounts)
  let hasUnused = false;
  const unusedKeywordsTextLines: string[] = [];
  for (const keyword of keywordLookup.keys()) {
      if (!keywordCounts[keyword.toLowerCase()]) {
          if (!hasUnused) {
              unusedKeywordsTextLines.push("Unused Keywords (from lookup map but not found on skills/specs):\n");
              hasUnused = true;
          }
          const technicalNames = keywordLookup.get(keyword) || 'N/A';
          unusedKeywordsTextLines.push(`- ${keyword} (Points to: ${technicalNames})\n`);
      }
  }
  if (hasUnused) {
      clipboardText += "\n" + unusedKeywordsTextLines.join('');
  }


  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => {
      triggerCopyAnimation('skillKeywords');
    })
    .catch(err => {
      console.error('Failed to copy skill keyword stats to clipboard:', err);
    });
};

const copySkillNamesAndDescriptions = (_event?: Event) => {
  if (!gameState || !gameState.lib?.getSkillLib) {
    console.error("GameState or SkillLib not available for skill names and descriptions.");
    return;
  }

  const skillLib = gameState.lib.getSkillLib();
  const skillsData = skillLib.getAllSkills(); // Changed to getAllSkills()
  let clipboardText = "";

  Object.values(skillsData).forEach((skill: Skill) => { // skillsData is Record<string, Skill>, so value is Skill
    clipboardText += `\"${skill.displayName}\": \"${skill.description}\",\n`;
    if (skill.specializations && skill.specializations.length > 0) {
      skill.specializations.forEach((specId: string) => { // skill.specializations is string[]
        const spec = skillLib.getSpecialization(specId);
        if (spec) {
          clipboardText += `  \"${spec.displayName}\": \"${spec.description}\",\n`;
        }
      });
    }
  });

  navigator.clipboard.writeText(clipboardText.trim().replace(/,\n$/, "\n")) // Remove trailing comma from the last line
    .then(() => {
      triggerCopyAnimation('skillNameDesc');
    })
    .catch(err => {
      console.error('Failed to copy skill names and descriptions to clipboard:', err);
    });
};

const copySkillIds = (_event?: Event) => {
  if (!gameState || !gameState.lib?.getSkillLib) {
    console.error("GameState or SkillLib not available for skill IDs.");
    return;
  }

  const skillLib = gameState.lib.getSkillLib();
  const skillsData = skillLib.getAllSkills(); // Changed to getAllSkills()
  let clipboardText = "";

  Object.values(skillsData).forEach((skill: Skill) => { // Iterate over Skill objects
    clipboardText += `${skill.id}\n`; // Add skill ID
    if (skill.specializations && skill.specializations.length > 0) {
      skill.specializations.forEach((specId: string) => { // Iterate over spec IDs
        clipboardText += `${specId}\n`; // Add specialization ID (which is spec.id)
      });
    }
  });

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => {
      triggerCopyAnimation('skillIds');
    })
    .catch(err => {
      console.error('Failed to copy skill IDs to clipboard:', err);
    });
};

const copyGameStateToClipboard = (_event?: Event) => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }

  // Create a shallow copy of the gameState to avoid modifying the original
  const gameStateCopy = { ...gameState };

  // Define keys to remove
  const keysToRemove: (keyof GameState)[] = [
    'connections',
    'lib',
    // 'eventProcessor', // Temporarily remove or ensure it's a valid keyof GameState
    'uiState'
  ];

  // Add 'eventProcessor' back if it's confirmed to be a valid key and update GameState type
  // For now, let's assume it might be dynamically added or type is slightly off
  const dynamicKeysToRemove = ['eventProcessor'];

  // Remove the specified keys from the copy
  for (const key of keysToRemove) {
    if (key in gameStateCopy) {
      delete (gameStateCopy as any)[key]; // Use 'as any' for keys known to be problematic with strict typing
    }
  }
  // Handle potentially dynamic keys separately to avoid strict type errors
  for (const key of dynamicKeysToRemove) {
    if (key in gameStateCopy) {
      delete (gameStateCopy as any)[key];
    }
  }

  try {
    // Attempt to serialize the modified gameState copy
    // No complex replacer needed now, but pretty-printing is good.
    const gameStateJson = JSON.stringify(gameStateCopy, null, 2);

    navigator.clipboard.writeText(gameStateJson)
      .then(() => {
        triggerCopyAnimation('gameState');
      })
      .catch(err => {
        console.error('Failed to copy game state to clipboard:', err);
      });
  } catch (error) {
    console.error('Error serializing game state:', error);
    // Optionally, inform the user via UI or a simpler clipboard message
    navigator.clipboard.writeText("Error serializing game state. Check console for details.")
      .then(() => triggerCopyAnimation('gameStateError')) // Use a different animation key for error
      .catch(err => console.error('Failed to copy error message to clipboard:', err));
  }
};

// Function to replace skill display names with IDs in clipboard text
const replaceSkillNamesWithIdsInClipboard = async (_event?: Event) => {
  if (!gameState || !gameState.lib?.getSkillLib) {
    console.error("GameState or SkillLib not available for replacing names with IDs.");
    triggerCopyAnimation('replaceNamesWithIdsError');
    return;
  }

  try {
    let clipboardText = await navigator.clipboard.readText();
    const skillLib = gameState.lib.getSkillLib();
    const skillsData = skillLib.getAllSkills(); // Changed to getAllSkills()

    const replacements: { searchDisplayName: string; replacementId: string }[] = [];

    // Collect all skills and specializations
    Object.values(skillsData).forEach((skill: Skill) => { // Iterate over Skill objects
      // Add skill
      replacements.push({
        searchDisplayName: skill.displayName,
        replacementId: skill.id
      });

      // Add specializations
      if (skill.specializations && skill.specializations.length > 0) {
        skill.specializations.forEach((specId: string) => { // Iterate over spec IDs
          const spec = skillLib.getSpecialization(specId); // Get spec object
          if (spec) {
            replacements.push({
              searchDisplayName: spec.displayName,
              replacementId: spec.id // Corrected: spec.id is globally unique
            });
          }
        });
      }
    });

    // Sort by display name length (descending) to replace longer names first
    replacements.sort((a, b) => b.searchDisplayName.length - a.searchDisplayName.length);

    // Helper to escape regex special characters
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\\\]/g, '\\\\$&'); // $& means the whole matched string
    };

    // Perform replacements
    replacements.forEach(rep => {
      // Match the display name only when enclosed in double quotes
      const searchRegex = new RegExp(`"${escapeRegExp(rep.searchDisplayName)}"`, 'g');
      const replacementString = `"${rep.replacementId}"`;
      clipboardText = clipboardText.replace(searchRegex, replacementString);
    });

    await navigator.clipboard.writeText(clipboardText);
    triggerCopyAnimation('replaceNamesWithIds');

  } catch (err) {
    console.error('Failed to replace skill names with IDs in clipboard:', err);
    // Consider providing user feedback about the error, e.g., clipboard read/write permission denied
    // You could use a specific animation for errors here too.
    triggerCopyAnimation('replaceNamesWithIdsError'); // Or a general copy error animation
  }
};

// Function to simplify clipboard text by extracting the second part of dot-separated words in quotes
const simplifyClipboardText = async (_event?: Event) => {
  try {
    let clipboardText = await navigator.clipboard.readText();

    // Regex to find "word1.word2" patterns
    // It captures word1 and word2
    const regex = /"([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)"/g;

    // Replace "word1.word2" with "word2"
    const simplifiedText = clipboardText.replace(regex, (_match, _word1, word2) => {
      return `"${word2}"`;
    });

    await navigator.clipboard.writeText(simplifiedText);
    triggerCopyAnimation('simplifyClipboard'); // Use a new animation key

  } catch (err) {
    console.error('Failed to simplify clipboard text:', err);
    triggerCopyAnimation('simplifyClipboardError'); // Optional: specific error animation
  }
};

// Function to clear the include filter
const clearIncludeFilter = () => {
  includeFilter.value = '';
  isIncludeRegexValid.value = true; // Reset validity
};

// Function to clear the exclude filter
const clearExcludeFilter = () => {
  excludeFilter.value = '';
  isExcludeRegexValid.value = true; // Reset validity
};

// Function to clear both filters
const clearAllFilters = () => {
  clearIncludeFilter();
  clearExcludeFilter();
};

// New function to copy character names and bios
const copyCharacterNamesAndBios = (_event?: Event) => {
  if (!gameState || !gameState.lib || !(gameState.lib as any).characters) { // Check for characters property
    console.error("GameState, Lib, or CharacterLib not available for character names and bios.");
    triggerCopyAnimation('characterNamesAndBiosError');
    return;
  }

  const characterLib = (gameState.lib as any).characters as CharacterLib; // Access directly
  const characters = characterLib.values();
  let clipboardText = "";

  for (const character of characters) {
    clipboardText += `Name: ${character.name}\n`;
    clipboardText += `Bio: ${character.bio || 'N/A'}\n\n`; // Add bio, handle if undefined/empty
  }

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => {
      triggerCopyAnimation('characterNamesAndBios');
    })
    .catch(err => {
      console.error('Failed to copy character names and bios to clipboard:', err);
      triggerCopyAnimation('characterNamesAndBiosError'); // Optional: error animation
    });
};

// New computed properties for discovered items
const hasDiscoveredItems = computed(() => {
  return gameState && gameState.discoveredItems && Object.keys(gameState.discoveredItems).length > 0;
});

const filteredDiscoveredItems = computed(() => {
  if (!gameState || !gameState.discoveredItems) {
    return [];
  }

  let items = Object.keys(gameState.discoveredItems).filter(key => gameState.discoveredItems[key]);
  isDiscoverIncludeRegexValid.value = true; // Reset validity before check

  // Apply include filter
  if (discoverIncludeFilter.value.trim() !== '') {
    try {
      const includeRegex = new RegExp(discoverIncludeFilter.value.trim(), 'i');
      items = items.filter(item => includeRegex.test(item));
    } catch (e) {
      console.warn("Invalid discover include regex:", e);
      isDiscoverIncludeRegexValid.value = false; // Mark as invalid
      // Do not filter if regex is invalid
    }
  }

  // Sort items alphabetically
  return items.sort();
});

// Function to clear discover filters
const clearDiscoverFilters = () => {
  discoverIncludeFilter.value = '';
  isDiscoverIncludeRegexValid.value = true; // Reset validity
};

// Function to copy discovered items to clipboard
const copyDiscoveredItemsToClipboard = (_event?: Event) => {
  if (!gameState || !gameState.discoveredItems) {
    console.error("GameState or discoveredItems not available");
    return;
  }

  const discoveredItemsList = Object.keys(gameState.discoveredItems)
    .filter(key => gameState.discoveredItems[key])
    .sort();

  let clipboardText = 'Discovered Items:\n\n';
  discoveredItemsList.forEach(item => {
    clipboardText += `${item}\n`;
  });

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => {
      triggerCopyAnimation('discoveredItems');
    })
    .catch(err => {
      console.error('Failed to copy discovered items to clipboard:', err);
    });
};

// Function to discover all items
const discoverAllItems = () => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  
  // Import and call the discoverAll effect
  import('../../logic/effects').then(effects => {
    effects.discoverAll(gameState);
  });
};

// Function to clear all discovered items
const discoverNoneItems = () => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  
  // Clear all discovered items
  gameState.discoveredItems = {};
  gameState.uiState.discoveredItemsCount = 0;
};

// Individual discovery functions
const discoverSkills = () => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  
  import('../../logic/effects').then(effects => {
    effects.discoverAllSkills(gameState);
  });
};

const discoverBuildings = () => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  
  import('../../logic/effects').then(effects => {
    effects.discoverAllBuildings(gameState);
  });
};

const discoverResources = () => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  
  import('../../logic/effects').then(effects => {
    effects.discoverAllResources(gameState);
  });
};

const discoverAttributes = () => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  
  import('../../logic/effects').then(effects => {
    effects.discoverAllAttributes(gameState);
  });
};

const discoverTabs = () => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  
  import('../../logic/effects').then(effects => {
    effects.discoverAllTabs(gameState);
  });
};
</script>

<style scoped>
.debug-view {
  padding: 0.5rem;
  font-family: monospace;
  overflow-x: auto; /* Prevent wide content from breaking layout */
}

.stats-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 10px;
  overflow-x: auto;
  font-size: 0.9em;
  color: #212529;
  width: 100%;
}

.stat-row {
  display: flex;
  align-items: center;
  padding: 4px 0;
  line-height: 1.5;
  white-space: nowrap;
}

.stat-controls {
  display: flex;
  align-items: center;
  margin-right: 8px;
  width: 148px; /* Fixed exact width for consistent alignment */
  flex-shrink: 0;
}

.placeholder-controls {
  width: 148px; /* Must match .stat-controls width exactly */
}

.control-btn {
  padding: 2px 6px;
  margin: 0 2px;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.9em;
}

.control-btn:hover {
  background-color: #dee2e6;
}

.stat-input {
  width: 60px;
  padding: 2px 4px;
  margin: 0 2px;
  font-family: monospace;
  font-size: 0.9em;
  border: 1px solid #ced4da;
  border-radius: 3px;
}

.stat-name {
  flex: 0 0 auto;
  min-width: 220px;
  padding-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-separator {
  flex: 0 0 auto;
  margin-right: 10px;
}

.stat-value {
  flex: 1 1 auto;
  white-space: nowrap;
}

.stat-params {
  color: #6c757d;
  margin-left: 10px;
}

h2 {
  margin-bottom: 1rem;
  color: #495057;
}

p {
  color: #6c757d;
}

.button-container {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap */
  gap: 10px;
  margin-bottom: 15px;
}

.action-btn {
  padding: 8px 12px;
  background-color: #4b72b0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #3a5b8c;
}

.action-btn.copy-success {
  background-color: #4caf50;
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.filter-input {
  width: calc(50% - 10px); /* Adjust width considering gap */
  padding: 8px;
  font-family: monospace;
}

.filter-input.invalid-regex {
  border-color: red;
}

.filter-inputs {
    display: flex;
    align-items: center; /* Align items vertically */
    gap: 10px; /* Add gap between input fields */
    margin-bottom: 15px; /* Add some space below the filter section */
}

.clear-btn {
  padding: 6px 10px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.8em;
  height: fit-content; /* Adjust height to match input boxes better */
}

.clear-btn.clear-all-btn {
    width: auto; /* Allow button to size to its content */
    flex-shrink: 0; /* Prevent shrinking if space is tight */
    margin-left: 5px; /* A bit of space from the last input */
}

.clear-btn:hover {
  background-color: #e9ecef;
}

/* Tab Navigation Styles */
.tab-navigation {
  display: flex;
  gap: 3px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.tab-btn {
  padding: 4px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.3s;
}

.tab-btn:hover {
  background-color: #e9ecef;
}

.tab-btn.active {
  background-color: #4b72b0;
  color: white;
  border-color: #4b72b0;
}

.tab-content {
  margin-top: 5px;
}

/* Discover Tab Styles */
.discover-header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px 0;
}

.discover-count {
  font-weight: bold;
  color: #495057;
  white-space: nowrap;
  font-size: 0.9em;
  min-width: 35px;
  text-align: right;
}

.discover-buttons {
  display: flex;
  gap: 5px;
  align-items: center;
}

.bigger-btn {
  padding: 6px 12px;
  font-size: 0.85em;
}

.discover-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 8px;
  font-size: 0.9em;
  color: #212529;
  width: 100%;
}

.discover-columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 2px;
  line-height: 1.2;
}

.discover-item {
  font-family: monospace;
  font-size: 1.1em;
  padding: 2px 0;
  word-break: break-word;
}

.filter-input.discover-filter {
  width: 500px;
  flex-shrink: 1;
}

.discover-type-btn {
  padding: 6px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.3s;
}

.discover-type-btn:hover {
  background-color: #5a6268;
}

.clear-discover-btn {
  padding: 6px 12px;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.3s;
}

.clear-discover-btn:hover {
  background-color: #e9ecef;
}
</style>