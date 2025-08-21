import type { GameState } from '../../logic/GameState';
import type { FirstStepsState } from './FirstStepsGame';
import type { MinigameUISyncFn } from '../../logic/minigames/MinigameUIStateManager';
import { DialogState } from '../../logic/dialog/Dialog';

/**
 * UI Sync function for the FirstSteps minigame.
 * This function copies the relevant state from the logic-side minigame state
 * to the UI-side minigame state, allowing Vue components to react to changes.
 * For a blank scaffold, this function will be minimal.
 */
export const syncFirstStepsUI: MinigameUISyncFn = (
    gameState: GameState
): void => {
    const logicState = gameState.activeMinigame?.state as FirstStepsState | undefined;
    const uiState = gameState.uiState.activeMinigameState as FirstStepsState | undefined;
    const dialogState = gameState.dialogs[gameState.activeMinigame!.id] as DialogState | undefined;

    if (logicState && uiState && dialogState) {
        if (!uiState.dialogState) {
            uiState.dialogState = { nodes: [], choicesMade: [], definitionId: dialogState.definitionId } as any;
        }
        const uiDialog = uiState.dialogState as any;

        if (JSON.stringify(uiDialog.nodes) !== JSON.stringify(dialogState.nodes)) {
            uiDialog.nodes = [...dialogState.nodes];
        }
        if (JSON.stringify(uiDialog.choicesMade) !== JSON.stringify(dialogState.choicesMade)) {
            uiDialog.choicesMade = [...dialogState.choicesMade];
        }
        if (uiDialog.definitionId !== dialogState.definitionId) {
            uiDialog.definitionId = dialogState.definitionId;
        }
    }
}; 