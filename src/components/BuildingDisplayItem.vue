<template>
  <div class="building-item">
    <h4>{{ gameState && gameState.isDiscovered(building.id) ? building.name : obfuscateString(building.name) }}</h4>
    <p>{{ building.description }}</p>
    <p>Clutter: {{ building.clutterPerSecond }}/s</p>
    <button v-if="showConstructButton" @click="constructBuilding">Construct</button>
  </div>
</template>

<script setup lang="ts">
import type { BuildingDefinition } from '../logic/lib/definitions/BuildingDefinition';
import { globalInputQueue, GameState } from '../logic/GameState';
import type { CmdConstructBuilding } from '../logic/input/InputCommands';
import { obfuscateString } from '../utils/stringUtils';
import { inject } from 'vue';

interface Props {
  building: BuildingDefinition;
  isConstructed: boolean;
}

const props = defineProps<Props>();

const gameState = inject<GameState>('gameState');

const showConstructButton = !props.isConstructed;

function constructBuilding() {
  if (!props.isConstructed) {
    const command: CmdConstructBuilding = {
      name: 'CmdConstructBuilding',
      buildingId: props.building.id,
    };
    globalInputQueue.push(command);
  }
}
</script>

<style scoped>
.building-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style> 