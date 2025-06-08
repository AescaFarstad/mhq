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
        // Sync possession charges
        if (logicState.possessionCharges !== uiState.possessionCharges) {
            uiState.possessionCharges = logicState.possessionCharges;
        }

        // Sync total possession charges
        if (logicState.totalPossessionCharges !== uiState.totalPossessionCharges) {
            uiState.totalPossessionCharges = logicState.totalPossessionCharges;
        }

        // Sync character options - needs a deep copy for reactivity
        // A simple check and deep copy ensures the UI updates when cards change state
        if (JSON.stringify(logicState.characterOptions) !== JSON.stringify(uiState.characterOptions)) {
            uiState.characterOptions = JSON.parse(JSON.stringify(logicState.characterOptions));
        }

        // Sync inspection state
        if (logicState.inspectingCharacterId !== uiState.inspectingCharacterId) {
            uiState.inspectingCharacterId = logicState.inspectingCharacterId;
        }
        if (logicState.bioObfuscation !== uiState.bioObfuscation) {
            uiState.bioObfuscation = logicState.bioObfuscation;
        }

        // Sync useful words
        if (logicState.usefulWords !== uiState.usefulWords) { 
            uiState.usefulWords = [...logicState.usefulWords]; 
        }

        // Sync offensive words
        if (logicState.offensiveWords !== uiState.offensiveWords) { 
            uiState.offensiveWords = [...logicState.offensiveWords]; 
        }
        
        // Sync blank words (assuming it might change and needs syncing)
        if (logicState.blankWords !== uiState.blankWords) { 
            uiState.blankWords = [...logicState.blankWords]; 
        }

        // Sync upgrades
        if (JSON.stringify(logicState.upgrades) !== JSON.stringify(uiState.upgrades)) {
            uiState.upgrades = JSON.parse(JSON.stringify(logicState.upgrades));
        }

        if (logicState.upgradesRevealed !== uiState.upgradesRevealed) {
            uiState.upgradesRevealed = logicState.upgradesRevealed;
        }

        if (logicState.possessionProgress !== uiState.possessionProgress) {
            uiState.possessionProgress = logicState.possessionProgress;
        }

        // Sync character XP bonuses
        if (JSON.stringify(logicState.characterXpBonuses) !== JSON.stringify(uiState.characterXpBonuses)) {
            uiState.characterXpBonuses = JSON.parse(JSON.stringify(logicState.characterXpBonuses));
        }

        if (logicState.engaged !== uiState.engaged) {
            uiState.engaged = logicState.engaged;
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