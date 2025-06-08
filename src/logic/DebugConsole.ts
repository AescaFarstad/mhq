import { GameState } from './GameState';
import { EventProcessor } from './Event';
import { Effect, EventDefinition } from './lib/definitions/EventDefinition';

/**
 * Provides methods to interact with the game via the browser console for debugging.
 */
export class DebugConsole {
    constructor() {}

    /**
     * Executes a specific game effect via the console.
     *
     * @param gameState The current GameState instance.
     * @param effectKey The key of the effect to execute.
     * @param params The parameters required by the effect.
     */
    public run(gameState: GameState, effectKey: string, params: any): void {
        const effect: Pick<Effect, 'key' | 'params'> = { key: effectKey, params: params };
        
        const eventDef: EventDefinition = {
            id: `console_event_${effectKey}_${Date.now()}`,
            effects: [effect as Effect] 
        };

        try {
            EventProcessor.processSingleEvent(eventDef, gameState);
        } catch (error) {
            console.error(`[DebugConsole] Error processing effect '${effectKey}':`, error);
        }
    }
}

/**
 * Initializes the debug console and exposes its functionality to the window object.
 * 
 * @param getGameState A function that returns the current GameState instance.
 */
export function initializeDebugConsole(
    getGameState: () => GameState | null | undefined
): void {
    if ((window as any).run) {
        console.warn("[DebugConsole] `run` is already defined on window. Skipping initialization.");
        return;
    }
    
    const debugConsoleInstance = new DebugConsole();

    (window as any).run = (effectKey: string, params: any) => {
        const gameState = getGameState();

        if (!gameState) {
            console.error("[DebugConsole] GameState is not available. Ensure it's initialized and the getter function is correct.");
            return;
        }
        debugConsoleInstance.run(gameState, effectKey, params);
    };
} 