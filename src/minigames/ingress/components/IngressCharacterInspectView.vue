<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import type { GameState } from '../../../logic/GameState';
import type { IngressGame } from '../IngressGame';
import { INGRESS_TYPE, type IngressState } from '../IngressTypes';
import ImageHolder from '../../../components/common/ImageHolder.vue';
import { obfuscateString } from '../../../utils/stringUtils';
import PossessionChargesBar from './PossessionChargesBar.vue';

const gameState = inject<GameState>('gameState');
const newName = ref('');

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

const characterDef = computed(() => {
    if (!ingressState.value?.inspectingCharacterId || !gameState) {
        return null;
    }
    return gameState.lib.characters.getCharacter(ingressState.value.inspectingCharacterId);
});

const xpBonus = computed(() => {
    if (!ingressState.value?.inspectingCharacterId) return 0;
    return ingressState.value.characterXpBonuses[ingressState.value.inspectingCharacterId] || 0;
});

const displayedCharacterName = computed(() => {
    if (!characterDef.value) return '';
    if (ingressState.value?.characterRenames && ingressState.value.characterRenames[characterDef.value.id]) {
        return ingressState.value.characterRenames[characterDef.value.id];
    }
    return characterDef.value.name;
});

const locationDef = computed(() => {
    if (!characterDef.value?.location || !gameState) {
        return null;
    }
    return gameState.lib.welcomeLocations.getLocation(characterDef.value.location);
});

const obfuscatedBio = computed(() => {
    if (!characterDef.value?.bio || ingressState.value === null) {
        return '';
    }
    return obfuscateString(characterDef.value.bio, ingressState.value.bioObfuscation, 0.4);
});

const handleDeobfuscate = () => {
    ingressGame.value?.deobfuscateBio();
};

const isPossessButtonDisabled = computed(() => {
    if (!ingressState.value) {
        return true;
    }
    return ingressState.value.possessionProgress < 100 || ingressState.value.possessionCharges < 10;
});

const handlePossess = () => {
    if (ingressGame.value && gameState) {
        ingressGame.value.commitAndPossess(gameState);
    }
};

const handleClose = () => {
    ingressGame.value?.closeCharacterInspection();
};

const isNewNameValid = computed(() => {
    return newName.value.trim().length >= 3 && newName.value.trim().length <= 12;
});

const handleOpenRenameDialog = () => {
    if (characterDef.value) {
        newName.value = displayedCharacterName.value;
        ingressGame.value?.openRenameDialog();
    }
};

const handleCloseRenameDialog = () => {
    ingressGame.value?.closeRenameDialog();
};

const handleRename = () => {
    if (isNewNameValid.value) {
        ingressGame.value?.renameCharacter(newName.value);
    }
};

const deobfuscateButtonLabel = computed(() => {
    if (!ingressState.value) return 'See through';
    // Based on the logic in IngressGame.ts deobfuscateBio
    const steps = Math.round(ingressState.value.bioObfuscation * 5);
    switch (steps) {
        case 5: return 'Squint';
        case 3: return 'Grasp';
        case 2: return 'Discern';
        case 1: return 'Absorb';
        default: return 'See through';
    }
});
</script>

