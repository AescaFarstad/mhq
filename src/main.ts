import { createApp } from 'vue';
import './style.css'; // Optional: include a basic CSS file
import App from './App.vue';
import { GameState } from './logic/GameState';

// --- Synchronous Initialization ---
function initializeGame() {

    // Create the game state instance
    // This will also synchronously load the Lib definitions
    const gameState = new GameState();

    // Check if Lib loading was successful (optional but good practice)
    if (!gameState.lib.isLoaded) {
        console.error("Initialization failed: Could not process library definitions.");
        document.getElementById('app')!.innerHTML = '<h1 style="color: red;">Error processing game data. Please check console.</h1>';
        return; // Stop initialization
    }

    // Lib is loaded, proceed

    // Create the Vue app instance
    const app = createApp(App);

    // Provide the gameState to the Vue application
    app.provide('gameState', gameState);

    // Mount the Vue app
    app.mount('#app');

    // --- Game Loop ---
    let lastTimestamp = 0;

    function gameLoop(timestamp: number) {
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
        }
        const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert ms to seconds
        lastTimestamp = timestamp;

        gameState.update(deltaTime);

        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Start the initialization process
initializeGame(); 