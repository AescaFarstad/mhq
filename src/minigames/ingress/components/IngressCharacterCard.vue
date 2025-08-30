<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { IngressCharacterOption } from '../IngressTypes';
import ImageHolder from '../../../components/common/ImageHolder.vue';
import type { GameState } from '../../../logic/GameState';
import { INGRESS_TYPE, type IngressState } from '../IngressTypes';
import StarTooltip from './StarTooltip.vue';

const props = defineProps<{
  option: IngressCharacterOption;
  xpBonus: number;
}>();

const emit = defineEmits(['explore']);

const gameState = inject<GameState>('gameState');

const starTooltipVisible = ref(false);
const starTooltipPosition = ref<{ x: number, y: number } | null>(null);
const cardElement = ref<HTMLElement | null>(null);

const ingressState = computed(() => {
  if (gameState?.activeMinigame?.type === INGRESS_TYPE && gameState.uiState.activeMinigameState) {
  return gameState.uiState.activeMinigameState as IngressState;
  }
  return null;
});

const characterDefinition = computed(() => {
  if (gameState && props.option.characterId) {
    return gameState.lib.characters.getCharacter(props.option.characterId);
  }
  return null;
});

const characterName = computed(() => {
  if (props.option.characterName) {
    if (ingressState.value?.characterRenames && ingressState.value.characterRenames[props.option.characterId]) {
      return ingressState.value.characterRenames[props.option.characterId];
    }
    return props.option.characterName;
  }
  return '???';
});

const firstEpithet = computed(() => {
  if (characterDefinition.value && characterDefinition.value.epithets.length > 0) {
    return characterDefinition.value.epithets[0];
  }
  return '';
});



const explorationCost = computed(() => {
  switch (props.option.discoveryState) {
  case 'unexplored':
    return props.option.explorationCosts[0];
  case 'name_revealed':
    return props.option.explorationCosts[1];
  default:
    return 0;
  }
});

const buttonText = computed(() => {
  switch (props.option.discoveryState) {
  case 'unexplored':
    return 'Focus attention';
  case 'name_revealed':
    return 'Intensify Focus';
  default:
    return '';
  }
});

const isExploreDisabled = computed(() => {
  return !ingressState.value || (ingressState.value.aspectPoints < explorationCost.value);
});

const costStarsDisplay = computed(() => {
  const cost = explorationCost.value;
  if (cost <= 0) return '';
  return '☆'.repeat(cost);
});

const handleExploreClick = () => {
  if (!isExploreDisabled.value) {
  emit('explore', props.option);
  }
};

const handleCardClick = () => {
  if (props.option.discoveryState === 'portrait_revealed') {
    emit('explore', props.option);
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
  <div 
  class="character-card" 
  :class="[
    `state-${option.discoveryState}`, 
    { 'is-clickable': option.discoveryState === 'portrait_revealed' }
  ]"
  @click="handleCardClick"
  ref="cardElement"
  >
  <div class="card-content">
    <div v-if="option.discoveryState === 'unexplored'" class="unexplored-content">
    <span class="question-mark">?</span>
    </div>
    <div v-if="option.discoveryState === 'name_revealed'" class="name-content">
    <h3 class="character-name">{{ characterName }}</h3>
    <div v-if="firstEpithet" class="character-epithet">{{ firstEpithet }}</div>
    </div>
    
    <div v-if="option.discoveryState === 'name_revealed' && characterDefinition" class="character-quote-card">
    <div class="quote-content">
      <div class="quote-text">"{{ characterDefinition.quote }}"</div>
    </div>
    </div>

    <div v-if="option.discoveryState === 'portrait_revealed'" class="portrait-content">
     <ImageHolder 
      v-if="option.characterImage"
      :atlas-name="'heroes'"
      :image-name="option.characterImage.portrait || option.characterImage.full"
      :display-width="254"
      :display-height="360"
    />
    <div v-if="xpBonus > 0" class="xp-bonus-overlay">+{{ xpBonus }}% XP</div>
    <h3 class="character-name overlay-name">{{ characterName }}</h3>
    <div v-if="firstEpithet" class="character-epithet overlay-epithet">{{ firstEpithet }}</div>
    </div>
    
    <button 
    v-if="option.discoveryState === 'unexplored' || option.discoveryState === 'name_revealed'"
    @click.stop="handleExploreClick" 
    @mouseenter="isExploreDisabled ? handleStarTooltipShow($event) : null"
    @mousemove="isExploreDisabled ? handleStarTooltipMove($event) : null"
    @mouseleave="handleStarTooltipHide"
    :disabled="isExploreDisabled"
    class="explore-button"
    >
    {{ buttonText }} <span v-if="costStarsDisplay" class="cost-stars">{{ costStarsDisplay }}</span>
    </button>



  </div>
  <StarTooltip :show="starTooltipVisible" :position="starTooltipPosition" />
  </div>
</template>

<style scoped>
.character-card {
  width: 260px;
  height: 360px;
  background-color: #3e4f61;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  border: 2px solid #566a80;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.character-card.is-clickable {
  cursor: pointer;
}

.character-card.is-clickable:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.unexplored-content .question-mark {
  font-size: 8rem;
  font-weight: bold;
  color: #2c3e50;
  user-select: none;
}

.name-content {
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 10px 10px 10px;
}

.name-content .character-name {
  font-size: 1.5rem;
  color: #ecf0f1;
  text-align: center;
  padding: 0 5px;
  margin-bottom: 8px;
}

.character-epithet {
  font-size: 0.9rem;
  color: #bdc3c7;
  text-align: center;
  font-style: italic;
  padding: 0 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.character-quote-card {
  flex: 2;
  width: 100%;
  padding: 5px 5px 80px 5px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.quote-content {
  background-color: rgba(52, 73, 94, 0.8);
  border: none;
  border-left: 3px dotted #7f8c8d;
  border-radius: 0;
  padding: 8px 2px 8px 6px;
  width: 100%;
  position: relative;
  box-shadow: none;
}

.quote-text {
  color: #ecf0f1;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  white-space: pre-wrap;
}



.portrait-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.portrait-content .overlay-name {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(44, 62, 80, 0.85);
  padding: 2px 8px 2px;
  border-radius: 0 0 10px 10px;
  font-size: 1rem;
  color: #ecf0f1;
  width: 65%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0;
}

.portrait-content .overlay-epithet {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(44, 62, 80, 0.75);
  padding: 1px 6px;
  border-radius: 0 0 8px 8px;
  font-size: 0.8rem;
  color: #bdc3c7;
  font-style: italic;
  max-width: 80%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.xp-bonus-overlay {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f1c40f;
  color: #2c3e50;
  padding: 4px 4px;
  border-radius: 0 0 0 12px;
  font-size: 0.8rem;
  z-index: 1;
}

.explore-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  padding: 10px 5px;
  background-color: #f1c40f;
  color: #2c3e50;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9em;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.explore-button:hover:not(:disabled) {
  background-color: #f39c12;
}

.explore-button:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.cost-stars {
  margin-left: 8px;
  color: #2c3e50;
  opacity: 0.8;
}

.character-card.state-name_revealed .character-epithet {
  opacity: 1;
}

.character-card:hover .character-epithet {
  opacity: 1;
}


</style> 