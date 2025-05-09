<template>
  <div 
    :class="['character-item', { 'selected': isSelected }]"
    @click="$emit('select')"
  >
    <div class="char-name">{{ character.name }}</div>
    <div class="char-stats">
      <span class="char-level">Level {{ character.level }}</span>
      <span class="char-upkeep">Upkeep: {{ character.upkeep.toFixed(1) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { SimpleCharacterInfo } from '../../types/uiTypes';

defineProps({
  character: {
    type: Object as PropType<SimpleCharacterInfo>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['select']);
</script>

<style scoped>
/* Styles moved from CrewView.vue for individual list items */
.character-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 12px; /* Slightly increased padding */
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Subtle shadow */
}

.character-item:hover {
  background-color: #f0f7ff;
  border-color: #a0c0ff;
  transform: translateY(-1px); /* Slight lift effect */
  box-shadow: 0 2px 4px rgba(0,0,0,0.07); /* Increased shadow on hover */
}

.character-item.selected {
  background-color: #e0f0ff;
  border-color: #70a0ff;
  box-shadow: 0 0 5px rgba(100, 150, 255, 0.3); /* Highlight shadow */
  transform: translateY(0); /* Reset transform */
}

.char-name {
  font-weight: bold;
  margin-bottom: 5px; /* Increased spacing */
  color: #333;
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis if name is too long */
}

.char-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #555; /* Slightly darker grey */
}

.char-level {
    /* Specific styles for level if needed */
}

.char-upkeep {
    /* Specific styles for upkeep if needed */
}
</style>
