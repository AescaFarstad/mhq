<template>
  <div class="tab-content">
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
</template>

<script setup lang="ts">
import { computed, PropType, ref, reactive, inject } from 'vue';
import { GameState } from '../../logic/GameState';
import type { DebugStatInfo } from '../../types/uiTypes';
import { Stats } from '../../logic/core/Stats';
import { IndependentStat } from '../../logic/core/Stat';
import * as UIStateManager from '../../logic/UIStateManager';
import { CharacterLib } from '../../logic/lib/CharacterLib';

const props = defineProps({
  stats: {
    type: Object as PropType<Record<string, DebugStatInfo> | null | undefined>,
    required: true,
  },
});

const gameState = inject<GameState>('gameState');

// Store input values for setting stat values
const statInputValues = reactive<Record<string, string>>({});

// Filters
const includeFilter = ref('');
const excludeFilter = ref('');
const isIncludeRegexValid = ref(true);
const isExcludeRegexValid = ref(true);

// Animation state
const copyAnimationButton = ref<string | null>(null);
const triggerCopyAnimation = (buttonId: string) => {
  copyAnimationButton.value = buttonId;
  setTimeout(() => (copyAnimationButton.value = null), 1000);
};

// ---------- Stat helpers ----------
const hasStats = computed(() => props.stats && Object.keys(props.stats).length > 0);

const sortedStats = computed(() => {
  if (!props.stats) return {};
  let filteredKeys = Object.keys(props.stats);
  isIncludeRegexValid.value = true;
  isExcludeRegexValid.value = true;

  // Include filter
  if (includeFilter.value.trim()) {
    try {
      const r = new RegExp(includeFilter.value.trim(), 'i');
      filteredKeys = filteredKeys.filter((k) => r.test(k));
    } catch {
      isIncludeRegexValid.value = false;
    }
  }

  // Exclude filter
  if (excludeFilter.value.trim()) {
    try {
      const r = new RegExp(excludeFilter.value.trim(), 'i');
      filteredKeys = filteredKeys.filter((k) => !r.test(k));
    } catch {
      isExcludeRegexValid.value = false;
    }
  }

  const res: Record<string, DebugStatInfo> = {};
  filteredKeys.sort().forEach((k) => {
    res[k] = props.stats![k];
    if (statInputValues[k] === undefined) statInputValues[k] = String(props.stats![k].value);
  });
  return res;
});

const isIndependentStat = (stat: DebugStatInfo) => !stat.params;

const formatParams = (params: Record<string, number>): string => {
  if ('add' in params && 'multiCache' in params) return `${params.add} * ${params.multiCache}`;
  if ('argument' in params) return `formula(${params.argument})`;
  return Object.entries(params)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
};

const modifyStat = (name: string, delta: number) => {
  if (!gameState) return;
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    gameState.modifyIndependentStat(name, delta);
    statInputValues[name] = String(stat.value + delta);
  }
};

const setStatValue = (name: string) => {
  if (!gameState) return;
  const stat = gameState.connections.connectablesByName.get(name);
  if (stat && 'independent' in stat && stat.independent) {
    const v = Number(statInputValues[name]);
    if (gameState && gameState.connections) {
      Stats.setIndependentStat(stat as IndependentStat, v, gameState.connections);
      UIStateManager.updateDebugView(gameState);
    }
  }
};

