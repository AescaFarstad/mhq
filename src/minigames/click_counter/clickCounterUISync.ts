import type { GameState } from '../../logic/GameState';
import type { ClickCounterState } from './ClickCounterTypes';
import type { MinigameUISyncFn } from '../../logic/minigames/MinigameUIStateManager';

/**
 * UI Sync function for the ClickCounter minigame.
 */
export const syncClickCounterUI: MinigameUISyncFn = (
    gameState: GameState
): void => {
    const logicState = gameState.activeMinigame?.state as ClickCounterState;
    const UIMinigameState = gameState.uiState.activeMinigameState;

    if (logicState && UIMinigameState && typeof UIMinigameState === 'object') {
        (UIMinigameState as any).clickCount = logicState.clickCount;
        (UIMinigameState as any).clicksToWin = logicState.clicksToWin;
    } else {
        console.warn('syncClickCounterUI: logicState or UIMinigameState is null or not an object during sync.');
    }
}; 