<template>
  <div class="stage-one-container">
    <p class="stage-text">We've established a telepathic link to a new world—one with <b>magic</b>.</p>
    <p class="stage-text">To tap into this power, we need a stable gateway built from both sides.</p>
    <p class="stage-text">The plan: possses an isolated guild master who has the necessary infrastructure.</p>
    <p class="stage-text">Several candidates exist across different regions. Choose the region.</p>
    <div class="choices-container">
      <ChoiceOption
        v-for="choice in choices"
        :key="choice.id"
        :id="choice.id"
        :name="choice.nameObfuscationPercentage > 0 ? obfuscateString(choice.name, choice.nameObfuscationPercentage) : choice.name"
        :imageName="choice.imageName"
        :atlasName="choice.atlasName"
        :pros="choice.pros.slice(0, choice.revealedProsCount)"
        :cons="choice.cons.slice(0, choice.revealedConsCount)"
        :description="choice.description" 
        :isExploring="choice.isExploring"
        :explorationProgress="choice.explorationProgress" 
        :canBeSelected="choice.canBeSelected"
        :areProsConsTitlesVisible="choice.areProsConsTitlesVisible" 
        :nameObfuscationPercentage="choice.nameObfuscationPercentage"
        @selected="handleChoiceSelected(choice.id)" 
        @explore="handleStartExploration(choice.id)" 
        @mouseenter-choice="handleChoiceHover(choice)" 
        @mouseleave-choice="handleChoiceLeave" 
      />
    </div>
    <div class="hovered-description-container">
      <p v-if="currentDescription">{{ currentDescription }}</p>
      <p v-else>&nbsp;</p> <!-- Ensure space is reserved -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import ChoiceOption from './ChoiceOption.vue';
import type { ExplorableWelcomeChoice } from './WelcomeGame';
import { obfuscateString } from '../../utils/stringUtils'; // For obfuscating description

const props = defineProps<{
  explorableChoices: ExplorableWelcomeChoice[];
}>();

const emit = defineEmits<{
  (e: 'choiceMade', choiceId: string): void; // Emit ID, parent will get full object
  (e: 'startExploration', choiceId: string): void;
}>();

const choices = computed(() => props.explorableChoices);
const currentHoveredChoiceId = ref<string | null>(null);

const currentDescription = computed(() => {
  if (!currentHoveredChoiceId.value) {
    return null;
  }
  const hoveredChoice = choices.value.find(c => c.id === currentHoveredChoiceId.value);
  if (hoveredChoice && hoveredChoice.isDescriptionVisible) {
    return hoveredChoice.descriptionObfuscationPercentage > 0 && hoveredChoice.description
           ? obfuscateString(hoveredChoice.description, hoveredChoice.descriptionObfuscationPercentage)
           : hoveredChoice.description || null;
  }
  return null;
});

const handleChoiceSelected = (choiceId: string) => {
  const selectedChoice = choices.value.find(c => c.id === choiceId);
  if (selectedChoice && selectedChoice.canBeSelected) {
    emit('choiceMade', choiceId);
  }
  // If not canBeSelected, click does nothing as per requirements
};

const handleStartExploration = (choiceId: string) => {
  emit('startExploration', choiceId);
};

const handleChoiceHover = (choice: ExplorableWelcomeChoice) => {
  currentHoveredChoiceId.value = choice.id;
  // The currentDescription will now update automatically via the computed property
};

const handleChoiceLeave = () => {
  currentHoveredChoiceId.value = null;
  // The currentDescription will now update automatically via the computed property
};

</script>

<style scoped>
.stage-one-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-width: 70%;
  min-height: 80%;
  max-width: 1200px; /* Added max-width for very large screens */
  margin: 20px auto; /* Added top/bottom margin and ensured centering */
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f0f0f0;
  color: #000;
}

.stage-text {
  font-size: 1.0em;
  margin-bottom: 0.5em; /* Adjusted for spacing, original was 20px */
  text-align: center;
}

.stage-text:first-of-type {
  font-size: 1.2em; /* Larger font size for the first line */
  margin-bottom: 1.2em; /* More space after the larger first line */
}

.stage-text:last-of-type {
  margin-bottom: 20px; /* Keep original bottom margin for the last paragraph before choices */
}

.choices-container {
  display: flex;
  justify-content: space-around; /* Distribute choices evenly */
  align-items: flex-start; /* Align items to the top */
  flex-wrap: wrap; /* Allow wrapping if choices exceed container width */
  width: 100%;
  margin-bottom: 20px; /* Add margin to separate from description area */
}

.hovered-description-container {
  width: 100%;
  min-height: 60px; /* Reserve space for description (adjust as needed) */
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 1em;
  color: #333;
  box-sizing: border-box;
}

.hovered-description-container p {
  margin: 0;
}
</style> 