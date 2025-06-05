<script setup lang="ts">
import { inject, computed, ref, nextTick, watch } from 'vue';
import type { GameState } from '../../logic/GameState';
import { INGRESS_TYPE, type IngressState } from './IngressTypes';
import type { IngressGame } from './IngressGame';
import IngressWordColumns from './components/IngressWordColumns.vue';
import type { WordDefinition } from './lib/definitions/WordDefinition';

const gameState = inject<GameState>('gameState');
const inputValue = ref('');
const inputElementRef = ref<HTMLInputElement | null>(null); // Ref for the input element
const inputAreaRef = ref<HTMLDivElement | null>(null); // Ref for the div.input-area for animations

// State for managing input visual feedback and animations
const inputInteractionState = ref<'default' | 'blank-error' | 'scored-points' | 'typing'>('default');

const ingressState = computed(() => {
  if (gameState?.activeMinigame?.type === INGRESS_TYPE && gameState.uiState.activeMinigameState) {
    return gameState.uiState.activeMinigameState as IngressState;
  }
  return null;
});

const ingressGame = computed(() => {
  if (gameState?.activeMinigame?.type === INGRESS_TYPE) {
    return gameState.activeMinigame as IngressGame;
  }
  return null;
});

const wordColumns = computed(() => {
  const columns: { title: string; words: (WordDefinition | string)[] }[] = [];

  if (!ingressState.value) return [];

  if (ingressState.value.usefulWords.length > 0) {
    columns.push({ title: 'Useful', words: [...ingressState.value.usefulWords].reverse() });
  }

  if (ingressState.value.offensiveWords.length > 0) {
    columns.push({ title: 'Offensive', words: [...ingressState.value.offensiveWords].reverse() });
  }

  return columns;
});

// Possession Charges Bar Logic
const possessionBarFlash = ref<'default' | 'increase' | 'decrease'>('default');
const internalPreviousPossessionCharges = ref<number | undefined>(undefined);

const possessionStarsDisplay = computed(() => {
  const charges = ingressState.value?.possessionCharges ?? 0;
  if (charges <= 0) return '';
  return '★'.repeat(charges);
});

watch(() => ingressState.value?.possessionCharges, (newCharges) => {
  const currentVal = newCharges ?? 0;

  if (internalPreviousPossessionCharges.value === undefined) {
    internalPreviousPossessionCharges.value = currentVal;
    return;
  }

  if (currentVal > internalPreviousPossessionCharges.value) {
    possessionBarFlash.value = 'increase';
  } else if (currentVal < internalPreviousPossessionCharges.value) {
    possessionBarFlash.value = 'decrease';
  } else {
    internalPreviousPossessionCharges.value = currentVal;
    return;
  }

  setTimeout(() => {
    possessionBarFlash.value = 'default';
  }, 700);

  internalPreviousPossessionCharges.value = currentVal;
});

watch(ingressState, (newState) => {
    if (newState && internalPreviousPossessionCharges.value === undefined) {
        internalPreviousPossessionCharges.value = newState.possessionCharges ?? 0;
    }
}, { immediate: true });

const submitInput = async () => {
  if (ingressGame.value && gameState?.lib.ingressWords && inputValue.value.trim()) {
    const currentWord = inputValue.value;
    const result = ingressGame.value.processSubmittedWord(currentWord, gameState.lib.ingressWords as any);
    
    inputInteractionState.value = 'default';
    await nextTick();

    if (result.classification === 'blank') {
      inputInteractionState.value = 'blank-error';
      inputElementRef.value?.select();
      setTimeout(() => {
        if (inputInteractionState.value === 'blank-error' && inputValue.value === currentWord) {
          // Stays red until user types
        }
      }, 700);
    } else {
      if (result.classification === 'offensive' || result.isNewAddition) {
        inputValue.value = '';
      } else if (result.classification === 'useful' && !result.isNewAddition) {
        inputElementRef.value?.select();
      }
      
      inputElementRef.value?.focus(); 

      if (result.classification === 'useful' && result.pointsEarned > 0 && result.isNewAddition) {
        inputInteractionState.value = 'scored-points';
        setTimeout(() => {
          if (inputInteractionState.value === 'scored-points') {
            inputInteractionState.value = 'default';
          }
        }, 700);
      } else if (result.classification === 'useful' && result.pointsEarned > 0 && !result.isNewAddition) {
        // Handle visual feedback for duplicate useful word if needed (e.g., a different small animation or message)
        // For now, no specific animation, just selection of text.
      }
    }
  } else if (!inputValue.value.trim()) {
    inputValue.value = '';
    inputInteractionState.value = 'default';
  }
};

