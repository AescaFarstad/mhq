<template>
  <div class="crew-container">
    <!-- Character List Panel (right side) -->
    <div class="character-list">
      <CharacterList
        :characters="characters"
        :selected-character-id="selectedCharacterId"
        @select-character="selectCharacter"
      />
    </div>

    <!-- Character Details Panel (main content area) -->
    <div class="character-details">
       <CharacterDetails
         :selected-character="selectedCharacter"
         :current-hint="currentHint"
         @set-hint="setHint" 
       />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import { GameState } from '../../logic/GameState';
import CharacterList from '../crew/CharacterList.vue';
import CharacterDetails from '../crew/CharacterDetails.vue';

const gameState = inject<GameState>('gameState');

const currentHint = ref<string | null>(null);

const characters = computed(() => {
  if (!gameState) return [];
  return gameState.uiState.characters || []; 
});

const selectedCharacterId = computed(() => {
  if (!gameState) return null;
  return gameState.uiState.selectedCharacterId;
});

const selectedCharacter = computed(() => {
  if (!gameState || !selectedCharacterId.value) return null;
  return gameState.uiState.characters.find(char => char.id === selectedCharacterId.value) || null;
});


const selectCharacter = (id: string) => {
  if (gameState) {
    gameState.uiState.selectedCharacterId = id;
    currentHint.value = null; 
  }
};

const setHint = (hint: string | null) => {
  currentHint.value = hint;
};

</script>

<style scoped>
.crew-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #f0f0f0;
}

.character-list {
  width: 250px;
  min-width: 200px;
  max-width: 30%;
  border-left: 1px solid #ccc;
  background-color: #f9f9f9;
  padding: 5px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.character-list h3 {
    margin: 0 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    font-size: 1.2em;
    color: #333;
}

.character-details {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #ffffff;
}

/* Styles previously applied to specific elements inside list/details
   will be moved to their respective component files. */

</style> 