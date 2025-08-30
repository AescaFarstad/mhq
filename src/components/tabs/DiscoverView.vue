<template>
  <div class="discover-view-container">
  <div class="discover-layout">
    <!-- Skill Browser Panel -->
    <div class="skill-browser-panel">
    <SkillBrowser />
    <!-- Crystal View positioned over skill browser -->
    <CrystalView v-if="showCrystalView" />
    
    <!-- Skill Browser Overlay -->
    <div v-if="!showSkillBrowser" class="skill-browser-overlay fade-overlay">
      <button 
      @click="discoverSkillBrowser"
      class="discovery-button"
      >
      Contemplate skills and specialization
      </button>
    </div>
    </div>
    
    <!-- Inner Cosmos Panel -->
    <div class="crystal-ball-panel">
    <!-- Character XP Bar -->
    <div v-if="protagonistCharacter" class="character-progress-bars">
      <div class="character-xp-bar">
      <span class="character-name">{{ protagonistCharacter.name }} xp:</span>
      <div class="bar-container">
      <ProgressBar 
        :currentProgress="protagonistCharacter.xp.progress" 
        :maxValue="protagonistCharacter.xp.nextLevelDelta" 
        progressLabel="XP"
        progressColor="blue"
        />
      </div>
      </div>
      
      <!-- Inspiration Bar -->
      <div class="character-inspiration-bar">
      <span 
        class="character-name"
        :class="{ 'inspiration-clickable': hasInspirationCharges }"
        @click="toggleCrystalView"
      >
        Inspiration:
      </span>
      <div class="bar-container">
        <ProgressBar 
        :currentProgress="inspirationProgress" 
        :maxValue="inspirationMax" 
        progressLabel=""
        progressColor="purple"
        :disableGainEffect="true"
      />
      </div>
      </div>
    </div>
    
    <ActiveKeywords />
    <div class="discovery-input-wrapper">
      <DiscoveryLog />
      <DiscoveryInput v-if="showInnerCosmos" />
    </div>
    
    <!-- Inner Cosmos Overlay -->
    <div v-if="!showInnerCosmos" class="inner-cosmos-overlay fade-overlay">
      <button 
      @click="discoverInnerCosmos"
      class="discovery-button"
      >
      Talk to inner cosmos
      </button>
    </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { GameState } from '../../logic/GameState';
import { globalInputQueue } from '../../logic/GameState';
import type { CmdDiscover } from '../../logic/input/InputCommands';
import { C } from '../../logic/lib/C';
import SkillBrowser from '../discover/SkillBrowser.vue';
import DiscoveryInput from '../discover/DiscoveryInput.vue';
import DiscoveryLog from '../discover/DiscoveryLog.vue';
import ActiveKeywords from '../discover/ActiveKeywords.vue';
import CrystalView from '../CrystalView.vue';
import ProgressBar from '../shared/ProgressBar.vue';

const gameState = inject<GameState>('gameState');

// Computed properties to check if UI elements are discovered
// Use discoveredItemsCount to ensure reactivity
const showSkillBrowser = computed(() => {
  // Force reactivity by accessing discoveredItemsCount
  gameState?.uiState.discoveredItemsCount;
  return gameState?.discoveredItems.has(C.DISCOVERY_SKILL_BROWSER) ?? false;
});

const showInnerCosmos = computed(() => {
  // Force reactivity by accessing discoveredItemsCount
  gameState?.uiState.discoveredItemsCount;
  return gameState?.discoveredItems.has(C.DISCOVERY_INNER_COSMOS) ?? false;
});

const showCrystalView = computed(() => {
  return gameState?.uiState.showCrystalView ?? false;
});

// Find the protagonist character for the XP bar
const protagonistCharacter = computed(() => {
  return gameState?.uiState.characters.find(char => char.id === gameState.uiState.selectedCharacterId) || 
     gameState?.uiState.characters[0] || null;
});

const inspirationProgress = computed(() => {
  // Force reactivity by accessing the UI state first
  if (!gameState?.uiState) return 0;
  return (gameState.uiState as any)?.inspiration?.progress ?? 0;
});

const inspirationMax = computed(() => {
  // Force reactivity by accessing the UI state first
  if (!gameState?.uiState) return 1;
  return (gameState.uiState as any)?.inspiration?.max ?? 1;
});

// Check if inspiration charges are available for crystal ball interaction
const hasInspirationCharges = computed(() => {
  // Force reactivity by accessing the UI state first
  if (!gameState?.uiState) return false;
  const charges = (gameState.uiState as any)?.inspiration?.charges ?? 0;
  return charges > 0;
});

// Function to toggle crystal view when inspiration is clicked
const toggleCrystalView = () => {
  if (hasInspirationCharges.value && gameState) {
  gameState.uiState.showCrystalView = !gameState.uiState.showCrystalView;
  }
};

// Functions to trigger discovery
const discoverSkillBrowser = () => {
  const command: CmdDiscover = {
  name: "CmdDiscover",
  identifier: C.DISCOVERY_SKILL_BROWSER
  };
  globalInputQueue.push(command);
};

const discoverInnerCosmos = () => {
  const command: CmdDiscover = {
  name: "CmdDiscover",
  identifier: C.DISCOVERY_INNER_COSMOS
  };
  globalInputQueue.push(command);
};
</script>

<style scoped>
.discover-view-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #2c3e50;
  color: #e2e8f0;
}

.discover-layout {
  flex: 1;
  display: flex;
  height: 100%;
}

/* Skill Browser Panel */
.skill-browser-panel {
  flex-shrink: 0;
  width: 600px;
  height: 100%;
  background: #34495e;
  border-right: 1px solid #566a80;
  overflow: hidden;
  position: relative;
}

.crystal-ball-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  background-color: #2c3e50;
  position: relative;
}

.discovery-input-wrapper {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center; /* Center the unified block */
  width: 100%;
}

/* Overlay Styles */
.fade-overlay {
  transition: opacity 2s ease-out;
}

.fade-overlay.v-enter-active,
.fade-overlay.v-leave-active {
  transition: opacity 2s ease-out;
}

.fade-overlay.v-enter-from {
  opacity: 0;
}

.fade-overlay.v-leave-to {
  opacity: 0;
}

.skill-browser-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.inner-cosmos-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}


.character-progress-bars {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 10px;
  padding: 2px 12px;
  background: rgba(52, 73, 94, 0.3);
}

/* Character XP Bar Styles */
.character-xp-bar {
  display: contents; /* Makes children participate in parent grid */
}

/* Character Inspiration Bar Styles */
.character-inspiration-bar {
  display: contents; /* Makes children participate in parent grid */
}

.character-name {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  text-align: left;
  align-self: center;
}

.inspiration-clickable {
  color: #3498db !important;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.inspiration-clickable:hover {
  color: #5dade2 !important;
}

.bar-container {
  min-width: 200px;
  align-self: center;
}

/* Discovery Button Styles */
.discovery-button {
  padding: 20px 40px;
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
  border: 2px solid #566a80;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.discovery-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border-color: #7fb3d3;
  background: linear-gradient(135deg, #3d566e 0%, #34495e 100%);
}

.discovery-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style> 