<template>
  <div class="tab-content">
    <div class="button-container">
      <button @click="copySkillsToClipboard(false, $event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'basic' }">Skills (Basic)</button>
      <button @click="copySkillsToClipboard(true, $event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributes' }">Skills (With Attributes)</button>
      <button @click="copyAttributesToClipboard($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributesCopy' }">Attributes</button>
      <button @click="copyAttributeSkillStats($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'attributeStats' }">Attribute Skill Stats</button>
      <button @click="copyAllSkillNames($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillNames' }">Skill Names</button>
      <button @click="copySkillKeywordStats($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillKeywords' }">Skill Keyword Stats</button>
      <button @click="copyKeywordOverview($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'keywordOverview' }">Keyword Overview</button>
      <button @click="copySkillNamesAndDescriptions($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillNameDesc' }">Skill Names & Descriptions</button>
      <button @click="copySkillIds($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'skillIds' }">Skill IDs</button>
      <button @click="copyGameStateToClipboard($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'gameState' }">Game State (JSON)</button>
      <button @click="replaceSkillNamesWithIdsInClipboard($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'replaceNamesWithIds' }">Replace Names with IDs</button>
      <button @click="simplifyClipboardText($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'simplifyClipboard' }">Simplify Clipboard Text</button>
      <button @click="copyCharacterNamesAndBios($event)" class="action-btn" :class="{ 'copy-success': copyAnimationButton === 'characterNamesAndBios' }">Character Names & Bios</button>
    </div>
    
    <!-- Display area for copied content -->
    <div v-if="displayedContent" class="content-display">
      <div class="content-header">
        <h3>{{ displayedContentTitle }}</h3>
        <button @click="clearDisplayedContent" class="clear-content-btn">Clear</button>
      </div>
      <pre class="content-text">{{ displayedContent }}</pre>
    </div>
    
    <div v-else class="no-content-message">
      <p>Click any copy button above to display its content here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { GameState } from '../../logic/GameState';
import { CharacterLib } from '../../logic/lib/CharacterLib';

const gameState = inject<GameState>('gameState');

// Animation state
const copyAnimationButton = ref<string | null>(null);
const triggerCopyAnimation = (buttonId: string) => {
  copyAnimationButton.value = buttonId;
  setTimeout(() => (copyAnimationButton.value = null), 1000);
};

// Content display state
const displayedContent = ref<string>('');
const displayedContentTitle = ref<string>('');

// Helper function to display content
const displayContent = (content: string, title: string) => {
  displayedContent.value = content;
  displayedContentTitle.value = title;
};

// Clear displayed content
const clearDisplayedContent = () => {
  displayedContent.value = '';
  displayedContentTitle.value = '';
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
    .then(() => {
      triggerCopyAnimation(includeAttributes ? 'attributes' : 'basic');
      displayContent(clipboardText, includeAttributes ? 'Skills (With Attributes)' : 'Skills (Basic)');
    })
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
    .then(() => {
      triggerCopyAnimation('attributesCopy');
      displayContent(clipboardText, 'Attributes');
    })
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
    .then(() => {
      triggerCopyAnimation('attributeStats');
      displayContent(clipboardText.trim(), 'Attribute Skill Stats');
    })
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
    .then(() => {
      triggerCopyAnimation('skillNames');
      displayContent(clipboardText.trim(), 'Skill Names');
    })
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
    .then(() => {
      triggerCopyAnimation('skillKeywords');
      displayContent(clipboardText.trim(), 'Skill Keyword Stats');
    })
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
  const finalText = clipboardText.trim().replace(/,\n$/, '\n');
  navigator.clipboard.writeText(finalText)
    .then(() => {
      triggerCopyAnimation('skillNameDesc');
      displayContent(finalText, 'Skill Names & Descriptions');
    })
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
    .then(() => {
      triggerCopyAnimation('skillIds');
      displayContent(clipboardText.trim(), 'Skill IDs');
    })
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
    const jsonText = JSON.stringify(copy, null, 2);
    navigator.clipboard.writeText(jsonText)
      .then(() => {
        triggerCopyAnimation('gameState');
        displayContent(jsonText, 'Game State (JSON)');
      })
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
    displayContent(text, 'Replace Names with IDs');
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
    displayContent(text, 'Simplify Clipboard Text');
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
  const finalText = text.trim();
  navigator.clipboard.writeText(finalText)
    .then(() => {
      triggerCopyAnimation('characterNamesAndBios');
      displayContent(finalText, 'Character Names & Bios');
    })
    .catch((err) => {
      console.error('Failed to copy character names and bios to clipboard:', err);
      triggerCopyAnimation('characterNamesAndBiosError');
    });
};

// Function to copy keyword overview
const copyKeywordOverview = (_event?: Event) => {
  if (!gameState || !gameState.lib?.skills) {
    console.error("GameState or SkillLib not available for keyword overview");
    return;
  }
  const skillLib = (gameState.lib as any).skills;
  const skillsData = skillLib.getAllSkills();

  const uniqueKeywords = new Set<string>();
  const skillSpecKeywordCounts: Record<string, number> = {};
  let totalKeywords = 0;
  let totalSkillsSpecs = 0;

  Object.values(skillsData).forEach((skill: any) => {
    const processItem = (item: any, name: string) => {
      totalSkillsSpecs++;
      let keywordCount = 0;
      
      if (item.keywords) {
        const flatKeywords = item.keywords.flat();
        keywordCount = flatKeywords.length;
        totalKeywords += keywordCount;
        
        flatKeywords.forEach((kw: string) => {
          uniqueKeywords.add(kw.toLowerCase());
        });
      }
      
      skillSpecKeywordCounts[name] = keywordCount;
    };

    processItem(skill, skill.displayName);
    
    skill.specializations?.forEach((id: string) => {
      const spec = skillLib.getSpecialization(id);
      if (spec) {
        processItem(spec, `${skill.displayName} > ${spec.displayName}`);
      }
    });
  });

  const avgKeywordsPerSkillSpec = totalSkillsSpecs > 0 ? (totalKeywords / totalSkillsSpecs).toFixed(2) : '0';

  let clipboardText = `Total Keywords: ${totalKeywords}\n`;
  clipboardText += `Total Unique Keywords: ${uniqueKeywords.size}\n`;
  clipboardText += `Average Keywords per Skill/Spec: ${avgKeywordsPerSkillSpec}\n`;
  clipboardText += `Total Skills/Specs: ${totalSkillsSpecs}\n\n`;
  
  Object.entries(skillSpecKeywordCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([name, count]) => {
      clipboardText += `${name}:\t${count}\n`;
    });

  navigator.clipboard.writeText(clipboardText.trim())
    .then(() => {
      triggerCopyAnimation('keywordOverview');
      displayContent(clipboardText.trim(), 'Keyword Overview');
    })
    .catch((err) => console.error('Failed to copy keyword overview to clipboard:', err));
};

</script> 