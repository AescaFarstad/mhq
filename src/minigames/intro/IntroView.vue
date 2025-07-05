<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { inject, computed } from 'vue';
import type { GameState } from '../../logic/GameState';
import type { IntroState } from './IntroGame';
import { IntroGame } from './IntroGame';

const gameState = inject<GameState>('gameState');

// State for managing background transitions
const isTransitioning = ref(false);
const currentBackgroundImage = ref<string | null>(null);
const previousBackgroundImage = ref<string | null>(null);

const minigameState = computed(() => {
  if (gameState?.activeMinigame?.type === 'Intro' && gameState.uiState.activeMinigameState) {
    const state = gameState.uiState.activeMinigameState as IntroState;
    // Force tracking of all state properties by accessing them for reactivity
    // @ts-ignore - These variables are used to establish reactive dependencies
    const historyLength = state.dialogHistory?.length || 0;
    // @ts-ignore - These variables are used to establish reactive dependencies  
    const currentText = state.currentText;
    // @ts-ignore - These variables are used to establish reactive dependencies
    const currentChoices = state.currentChoices;
    // @ts-ignore - These variables are used to establish reactive dependencies
    const isWaitingForChoice = state.isWaitingForChoice;
    // @ts-ignore - These variables are used to establish reactive dependencies
    const backgroundImage = state.backgroundImage;
    // @ts-ignore - These variables are used to establish reactive dependencies
    const isEnded = state.isEnded;
    // @ts-ignore - These variables are used to establish reactive dependencies
    const isEnding = state.isEnding;
    // @ts-ignore - These variables are used to establish reactive dependencies
    const endingStartTime = state.endingStartTime;
    
    return state;
  }
  return null;
});

// Create a direct computed for dialog history
const dialogHistory = computed(() => {
  const state = gameState?.uiState.activeMinigameState as IntroState;
  if (state?.dialogHistory) {
    return state.dialogHistory;
  }
  return [];
});

// Watch for background image changes to trigger transitions
watch(() => minigameState.value?.backgroundImage, (newImage, oldImage) => {
  if (newImage && newImage !== oldImage && oldImage) {
    // Start transition
    previousBackgroundImage.value = oldImage;
    currentBackgroundImage.value = newImage;
    isTransitioning.value = true;
    
    // End transition after 20 seconds
    setTimeout(() => {
      isTransitioning.value = false;
      previousBackgroundImage.value = null;
    }, 20000);
  } else if (newImage && !oldImage) {
    // First image load, no transition needed
    currentBackgroundImage.value = newImage;
  }
}, { immediate: true });

