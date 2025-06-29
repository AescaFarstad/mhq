import type { GameState } from '../../logic/GameState';
import type { IntroState } from './IntroGame';
import type { MinigameUISyncFn } from '../../logic/minigames/MinigameUIStateManager';

/**
 * UI Sync function for the Intro minigame.
 * This function copies the relevant state from the logic-side minigame state
 * to the UI-side minigame state, allowing Vue components to react to changes.
 */
export const introUISync: MinigameUISyncFn = (
    gameState: GameState
): void => {
    const logicState = gameState.activeMinigame?.state as IntroState | undefined;
    const uiState = gameState.uiState.activeMinigameState as IntroState | undefined;

    if (logicState && uiState) {
        // Sync intro-specific properties
        uiState.introProgress = logicState.introProgress;
        uiState.currentStep = logicState.currentStep;
        uiState.isCompleted = logicState.isCompleted;

        // Add other IntroState property syncing as needed
    } else {
        console.warn('introUISync: logicState or uiState is null or undefined during sync.');
    }
}; 