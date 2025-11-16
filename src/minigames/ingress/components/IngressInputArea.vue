<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  showHint: boolean;
  chargesBarRevealed: boolean;
  engaged: boolean;
  engagementProgress: number;
}>();

const emit = defineEmits<{
  (e: 'submit-word', payload: { word: string, inputRect: DOMRect | undefined }): void;
  (e: 'engage-game'): void;
  (e: 'engage-hover', payload: DOMRect | null): void;
  (e: 'engagement-click'): void;
  (e: 'engagement-mousedown'): void;
  (e: 'engagement-mouseup'): void;
  (e: 'engagement-mouseleave'): void;
}>();

const inputValue = ref('');
const inputElementRef = ref<HTMLInputElement | null>(null);
const inputAreaRef = ref<HTMLDivElement | null>(null);
const engageButtonRef = ref<HTMLButtonElement | null>(null);
const isInputHintVisible = ref(false);
const isEngageButtonVisible = ref(false);
const isEngagedClicked = ref(false);
const initialPromptsVisible = ref(false);
const reanimateHints = ref(false);
const hasHoveredHint = ref(false);

onMounted(() => {
  setTimeout(() => {
    isEngageButtonVisible.value = true;
  }, 5000);
  setTimeout(() => {
    initialPromptsVisible.value = true;
  }, 1000);
});

// Constants for engage button fade behavior
const FADE_START_PERCENTAGE = 0;
const OPACITY_EXPONENT = 3;

const engageButtonStyle = computed(() => {
  if (props.engagementProgress > FADE_START_PERCENTAGE) {
    const progressRatio = (props.engagementProgress - FADE_START_PERCENTAGE) / (100 - FADE_START_PERCENTAGE);
    const opacity = progressRatio < 1 ? 0.1 + Math.pow(1 - progressRatio, OPACITY_EXPONENT) * 0.9 : 0;
    return { opacity: Math.max(0, opacity) };
  }
  return {};
});

const inputInteractionState = ref<'default' | 'blank-error' | 'scored-points' | 'typing'>('default');

const submitInput = () => {
  const word = inputValue.value.trim();
  if (word) {
  const inputRect = inputElementRef.value?.getBoundingClientRect();
  emit('submit-word', { word, inputRect });
  } else {
  // If the input is blank, we'll just clear the visual state without submitting
  inputValue.value = '';
  inputInteractionState.value = 'default';
  }
};

// When user starts typing after a blank error, reset the visual state
const onInputBoxInput = () => {
  if (inputInteractionState.value === 'blank-error' || inputInteractionState.value === 'scored-points') {
  inputInteractionState.value = 'typing';
  }
};

const handleEngageClick = () => {
  emit('engagement-click');
  isEngagedClicked.value = true;
  setTimeout(() => {
    isEngagedClicked.value = false;
  }, 800);
};

const stopHolding = () => {
  emit('engage-hover', null);
  emit('engagement-mouseup');
};

const handleEngageMouseDown = () => {
  emit('engage-hover', engageButtonRef.value?.getBoundingClientRect() ?? null);
  emit('engagement-mousedown');
};

const handleEngageMouseLeave = () => {
  emit('engagement-mouseleave');
};

defineExpose({
  clearInput: () => {
  inputValue.value = '';
  },
  selectInput: () => {
  inputElementRef.value?.select();
  },
  focusInput: () => {
  inputElementRef.value?.focus();
  },
  showBlankError: () => {
  inputInteractionState.value = 'blank-error';
  // Re-animate hint prompts when wrong word is typed and charges bar is not revealed
  if (!props.chargesBarRevealed) {
    reanimateHints.value = true;
    setTimeout(() => {
    reanimateHints.value = false;
    }, 1500);
  }
  },
  showScoredPoints: () => {
  inputInteractionState.value = 'scored-points';
  setTimeout(() => {
    // Transition back to default state after the animation
    if (inputInteractionState.value === 'scored-points') {
    inputInteractionState.value = 'default';
    }
  }, 500);
  },
  resetState: () => {
  inputInteractionState.value = 'default';
  }
});
</script>

