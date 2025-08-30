<template>
  <div v-if="inspirationCharges > 0" class="inspiration-section">
  <div class="inspiration-charges">
    Inspirations: {{ inspirationCharges }}
  </div>
  <div class="inspiration-choices">
    <div 
    class="inspiration-choice" 
    @click="selectInspirationChoice('rarest')"
    @mouseenter="showTooltip($event, rarestHint)"
    @mouseleave="hideTooltip"
    >
    Rarest {{ C.INSPIRATION_CHOICE_RAREST_COUNT }}
    </div>
    <div 
    class="inspiration-choice" 
    @click="selectInspirationChoice('juicy')"
    @mouseenter="showTooltip($event, juicyHint)"
    @mouseleave="hideTooltip"
    >
    Juicy {{ C.INSPIRATION_CHOICE_JUICY_COUNT }}
    </div>
    <div 
    class="inspiration-choice" 
    @click="selectInspirationChoice('random')"
    @mouseenter="showTooltip($event, randomHint)"
    @mouseleave="hideTooltip"
    >
    Random {{ C.INSPIRATION_CHOICE_RANDOM_COUNT }}
    </div>
  </div>
  </div>
  
  <!-- Tooltip -->
  <Teleport to="body">
  <div 
    v-if="tooltipVisible" 
    class="inspiration-tooltip"
    :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
  >
    {{ tooltipContent }}
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue';
import type { GameState } from '../../logic/GameState';
import { globalInputQueue } from '../../logic/GameState';
import type { CmdInspirationChoice } from '../../logic/input/InputCommands';
import { C } from '../../logic/lib/C';

const gameState = inject<GameState>('gameState');

const inspirationCharges = computed(() => {
  return (gameState?.uiState as any)?.inspiration?.charges ?? 0;
});

// Tooltip hints for inspiration choices
const rarestHint = `Gain ${C.INSPIRATION_CHOICE_RAREST_COUNT} new keywords from the skills you've discovered the least`;
const juicyHint = `Gain ${C.INSPIRATION_CHOICE_JUICY_COUNT} new keywords that relate to the most number of undiscovered items`;
const randomHint = `Gain ${C.INSPIRATION_CHOICE_RANDOM_COUNT} random new keywords (may contain keywords for already discovered items)`;

// Tooltip state
const tooltipVisible = ref<boolean>(false);
const tooltipContent = ref<string>('');
const tooltipPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

const selectInspirationChoice = (choiceType: "rarest" | "juicy" | "random") => {
  if (!gameState) return;
  
  const command: CmdInspirationChoice = {
  name: "CmdInspirationChoice",
  choiceType: choiceType
  };
  
  globalInputQueue.push(command);
};

/**
 * Show tooltip with hint text
 */
function showTooltip(event: MouseEvent, hint: string): void {
  if (inspirationCharges.value === 0) return; // Don't show tooltip if no charges
  
  tooltipContent.value = hint;
  
  tooltipPosition.value = {
  x: event.clientX,
  y: event.clientY
  };
  tooltipVisible.value = true;
}

/**
 * Hide tooltip
 */
function hideTooltip(): void {
  tooltipVisible.value = false;
}

// Watch for inspiration charges and hide tooltip when they reach 0
watch(inspirationCharges, (newCharges) => {
  if (newCharges === 0) {
  tooltipVisible.value = false;
  }
});
</script>

<style scoped>
/* Inspiration Section Styles */
.inspiration-section {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(52, 73, 94, 0.8);
  border: 1px solid #667eea;
  border-radius: 10px;
}

.inspiration-charges {
  text-align: center;
  color: #e2e8f0;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.inspiration-choices {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.inspiration-choice {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  user-select: none;
  min-height: 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.inspiration-choice:hover {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}

.inspiration-choice:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

/* Tooltip Styles - matching SkillBrowser.vue */
.inspiration-tooltip {
  position: fixed;
  background: #2c3e50;
  color: #e2e8f0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.85em;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #566a80;
  z-index: 2000; /* Higher z-index to ensure it appears above crystal view */
  max-width: 350px;
  pointer-events: none;
  line-height: 1.4;
  transform: translate(-50%, 40px); /* Center horizontally, position just above cursor */
}
</style> 