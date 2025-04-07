<template>
  <div class="crew-container">
    <!-- Character List Panel (right side) -->
    <div class="character-list">
      <h3>Characters</h3>
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
import { GameState } from '../../logic/GameState'; // Adjusted path
import CharacterList from '../crew/CharacterList.vue'; // Import new component
import CharacterDetails from '../crew/CharacterDetails.vue'; // Import new component

// Inject the game state
const gameState = inject<GameState>('gameState');

// Ref for current hint (remains here)
const currentHint = ref<string | null>(null);

// Computed property to get characters from the reactive uiState
const characters = computed(() => {
  if (!gameState) return [];
  // Make sure the structure matches what CharacterList expects
  return gameState.uiState.characters || []; 
});

// Get the selected character ID from ui state
const selectedCharacterId = computed(() => {
  if (!gameState) return null;
  return gameState.uiState.selectedCharacterId;
});

// Find the selected character object based on ID
// This now also needs the detailed attribute structure for CharacterDetails/CharacterAttributes
const selectedCharacter = computed(() => {
  if (!gameState || !selectedCharacterId.value) return null;
  // Find the character in the potentially simplified list first
  const basicChar = gameState.uiState.characters?.find(char => char.id === selectedCharacterId.value);
  if (!basicChar) return null;

  // We need the fully processed character data including hierarchical attributes
  // Assuming GameState's update loop populates a detailed structure somewhere,
  // or we need to call a processing function here.
  // Let's assume for now `gameState.getProcessedCharacterDetails(id)` exists or adapt later.
  // ** Placeholder: Fetching detailed data might need adjustment based on GameState **
  // For now, let's use the data directly from uiState if it includes attributes
   return gameState.uiState.characters.find(char => char.id === selectedCharacterId.value) || null;
   // If uiState.characters doesn't have the full attribute structure needed by CharacterDetails,
   // we'd need gameState.getCharacterWithProcessedAttributes(selectedCharacterId.value) or similar.
});


// Handler for character selection (remains here)
const selectCharacter = (id: string) => {
  if (gameState) {
    gameState.uiState.selectedCharacterId = id;
    currentHint.value = null; // Reset hint on selection change
  }
};

// Handler for updating the hint (remains here)
const setHint = (hint: string | null) => {
  currentHint.value = hint;
};

</script>

<style scoped>
/* Keep layout styles */
.crew-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #f0f0f0; /* Added background for contrast */
}

/* Character list panel */
.character-list {
  width: 250px; /* Fixed width */
  min-width: 200px; /* Minimum width */
  max-width: 30%; /* Maximum width relative to container */
  border-left: 1px solid #ccc; /* Use a slightly darker border */
  background-color: #f9f9f9;
  padding: 15px; /* Increased padding */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Allow scrolling if list is long */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05); /* Subtle shadow */
  flex-shrink: 0; /* Prevent shrinking */
}

.character-list h3 {
    margin: 0 0 15px 0; /* Adjusted margin */
    padding-bottom: 10px; /* Add padding */
    border-bottom: 1px solid #eee; /* Add border */
    font-size: 1.2em; /* Slightly larger font */
    color: #333; /* Darker color */
}


/* Character details panel */
.character-details {
  flex-grow: 1; /* Take remaining space */
  padding: 20px;
  overflow-y: auto; /* Allow scrolling for long details */
  background-color: #ffffff; /* White background for content */
}

/* Styles previously applied to specific elements inside list/details
   will be moved to their respective component files. */

/* Example of a style that might stay if it applies to the container */
.no-selection, .no-characters { /* These placeholders might now live inside the child components */
  /* display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-style: italic; */
}

</style> 