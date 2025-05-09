<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted, reactive } from 'vue';
import { GameState } from './logic/GameState';
// Import the new components
import ResourceDisplay from './components/ResourceDisplay.vue';
import CastleView from './components/tabs/CastleView.vue';
import CrewView from './components/tabs/CrewView.vue';
import QuestsView from './components/tabs/QuestsView.vue';
import DebugView from './components/tabs/DebugView.vue'; // Import the Debug view

// Inject the game state provided in main.ts
const gameState = inject<GameState>('gameState');

// Tab management
const activeTab = ref('Castle'); // Default tab
const tabs = ['Castle', 'Crew', 'Quests', 'Debug']; // Add 'Debug' to list of tabs

// Notify GameState when tab changes
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  if (gameState) {
    gameState.setActiveTab(tabName);
  }
};

// Dialog visibility
const showDialog = ref(false); // Initially hidden

onMounted(() => {
  if (!gameState) {
    console.error("GameState not injected or provided!");
    return; // Stop setup if no game state
  }

  // Set initial active tab in GameState
  if (gameState) {
    gameState.setActiveTab(activeTab.value);
  }
});

</script>

<template>
  <div class="app-container">
    <!-- Left Sidebar for Resources -->
    <div class="sidebar">
      <!-- Use the ResourceDisplay component -->
      <ResourceDisplay />
    </div>

    <!-- Right Main Content Area with Tabs -->
    <div class="main-content">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="setActiveTab(tab)"
          :class="{ active: activeTab === tab }"
        >
          {{ tab }}
        </button>
      </div>
      <div class="tab-content">
        <!-- Use the Tab components -->
        <CastleView v-if="activeTab === 'Castle'" />
        <CrewView v-if="activeTab === 'Crew'" />
        <QuestsView v-if="activeTab === 'Quests'" />
        <!-- Add the DebugView component, passing the stats -->
        <DebugView v-if="activeTab === 'Debug' && gameState" :stats="gameState.uiState.debugStats" />
      </div>
    </div>

    <!-- Overlay Dialog -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h2>Dialog Title</h2>
        <p>This is the dialog content. It appears on top of everything.</p>
        <button @click="showDialog = false">Close</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  position: relative; /* Needed for absolute positioning of the dialog */
}

.sidebar {
  width: 240px; /* Increased width */
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
  overflow-y: auto; /* Add scroll if content overflows */
}

.main-content {
  flex-grow: 1; /* Takes up remaining space */
  padding: 15px;
  display: flex;
  flex-direction: column; /* Stack tabs and content vertically */
  overflow-y: auto; /* Add scroll if content overflows */
}

.tabs {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
}

.tabs button {
  padding: 10px 15px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1em;
  border-bottom: 3px solid transparent; /* Placeholder for active indicator */
  margin-bottom: -1px; /* Align with the content border */
}

.tabs button.active {
  border-bottom-color: #007bff; /* Active tab indicator color */
  font-weight: bold;
}

.tabs button:hover {
  background-color: #eee;
}

.tab-content {
  flex-grow: 1; /* Takes up remaining space in main-content */
}

/* Dialog Styles */
.dialog-overlay {
  position: absolute; /* Position relative to .app-container */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's on top */
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  text-align: center;
}

.dialog-content h2 {
    margin-top: 0;
}

.dialog-content button {
    margin-top: 15px;
    padding: 8px 15px;
    cursor: pointer;
}
</style> 