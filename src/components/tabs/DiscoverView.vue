<template>
  <div class="discover-view-container">
    <div class="discover-layout">
      <div class="skill-browser-panel">
        <SkillBrowser />
        <!-- Crystal View positioned over skill browser -->
        <CrystalView v-if="showCrystalView" />
      </div>
      <div class="crystal-ball-panel">
        <ActiveKeywords />
        <div class="discovery-input-wrapper">
          <DiscoveryLog />
          <DiscoveryInput />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { GameState } from '../../logic/GameState';
import SkillBrowser from '../discover/SkillBrowser.vue';
import DiscoveryInput from '../discover/DiscoveryInput.vue';
import DiscoveryLog from '../discover/DiscoveryLog.vue';
import ActiveKeywords from '../discover/ActiveKeywords.vue';
import CrystalView from '../CrystalView.vue';

const gameState = inject<GameState>('gameState');

const showCrystalView = computed(() => {
  return gameState?.uiState.showCrystalView ?? false;
});
</script>

<style scoped>
.discover-view-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.discover-layout {
  flex: 1;
  display: flex;
  height: 100%;
}

.skill-browser-panel {
  flex-shrink: 0; /* Don't shrink, use only needed space */
  height: 100%;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  overflow: hidden;
  position: relative; /* Enable positioning for CrystalView */
}

.crystal-ball-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.discovery-input-wrapper {
  margin-top: auto; /* Push to bottom */
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style> 