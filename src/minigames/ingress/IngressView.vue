<script setup lang="ts">
import { inject, computed, ref, nextTick } from 'vue';
import type { GameState } from '../../logic/GameState';
import { INGRESS_TYPE, type IngressState, type IngressCharacterOption, type SubmittedWord } from './IngressTypes';
import type { IngressGame } from './IngressGame';
import IngressWordColumns from './components/IngressWordColumns.vue';
import IngressCharacterCard from './components/IngressCharacterCard.vue';
import IngressCharacterInspectView from './components/IngressCharacterInspectView.vue';
import IngressUpgradeView from './components/IngressUpgradeView.vue';
import AspectPointsBar from './components/AspectPointsBar.vue';
import { IngressWordsLib } from './lib/IngressWordsLib';
import IngressCharacterHint from './components/IngressCharacterHint.vue';
import IngressInputArea from './components/IngressInputArea.vue';
import StarfieldBackground from './components/StarfieldBackground.vue';
import StarTooltip from './components/StarTooltip.vue';

const showStarfield = ref(true);
const gameState = inject<GameState>('gameState');
const ingressInputAreaRef = ref<InstanceType<typeof IngressInputArea> | null>(null);
const attractorPosition = ref<{ x: number; y: number } | null>(null);

const hoveredWord = ref<SubmittedWord | null>(null);
const hintPosition = ref<{ x: number, y: number } | null>(null);
const anyBadgeHovered = ref(false);

const starTooltipVisible = ref(false);
const starTooltipPosition = ref<{ x: number, y: number } | null>(null);

const showInputHint = computed(() => {
  if (!ingressState.value) return false;
  return (ingressState.value.substantiveWords.length + ingressState.value.offensiveWords.length) >= 2;
});

const animationState = ref<{
  wordId: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  wordName: string;
  wordPoints: number;
  wordWasTypo: boolean;
  wordItemWidth: number;
} | null>(null);

const flyerStyle = computed(() => {
  if (!animationState.value) return {};
  return {
    '--start-x': `${animationState.value.from.x}px`,
    '--start-y': `${animationState.value.from.y}px`,
    '--end-x': `${animationState.value.to.x}px`,
    '--end-y': `${animationState.value.to.y}px`,
    width: `${animationState.value.wordItemWidth}px`,
  };
});

const onAnimationEnd = () => {
  if (animationState.value) {
    const wordEl = document.getElementById(`word-li-${animationState.value.wordId}`);
    if (wordEl) {
      wordEl.style.visibility = 'visible';
      wordEl.classList.add('new-word-entry-animation');
    }
    animationState.value = null;
  }
};

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

const totalSubstantiveWordsCount = computed(() => {
  if (!ingressGame.value || !gameState) {
    return 0;
  }
  const ingressWordsLib = gameState.lib.ingressWords as IngressWordsLib;
  return ingressGame.value.getSubstantiveWordsCount(ingressWordsLib, gameState);
});

const wordsColumns = computed(() => {
    const columns: any[] = [];
    if (!ingressState.value) return [];

    const showSubstantiveColumn = ingressState.value.substantiveWords.length > 0 || ingressState.value.upgrades.breach_word_counter;

    if (showSubstantiveColumn) {
        const found = ingressState.value.substantiveWords.length;
        const total = totalSubstantiveWordsCount.value;
        const showTotal = ingressState.value.upgrades.breach_word_counter && total > 0;
        const title = `Substantive: ${found}${showTotal ? ` / ${total}` : ''}`;
        columns.push({ id: 'substantive', title: title, words: [...ingressState.value.substantiveWords].reverse() });
    }

    if (ingressState.value.offensiveWords.length > 0) {
        columns.push({ id: 'offensive', title: 'Offensive', words: ingressState.value.offensiveWords });
    }

    return columns;
});

const handleSubmitWord = async (payload: { word: string, inputRect: DOMRect | undefined }) => {
  if (ingressGame.value && gameState?.lib.ingressWords) {
    const { word, inputRect } = payload;
    const result = ingressGame.value.processSubmittedWord(word, gameState.lib.ingressWords as any, gameState);
    
    ingressInputAreaRef.value?.resetState();
    await nextTick();

    if (result.classification === 'blank') {
      ingressInputAreaRef.value?.showBlankError();
      ingressInputAreaRef.value?.selectInput();
    } else {
      if (result.classification === 'offensive' || result.isNewAddition) {
        ingressInputAreaRef.value?.clearInput();
      } else if (result.classification === 'substantive' && !result.isNewAddition) {
        ingressInputAreaRef.value?.selectInput();
      }
      
      ingressInputAreaRef.value?.focusInput(); 

      if (result.classification === 'substantive' && result.pointsEarned > 0 && result.isNewAddition) {
        if (ingressState.value && ingressState.value.substantiveWords.length > 0 && inputRect) {
            const newWord = ingressState.value.substantiveWords[ingressState.value.substantiveWords.length - 1];

            const wordEl = document.getElementById(`word-li-${newWord.definition.id}`);
            const wordRect = wordEl?.getBoundingClientRect();
            
            if (wordRect && wordEl) {
                wordEl.style.visibility = 'hidden';

                animationState.value = {
                    wordId: newWord.definition.id,
                    from: { x: inputRect.left + inputRect.width / 2, y: inputRect.top + inputRect.height / 2 },
                    to: { x: wordRect.left, y: wordRect.top },
                    wordName: newWord.definition.name,
                    wordPoints: newWord.pointsEarned,
                    wordWasTypo: newWord.wasTypo,
                    wordItemWidth: wordRect.width
                };
            }
        }

        ingressInputAreaRef.value?.showScoredPoints();
      } else if (result.classification === 'substantive' && result.pointsEarned > 0 && !result.isNewAddition) {
        // Handle visual feedback for duplicate substantive word if needed
      }
    }
  }
};

