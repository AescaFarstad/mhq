import type { MinigameState, MinigameType } from './MinigameTypes';
import type { GameState } from '../GameState'; // Needed for context, though sync might not use it directly

/**
 * Interface for minigame-specific UI state synchronization logic.
 * Each minigame that requires custom UI state handling should provide an implementation of this.
 */
export interface IMinigameUIStateManager {
    /**
     * Synchronizes the minigame's logical state to its representation in the global UI state.
     * 
     * @param gameState The full game state, containing both the minigame state and UI state to be updated.
     */
    sync(gameState: GameState): void;
}

// Example of how a specific minigame UI state manager might look (conceptual)
/*
import { ClickCounterState } from '../../minigames/click_counter/ClickCounterTypes';

export class ClickCounterUIStateManager implements IMinigameUIStateManager {
    sync(gameState: GameState): void {
        const minigameLogicState = gameState.activeMinigame?.state as ClickCounterState;
        const UIMinigameState = gameState.uiState.activeMinigameState;
        if (minigameLogicState && UIMinigameState) {
            // Assuming UIMinigameState is an object that can hold these properties
            // and is correctly typed or cast within the actual implementation.
            (UIMinigameState as any).clickCount = minigameLogicState.clickCount;
            (UIMinigameState as any).clicksToWin = minigameLogicState.clicksToWin; 
            // Potentially more complex transformations or calculations for UI
        }
    }
}
*/

/**
 * Signature for a minigame-specific UI state synchronization function.
 */
export type MinigameUISyncFn = (
    gameState: GameState
) => void;

/**
 * A registry to hold UI state sync functions for different minigame types.
 */
export const minigameUISyncFunctions: Map<MinigameType, MinigameUISyncFn> = new Map();

/**
 * Registers a UI state sync function for a specific minigame type.
 */
export function registerMinigameUISyncFunction(type: MinigameType, syncFn: MinigameUISyncFn): void {
    if (minigameUISyncFunctions.has(type)) {
        console.warn(`[MinigameUISync] Overwriting UI sync function for type: ${type}`);
    }
    minigameUISyncFunctions.set(type, syncFn);
    console.log(`[MinigameUISync] Registered UI sync function for type: ${type}`);
} 