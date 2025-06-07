<script setup lang="ts">
import { computed, inject } from 'vue';
import type { IngressCharacterOption } from '../IngressTypes';
import ImageHolder from '../../../components/common/ImageHolder.vue';
import type { GameState } from '../../../logic/GameState';
import { INGRESS_TYPE, type IngressState } from '../IngressTypes';

const props = defineProps<{
    option: IngressCharacterOption;
    xpBonus: number;
}>();

const emit = defineEmits(['explore']);

const gameState = inject<GameState>('gameState');

const ingressState = computed(() => {
  if (gameState?.activeMinigame?.type === INGRESS_TYPE && gameState.uiState.activeMinigameState) {
    return gameState.uiState.activeMinigameState as IngressState;
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

const isButtonDisabled = computed(() => {
    return props.option.discoveryState !== 'unexplored' && props.option.discoveryState !== 'name_revealed';
});

const costStarsDisplay = computed(() => {
  const cost = explorationCost.value;
  if (cost <= 0) return '';
  return '☆'.repeat(cost);
});

const handleExploreClick = () => {
  if (!isButtonDisabled.value) {
    emit('explore', props.option);
  }
};

const handleCardClick = () => {
    if (props.option.discoveryState === 'portrait_revealed') {
        emit('explore', props.option);
    }
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
  >
    <div class="card-content">
      <div v-if="option.discoveryState === 'unexplored'" class="unexplored-content">
        <span class="question-mark">?</span>
      </div>
      <div v-if="option.discoveryState === 'name_revealed'" class="name-content">
        <h3 class="character-name">{{ characterName }}</h3>
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
      </div>
      
      <button 
        v-if="option.discoveryState === 'unexplored' || option.discoveryState === 'name_revealed'"
        @click.stop="handleExploreClick" 
        :disabled="isButtonDisabled"
        class="explore-button"
      >
        {{ buttonText }} <span v-if="costStarsDisplay" class="cost-stars">{{ costStarsDisplay }}</span>
      </button>

    </div>
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

.name-content .character-name {
    font-size: 1.5rem;
    color: #ecf0f1;
    text-align: center;
    padding: 0 5px;
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
</style> 