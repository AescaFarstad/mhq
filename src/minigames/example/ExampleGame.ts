import type { GameState } from '../../logic/GameState';
import type { BaseMinigame } from '../../logic/minigames/MinigameTypes';
import { EXAMPLE_TYPE, type ExampleState } from './ExampleTypes';
import { reactive } from 'vue'; // Or shallowReactive if preferred for root

export class ExampleGame implements BaseMinigame<ExampleState> {
    readonly id: string;
    readonly type = EXAMPLE_TYPE;
    public state: ExampleState;
    public hidesMainUI = false; // Set to true for full-screen minigame

    constructor(id: string) {
        this.id = id;
        
        // Initialize your minigame's state here
        // All state properties that need to be reactive for the UI
        // should be within this reactive object.
        this.state = reactive<ExampleState>({
            // Example initial state:
            // score: 0,
            // currentLevel: 'level1',
            // isActive: true,
        });
    }

    /**
     * Called every game tick while the minigame is active.
     * @param _gameState The global game state.
     * @param deltaTime The time elapsed since the last update, in seconds.
     */
    update(_gameState: GameState, deltaTime: number): void {
        // TODO: Implement your minigame's core logic here
        // This method is called repeatedly - use deltaTime for frame-rate independent updates.
        // console.log(`ExampleGame update, deltaTime: \${deltaTime}`);
    }

    /**
     * Called when the minigame is being exited or shut down.
     * Use this to clean up any resources, listeners, or ongoing processes.
     * @param _gameState The global game state.
     */
    destroy(_gameState: GameState): void {
        // TODO: Add any cleanup logic specific to your minigame
        // This could include stopping timers, removing event listeners, etc.
        // console.log('ExampleGame destroyed');
    }

    // TODO: Add your custom minigame methods here
    // For example:
    // public increaseScore(points: number): void {
    //    if (this.state.isActive) {
    //        this.state.score += points;
    //    }
    // }
    //
    // public completeLevel(): void {
    //     this.state.currentLevel = 'nextLevel'; // Or some other logic
    // }
} 