// ---------- Clipboard helper functions (copied from original DebugView) ----------
// Function to copy skills to clipboard (using gameState now)
const copySkillsToClipboard = (includeAttributes: boolean, _event?: Event) => {
  if (!gameState || !gameState.lib?.skills || !gameState.lib?.attributes) {
    console.error("GameState, SkillLib, or AttributeLib not available via getters");
    return;
  }
  let clipboardText = '';
  const skillLib = (gameState.lib as any).getSkillLib();
  const attributeLib = (gameState.lib as any).getAttributeLib();
  const skillsData = skillLib.getAllSkills();
  const attributeDefinitions = attributeLib.getAttributeDefinitions();

  const findAttributeDisplayName = (attrKey: string): string => {
    for (const category of Object.values(attributeDefinitions)) {
      if ((category as any).attributes[attrKey]) {
        return (category as any).attributes[attrKey].displayName;
      }
    }
    return attrKey;
  };

  Object.values(skillsData).forEach((skill: any) => {
    clipboardText += `${skill.displayName}: ${skill.description}\n`;

    if (includeAttributes) {
      const governedBy = skill.governedBy?.map((a: string) => findAttributeDisplayName(a)).join(', ') || 'none';
      const assistedBy = skill.assistedBy?.map((a: string) => findAttributeDisplayName(a)).join(', ') || 'none';
      clipboardText += `Governed by: ${governedBy}\n`;
      clipboardText += `Assisted by: ${assistedBy}\n`;
    }

    if (skill.specializations?.length) {
      skill.specializations.forEach((specId: string) => {
        const spec = skillLib.getSpecialization(specId);
        if (spec) {
          clipboardText += `* ${spec.displayName}: ${spec.description}\n`;
        }
      });
    }

    clipboardText += '\n';
  });

  navigator.clipboard.writeText(clipboardText)
    .then(() => triggerCopyAnimation(includeAttributes ? 'attributes' : 'basic'))
    .catch((err) => console.error('Failed to copy skills to clipboard:', err));
};

// Function to copy attributes to clipboard (using gameState now)
const copyAttributesToClipboard = (_event?: Event) => {
  if (!gameState || !gameState.lib?.attributes) {
    console.error("GameState or AttributeLib not available via getter");
    return;
  }
  const attributeDefinitions = (gameState.lib as any).getAttributeLib().getAttributeDefinitions();
  let clipboardText = '';

  Object.values(attributeDefinitions).forEach((cat: any) => {
    clipboardText += `${cat.displayName}: ${cat.description}\n`;
    Object.values(cat.attributes).forEach((attr: any) => {
      clipboardText += `* ${attr.displayName}: ${attr.description}\n`;
    });
    clipboardText += '\n';
  });

  navigator.clipboard.writeText(clipboardText)
    .then(() => triggerCopyAnimation('attributesCopy'))
    .catch((err) => console.error('Failed to copy attributes to clipboard:', err));
};

// Function to copy attribute skill governance statistics to clipboard (using gameState now)
const copyAttributeSkillStats = (_event?: Event) => {
  if (!gameState || !gameState.lib?.skills || !gameState.lib?.attributes) {
    console.error("GameState, SkillLib, or AttributeLib not available via getters");
    return;
  }
  const skillLib = (gameState.lib as any).getSkillLib();
  const skillsData = skillLib.getAllSkills();
  const attributeDefinitions = (gameState.lib as any).getAttributeLib().getAttributeDefinitions();

  const attributeStats: Record<string, { governs: number; assists: number }> = {};
  Object.values(attributeDefinitions).forEach((cat: any) => {
    Object.keys(cat.attributes).forEach((key) => (attributeStats[key] = { governs: 0, assists: 0 }));
  });

  const skillsByAttribute: Record<string, string[]> = {};
  Object.values(skillsData).forEach((skill: any) => {
    skill.governedBy?.forEach((attrKey: string) => {
      if (attributeStats[attrKey]) {
        attributeStats[attrKey].governs++;
        skillsByAttribute[attrKey] = skillsByAttribute[attrKey] || [];
        if (!skillsByAttribute[attrKey].includes(`${skill.displayName} (Governs)`)) {
          skillsByAttribute[attrKey].push(`${skill.displayName} (Governs)`);
        }
      }
    });
    skill.assistedBy?.forEach((attrKey: string) => {
      if (attributeStats[attrKey]) {
        attributeStats[attrKey].assists++;
        skillsByAttribute[attrKey] = skillsByAttribute[attrKey] || [];
        if (!skillsByAttribute[attrKey].includes(`${skill.displayName} (Assists)`)) {
          skillsByAttribute[attrKey].push(`${skill.displayName} (Assists)`);
        }
      }
    });
  });

  const findAttributeDisplayName = (attrKey: string): string => {
    for (const cat of Object.values(attributeDefinitions)) {
      if ((cat as any).attributes[attrKey]) return (cat as any).attributes[attrKey].displayName;
    }
    return attrKey;
  };

  let clipboardText = 'Attribute Skill Governance Stats:\n\n';
  Object.entries(attributeStats)
    .sort(([, a], [, b]) => b.governs + b.assists - (a.governs + a.assists))
    .forEach(([key, stats]) => {
      clipboardText += `${findAttributeDisplayName(key)} - Governs: ${stats.governs}, Assists: ${stats.assists}\n`;
      skillsByAttribute[key]?.sort().forEach((n) => (clipboardText += `  - ${n}\n`));
    });

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => triggerCopyAnimation('attributeStats'))
    .catch((err) => console.error('Failed to copy attribute skill stats to clipboard:', err));
};