const handleWordHover = (payload: { word: SubmittedWord, event: MouseEvent }) => {
    hoveredWord.value = payload.word;
    hintPosition.value = { x: payload.event.clientX, y: payload.event.clientY };
    if (!anyBadgeHovered.value) {
        anyBadgeHovered.value = true;
    }
};

const handleWordLeave = () => {
    hoveredWord.value = null;
    hintPosition.value = null;
};

const handleCharacterExplore = (option: IngressCharacterOption) => {
    if (ingressGame.value && gameState) {
        if (option.discoveryState === 'portrait_revealed') {
            ingressGame.value.startCharacterInspection(option.characterId);
        } else {
            ingressGame.value.exploreCharacter(option.characterId, gameState);
        }
    }
};

const handleCloseInspect = () => {
    ingressGame.value?.closeCharacterInspection();
};

const handleEngageGame = () => {
    ingressGame.value?.engage();
};

const handleEngageHover = (rect: DOMRect | null) => {
    if (rect) {
        attractorPosition.value = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
    } else {
        attractorPosition.value = null;
    }
};

const handleEnvisionCharacters = () => {
    if (ingressGame.value && gameState) {
        ingressGame.value.envisionCharacters(gameState);
    }
};

const handleStarTooltipShow = (event: MouseEvent) => {
    starTooltipVisible.value = true;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    starTooltipPosition.value = {
        x: event.clientX,
        y: rect.top
    };
};

const handleStarTooltipMove = (event: MouseEvent) => {
    if (starTooltipVisible.value && starTooltipPosition.value) {
        starTooltipPosition.value = {
            x: event.clientX,
            y: starTooltipPosition.value.y // Keep the same Y position
        };
    }
};

const handleStarTooltipHide = () => {
    starTooltipVisible.value = false;
    starTooltipPosition.value = null;
};

</script>

<template>
  <div class="ingress-view-container" :class="{ 'center-content': !ingressState?.engaged }">
    <StarfieldBackground
      v-if="showStarfield"
      :attractor-position="attractorPosition"
      :is-engaged="!!ingressState?.engaged"
      :engagement-progress="ingressState?.engagementProgress ?? 0"
      :engagement-completion-time="ingressState?.engagementCompletionTime ?? null"
      @all-stars-gone="() => {
        showStarfield = false;
        console.log('[IngressView] Starfield component removed.');
      }"
    />
    <div class="game-content-wrapper">
      <div class="game-content-below-bar" :class="{ 'engaged': ingressState?.engaged }">
        <div class="main-content-area">
          <AspectPointsBar
            v-if="ingressState && ingressState.chargesBarRevealed"
            :charges="ingressState.aspectPoints"
            :materialization-progress="ingressState.materializationProgress"
            :total-aspect-points="ingressState.totalAspectPoints"
            :upgrades="ingressState.upgrades"
            :show-progress="true"
          />
          <button 
            v-if="ingressState && !ingressState.hasEnvisioned && ingressState.charactersAvailableToEnvision > 0"
            @click="handleEnvisionCharacters" 
            @mouseenter="ingressState.aspectPoints < 2 ? handleStarTooltipShow($event) : null"
            @mousemove="ingressState.aspectPoints < 2 ? handleStarTooltipMove($event) : null"
            @mouseleave="handleStarTooltipHide"
            class="envision-button" 
            :disabled="ingressState.aspectPoints < 2"
          >
            Envision possible characters (takes ☆☆)
          </button>
          <div v-if="ingressState && ingressState.characterOptions.length > 0 && ingressState.engaged" class="character-options-container">
              <IngressCharacterCard
                  v-for="option in ingressState.characterOptions"
                  :key="option.characterId"
                  :option="option"
                  :xp-bonus="ingressState.characterXpBonuses[option.characterId] || 0"
                  @explore="handleCharacterExplore"
              />
          </div>
          <IngressInputArea
              v-if="ingressState && ingressGame"
              ref="ingressInputAreaRef"
              :show-hint="showInputHint"
              :charges-bar-revealed="ingressState.chargesBarRevealed"
              :engaged="ingressState.engaged"
              :engagement-progress="ingressState.engagementProgress"
              @submit-word="handleSubmitWord"
              @engage-game="handleEngageGame"
              @engage-hover="handleEngageHover"
              @engagement-click="ingressGame.handleEngagementClick()"
              @engagement-mousedown="ingressGame.handleEngagementMouseDown()"
              @engagement-mouseup="ingressGame.stopEngagementHold()"
              @engagement-mouseleave="ingressGame.stopEngagementHold()"
          />
        </div>
        <IngressWordColumns
          :columns="wordsColumns"
          v-if="wordsColumns.length > 0 && ingressState?.engaged"
          :key="wordsColumns.length"
          @word-hover="handleWordHover"
          @word-leave="handleWordLeave"
          :any-badge-hovered="anyBadgeHovered"
        />
      </div>
    </div>

    <div v-if="ingressState && ingressState.inspectingCharacterId" class="inspect-views-container-backdrop" @click.self="handleCloseInspect">
      <div class="inspect-views-panel-container">
        <IngressCharacterInspectView />
        <IngressUpgradeView />
      </div>
    </div>
    <IngressCharacterHint :word="hoveredWord" :position="hintPosition" />
    <StarTooltip :show="starTooltipVisible" :position="starTooltipPosition" />
    <div 
      v-if="animationState" 
      class="word-flyer" 
      :style="flyerStyle"
      @animationend="onAnimationEnd"
    >
        <div class="word-item">
          <span class="word-name">{{ animationState.wordName }}</span>
          <span class="stars" v-if="animationState.wordPoints > 0">{{ '★'.repeat(Math.min(animationState.wordPoints, 5)) }}</span>
        </div>
        <div v-if="animationState.wordWasTypo" class="typo-sticker">TYPO</div>
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
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.ingress-view-container.center-content {
  justify-content: center; /* Center content vertically */
}

