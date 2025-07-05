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
        uiState.currentNodeId = logicState.currentNodeId;
        uiState.currentNodeType = logicState.currentNodeType;
        uiState.currentText = logicState.currentText;
        uiState.currentSpeakerId = logicState.currentSpeakerId;
        uiState.currentChoices = logicState.currentChoices;
        uiState.backgroundImage = logicState.backgroundImage;
        uiState.isWaitingForChoice = logicState.isWaitingForChoice;
        uiState.isEnded = logicState.isEnded;
        uiState.isEnding = logicState.isEnding;
        uiState.isSpecialEnding = logicState.isSpecialEnding;
        uiState.endingStartTime = logicState.endingStartTime;
        uiState.dialogStarted = logicState.dialogStarted;
        
        // Ensure dialog history exists on UI state
        if (!uiState.dialogHistory) {
            uiState.dialogHistory = [];
        }
        
        // Sync dialog history - create new array reference to ensure Vue reactivity
        const needsHistoryUpdate = uiState.dialogHistory.length !== logicState.dialogHistory.length ||
            !uiState.dialogHistory.every((item, index) => item === logicState.dialogHistory[index]);
        
        if (needsHistoryUpdate) {
            uiState.dialogHistory = [...logicState.dialogHistory];
        }
    } else {
        console.warn('introUISync: logicState or uiState is null or undefined during sync.');
    }
}; 