// Function to copy all skill names
const copyAllSkillNames = (_event?: Event) => {
  if (!gameState || !gameState.lib?.skills) {
    console.error("GameState or SkillLib not available");
    return;
  }
  const skillLib = (gameState.lib as any).skills;
  const skillsData = skillLib.getAllSkills();
  let clipboardText = '';
  Object.values(skillsData).forEach((skill: any) => {
    clipboardText += `${skill.displayName}\n`;
    skill.specializations?.forEach((id: string) => {
      const spec = skillLib.getSpecialization(id);
      if (spec) clipboardText += `* ${spec.displayName}\n`;
    });
  });
  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => triggerCopyAnimation('skillNames'))
    .catch((err) => console.error('Failed to copy skill names to clipboard:', err));
};

// Function to copy keyword stats
const copySkillKeywordStats = (_event?: Event) => {
  if (!gameState || !gameState.lib?.skills) {
    console.error("GameState or SkillLib not available for keyword stats");
    return;
  }
  const skillLib = (gameState.lib as any).skills;
  const skillsData = skillLib.getAllSkills();
  const keywordLookup = skillLib.keywordLookup;

  const keywordCounts: Record<string, number> = {};
  const keywordToSkills: Record<string, string[]> = {};

  Object.values(skillsData).forEach((skill: any) => {
    const process = (item: any, name: string) => {
      item.keywords?.flat().forEach((kw: string) => {
        kw = kw.toLowerCase();
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
        keywordToSkills[kw] = keywordToSkills[kw] || [];
        if (!keywordToSkills[kw].includes(name)) keywordToSkills[kw].push(name);
      });
    };
    process(skill, skill.displayName);
    skill.specializations?.forEach((id: string) => {
      const spec = skillLib.getSpecialization(id);
      if (spec) process(spec, `${skill.displayName} > ${spec.displayName}`);
    });
  });

  let clipboardText = 'Skill Keyword Statistics:\n\n';
  Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([kw, count]) => {
      clipboardText += `${kw} (${count}):\n`;
      keywordToSkills[kw]?.sort().forEach((n) => (clipboardText += `  - ${n}\n`));
      clipboardText += '\n';
    });

  let hasUnused = false;
  for (const kw of keywordLookup.keys()) {
    if (!keywordCounts[kw.toLowerCase()]) {
      if (!hasUnused) {
        clipboardText += '\nUnused Keywords (from lookup map but not found on skills/specs):\n';
        hasUnused = true;
      }
      clipboardText += `- ${kw} (Points to: ${keywordLookup.get(kw) || 'N/A'})\n`;
    }
  }

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => triggerCopyAnimation('skillKeywords'))
    .catch((err) => console.error('Failed to copy skill keyword stats to clipboard:', err));
};

// Function to copy skill names & descriptions
const copySkillNamesAndDescriptions = (_event?: Event) => {
  if (!gameState || !gameState.lib?.skills) {
    console.error("GameState or SkillLib not available for skill names and descriptions.");
    return;
  }
  const skillLib = (gameState.lib as any).skills;
  const skillsData = skillLib.getAllSkills();
  let clipboardText = '';
  Object.values(skillsData).forEach((skill: any) => {
    clipboardText += `"${skill.displayName}": "${skill.description}",\n`;
    skill.specializations?.forEach((id: string) => {
      const spec = skillLib.getSpecialization(id);
      if (spec) clipboardText += `  "${spec.displayName}": "${spec.description}",\n`;
    });
  });
  navigator.clipboard.writeText(clipboardText.trim().replace(/,\n$/, '\n'))
    .then(() => triggerCopyAnimation('skillNameDesc'))
    .catch((err) => console.error('Failed to copy skill names and descriptions to clipboard:', err));
};

