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

onMounted(() => {
    setTimeout(() => {
        isEngageButtonVisible.value = true;
    }, 5000);
});

// Constants for engage button fade behavior
const FADE_START_PERCENTAGE = 0;
const OPACITY_EXPONENT = 4;

const engageButtonStyle = computed(() => {
    if (props.engagementProgress > FADE_START_PERCENTAGE) {
        const progressRatio = (props.engagementProgress - FADE_START_PERCENTAGE) / (100 - FADE_START_PERCENTAGE);
        const opacity = Math.pow(1 - progressRatio, OPACITY_EXPONENT);
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
      <p v-if="!chargesBarRevealed" class="input-prompt large-prompt">Time to initiate possession.</p>
      <p v-if="!chargesBarRevealed" class="input-prompt prompt-with-a-break">This process is mentally strenuous, stock up on coffee or tea.</p>

      <div class="action-area">
        <!-- Content shown when the game is engaged -->
        <div class="engaged-content" :class="{ hidden: !engaged }">
          <p class="input-prompt">Type in <b>nouns</b> you believe might resonate across the dimensional barrier. The right words will accelerate the possession.</p>
          <div class="input-wrapper">
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
                placeholder="type a magic noun and hit Enter"
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
              @mouseenter="isInputHintVisible = true"
              @mouseleave="isInputHintVisible = false"
            >
              <span class="hint-icon">?</span>
              <div v-if="isInputHintVisible" class="hint-tooltip">
                  <ul>
                    <li>Verbs can not transcend universal boundaries. Only nouns pave the way.</li>
                    <li>Use simple, singular forms (i.e. 'farm' instead of 'farmer'). Trivial cases will be autocorrected.</li>
                    <li>Nobody can tell you which words to type. Telepathy responds to instinct.</li>
                    <li>There is no penalty for errors. Despair is your only undoing.</li>
                  </ul>
              </div>
            </div>
          </div>
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
          Engage now
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
  gap: 8px; /* Space between prompt and input box */
  align-items: center; /* Align prompt and input area to the center */
}

.input-and-prompt-area {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Space between prompt and input box */
  align-items: center; /* Align prompt and input area to the center */
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
  color: #bdc3c7;
  text-align: center;
  margin: 0;
}

.large-prompt {
  font-size: 1.2em;
  font-weight: bold;
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
  background-color: #34495e; /* Adjusted color */
  padding: 10px; /* Reduced padding a bit */
  border-radius: 8px;
  align-items: center;
  width: auto; /* Allow it to shrink to content + input max-width */
  max-width: 450px; /* Max width for the whole input area */
  border: 2px solid transparent; /* For smooth transition with highlight */
  gap: 10px;
}

.input-area input {
  flex-grow: 0;
  width: 220px; /* Further reduced input box width slightly */
  max-width: 280px; /* Adjusted max-width */
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #7f8c8d;
  border-radius: 4px;
  background-color: #ecf0f1;
  color: #2c3e50;
  transition: border-color 0.3s ease;
}

.input-area input.input-blank-highlight {
  border-color: #e74c3c !important; /* Red border for blank */
  background-color: #fadbd8; /* Light red background */
}

.input-area input.input-typing-highlight {
  border-color: #2ecc71; /* Green border when typing after blank */
}

.input-area input::placeholder {
  color: #95a5a6;
}

.input-area button {
  padding: 10px 15px; /* Adjusted padding */
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
  background-color: #7f8c8d;
  color: #ecf0f1;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
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
</style> 