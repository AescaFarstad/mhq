<template>
  <transition-group appear name="slide-from-right" tag="div" class="ingress-word-columns-container">
    <IngressWordColumn
      v-for="column in columns"
      :key="column.title"
      :title="column.title"
      :words="column.words"
      class="word-column"
      @word-hover="$emit('word-hover', $event)"
      @word-leave="$emit('word-leave')"
      :any-badge-hovered="anyBadgeHovered"
    />
  </transition-group>
</template>

<script setup lang="ts">
import IngressWordColumn from './IngressWordColumn.vue';
import type { SubmittedWord } from '../IngressTypes';

defineProps<{
  columns: {
    title: string;
    words: (SubmittedWord | string)[];
  }[];
  anyBadgeHovered: boolean;
}>();

defineEmits(['word-hover', 'word-leave']);
</script>

<style scoped>
.ingress-word-columns-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  gap: 15px; /* Space between columns */
  flex-shrink: 0; /* Prevent from shrinking */
  box-sizing: border-box;
}

.word-column {
  width: 220px;
}

.slide-from-right-enter-active,
.slide-from-right-leave-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  opacity: 0;
  transform: translateX(120%) rotate(15deg);
}
</style> 