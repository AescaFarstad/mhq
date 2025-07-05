import type { GameState } from '../../logic/GameState';
import type { IngressState } from './IngressTypes';
import type { MinigameUISyncFn } from '../../logic/minigames/MinigameUIStateManager';

/**
 * UI Sync function for the Ingress minigame.
 * This function copies the relevant state from the logic-side minigame state
 * to the UI-side minigame state, allowing Vue components to react to changes.
 * For a blank scaffold, this function will be minimal.
 */
export const syncIngressUI: MinigameUISyncFn = (
    gameState: GameState
): void => {
    const logicState = gameState.activeMinigame?.state as IngressState | undefined;
    const uiState = gameState.uiState.activeMinigameState as IngressState | undefined;

    if (logicState && uiState) {
        // Sync aspect points
        if (logicState.aspectPoints !== uiState.aspectPoints) {
            uiState.aspectPoints = logicState.aspectPoints;
        }

        // Sync total aspect points
        if (logicState.totalAspectPoints !== uiState.totalAspectPoints) {
            uiState.totalAspectPoints = logicState.totalAspectPoints;
        }

        // Sync character options - needs a deep copy for reactivity
        // A simple check and deep copy ensures the UI updates when cards change state
        if (JSON.stringify(logicState.characterOptions) !== JSON.stringify(uiState.characterOptions)) {
            uiState.characterOptions = JSON.parse(JSON.stringify(logicState.characterOptions));
        }

        // Sync envision state
        if (logicState.charactersAvailableToEnvision !== uiState.charactersAvailableToEnvision) {
            uiState.charactersAvailableToEnvision = logicState.charactersAvailableToEnvision;
        }
        if (logicState.hasEnvisioned !== uiState.hasEnvisioned) {
            uiState.hasEnvisioned = logicState.hasEnvisioned;
        }

        // Sync inspection state
        if (logicState.inspectingCharacterId !== uiState.inspectingCharacterId) {
            uiState.inspectingCharacterId = logicState.inspectingCharacterId;
        }

        // Sync substantive words
        if (logicState.substantiveWords !== uiState.substantiveWords) {
            uiState.substantiveWords = [...logicState.substantiveWords];
        }

        // Sync offensive words
        if (logicState.offensiveWords !== uiState.offensiveWords) { 
            uiState.offensiveWords = [...logicState.offensiveWords]; 
        }
        
        // Sync blank words (assuming it might change and needs syncing)
        if (logicState.blankWords !== uiState.blankWords) { 
            uiState.blankWords = [...logicState.blankWords]; 
        }

        // Sync comprehensive word storage
        if (logicState.allSubmittedWords !== uiState.allSubmittedWords) {
            uiState.allSubmittedWords = [...logicState.allSubmittedWords];
        }

        // Sync upgrades
        if (JSON.stringify(logicState.upgrades) !== JSON.stringify(uiState.upgrades)) {
            uiState.upgrades = JSON.parse(JSON.stringify(logicState.upgrades));
        }

        if (logicState.upgradesRevealed !== uiState.upgradesRevealed) {
            uiState.upgradesRevealed = logicState.upgradesRevealed;
        }

        if (logicState.materializationProgress !== uiState.materializationProgress) {
            uiState.materializationProgress = logicState.materializationProgress;
        }

        // Sync character XP bonuses
        if (JSON.stringify(logicState.characterXpBonuses) !== JSON.stringify(uiState.characterXpBonuses)) {
            uiState.characterXpBonuses = JSON.parse(JSON.stringify(logicState.characterXpBonuses));
        }

        if (logicState.engaged !== uiState.engaged) {
            uiState.engaged = logicState.engaged;
        }

        if (logicState.engagementProgress !== uiState.engagementProgress) {
            uiState.engagementProgress = logicState.engagementProgress;
        }

        if (logicState.engagementCompletionTime !== uiState.engagementCompletionTime) {
            uiState.engagementCompletionTime = logicState.engagementCompletionTime;
        }

        if (logicState.characterBioObfuscation !== uiState.characterBioObfuscation) {
            uiState.characterBioObfuscation = logicState.characterBioObfuscation;
        }

        // Add other properties from IngressState that need to be kept in sync
        // For example:
        // if (logicState.score !== uiState.score) {
        //     uiState.score = logicState.score;
        // }

    } else {
        // This warning can be helpful during development if sync is called unexpectedly
        // console.warn('syncIngressUI: logicState or uiState is null or undefined during sync.');
    }
}; 