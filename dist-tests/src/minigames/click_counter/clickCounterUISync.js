/**
 * UI Sync function for the ClickCounter minigame.
 */
export const syncClickCounterUI = (gameState) => {
    const logicState = gameState.activeMinigame?.state;
    const UIMinigameState = gameState.uiState.activeMinigameState;
    if (logicState && UIMinigameState && typeof UIMinigameState === 'object') {
        UIMinigameState.clickCount = logicState.clickCount;
        UIMinigameState.clicksToWin = logicState.clicksToWin;
    }
    else {
        console.warn('syncClickCounterUI: logicState or UIMinigameState is null or not an object during sync.');
    }
};
