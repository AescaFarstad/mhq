// Defines the type of the minigame for identification and routing.
export type MinigameType = 'ClickCounter' | 'Welcome' | 'Ingress' | 'Example'; // Add other minigame types here

// Base interface for the state of any minigame.
// Specific minigames will extend this with their own state properties.
export interface MinigameState {
    // Common state properties can be added here if needed in the future.
}

// Base interface for all minigame logic classes.
export interface BaseMinigame<TState extends MinigameState> {
    readonly id: string; // Unique identifier for this instance of the minigame
    readonly type: MinigameType;
    state: TState;
    hidesMainUI: boolean; // If true, the main game UI should be hidden

    // Called every game tick to update the minigame's logic.
    update(gameState: any, deltaTime: number): void;

    // Called when the minigame is being closed/exited.
    // Should perform any cleanup and potentially signal GameState to remove it.
    destroy(gameState: any): void;
} 