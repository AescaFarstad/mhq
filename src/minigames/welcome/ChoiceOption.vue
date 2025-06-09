<template>
  <div class="choice-wrapper" 
       @mouseover="handleMouseOver" 
       @mouseleave="handleMouseLeave" 
       :class="{ 'hovered': hovered, 'can-select': canBeSelected }" 
       @click="selectOptionIfPossible">
    <div class="choice-option">
      <div class="card-header">
        <img :src="'img/' + imageName" :alt="name" class="choice-image"/>
        <div class="progress-bar-container" v-if="isExploring">
          <div class="progress-bar" :style="{ width: (explorationProgress * 100) + '%' }"></div>
        </div>
        <h3>{{ name }}</h3>
      </div>
      <div class="details">
        <div class="pros">
          <h4 v-if="areProsConsTitlesVisible">Pros:</h4>
          <ul v-if="areProsConsTitlesVisible">
            <li v-for="(pro, index) in pros" :key="'pro-' + index">{{ pro }}</li>
          </ul>
        </div>
        <div class="cons">
          <h4 v-if="areProsConsTitlesVisible">Cons:</h4>
          <ul v-if="areProsConsTitlesVisible">
            <li v-for="(con, index) in cons" :key="'con-' + index">{{ con }}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- New button container outside the card -->
    <transition name="slide">
      <div class="button-container" v-if="!canBeSelected && !isExploring">
        <button @click.stop="emitExplore" class="explore-button">
          Explore
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  id: string;
  name: string;
  imageName: string;
  pros: string[]; // These will be the revealed pros
  cons: string[]; // These will be the revealed cons
  description?: string;
  isExploring: boolean;
  explorationProgress: number;
  canBeSelected: boolean;
  areProsConsTitlesVisible: boolean;
  nameObfuscationPercentage: number; 
}>();

const emit = defineEmits(['selected', 'mouseenter-choice', 'mouseleave-choice', 'explore']);

const hovered = ref(false);

const selectOptionIfPossible = () => {
  if (props.canBeSelected) {
    emit('selected', props.id);
  }
};

const emitExplore = () => {
  emit('explore', props.id);
};

const handleMouseOver = () => {
  hovered.value = true;
  emit('mouseenter-choice', props.description);
};

const handleMouseLeave = () => {
  hovered.value = false;
  emit('mouseleave-choice');
};
</script>

<style scoped>
.choice-wrapper {
  padding: 0;
  margin: 10px;
  cursor: default;
  transition: background-color 0.3s, transform 0.3s;
  width: 360px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.choice-wrapper.can-select {
  cursor: pointer;
}

.choice-wrapper.hovered.can-select {
  transform: translateY(-5px);
}

.choice-option {
  background-color: #ffffff;
  border-radius: 10px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #bcccdc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  position: relative;
  z-index: 2;
}

.choice-wrapper.hovered.can-select .choice-option {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-header {
  width: 100%;
  height: 300px;
  position: relative;
  top:-1px;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.card-header .choice-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.card-header .progress-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px; /* Matching h3's new fixed height */
  background-color: #e0e0e0;
  z-index: 0;
  overflow: hidden;
}

.card-header .progress-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.1s linear;
}

.card-header h3 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 10px;
  font-size: 1.6em;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  text-align: center;
  z-index: 1;
  height: 64px; /* New fixed height */
  box-sizing: border-box; /* Ensures padding is included in the height */
  display: flex;
  align-items: center;
  justify-content: center;
}

.details {
  padding: 20px; /* Restored original padding */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to start for vertical layout */
  width: 100%;
  font-size: 0.95em; /* Restored original font size */
  flex-grow: 1;
  justify-content: flex-start; /* Allow content to flow from top */
}

.pros {
  width: 100%; /* Full width for vertical stacking */
  margin-bottom: 10px; /* Original margin */
  text-align: left;
  min-height: 100px; /* Original min-height to reserve space */
}

.cons {
  width: 100%; /* Full width for vertical stacking */
  margin-bottom: 10px; /* Original margin */
  text-align: left;
  min-height: 80px; /* Original min-height to reserve space */
}

.pros:last-child, .cons:last-child { /* This might not be needed if stacking*/
  margin-bottom: 0;
}

.pros h4, .cons h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1.2em; /* Original font size */
  color: #555;     /* Original color */
  text-align: left;
}

.pros ul, .cons ul {
  list-style-position: inside;
  padding-left: 0;
  text-align: left;
  margin: 0;
}

.pros li, .cons li {
  margin-bottom: 5px; /* Original margin */
  font-size: 1em; /* Ensuring li font size relative to .details or default */
}

.pros li {
  color: #28a745;
}

.cons li {
  color: #dc3545;
}

.button-container {
  width: 80%; /* Narrower than the card */
  margin: 0 auto; /* Center it */
  background-color: #ffffff; /* Same color as card */
  border: 1px solid #bcccdc; /* Same border as card */
  border-top: none; /* No top border since it's attached to card */
  border-radius: 0 0 10px 10px; /* Only rounded bottom edges */
  display: flex;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  /* Add shadow effect to simulate receiving shadow from card above */
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
}

.choice-wrapper.hovered.can-select .button-container {
  box-shadow: inset 0 8px 16px rgba(0, 0, 0, 0.2);
}

.explore-button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.explore-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.explore-button:hover:not(:disabled) {
  background-color: #0056b3;
}

/* Slide transition animations */
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-enter-to, .slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style> 