// Function to copy skill ids
const copySkillIds = (_event?: Event) => {
  if (!gameState || !gameState.lib?.skills) {
    console.error("GameState or SkillLib not available for skill IDs.");
    return;
  }
  const skillLib = (gameState.lib as any).getSkillLib();
  const skillsData = skillLib.getAllSkills();
  let clipboardText = '';
  Object.values(skillsData).forEach((skill: any) => {
    clipboardText += `${skill.id}\n`;
    skill.specializations?.forEach((id: string) => clipboardText += `${id}\n`);
  });
  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => triggerCopyAnimation('skillIds'))
    .catch((err) => console.error('Failed to copy skill IDs to clipboard:', err));
};

// Function to copy gameState
const copyGameStateToClipboard = (_event?: Event) => {
  if (!gameState) {
    console.error("GameState not available");
    return;
  }
  const copy: any = { ...gameState };
  ['connections', 'lib', 'uiState', 'eventProcessor'].forEach((k) => delete copy[k]);
  try {
    navigator.clipboard.writeText(JSON.stringify(copy, null, 2))
      .then(() => triggerCopyAnimation('gameState'))
      .catch((err) => console.error('Failed to copy game state to clipboard:', err));
  } catch (e) {
    console.error('Error serializing game state:', e);
  }
};

// Replace names with ids
const replaceSkillNamesWithIdsInClipboard = async (_event?: Event) => {
  if (!gameState || !gameState.lib?.skills) {
    console.error("GameState or SkillLib not available for replacing names with IDs.");
    triggerCopyAnimation('replaceNamesWithIdsError');
    return;
  }
  try {
    let text = await navigator.clipboard.readText();
    const skillLib = (gameState.lib as any).skills;
    const skillsData = skillLib.getAllSkills();
    const replacements: { search: string; id: string }[] = [];
    Object.values(skillsData).forEach((skill: any) => {
      replacements.push({ search: skill.displayName, id: skill.id });
      skill.specializations?.forEach((id: string) => {
        const spec = skillLib.getSpecialization(id);
        if (spec) replacements.push({ search: spec.displayName, id: spec.id });
      });
    });
    replacements.sort((a, b) => b.search.length - a.search.length);
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    replacements.forEach(({ search, id }) => {
      text = text.replace(new RegExp(`"${escapeRegExp(search)}"`, 'g'), `"${id}"`);
    });
    await navigator.clipboard.writeText(text);
    triggerCopyAnimation('replaceNamesWithIds');
  } catch (err) {
    console.error('Failed to replace skill names with IDs in clipboard:', err);
    triggerCopyAnimation('replaceNamesWithIdsError');
  }
};

// Simplify clipboard text
const simplifyClipboardText = async (_event?: Event) => {
  try {
    let text = await navigator.clipboard.readText();
    text = text.replace(/"([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)"/g, (_m, _w1, w2) => `"${w2}"`);
    await navigator.clipboard.writeText(text);
    triggerCopyAnimation('simplifyClipboard');
  } catch (err) {
    console.error('Failed to simplify clipboard text:', err);
    triggerCopyAnimation('simplifyClipboardError');
  }
};

// Copy character names & bios
const copyCharacterNamesAndBios = (_event?: Event) => {
  if (!gameState || !(gameState.lib as any)?.characters) {
    console.error('GameState, Lib, or CharacterLib not available for character names and bios.');
    triggerCopyAnimation('characterNamesAndBiosError');
    return;
  }
  const characterLib: CharacterLib = (gameState.lib as any).characters;
  let text = '';
  for (const c of characterLib.values()) {
    text += `Name: ${c.name}\n`;
    text += `Bio: ${c.bio || 'N/A'}\n\n`;
  }
  navigator.clipboard.writeText(text.trim())
    .then(() => triggerCopyAnimation('characterNamesAndBios'))
    .catch((err) => {
      console.error('Failed to copy character names and bios to clipboard:', err);
      triggerCopyAnimation('characterNamesAndBiosError');
    });
};

// Clear filters
const clearAllFilters = () => {
  includeFilter.value = '';
  excludeFilter.value = '';
  isIncludeRegexValid.value = true;
  isExcludeRegexValid.value = true;
};
</script> 