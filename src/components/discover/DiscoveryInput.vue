<template>
  <div class="discovery-input-section">
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div class="input-container">
      <div class="crystal-ball-mini">
        <CrystalBall />
      </div>
      <div
        class="input-area"
        :class="{
          'shake-animation': inputInteractionState === 'error',
          'flash-green-animation': inputInteractionState === 'success'
        }"
      >
        <input
          ref="inputElementRef"
          v-model="discoveryInput"
          @keydown.enter="submitDiscovery"
          @input="onInputChange"
          type="text"
          placeholder="Type something to discover..."
          class="discovery-input"
          :class="{
            'input-error-highlight': inputInteractionState === 'error',
            'input-typing-highlight': inputInteractionState === 'typing'
          }"
          maxlength="100"
        />
        <button @click="submitDiscovery" class="discovery-submit-btn">
          Enter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, inject } from 'vue';
import type { GameState } from '../../logic/GameState';
import { globalInputQueue } from '../../logic/GameState';
import type { CmdSubmitDiscovery } from '../../logic/input/InputCommands';
import CrystalBall from '../CrystalBall.vue';

const gameState = inject<GameState>('gameState');
const discoveryInput = ref('');
const inputElementRef = ref<HTMLInputElement | null>(null);
const inputInteractionState = ref<'default' | 'error' | 'success' | 'typing'>('default');
const errorMessage = ref('');

let lastDiscoveryLogLength = 0;

const submitDiscovery = async () => {
  if (!gameState || !discoveryInput.value.trim()) {
    await showError("Please enter something to discover");
    return;
  }
  
  const inputBefore = discoveryInput.value.trim();
  lastDiscoveryLogLength = gameState.discoveryLog.length;
  
  const command: CmdSubmitDiscovery = {
    name: "CmdSubmitDiscovery",
    input: inputBefore
  };
  
  globalInputQueue.push(command);
  
  // Check for discovery result after a short delay
  setTimeout(async () => {
    if (!gameState) return;
    
    const hasNewEntry = gameState.discoveryLog.length > lastDiscoveryLogLength;
    
    if (hasNewEntry) {
      const lastEntry = gameState.discoveryLog[gameState.discoveryLog.length - 1];
      if (lastEntry.type === 'direct_discovery' || lastEntry.type === 'brainstorm_discovery') {
        // Success - clear input, show success animation, maintain focus
        discoveryInput.value = '';
        showSuccess();
        await nextTick();
        inputElementRef.value?.focus();
      } else {
        // This shouldn't happen with current DiscoveryEvent types, but just in case
        await showError(`No matches found for "${inputBefore}"`);
      }
    } else {
      // No new entry means no match found
      await showError(`No matches found for "${inputBefore}"`);
    }
  }, 100);
};

const onInputChange = () => {
  // Clear error state when user starts typing
  if (inputInteractionState.value === 'error' || inputInteractionState.value === 'success') {
    inputInteractionState.value = 'typing';
    errorMessage.value = '';
  }
};

const showError = async (message: string) => {
  errorMessage.value = message;
  inputInteractionState.value = 'error';
  
  // Select the input text and maintain focus
  await nextTick();
  inputElementRef.value?.select();
  inputElementRef.value?.focus();
  
  // Keep the error state longer to ensure animation completes
  setTimeout(() => {
    if (inputInteractionState.value === 'error') {
      inputInteractionState.value = 'default';
    }
  }, 600); // Match the animation duration
};

const showSuccess = () => {
  inputInteractionState.value = 'success';
  setTimeout(() => {
    if (inputInteractionState.value === 'success') {
      inputInteractionState.value = 'default';
    }
  }, 700); // Match the animation duration
};
</script>

<style scoped>
.discovery-input-section {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin: 0;
  padding: 0;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.crystal-ball-mini {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.crystal-ball-mini :deep(.crystal-ball-container) {
  width: 60px !important;
  height: 60px !important;
  min-width: 60px !important;
  min-height: 60px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.crystal-ball-mini :deep(.crystal-ball) {
  width: 466px !important;
  height: 470px !important;
  min-width: 466px !important;
  min-height: 470px !important;
  transform: scale(0.13) !important;
  transform-origin: center !important;
}

.crystal-ball-mini :deep(.ball-layer) {
  width: 100% !important;
  height: 100% !important;
}

.input-area {
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
  padding: 0;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.discovery-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, background-color 0.2s;
}

.discovery-input:focus {
  outline: none;
  border-color: #4a90e2;
}

.discovery-input.input-error-highlight {
  border-color: #e74c3c !important;
  background-color: #fadbd8;
}

.discovery-input.input-typing-highlight {
  border-color: #2ecc71;
  background-color: #f0f9f0;
}

.discovery-submit-btn {
  padding: 12px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.discovery-submit-btn:hover {
  background: #357abd;
}

/* Enhanced animations matching IngressInputArea */
@keyframes shakeInput {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.shake-animation {
  animation: shakeInput 0.6s ease-in-out;
}

@keyframes flashGreenBorder {
  0% { 
    border-color: transparent;
    background-color: rgba(46, 204, 113, 0.1);
  }
  50% { 
    border-color: #2ecc71;
    background-color: rgba(46, 204, 113, 0.2);
  }
  100% { 
    border-color: transparent;
    background-color: rgba(46, 204, 113, 0.1);
  }
}

.flash-green-animation {
  animation: flashGreenBorder 0.7s ease-out;
}

.flash-green-animation .discovery-input {
  animation: flashGreenBorder 0.7s ease-out;
}
</style> 