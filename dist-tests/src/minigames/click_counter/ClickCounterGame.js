import { CLICK_COUNTER_TYPE } from './ClickCounterTypes';
import { reactive } from 'vue'; // Import reactive from Vue
const CLICKS_TO_WIN_DEFAULT = 5;
export class ClickCounterGame {
    id;
    type = CLICK_COUNTER_TYPE;
    state;
    hidesMainUI = false; // This minigame overlays, does not hide main UI
    constructor(id, initialClicksToWin) {
        this.id = id;
        // Make the internal state reactive
        this.state = reactive({
            clickCount: 0,
            clicksToWin: initialClicksToWin || CLICKS_TO_WIN_DEFAULT,
        });
    }
    update(_gameState, _deltaTime) {
        // Game logic update, if any, would go here.
        // For this simple game, most logic is driven by UI interaction handled in the Vue component
        // and direct calls to methods like recordClick.
    }
    destroy(_gameState) {
        // Perform any cleanup specific to this minigame instance.
        // In this case, there's not much to do beyond GameState handling its removal.
    }
    // --- Minigame Specific Methods ---
    recordClick(gameState) {
        this.state.clickCount++; // This now mutates a reactive property
        if (this.state.clickCount >= this.state.clicksToWin) {
            gameState.exitMinigame(); // Request GameState to exit this minigame
        }
    }
}
