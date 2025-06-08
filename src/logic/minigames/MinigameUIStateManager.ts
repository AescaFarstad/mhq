import type { MinigameType } from './MinigameTypes';
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
} 