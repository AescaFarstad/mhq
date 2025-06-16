import { inject, shallowRef } from 'vue';
// Key for provide/inject, can also be a Symbol for more robustness against collisions
export const GameStateKey = 'gameState';
export function useGameState() {
    // Attempt to inject gameState. It might be null if not provided by an ancestor.
    const injectedState = inject(GameStateKey);
    // To maintain a similar reactive structure as before (a shallowRef containing the state or null),
    // we can wrap the injectedState. Components will then access it via .value as they do now.
    // However, if inject returns undefined (not provided), we'll set it to null.
    const gameState = shallowRef(injectedState || null);
    if (!injectedState) {
        console.warn(`[useGameState] GameState was not provided. Ensure an ancestor component calls app.provide('${GameStateKey}', yourGameStateInstance).`);
    }
    return { gameState };
}
// setGlobalGameState is no longer needed with provide/inject
// export function setGlobalGameState(instance: GameState) {
//   // This was for the module-level global instance, which we are moving away from
// } 
