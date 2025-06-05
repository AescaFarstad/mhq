import type { GameState } from '../../logic/GameState';
import type { ExampleState } from './ExampleTypes';
import type { MinigameUISyncFn } from '../../logic/minigames/MinigameUIStateManager';

/**
 * UI Sync function for the Example minigame.
 * This function copies the relevant state from the logic-side minigame state
 * to the UI-side minigame state, allowing Vue components to react to changes.
 * For a blank scaffold, this function will be minimal.
 */
export const syncExampleUI: MinigameUISyncFn = (
    gameState: GameState
): void => {
    const logicState = gameState.activeMinigame?.state as ExampleState | undefined;
    const uiState = gameState.uiState.activeMinigameState as ExampleState | undefined;

    if (logicState && uiState) {
        // TODO: Sync Example-specific state properties here
        // Example:
        // if (logicState.score !== uiState.score) {
        //     uiState.score = logicState.score;
        // }
        // if (logicState.currentLevel !== uiState.currentLevel) {
        //     uiState.currentLevel = logicState.currentLevel;
        // }
        // For complex objects or arrays, ensure deep copies if necessary to trigger reactivity,
        // or sync property by property for finer control.
        // e.g., uiState.someArray = [...logicState.someArray];
        // e.g., uiState.someObject = { ...logicState.someObject };

        // For now, as a blank scaffold, there are no specific properties to sync.
        // Add them as you define ExampleState and need them reflected in the UI.
    } else {
        // This warning can be helpful during development if sync is called unexpectedly
        // console.warn('syncExampleUI: logicState or uiState is null or undefined during sync.');
    }
}; 