const onInputBoxInput = () => {
  if (inputInteractionState.value === 'blank-error' || inputInteractionState.value === 'scored-points') {
    inputInteractionState.value = 'typing'; // Or 'default' - 'typing' could have a subtle green border
  }
  // If just 'default' or 'typing', no specific visual change on input other than normal browser behavior
};

</script>

<template>
  <div class="ingress-view-container">
    <div class="game-content-below-bar">
      <div class="main-content-area">
        <div 
          v-if="ingressState && ingressState.possessionCharges >= 5"
          class="possession-charges-bar"
          :class="{
            'flash-green-possession': possessionBarFlash === 'increase',
            'flash-dark-possession': possessionBarFlash === 'decrease'
          }"
        >
          <span class="possession-charges-label">Possession Charges: </span><span class="stars">{{ possessionStarsDisplay }}</span>
        </div>
        <div class="input-and-prompt-area-wrapper">
          <div class="input-and-prompt-area">
            <p class="input-prompt">Type in words which you believe might help</p>
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
          </div>
        </div>
      </div>
      <IngressWordColumns :columns="wordColumns" v-if="wordColumns.length > 0" :key="wordColumns.length" />
    </div>
  </div>
</template>

<style scoped>
.ingress-view-container {
  width: 100%;
  height: 100%;
  display: flex; 
  flex-direction: column; 
  background-color: #2c3e50;
  color: #e2e8f0;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}

.possession-charges-bar {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #3e4f61; 
  color: #e2e8f0;
  font-size: 0.9em;
  border-radius: 6px;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
  width: 100%;
}

.possession-charges-label {
  flex-shrink: 0;
}

.possession-charges-bar .stars {
  font-size: 1.2em;
  color: #f1c40f; /* Star color */
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes flashGreenPossessionAnim {
  0%, 100% { background-color: #3e4f61; }
  50% { background-color: #27ae60; } /* Green flash */
}

.flash-green-possession {
  animation: flashGreenPossessionAnim 0.7s ease-out;
}

@keyframes flashDarkPossessionAnim {
  0%, 100% { background-color: #3e4f61; }
  50% { background-color: #2c3a47; } /* Darker flash */
}

.flash-dark-possession {
  animation: flashDarkPossessionAnim 0.7s ease-out;
}

.game-content-below-bar {
  display: flex;
  flex-direction: row; /* Changed to row */
  align-items: stretch; /* Stretch children vertically */
  justify-content: center; /* Center content horizontally */
  flex-grow: 1; 
  overflow: visible; /* Allow seeing animations outside bounds */
  gap: 20px;
}

.main-content-area {
  display: flex;
  flex-direction: column;
  gap: 20px; 
  align-items: stretch; /* Stretch children to fill width */
  justify-content: flex-start;
  flex-grow: 1;
  min-width: 0; /* Prevent from overflowing when content is too wide */
}

.input-and-prompt-area-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
}

.input-and-prompt-area {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Space between prompt and input box */
  align-items: flex-start; /* Align prompt and input area to the left */
}

.input-prompt {
  font-size: 0.9em;
  color: #bdc3c7;
  margin-left: 2px; /* Slight indent to align with input box padding */
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

</style> 