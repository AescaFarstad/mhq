<template>
  <div class="castle-view-container">
    <h3>Castle View</h3>
    <div class="columns">
      <div class="column">
        <h4>Constructed Buildings</h4>
        <div class="building-grid">
          <BuildingDisplayItem
            v-for="building in constructedBuildings"
            :key="building.id"
            :building="building"
            :isConstructed="true"
          />
        </div>
        <p v-if="constructedBuildings.length === 0">No buildings constructed yet.</p>
      </div>
      <div class="column">
        <h4>Available Buildings</h4>
        <div class="building-grid">
          <BuildingDisplayItem
            v-for="building in availableBuildings"
            :key="building.id"
            :building="building"
            :isConstructed="false"
          />
        </div>
        <p v-if="availableBuildings.length === 0">All available buildings have been constructed.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent as _defineComponent } from "vue";
import { computed, inject } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { BuildingDefinition } from '../../logic/lib/definitions/BuildingDefinition';
import BuildingDisplayItem from "../BuildingDisplayItem.vue";

const gameState = inject<GameState>('gameState');

const allBuildingDefinitions = computed<BuildingDefinition[]>(() => {
  if (!gameState || !gameState.lib.buildings.isLoaded) {
    return [];
  }
  return Array.from(gameState.lib.buildings.values());
});

const constructedBuildingIds = computed<Set<string>>(() => {
  if (!gameState || !gameState.uiState) {
    return new Set();
  }
  return gameState.uiState.constructedBuildingIds;
});

const availableBuildings = computed<BuildingDefinition[]>(() => {
  return allBuildingDefinitions.value.filter(
    (def) => !constructedBuildingIds.value.has(def.id)
  );
});

const constructedBuildings = computed<BuildingDefinition[]>(() => {
  return allBuildingDefinitions.value.filter(
    (def) => constructedBuildingIds.value.has(def.id)
  );
});

</script>

<style scoped>
.castle-view-container {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h3 {
  margin-bottom: 20px;
  text-align: center;
  flex-shrink: 0;
}

.columns {
  display: flex;
  justify-content: space-around;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.column {
  width: 45%;
}

.column h4 {
  text-align: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.building-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsive grid */
  gap: 10px;
}

p {
  margin-top: 10px;
  text-align: center;
  font-style: italic;
}
</style> 