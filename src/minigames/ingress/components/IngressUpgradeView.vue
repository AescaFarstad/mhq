<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import type { GameState } from '../../../logic/GameState';
import { INGRESS_TYPE, type IngressState, type IngressUpgradeId } from '../IngressTypes';
import type { IngressGame } from '../IngressGame';

const gameState = inject<GameState>('gameState');

const ingressState = computed(() => {
  if (gameState && gameState.activeMinigame?.type === INGRESS_TYPE && gameState.uiState.activeMinigameState) {
    return gameState.uiState.activeMinigameState as IngressState;
  }
  return null;
});

const ingressGame = computed(() => {
  if (gameState && gameState.activeMinigame?.type === INGRESS_TYPE) {
    return gameState.activeMinigame as IngressGame;
  }
  return null;
});

const recentlyPurchased = ref(new Set<IngressUpgradeId>());

const charactersExploredCount = computed(() => {
    if (!ingressState.value) return 0;
    return ingressState.value.characterOptions.filter(c => c.discoveryState === 'portrait_revealed').length;
});

interface Upgrade {
    id: IngressUpgradeId;
    text: string;
    cost: number;
    stars: string;
}

const characterUpgrades: Upgrade[] = [
    { id: 'char_attribute_point', text: '+1 Attribute point', cost: 15, stars: '☆☆☆☆☆ ☆☆☆☆☆ ☆☆☆☆☆' },
    { id: 'char_skill_point', text: '+1 Skill point', cost: 10, stars: '☆☆☆☆☆ ☆☆☆☆☆' },
    { id: 'char_spec_point', text: '+1 Specialization point', cost: 5, stars: '☆☆☆☆☆' },
    { id: 'char_xp_boost', text: '+25% of next level XP', cost: 3, stars: '☆☆☆' },
];

const breachUpgrades: Upgrade[] = [
    { id: 'breach_possession_speed', text: '+100% Faster possession rate', cost: 5, stars: '☆☆☆☆☆' },
    { id: 'breach_word_bonus', text: '+1 from future \'useful\' words', cost: 5, stars: '☆☆☆☆☆' },
    { id: 'breach_typo_tolerance', text: '+1 typo tolerance', cost: 2, stars: '☆☆' },
    { id: 'breach_word_counter', text: 'Display remaining \'useful\' words count', cost: 1, stars: '☆' },
];

const purchaseUpgrade = (upgradeId: IngressUpgradeId, cost: number) => {
    if (ingressGame.value) {
        ingressGame.value.purchaseUpgrade(upgradeId, cost);
        recentlyPurchased.value.add(upgradeId);
        setTimeout(() => {
            recentlyPurchased.value.delete(upgradeId);
        }, 3500); // Animation duration
    }
};

const revealUpgrades = () => {
    if (ingressGame.value) {
        ingressGame.value.revealUpgrades();
    }
};

</script>