// Create computed styles for separate background layers
const oldBackgroundStyle = computed(() => {
  const baseUrl = import.meta.env.BASE_URL;
  if (isTransitioning.value && previousBackgroundImage.value) {
    const imagePath = `${baseUrl}img/${previousBackgroundImage.value}`;
    return { 
      backgroundImage: `url("${imagePath}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }
  return {};
});

const newBackgroundStyle = computed(() => {
  const baseUrl = import.meta.env.BASE_URL;
  const activeImage = currentBackgroundImage.value || minigameState.value?.backgroundImage;
  if (activeImage) {
    const imagePath = `${baseUrl}img/${activeImage}`;
    return { 
      backgroundImage: `url("${imagePath}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }
  return {};
});

const introGame = computed(() => {
  if (gameState?.activeMinigame?.type === 'Intro') {
    return gameState.activeMinigame as IntroGame;
  }
  return null;
});

const handleChoice = (choiceId: string) => {
  introGame.value?.makeChoice(choiceId);
};

// Reactive current time for ending animation
const currentTime = ref(Date.now());

// Computed properties for ending sequence
const endingProgress = computed(() => {
  if (!minigameState.value?.isEnding || !minigameState.value?.endingStartTime) {
    return 0;
  }
  const elapsed = currentTime.value - minigameState.value.endingStartTime;
  return Math.min(elapsed / 15000, 1); // Progress from 0 to 1 over 15 seconds (5 sec wait + 5 sec blur + 5 sec for text)
});

const shouldShowTheEnd = computed(() => {
  return minigameState.value?.isEnding && endingProgress.value > 0.67; // Show after blur completes (after 10 seconds)
});

const endingBlurAmount = computed(() => {
  if (!minigameState.value?.isEnding) return 0;
  
  // Wait 5 seconds (progress 0 to 0.33), then blur over the next 5 seconds (progress 0.33 to 0.67)
  if (endingProgress.value < 0.33) return 0; // No blur during wait
  if (endingProgress.value > 0.67) return 8; // Full blur after blur phase
  
  const blurProgress = (endingProgress.value - 0.33) / 0.34; // Maps 0.33-0.67 to 0-1
  return blurProgress * 8; // Blur from 0 to 8px
});

onMounted(() => {
  // Initialize intro with gameState
  if (introGame.value && gameState) {
    introGame.value.startIntro(gameState);
  }
  
  // Ensure initial background image is set
  if (minigameState.value?.backgroundImage && !currentBackgroundImage.value) {
    currentBackgroundImage.value = minigameState.value.backgroundImage;
  }
  
  // Set up ending sequence animation update
  const updateEndingAnimation = () => {
    if (minigameState.value?.isEnding && !minigameState.value?.isEnded) {
      currentTime.value = Date.now(); // Update reactive time to trigger computed property updates
      requestAnimationFrame(updateEndingAnimation);
    }
  };
  
  // Watch for ending state to start animation updates
  watch(() => minigameState.value?.isEnding, (isEnding) => {
    if (isEnding) {
      updateEndingAnimation();
    }
  });
});
</script>

<template>
  <div class="intro-view-container">
    <!-- Background layers for smooth transitions -->
    <div 
      class="background-layer old-background"
      :class="{ 'transitioning': isTransitioning }"
      :style="oldBackgroundStyle"
    ></div>
    <div 
      class="background-layer new-background"
      :class="{ 'transitioning': isTransitioning }"
      :style="newBackgroundStyle"
    ></div>
    
    <div 
      class="intro-content"
      :style="{ filter: `blur(${endingBlurAmount}px)` }"
    >
      <div v-if="minigameState && !minigameState.isEnded" class="dialog-history">
        <!-- Display all dialog history -->
        <div v-for="(item, index) in dialogHistory" :key="index" 
             :class="['history-item', { 'speaker-change': index > 0 && ((dialogHistory[index-1].type === 'message' && item.type === 'player_choice') || (dialogHistory[index-1].type === 'player_choice' && item.type === 'message')) }]">
          
          <!-- Message from character (left bubble) -->
          <div v-if="item.type === 'message'" class="message-bubble-container left">
            <div class="message-bubble character-bubble">
              <div class="message-text" v-html="item.text"></div>
            </div>
          </div>
          
          <!-- Choice options (only show if this is the current choice and waiting for choice) -->
          <div v-else-if="item.type === 'choice' && minigameState.isWaitingForChoice && index === dialogHistory.length - 1" class="choice-container">
            <div class="choices-grid">
              <button 
                v-for="choice in item.choices"
                :key="choice.id"
                @click="handleChoice(choice.id)"
                class="choice-btn"
              >
                {{ choice.text }}
              </button>
            </div>
          </div>
          
          <!-- Player's selected choice (right bubble) -->
          <div v-else-if="item.type === 'player_choice'" class="message-bubble-container right">
            <div class="message-bubble player-bubble">
              <div class="message-text">{{ item.selectedChoiceText }}</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
    <!-- The End overlay -->
    <div v-if="shouldShowTheEnd" class="the-end-overlay">
      <div class="the-end-text">The End</div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap');

.intro-view-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecf0f1;
  position: relative;
  box-sizing: border-box;
  overflow: hidden; /* Contain background layers */
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #2c3e50; /* Fallback color */
  z-index: 0;
}

.old-background.transitioning {
  animation: oldBackgroundTransition 20s ease-in-out forwards;
}

.new-background.transitioning {
  animation: newBackgroundTransition 20s ease-in-out forwards;
}

@keyframes oldBackgroundTransition {
  0% {
    filter: blur(0px);
    opacity: 1;
  }
  50% {
    filter: blur(12px);
    opacity: 1;
  }
  70% {
    filter: blur(12px);
    opacity: 1;
  }
  100% {
    filter: blur(12px);
    opacity: 0;
  }
}

@keyframes newBackgroundTransition {
  0% {
    filter: blur(12px);
    opacity: 0;
  }
  30% {
    filter: blur(12px);
    opacity: 0;
  }
  70% {
    filter: blur(12px);
    opacity: 1;
  }
  100% {
    filter: blur(0px);
    opacity: 1;
  }
}

.intro-content {
  width: 100%;
  height: 100%;
  max-width: 925px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-gutter: stable;
  padding-right: 8px; /* Fallback for browsers that don't support scrollbar-gutter */
  position: relative;
  z-index: 1; /* Ensure content is above background layers */
}

.dialog-history {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  padding: 0.5rem 0;
}

.history-item {
  animation: fadeIn 0.3s ease-in;
}

.history-item.speaker-change {
  margin-top: 0.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Chat bubble styling */
.message-bubble-container {
  display: flex;
  margin: 0.1rem 0;
}

.message-bubble-container.left {
  justify-content: flex-start;
  margin-right: 8%;
}

.message-bubble-container.right {
  justify-content: flex-end;
  margin-left: 8%;
}

.message-bubble {
  max-width: 100%;
  padding: 0.3rem 0.8rem;
  border-radius: 14px;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Character bubbles (left side) */
.character-bubble {
  background-color: rgba(15, 25, 40, 0.85);
  border-left: 4px solid rgba(52, 152, 219, 1);
  border-bottom-left-radius: 6px;
}

.character-bubble .message-text {
  font-weight: 400;
  font-family: "IM Fell English", serif;
  font-size: 1.22rem;
  text-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  letter-spacing: 0.5px;
}

/* Enhanced styling for emphasized text within character messages */
.character-bubble .message-text :deep(strong) {
  font-weight: 700;
  font-size: 1.4rem;
  color: #ffffff;
  font-family: "IM Fell English", serif;
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.55),
    0 0 8px rgba(52, 152, 219, 0.4);
}

/* Enhanced styling for emphasized text within character messages */
.character-bubble .message-text :deep(b) {
  font-weight: 700;
  font-size: 1.3rem;
  color: #ffffff;
  font-family: "IM Fell English", serif;
}

/* Player bubbles (right side, orange) */
.player-bubble {
  background-color: rgba(40, 25, 15, 0.85);
  border-right: 4px solid rgba(243, 156, 18, 1);
  border-bottom-right-radius: 6px;
}

.player-bubble .message-text {
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1rem;
}

.message-text {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* Choice styling */
.choice-container {
  display: flex;
  justify-content: flex-end;
  margin-left: 8%;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.choices-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-end;
  max-width: 100%;
}

.choice-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.choice-btn:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.choice-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* The End overlay styling */
.the-end-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
  animation: theEndFadeIn 1s ease-in-out forwards;
  overflow: visible; /* Allow glow effects to extend beyond overlay bounds */
}

.the-end-text {
  font-family: "IM Fell English", serif;
  font-size: 30vh; /* Twice as big as requested */
  font-weight: bold;
  color: #ecf0f1;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(255, 255, 255, 0.6),
    0 0 60px rgba(255, 255, 255, 0.4),
    0 0 80px rgba(255, 255, 255, 0.2);
  text-align: center;
  white-space: nowrap;
  animation: theEndAppear 2s ease-out forwards;
  max-width: none; /* Remove width constraint to prevent glow clipping */
  overflow: visible; /* Allow glow to extend beyond text bounds */
  line-height: 1;
  opacity: 0;
  transform: scale(0.8);
  /* Add padding to ensure glow has space to render */
  padding: 100px;
  margin: -100px; /* Negative margin to offset the padding visually */
}

@keyframes theEndFadeIn {
  from { 
    opacity: 0; 
  }
  to { 
    opacity: 1; 
  }
}

@keyframes theEndAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}



/* Scrollbar styling */
.intro-content::-webkit-scrollbar {
  width: 8px;
}

.intro-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.intro-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.intro-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .intro-view-container {
    padding: 1rem;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .choices-grid {
    max-width: 100%;
  }
  
  .choice-btn {
    min-width: 100px;
    font-size: 0.9rem;
  }
  
  .the-end-text {
    font-size: 24vh; /* Proportionally smaller on mobile */
  }
}

@media (max-width: 480px) {
  .the-end-text {
    font-size: max(20vh, 160px); /* Ensure minimum readable size on very small screens */
  }
}
</style> 