<template>
    <div class="inspect-view-panel">
        <button class="close-button" @click="handleClose">×</button>
        <PossessionChargesBar
            v-if="ingressState"
            :charges="ingressState.possessionCharges"
            :possession-progress="ingressState.possessionProgress"
            :total-possession-charges="ingressState.totalPossessionCharges"
            :upgrades="ingressState.upgrades"
            :show-progress="false"
        />
        <div v-if="characterDef" class="inspect-content">
            <div class="char-portrait-panel">
                <div class="name-container">
                    <h2 class="char-name">{{ displayedCharacterName }}</h2>
                    <button @click="handleOpenRenameDialog" class="rename-button" :disabled="!ingressState || ingressState.possessionCharges < 1">✏️ ☆</button>
                </div>
                <div class="portrait-container">
                    <ImageHolder 
                        v-if="characterDef.fullImage"
                        :atlas-name="'heroes'"
                        :image-name="characterDef.portraitImage || characterDef.fullImage"
                        :display-width="254"
                        :display-height="360"
                    />
                    <div v-if="xpBonus > 0" class="xp-bonus-overlay">+{{ xpBonus }}% XP</div>
                </div>
            </div>
            <div class="char-details-panel">
                <div class="bio-container">
                    <p class="bio-text">{{ obfuscatedBio }}</p>
                </div>
                <div class="actions-container">
                    <button 
                        v-if="ingressState && ingressState.bioObfuscation > 0"
                        @click="handleDeobfuscate" 
                        :disabled="ingressState.possessionCharges < 1"
                        class="action-button deobfuscate-button"
                    >
                        {{ deobfuscateButtonLabel }} ☆
                    </button>
                </div>
            </div>
            <div class="commit-panel" v-if="locationDef">
                <div class="location-image-container">
                    <img :src="'img/' + locationDef.imageName" :alt="locationDef.name" class="location-image"/>
                </div>
                <div class="possess-button-container">
                    <button 
                        @click="handlePossess" 
                        :disabled="isPossessButtonDisabled"
                        class="action-button possess-button"
                    >
                        Commit and possess <br> <span class="highlight-name">{{ displayedCharacterName }}</span> in <span class="highlight-name">{{ locationDef.name }}</span><br> ☆☆☆☆☆ ☆☆☆☆☆
                    </button>
                    <div v-if="ingressState && ingressState.possessionProgress < 100" class="possess-button-overlay">
                        <span class="overlay-percentage">{{ Math.floor(ingressState.possessionProgress) }}%</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="ingressState && ingressState.renamingCharacterId === characterDef?.id" class="rename-dialog-backdrop">
            <div class="rename-dialog">
                <h3>Rename {{ displayedCharacterName }}</h3>
                <input type="text" v-model="newName" class="rename-input" placeholder="Inscribe New Name" />
                <div class="rename-dialog-actions">
                    <span class="error-message" :class="{ 'error-visible': !isNewNameValid }">Names require 3-12 characters.</span>
                    <button @click="handleCloseRenameDialog" class="dialog-button cancel-button">Cancel</button>
                    <button @click="handleRename" class="dialog-button confirm-button" :disabled="!ingressState || ingressState.possessionCharges < 1 || !isNewNameValid">Rename ☆</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.inspect-view-panel {
    width: 100%;
    background-color: #2c3e50;
    border: 2px solid #7f8c8d;
    border-radius: 15px;
    padding: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    position: relative;
    color: #ecf0f1;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.close-button {
    position: absolute;
    top: 10px;
    right: 12px;
    background: #2c3e50;
    color: #ecf0f1;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    border: none;
    z-index: 11;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 4px;
}
.inspect-content {
    display: flex;
    gap: 25px;
    height: 100%;
    flex-grow: 1;
    min-height: 0;
}
.char-portrait-panel {
    flex-basis: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.name-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
}
.rename-button {
    background-color: #546e7a;
    color: #cfd8dc;
    padding: 4px 8px;
    font-size: 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: absolute;
    right: 0;
}
.rename-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
.rename-button:not(:disabled):hover {
    background-color: #455a64;
}
.char-portrait-panel .char-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f1c40f;
}
.portrait-container {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
}
.xp-bonus-overlay {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #f1c40f;
    color: #2c3e50;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    z-index: 1;
}
.char-details-panel {
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
}
.bio-container {
    flex-grow: 1;
    background-color: rgba(0,0,0,0.2);
    border-radius: 8px;
    padding: 15px;
    padding-top: 8px;
    overflow-y: auto;
    font-family: 'Source Code Pro', Courier, monospace;
    font-size: 1.0rem;
    line-height: 1.6;
}
.actions-container {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.action-button {
    padding: 12px;
    border-radius: 5px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
}
.action-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
.deobfuscate-button {
    background-color: #546e7a;
    color: #cfd8dc;
    padding: 8px 12px;
    font-size: 0.9rem;
}
.deobfuscate-button:not(:disabled):hover {
    background-color: #455a64;
}
.commit-panel {
    flex-basis: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}
.location-image-container {
    width: 320px;
    height: 270px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}
.location-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
}
.possess-button-container {
    position: relative;
    width: 100%;
}
.possess-button {
    background-color: #e67e22;
    color: white;
    font-size: 1.2rem;
    width: 100%;
    padding: 15px;
    line-height: 1.4;
}
.possess-button:not(:disabled):hover {
    background-color: #d35400;
}
.possess-button-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px; /* Matches .action-button */
    background: repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 10px,
        rgba(0, 0, 0, 0.3) 10px,
        rgba(0, 0, 0, 0.3) 20px
    );
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}
.overlay-percentage {
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
}
.highlight-name {
    text-decoration: underline;
    font-size: 1.1em;
    color: #f1c40f;
    font-weight: bold;
}
.rename-dialog-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border-radius: 15px;
}
.rename-dialog {
    background-color: #34495e;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    gap: 15px;
    border: 1px solid #7f8c8d;
    width: 90%;
    max-width: 450px;
}
.rename-dialog h3 {
    margin: 0;
    color: #f1c40f;
    text-align: center;
}
.rename-input {
    padding: 10px;
    border: 1px solid #7f8c8d;
    border-radius: 4px;
    background-color: #ecf0f1;
    color: #2c3e50;
    font-size: 1rem;
}
.rename-dialog-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
}
.error-message {
    color: #e74c3c;
    font-size: 0.75rem;
    margin-right: auto;
    visibility: hidden;
}
.error-message.error-visible {
    visibility: visible;
}
.dialog-button {
    padding: 8px 15px;
    border-radius: 5px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
}
.dialog-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
.cancel-button {
    background-color: #7f8c8d;
    color: #ecf0f1;
}
.cancel-button:hover {
    background-color: #95a5a6;
}
.confirm-button {
    background-color: #e67e22;
    color: white;
}
.confirm-button:not(:disabled):hover {
    background-color: #d35400;
}
</style> 