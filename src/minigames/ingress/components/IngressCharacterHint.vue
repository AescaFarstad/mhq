<template>
  <div class="ingress-character-hint" v-if="visible" :style="positionStyle">
    <p>This word resonates with the following characters:</p>
    <ul>
      <li v-for="char in characterInfo" :key="char.id">{{ char.name }}</li>
    </ul>
    <p v-if="word">Grants +{{ word.pointsEarned }}% next level XP upon possessing them.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { SubmittedWord, IngressState } from '../IngressTypes';
import type { GameState } from '../../../logic/GameState';

const props = defineProps<{
  word: SubmittedWord | null;
  position: { x: number, y: number } | null;
}>();

const gameState = inject<GameState>('gameState');

const visible = computed(() => !!props.word && !!props.position);

const positionStyle = computed(() => {
  if (!props.position) return {};
  // Position hint to the left of the cursor, with a small offset
  return {
    position: 'fixed' as const,
    left: `${props.position.x - 15}px`,
    top: `${props.position.y}px`,
    transform: 'translateX(-100%) translateY(-50%)',
    pointerEvents: 'none' as const,
  };
});

const characterInfo = computed(() => {
  if (!props.word?.sourceCharacterIds || !gameState?.lib.characters) {
    return [];
  }
  const ingressState = gameState.uiState.activeMinigameState as IngressState | undefined;

  return props.word.sourceCharacterIds.map(id => {
    const char = gameState.lib.characters.getCharacter(id);
    const totalBonus = ingressState?.characterXpBonuses?.[id] || 0;
    return {
      id,
      name: char ? char.name : 'Unknown Character',
      totalBonus,
    };
  });
});
</script>

<style scoped>
.ingress-character-hint {
  background-color: #34495e;
  color: #e2e8f0;
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 16px;
  z-index: 3000;
  font-size: 0.9em;
  max-width: 26rem;
  min-width: 26rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  text-align: left;
}

.ingress-character-hint p {
    margin: 0 0 10px 0;
}
.ingress-character-hint p:last-child {
    margin-bottom: 0;
}

.ingress-character-hint ul {
    margin: 0 0 10px 0;
    padding-left: 20px;
}

.ingress-character-hint ul li {
    font-size: 1.1em;
    font-weight: bold;
    color: #f1c40f;
    margin-bottom: 5px;
}
</style> 