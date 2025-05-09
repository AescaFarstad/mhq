<template>
    <div class="debug-view">
      <h2>Debug Stats</h2>
      <div class="button-container">
        <button @click="copySkillsToClipboard(false, $event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'basic' }">Skills (Basic)</button>
        <button @click="copySkillsToClipboard(true, $event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributes' }">Skills (With Attributes)</button>
        <button @click="copyAttributesToClipboard($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributesCopy' }">Attributes</button>
        <button @click="copyAttributeSkillStats($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributeStats' }">Attribute Skill Stats</button>
        <button @click="copyAllSkillNames($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillNames' }">Skill Names</button>
        <button @click="copySkillKeywordStats($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillKeywords' }">Skill Keyword Stats</button>
        <button @click="copySkillNamesAndDescriptions($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillNameDesc' }">Skill Names & Descriptions</button>
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
  </template>
  
<script setup lang="ts">
import { computed, PropType, ref, reactive, inject } from 'vue';
import { GameState } from '../../logic/GameState';
import { Skill, SkillSpecialization } from '../../logic/lib/definitions/SkillDefinition';
import type { DebugStatInfo } from '../../types/uiTypes'; // Import centralized type
import { Stats } from '../../logic/core/Stats';
import { IndependentStat } from '../../logic/core/Stat'; // Import IndependentStat for type assertion

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

// Check if there are any stats to display
const hasStats = computed(() => {
  return props.stats && Object.keys(props.stats).length > 0;
});

// Sort the stats and return them
const sortedStats = computed(() => {
  if (!props.stats) {
    return {};
  }
  // Sort keys alphabetically for consistent display
  const sortedKeys = Object.keys(props.stats).sort();
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
        gameState.uiStateManager.updateDebugView(); 
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
  const skillsData = skillLib.skills;
  const attributeDefinitions = attributeLib.getAttributeDefinitions();

  const findAttributeDisplayName = (attrKey: string): string => {
    for (const category of Object.values(attributeDefinitions)) {
      if (category.attributes[attrKey]) {
        return category.attributes[attrKey].displayName;
      }
    }
    return attrKey; 
  };

  Object.values(skillsData).forEach((skill: Skill) => {
    clipboardText += `${skill.displayName}: ${skill.description}\n`;

    if (includeAttributes) {
      const governedBy = skill.governedBy?.map((attrKey: string) => findAttributeDisplayName(attrKey)).join(', ') || 'none';
      const assistedBy = skill.assistedBy?.map((attrKey: string) => findAttributeDisplayName(attrKey)).join(', ') || 'none';
      clipboardText += `Governed by: ${governedBy}\n`;
      clipboardText += `Assisted by: ${assistedBy}\n`;
    }

    if (skill.specializations) {
      Object.values(skill.specializations).forEach((spec: SkillSpecialization) => {
        clipboardText += `* ${spec.displayName}: ${spec.description}\n`;
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
  const skillsData = gameState.lib.getSkillLib().skills;
  const attributeDefinitions = gameState.lib.getAttributeLib().getAttributeDefinitions();
  // const attributeLib = gameState.lib.getAttributeLib(); // Unused

  const attributeStats: Record<string, { governs: number; assists: number }> = {};

  Object.entries(attributeDefinitions).forEach(([, category]) => {
    Object.keys(category.attributes).forEach(attrKey => {
      attributeStats[attrKey] = { governs: 0, assists: 0 };
    });
  });

  const skillsByAttribute: Record<string, string[]> = {};

  Object.values(skillsData).forEach((skill: Skill) => {
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
  const skillsData = skillLib.skills;
  let clipboardText = '';

  Object.values(skillsData).forEach((skill: Skill) => {
    clipboardText += `${skill.displayName}\n`;
    if (skill.specializations) {
      Object.values(skill.specializations).forEach((spec: SkillSpecialization) => {
        clipboardText += `* ${spec.displayName}\n`;
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
  const skillsData = skillLib.skills; 
  const keywordLookup = skillLib.keywordLookup;

  let clipboardText = "Skill Keyword Statistics:\n\n";
  
  // Count keyword occurrences
  const keywordCounts: Record<string, number> = {};
  const keywordToSkills: Record<string, string[]> = {};

  Object.entries(skillsData).forEach(([, skill]) => {
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
    if (skill.specializations) {
      Object.entries(skill.specializations).forEach(([, spec]) => {
        processKeywords(spec, `${skill.displayName} > ${spec.displayName}`);
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
  const skillsData = skillLib.skills;
  let clipboardText = "";

  Object.values(skillsData).forEach((skill: Skill) => {
    clipboardText += `"${skill.displayName}": "${skill.description}",\n`;
    if (skill.specializations) {
      Object.values(skill.specializations).forEach((spec: SkillSpecialization) => {
        clipboardText += `  "${spec.displayName}": "${spec.description}",\n`;
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
</script>

<style scoped>
.debug-view {
  padding: 1rem;
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
</style>