<template>
  <div class="upgrade-view-panel" v-if="ingressState && charactersExploredCount >= 2">
      <div class="upgrades-reveal-container" :class="{ 'hidden': ingressState.upgradesRevealed }">
          <h3>Upgrades</h3>
          <button @click="revealUpgrades" class="explore-button" :disabled="ingressState.possessionCharges < 1">
              Connect <span class="cost-stars">☆</span>
          </button>
      </div>
      <div class="upgrade-content-wrapper" :class="{ 'revealed': ingressState.upgradesRevealed }">
          <div class="upgrade-content">
              <div class="column">
                  <h3>Upon possession, the host gains:</h3>
                  <template v-for="upgrade in characterUpgrades" :key="upgrade.id">
                    <button
                        class="upgrade-button"
                        :class="{ 'purchased': ingressState.upgrades[upgrade.id] }"
                        :disabled="ingressState.upgrades[upgrade.id] || ingressState.possessionCharges < upgrade.cost"
                        @click="purchaseUpgrade(upgrade.id, upgrade.cost)">
                        <span>{{ upgrade.text }}</span>
                        <span class="stars" :style="{ visibility: ingressState.upgrades[upgrade.id] ? 'hidden' : 'visible' }">{{ upgrade.stars }}</span>
                        <div v-if="recentlyPurchased.has(upgrade.id)" class="purchase-flash"></div>
                    </button>
                  </template>
              </div>
              <div class="column">
                  <h3>Widen the telepathic breach:</h3>
                  <template v-for="upgrade in breachUpgrades" :key="upgrade.id">
                    <button
                        class="upgrade-button"
                        :class="{ 'purchased': ingressState.upgrades[upgrade.id] }"
                        :disabled="ingressState.upgrades[upgrade.id] || ingressState.possessionCharges < upgrade.cost"
                        @click="purchaseUpgrade(upgrade.id, upgrade.cost)">
                        <span v-if="upgrade.id === 'breach_word_bonus'">+1 <span class="star-symbol">★</span> from future useful words</span>
                        <span v-else>{{ upgrade.text }}</span>
                        <span class="stars" :style="{ visibility: ingressState.upgrades[upgrade.id] ? 'hidden' : 'visible' }">{{ upgrade.stars }}</span>
                        <div v-if="recentlyPurchased.has(upgrade.id)" class="purchase-flash"></div>
                    </button>
                  </template>
              </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.upgrade-view-panel {
  background-color: #2c3e50;
  border: 2px solid #7f8c8d;
  border-radius: 15px;
  padding: 25px;
  padding-top: 0px;
  padding-bottom: 10px;
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.upgrades-reveal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding-top: 25px;
    overflow: hidden;
    max-height: 100px; /* Generous height for content */
    transition: all 0.7s ease-in-out;
}
.upgrades-reveal-container.hidden {
    max-height: 0;
    opacity: 0;
    padding: 0;
    margin: 0;
    gap: 0;
    pointer-events: none;
}
.upgrade-content-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: all 0.7s ease-in-out;
    opacity: 0;
}
.upgrade-content-wrapper.revealed {
    max-height: 500px; /* Adjust to fit content */
    opacity: 1;
    padding-bottom: 15px;
}
.upgrades-reveal-container h3 {
    font-size: 1.1rem;
    color: #f1c40f;
    margin-bottom: 0px;
}
.explore-button {
    padding: 10px 15px;
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
.upgrade-content {
  flex-grow: 1;
  display: flex;
  gap: 40px;
}
.column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.column h3 {
    font-size: 1.1rem;
    color: #f1c40f;
    margin-bottom: 10px;
}
.upgrade-button {
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #7f8c8d;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #34495e;
    color: #ecf0f1;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    min-height: 50px;
    box-sizing: border-box;
    line-height: 1.2;
    position: relative;
    overflow: hidden;
}
.upgrade-button:hover {
    background-color: #4a6572;
    border-color: #95a5a6;
}
.upgrade-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.upgrade-button:disabled:hover {
    background-color: #34495e;
    border-color: #7f8c8d;
}
.upgrade-button.purchased {
    background-color: transparent;
    border: 1px solid transparent;
    cursor: default;
    opacity: 1;
    min-height: 50px;
    box-sizing: border-box;
    line-height: 1.2;
    pointer-events: none;
}
.upgrade-button.purchased:hover {
    background-color: transparent;
    border-color: transparent;
}
.upgrade-button .stars {
    color: #f1c40f;
    font-size: 1.2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.star-symbol {
    color: #f1c40f;
    font-size: 1.2em;
}

.purchase-flash {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2ecc71;
    opacity: 0;
    animation: flash-animation 3.5s ease-out;
    pointer-events: none;
    z-index: 10;
}

@keyframes flash-animation {
    0% {
        opacity: 0.7;
        transform: scale(1);
    }
    80% {
        opacity: 0.1;
        transform: scale(1.35);
    }
    100% {
        opacity: 0;
        transform: scale(1.4);
    }
}
</style> 