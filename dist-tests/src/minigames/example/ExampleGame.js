import { EXAMPLE_TYPE } from './ExampleTypes';
import { reactive } from 'vue'; // Or shallowReactive if preferred for root
export class ExampleGame {
    id;
    type = EXAMPLE_TYPE;
    state;
    hidesMainUI = false; // Set to true for full-screen minigame
    constructor(id) {
        this.id = id;
        // Initialize your minigame's state here
        // All state properties that need to be reactive for the UI
        // should be within this reactive object.
        this.state = reactive({
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
    update(_gameState, _deltaTime) {
        // TODO: Implement your minigame's core logic here
        // This method is called repeatedly - use deltaTime for frame-rate independent updates.
        // console.log(`ExampleGame update, deltaTime: \${deltaTime}`);
    }
    /**
     * Called when the minigame is being exited or shut down.
     * Use this to clean up any resources, listeners, or ongoing processes.
     * @param _gameState The global game state.
     */
    destroy(_gameState) {
        // TODO: Add any cleanup logic specific to your minigame
        // This could include stopping timers, removing event listeners, etc.
        // console.log('ExampleGame destroyed');
    }
}