<template>
  <div class="input-and-prompt-area-wrapper">
  <div class="input-and-prompt-area">
    <!-- Prompts shown before the game is engaged -->
    <p v-if="!chargesBarRevealed" class="input-prompt large-prompt" :class="{ 'animate-prompt': initialPromptsVisible }">Now — the descent.</p>
    <p v-if="!chargesBarRevealed" class="input-prompt prompt-with-a-break" :class="{ 'animate-prompt delay-0': initialPromptsVisible }">This process is mentally strenuous, stock up on tea or coffee.</p>

    <div class="action-area">
    <!-- Content shown when the game is engaged -->
    <div class="engaged-content" :class="{ hidden: !engaged }">
      <div class="input-wrapper">
      <!-- Invisible spacer to balance the hint icon on the right -->
      <div class="hint-spacer"></div>
      <div
        ref="inputAreaRef"
        class="input-area"
        :class="{
        'shake-animation': inputInteractionState === 'blank-error',
        'flash-green-animation': inputInteractionState === 'scored-points'
        }"
      >
        <input
        ref="inputElementRef"
        type="text"
        v-model="inputValue"
        @keyup.enter="submitInput"
        @input="onInputBoxInput"
        placeholder="type a noun and hit Enter"
        :class="{
          'input-blank-highlight': inputInteractionState === 'blank-error',
          'input-typing-highlight': inputInteractionState === 'typing'
        }"
        />
        <button @click="submitInput">Enter</button>
      </div>
      <!-- Hint for input rules -->
      <div
        v-if="showHint"
        class="input-hint-container"
        @mouseenter="isInputHintVisible = true; hasHoveredHint = true"
        @mouseleave="isInputHintVisible = false"
      >
        <span class="hint-icon" :class="{ 'glow-until-hovered': !hasHoveredHint }">?</span>
        <div v-if="isInputHintVisible" class="hint-tooltip">
          <ul>
          <li>Nouns are substantive, while verbs are transformative. You need the former.</li>
          <li>Use simple, singular forms (i.e. 'farm' instead of 'farmer'). Trivial cases will be autocorrected.</li>
          <li>Descending requires you to think like a mortal. It's all on you, nobody can tell you what to type.</li>
          <li>There is no penalty for errors. Despair is your only undoing.</li>
          </ul>
        </div>
      </div>
      <!-- Invisible spacer to balance when hint is not shown -->
      <div v-if="!showHint" class="hint-spacer"></div>
      </div>

      <p
      class="input-prompt"
      :class="{
        'animate-prompt delay-1': engaged,
        'animate-prompt-again': reanimateHints
      }"
      >Type in <b>nouns</b> you believe may bring you closer to the human form.</p>
      <p
      class="input-prompt"
      :class="{
        'animate-prompt delay-2': engaged,
        'animate-prompt-again': reanimateHints
      }"
      >The right words will accelerate the materialization of your mortal aspect.</p>
    </div>
    <!-- Engage Button -->
    <button
      ref="engageButtonRef"
      :class="{ hidden: engaged || !isEngageButtonVisible, 'engage-button--clicked': isEngagedClicked }"
      :style="engageButtonStyle"
      @click="handleEngageClick"
      @mousedown="handleEngageMouseDown"
      @mouseup="stopHolding"
      @mouseleave="handleEngageMouseLeave"
      class="engage-button"
    >
      Dive
    </button>
    </div>
  </div>
  </div>
</template>

<style scoped>
.input-and-prompt-area-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  gap: 8px;
  align-items: center;
}

.input-and-prompt-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.action-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.engaged-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s ease;
}