.game-content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 1;
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

.game-content-below-bar:not(.engaged) {
  align-items: center; /* Center when not engaged */
}

.main-content-area {
  display: flex;
  flex-direction: column;
  gap: 10px; 
  align-items: stretch; /* Stretch children to fill width */
  justify-content: flex-start;
  flex-grow: 1;
  min-width: 0; /* Prevent from overflowing when content is too wide */
}

/* Animations */
@keyframes flashGreenBackground {
  0% { background-color: #34495e; } /* Original color */
  50% { background-color: #2ecc71; } /* Flash green */
  100% { background-color: #34495e; } /* Back to original */
}

.word-flyer {
  position: fixed;
  top: var(--start-y);
  left: var(--start-x);
  z-index: 2000;
  transform: translate(-50%, -50%);
  animation: flyToPlace 0.5s ease-in-out forwards;
  pointer-events: none; /* Don't intercept clicks */

  /* Styles copied from IngressWordColumn.vue to replicate the look */
  padding: 0;
  margin-bottom: 5px;
}

@keyframes flyToPlace {
  0% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.7;
  }
  20% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    top: var(--end-y);
    left: var(--end-x);
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
}

.word-flyer .word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  background-color: #34495e;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
  color: white; /* Make sure text is visible */
  animation: flashGreenBackground 0.5s ease-out;
}

.word-flyer .word-name {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}

.word-flyer .stars {
  color: #f1c40f;
  margin-left: 10px;
  flex-shrink: 0;
}

.word-flyer .typo-sticker {
  position: absolute;
  top: -2px;
  right: -6px;
  background-color: #e74c3c;
  color: white;
  padding: 3px 4px;
  font-size: 10px;
  font-weight: bold;
  transform: rotate(15deg);
  border-radius: 3px;
  z-index: 1;
  text-transform: uppercase;
  line-height: 1;
  padding-bottom: 3px;
}

@keyframes fadeInAndScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.new-word-entry-animation {
  animation: fadeInAndScale 0.3s ease-out;
}

.inspect-views-container-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow-y: auto;
    padding: 20px 0;
}

.inspect-views-panel-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 85%;
    max-width: 1100px;
}

.envision-button-container {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    width: 100%;
}

.envision-button {
    background-color: #f1c40f;
    color: #2c3e50;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 0.9em;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    width: 360px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30vh;
}

.envision-button:hover:not(:disabled) {
    background-color: #f39c12;
}

.envision-button:disabled {
    background-color: #7f8c8d;
    cursor: not-allowed;
}

.character-options-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    padding: 0px 0;
    width: 100%;
}

@media (max-height: 900px) {
    .character-options-container :deep(.character-card) {
        transform: scale(0.75);
        transform-origin: top center;
        margin-left: -32px;
        margin-right: -32px;
        margin-bottom: -96px;
    }
}

</style> 