<template>
  <div v-if="visible" class="tooltip-bubble" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, toRefs, type PropType, type CSSProperties } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  targetElement: {
    type: Object as PropType<HTMLElement | null>,
    default: null,
  },
});

const { visible, targetElement } = toRefs(props);
const style = ref<CSSProperties>({});

watchEffect(() => {
  if (visible.value && targetElement.value) {
    const rect = targetElement.value.getBoundingClientRect();
    style.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.bottom + 5}px`, // Position below the target element
      zIndex: '1000', // Ensure it's above other elements
    };
  } else {
    style.value = {};
  }
});

</script>

<style scoped>
.tooltip-bubble {
  background-color: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  white-space: nowrap; /* Keep tooltip content on one line */
}
</style> 