.engaged-content.hidden {
  opacity: 0;
  pointer-events: none;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-prompt {
  font-size: 0.9em;
  color: #dce1e4;
  text-align: center;
  margin: 0;
  opacity: 0;
}

.large-prompt {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0;
}

.prompt-with-a-break {
  margin-bottom: 1.2em;
}

.initial-prompt {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
}

.engage-button {
  position: absolute;
  padding: 12px 24px;
  background-color: #f1c40f;
  color: #2c3e50;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease, background-color 0.2s;
  font-size: 1.1em;
}

.engage-button.hidden {
  opacity: 0;
  pointer-events: none;
}

.engage-button:hover {
  background-color: #f39c12;
}

.engage-button--clicked {
  animation: engageClickEffect 0.8s ease-out;
}

.input-area {
  display: flex;
  background-color: #34495e;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  width: auto; /* Allow it to shrink to content + input max-width */
  max-width: 450px;
  border: 2px solid transparent;
  gap: 10px;
}

.input-area input {
  flex-grow: 0;
  width: 220px;
  max-width: 280px;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #7f8c8d;
  border-radius: 4px;
  background-color: #ecf0f1;
  color: #2c3e50;
  transition: border-color 0.3s ease;
}

.input-area input.input-blank-highlight {
  border-color: #e74c3c !important;
  border: 3px solid;
  background-color: #f7d0cd;
}

.input-area input.input-typing-highlight {
  border-color: #2ecc71;
}

.input-area input::placeholder {
  color: #95a5a6;
}

.input-area button {
  padding: 10px 15px;
  background-color: #f1c40f;
  color: #2c3e50;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.input-area button:hover {
  background-color: #f39c12;
}

.input-hint-container {
  position: relative;
  display: flex;
  align-items: center;
}

.hint-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f39c12;
  color: #2c3e50;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  animation: bouncy-hint-appear 1.8s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

.hint-icon:hover {
  transform: scale(1.3);
  background-color: #f5b041;
  box-shadow: 0 0 10px #f5b041;
}

.hint-icon.glow-until-hovered {
  animation: bouncy-hint-appear 1.8s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) both,
       hint-glow 2s ease-in-out infinite 3.1s;
}

.hint-spacer {
  width: 20px;
  height: 20px;
  /* Invisible spacer to balance the hint icon */
}

.hint-tooltip {
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  background-color: #34495e;
  color: #e2e8f0;
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 16px;
  z-index: 10;
  font-size: 0.85em;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  text-align: left;
  pointer-events: none;
}

.hint-tooltip ul {
  list-style-position: inside;
  padding: 0;
  margin: 0;
}

.hint-tooltip li {
  margin-bottom: 10px;
}

.hint-tooltip li:last-child {
  margin-bottom: 0;
}

/* Animations */
@keyframes bouncy-hint-appear {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  30% {
    transform: scale(1.3);
    opacity: 1;
  }
  50% {
    transform: scale(0.85);
  }
  70% {
    transform: scale(1.15);
  }
  85% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes hint-glow {
  0%, 100% {
    box-shadow: 0 0 2px #f39c12;
  }
  50% {
    box-shadow: 0 0 4px #f39c12, 0 0 12px #f39c12;
  }
}

@keyframes shakeInput {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

.shake-animation {
  animation: shakeInput 0.6s ease-in-out;
}

@keyframes flashGreenBackground {
  0% { background-color: #34495e; } /* Original color */
  50% { background-color: #2ecc71; } /* Flash green */
  100% { background-color: #34495e; } /* Back to original */
}

.flash-green-animation {
  animation: flashGreenBackground 0.7s ease-out;
}

@keyframes engageClickEffect {
  0% {
  transform: scale(1);
  box-shadow: 0 0 0 0 rgba(241, 196, 15, 0.7);
  }
  40% {
  transform: scale(1.1);
  }
  100% {
  transform: scale(1);
  box-shadow: 0 0 20px 30px rgba(241, 196, 15, 0);
  }
}

.animate-prompt {
  animation: fadeInAndFlash 1s ease-out forwards;
}
.animate-prompt.delay-0 {
  animation-delay: 0.5s;
}
.animate-prompt.delay-1 {
  animation-delay: 2.0s;
}
.animate-prompt.delay-2 {
  animation-delay: 3.0s;
}

/* Animations */
@keyframes fadeInAndFlash {
  0% {
  opacity: 0;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0);
  }
  70% {
  opacity: 1;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.7);
  }
  100% {
  opacity: 1;
  text-shadow: none;
  }
}

.animate-prompt-again {
  animation: flashText 1s ease-out;
}

@keyframes flashText {
  0% {
  text-shadow: none;
  }
  50% {
  text-shadow: 0 0 8px rgba(255, 255, 255, 1), 0 0 16px rgba(255, 255, 255, 0.8);
  }
  100% {
  text-shadow: none;
  }
}
</style> 