<template>
  <div class="attributes-section">
    <h4>Attributes</h4>
    <div v-if="!attributes || attributes.length === 0" class="no-attribute-data">
      No attribute data available.
    </div>
    <div v-else class="attribute-categories">
      <div 
        v-for="category in attributes" 
        :key="category.key" 
        class="attribute-category"
        @mouseenter="$emit('set-hint', category.description || null)"
        @mouseleave="$emit('set-hint', null)"
      >
        <div 
          class="category-header"
          @mouseenter="$emit('set-hint', category.description || null)" 
          @mouseleave="$emit('set-hint', null)" 
        >
          <span class="category-name">{{ category.displayName }}</span>
          <span class="category-value">{{ formatValue(category.value) }}</span>
        </div>
        <div class="secondary-attributes">
          <div 
            v-for="attribute in category.attributes" 
            :key="attribute.key" 
            class="attribute-row" 
            :class="{ 'highlighted': currentHint === attribute.description }"
            @mouseenter="$emit('set-hint', attribute.description || null)"
            @mouseleave="$emit('set-hint', null)"
          >
            <span class="attribute-name">{{ attribute.displayName }}</span>
            <span class="attribute-value">{{ formatValue(attribute.value) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { AttributeCategoryUIInfo } from '../../types/uiTypes';

defineProps({
  attributes: {
    type: Array as PropType<AttributeCategoryUIInfo[]>,
    required: true
  },
  currentHint: {
    type: String as PropType<string | null>,
    default: null
  }
});

defineEmits(['set-hint']);

// Helper function to format attribute values (e.g., numbers)
const formatValue = (value: number | string): string => {
  if (typeof value === 'number') {
    // Example: Format numbers to 1 decimal place if they have decimals
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  return value.toString();
};
</script>

<style scoped>
/* Styles moved/adapted from CrewView.vue for attributes */
.attributes-section {
  margin-top: 25px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.attributes-section h4 {
  margin-bottom: 15px;
  font-size: 1.2em; /* Slightly larger heading */
  color: #333;
}

.no-attribute-data {
    color: #888;
    font-style: italic;
}

.attribute-categories {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

.attribute-category {
  border: 1px solid #e0e0e0;
  border-radius: 5px; /* Slightly more rounded */
  background-color: #fdfdfd;
  transition: all 0.2s ease;
  position: relative; /* For hover effects/tooltips if added later */
  flex-grow: 1; /* Allow category to grow */
  min-width: 180px; /* Prevent becoming too narrow */
}

.attribute-category:hover {
  background-color: #f8faff; /* Lighter blue */
  border-color: #c0d8ff; /* Slightly lighter border */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06); /* Subtle shadow on hover */
}

.category-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  padding-top: 12px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
  cursor: default; /* Indicate it provides info on hover */
}

.category-name {
    color: #2c3e50; /* Darker blue/grey */
    flex-grow: 1;
}

.category-value {
    color: #0056b3; /* Blue for primary value */
    font-size: 1.05em;
    margin-left: 10px;
    text-align: right;
    white-space: nowrap;
}

.secondary-attributes {
  padding-bottom: 12px;
}

.attribute-row {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  padding: 5px 15px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  cursor: default; /* Indicate it provides info on hover */
}

.attribute-row:last-child {
  /* margin-bottom: 0; */ /* No longer needed */
}

.attribute-row.highlighted {
  background-color: #eaf4ff; /* Lighter, less intense highlight */
  color: #333; /* Ensure text remains readable */
}

/* Make highlighted row text slightly bolder */
.attribute-row.highlighted .attribute-name,
.attribute-row.highlighted .attribute-value {
  /* font-weight: 500; */ /* Optional: subtle bolding */
}

.attribute-name {
  color: #444; /* Slightly darker text */
  flex-grow: 1;
}

.attribute-value {
  color: #333; /* Standard text color for secondary values */
  font-weight: 500; /* Medium weight */
  margin-left: 10px;
  text-align: right;
  white-space: nowrap;
}
</style>
