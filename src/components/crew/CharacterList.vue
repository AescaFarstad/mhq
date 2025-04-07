<template>
  <div v-if="!characters || characters.length === 0" class="no-characters">
    No characters available.
  </div>
  <div v-else class="character-items">
    <CharacterListItem
      v-for="character in characters"
      :key="character.id"
      :character="character"
      :is-selected="character.id === selectedCharacterId"
      @select="$emit('select-character', character.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import CharacterListItem from './CharacterListItem.vue';
import { SimpleCharacterInfo } from '../../types/uiTypes'; // Import shared type

// Define props
defineProps({
  characters: {
    type: Array as PropType<SimpleCharacterInfo[]>, // Use imported type
    required: true,
  },
  selectedCharacterId: {
    type: String as PropType<string | null>,
    default: null,
  },
});

// Define emits
defineEmits(['select-character']);
</script>

<style scoped>
.character-items {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Space between items */
  overflow-y: auto; /* Allows scrolling if needed */
  padding-right: 5px; /* Avoid scrollbar overlapping content */
}

.no-characters {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* Give it some height */
  color: #888;
  font-style: italic;
  text-align: center;
}
</style>
