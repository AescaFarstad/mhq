import { createApp } from 'vue';
import './style.css'; // Optional: include a basic CSS file
import App from './App.vue';
import { GameState } from './logic/GameState';
import { processInputs } from './logic/input/InputProcessor';
import { initializeDebugConsole } from './logic/DebugConsole';
import { registerMinigameUISyncFunction } from './logic/minigames/MinigameUIStateManager';
import { syncClickCounterUI } from './minigames/click_counter/clickCounterUISync';
import { CLICK_COUNTER_TYPE } from './minigames/click_counter/ClickCounterTypes';
import { welcomeUISync } from './minigames/welcome/welcomeUISync';
import { WELCOME_TYPE } from './minigames/welcome/WelcomeGame';
import { syncIngressUI } from './minigames/ingress/ingressUISync';
import { INGRESS_TYPE } from './minigames/ingress/IngressTypes';
import { syncExampleUI } from './minigames/example/exampleUISync';
import { EXAMPLE_TYPE } from './minigames/example/ExampleGame';
import { syncFirstStepsUI } from './minigames/firststeps/firstStepsUISync';
import { FIRSTSTEPS_TYPE } from './minigames/firststeps/FirstStepsGame';
import { introUISync } from './minigames/intro/introUISync';
import { INTRO_TYPE } from './minigames/intro/IntroGame';
import { EventProcessor } from './logic/Event';
import { runTests } from '../tests/testRunner';
import { FPSCounter } from './utils/FPSCounter';
import { reactive } from 'vue';

// import { setGlobalGameState } from './composables/useGameState'; // No longer needed

// --- Synchronous Initialization ---
function initializeGame() {

    // This will also synchronously load the Lib definitions
    const gameState = new GameState();
    if (!gameState.lib.isLoaded) {
        console.error("Initialization failed: Could not process library definitions.");
        document.getElementById('app')!.innerHTML = '<h1 style="color: red;">Error processing game data. Please check console.</h1>';
        return; // Stop initialization
    }
    const app = createApp(App);

    // Create standalone FPS counter and reactive metrics
    const fpsCounter = new FPSCounter();
    const fpsMetrics = reactive({
        currentFPS: 0,
        averageFPS: 0,
        maxFrameTime: 0
    });

    // Provide the gameState to the Vue application
    // Make sure the key matches what useGameState expects, e.g., GameStateKey if you defined it
    app.provide('gameState', gameState);
    app.provide('fpsMetrics', fpsMetrics);

    // Register Minigame UI Sync Functions
    registerMinigameUISyncFunction(CLICK_COUNTER_TYPE, syncClickCounterUI);
    registerMinigameUISyncFunction(WELCOME_TYPE, welcomeUISync);
    registerMinigameUISyncFunction(INGRESS_TYPE, syncIngressUI);
    registerMinigameUISyncFunction(EXAMPLE_TYPE, syncExampleUI);
    registerMinigameUISyncFunction(INTRO_TYPE, introUISync);
    registerMinigameUISyncFunction(FIRSTSTEPS_TYPE, syncFirstStepsUI);
    // Register other minigame UI sync functions here

    initializeDebugConsole(
        () => gameState
    );
    
    runTests();


    // Mount the Vue app
    app.mount('#app');

    const startGameEvent = gameState.lib.events.get("startGame")!;
    EventProcessor.processSingleEvent(startGameEvent, gameState);

    // --- Game Loop ---
    let lastTimestamp = 0;
    let accumulatedTime = 0;

    function gameLoop(timestamp: number) {
        // Update FPS counter and metrics
        fpsCounter.update(timestamp);
        const metrics = fpsCounter.getMetrics();
        fpsMetrics.currentFPS = metrics.currentFPS;
        fpsMetrics.averageFPS = metrics.averageFPS;
        fpsMetrics.maxFrameTime = metrics.maxFrameTime;
        
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
        }
        const rawDeltaTime = (timestamp - lastTimestamp) / 1000; // Convert ms to seconds
        lastTimestamp = timestamp;

        // Apply time scale to rawDeltaTime
        const scaledDeltaTime = rawDeltaTime * gameState.timeScale.current;

        accumulatedTime += scaledDeltaTime;

        processInputs(gameState);

        // Process game logic if enough accumulated time has passed
        if (gameState.allowedUpdates > 0) {
            gameState.update(gameState.minDeltaTime); // Use minDeltaTime for a consistent tick
            gameState.allowedUpdates--;
            accumulatedTime = 0; // Reset accumulated time after a tick
        } else if (accumulatedTime >= gameState.minDeltaTime) {
            gameState.update(Math.min(10.0, accumulatedTime));
            accumulatedTime = 0;
        }

        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Start the initialization process
initializeGame(); 