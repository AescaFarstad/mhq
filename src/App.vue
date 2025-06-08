<script setup lang="ts">
import { ref, inject, onMounted, computed } from 'vue';
import { GameState, globalInputQueue, ALL_TAB_IDS } from './logic/GameState';
import type { CmdTimeScale, CmdTickOnce } from './logic/input/InputCommands';
import ResourceDisplay from './components/ResourceDisplay.vue';
import CastleView from './components/tabs/CastleView.vue';
import CrewView from './components/tabs/CrewView.vue';
import QuestsView from './components/tabs/QuestsView.vue';
import DebugView from './components/tabs/DebugView.vue';
import TasksView from './components/tabs/TasksView.vue';
import ClickCounterView from './minigames/click_counter/ClickCounterView.vue';
import WelcomeView from './minigames/welcome/WelcomeView.vue';
import IngressView from './minigames/ingress/IngressView.vue';
import ExampleView from './minigames/example/ExampleView.vue';

// Inject the game state provided in main.ts
const gameState = inject<GameState>('gameState');

// Tab management
const activeTab = ref('Castle');

const displayedTabs = computed(() => {
  if (!gameState) return [];
  return ALL_TAB_IDS.filter((tabId: string) => gameState.isDiscovered(tabId));
});

// Use discoveredItemsCount to force UI refresh when discoveries happen
const uiRefreshKey = computed(() => {
  return gameState?.uiState.discoveredItemsCount ?? 0;
});

// Active minigame type for conditional rendering
const activeMinigameType = computed(() => {
  return gameState?.uiState.activeMinigameType;
});

const shouldHideMainUI = computed(() => {
  return gameState?.activeMinigame?.hidesMainUI === true;
});

const timeControlScales = [
  { label: "Pause", value: 0 },
  { label: "0.01x", value: 0.01 },
  { label: "0.1x", value: 0.1 },
  { label: "0.3x", value: 0.3 },
  { label: "1x", value: 1 },
  { label: "3x", value: 3 },
  { label: "10x", value: 10 },
  { label: "100x", value: 100 },
];

const currentTimeScaleDisplay = computed(() => {
  if (gameState) {
    return gameState.uiState.currentTimeScale.toFixed(2);
  }
  return '1.00'; // Default display if gameState is not yet available
});

const queueTimeScaleCommand = (scale: number) => {
  if (gameState) {
    const command: CmdTimeScale = { name: "CmdTimeScale", scale: scale };
    globalInputQueue.push(command);
  }
};

const queueTickOnceCommand = () => {
  if (gameState) {
    const command: CmdTickOnce = { name: "CmdTickOnce" };
    globalInputQueue.push(command);
  }
};

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
    <!-- Main Game UI (conditionally hidden) -->
    <template v-if="!shouldHideMainUI">
      <!-- Left Sidebar for Resources -->
      <div class="sidebar">
        <!-- Use the ResourceDisplay component -->
        <ResourceDisplay />
      </div>

      <!-- Right Main Content Area with Tabs -->
      <div class="main-content">
        <div class="tabs">
          <button
            v-for="tab in displayedTabs"
            :key="tab"
            @click="setActiveTab(tab)"
            :class="{ active: activeTab === tab }"
          >
            {{ tab }}
          </button>
          <div class="time-controls">
            <span class="current-timescale">{{ currentTimeScaleDisplay }}x</span>
            <button
              v-for="control in timeControlScales"
              :key="control.label"
              @click="queueTimeScaleCommand(control.value)"
              :class="{ active: gameState && gameState.uiState.currentTimeScale === control.value }"
            >
              {{ control.label }}
            </button>
            <button @click="queueTickOnceCommand()" class="tick-button">Tick</button>
          </div>
        </div>
        <div class="tab-content" :key="uiRefreshKey">
          <!-- Use the Tab components -->
          <CastleView v-if="activeTab === 'Castle'" />
          <CrewView v-if="activeTab === 'Crew'" />
          <QuestsView v-if="activeTab === 'Quests'" />
          <TasksView v-if="activeTab === 'Tasks'" />
          <!-- Add the DebugView component, passing the stats -->
          <DebugView v-if="activeTab === 'Debug' && gameState" :stats="gameState.uiState.debugStats" />
        </div>
      </div>
    </template>

    <!-- Minigame Overlay Area -->
    <div v-if="activeMinigameType === 'ClickCounter'" class="minigame-overlay-container">
      <ClickCounterView />
    </div>
    <div v-else-if="activeMinigameType === 'Welcome'" class="minigame-overlay-container">
      <WelcomeView />
    </div>
    <div v-else-if="activeMinigameType === 'Ingress'" class="minigame-overlay-container">
      <IngressView />
    </div>
    <div v-else-if="activeMinigameType === 'Example'" class="minigame-overlay-container">
      <ExampleView />
    </div>
    <!-- Add other minigame views here with v-else-if, wrapped in the overlay container -->

    <!-- Overlay Dialog (Example, can be adapted or removed) -->
    <div v-if="showDialog && !shouldHideMainUI" class="dialog-overlay">
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
  width: 300px; /* Increased width */
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
  overflow-y: auto; /* Add scroll if content overflows */
  flex-shrink: 0; /* Prevent sidebar from shrinking */
}

.main-content {
  flex-grow: 1; /* Takes up remaining space */
  padding: 0px;
  display: flex;
  flex-direction: column; /* Stack tabs and content vertically */
  overflow-y: auto; /* Add scroll if content overflows */
}

.tabs {
  display: flex;
  margin-bottom: 0px;
  border-bottom: 1px solid #ccc;
  align-items: center; /* Align items vertically */
}

.tabs button {
  padding: 10px 15px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1em;
  border-bottom: 3px solid transparent; /* Placeholder for active indicator */
  margin-bottom: -1px; /* Align with the content border */
  min-width: 60px; /* Ensure consistent button width */
  text-align: center; /* Center text in button */
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

.time-controls {
  margin-left: auto; /* Pushes controls to the right */
  display: flex;
  align-items: center;
}

.time-controls button {
  padding: 8px 10px; /* Slightly smaller padding for more compact buttons */
  margin-left: 5px;
  font-size: 0.9em;
  min-width: 50px; /* Consistent width for time control buttons */
}

.time-controls button.active {
  background-color: #d0e0ff; /* Different active color for time controls */
  border-bottom-color: #0056b3;
}

.current-timescale {
  margin-right: 10px;
  font-weight: bold;
  min-width: 50px; /* Reserve space to prevent layout shift */
  text-align: right;
}

/* Minigame Overlay Container Style */
.minigame-overlay-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Optional: semi-transparent background */
  display: flex; /* To center the minigame content if needed */
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensures it's on top of other content */
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