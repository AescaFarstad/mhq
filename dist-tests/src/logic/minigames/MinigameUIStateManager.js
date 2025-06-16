/**
 * A registry to hold UI state sync functions for different minigame types.
 */
export const minigameUISyncFunctions = new Map();
/**
 * Registers a UI state sync function for a specific minigame type.
 */
export function registerMinigameUISyncFunction(type, syncFn) {
    if (minigameUISyncFunctions.has(type)) {
        console.warn(`[MinigameUISync] Overwriting UI sync function for type: ${type}`);
    }
    minigameUISyncFunctions.set(type, syncFn);
}
