import { Connections, ConnectionType } from './core/Stat';
import { Lib } from './lib/Lib';
import { EventProcessor } from './Event';
import { updateAllResources, addResource } from './Resource';
import { Stats } from './core/Stats';
import { reactive } from 'vue';
import { Building as BuildingOps } from './Building';
import * as UIStateManager from './UIStateManager';
import { processTasks } from './Task';
import { SlowTick } from './utils/SlowTick';
import { Invoker } from './core/behTree/Invoker';
import { C } from './lib/C';
export const maintenanceSlowTickGlobal = new SlowTick(C.DEFAULT_MIN_DELTA_TIME, C.MAINTENANCE_SLOW_TICK_INTERVAL, "maintenance_task_gen");
export const assignmentSlowTickGlobal = new SlowTick(C.DEFAULT_MIN_DELTA_TIME, C.ASSIGNMENT_SLOW_TICK_INTERVAL, "task_assignment_process");
export const globalInputQueue = [];
export class GameState {
    connections = new Connections();
    lib = new Lib();
    resources = new Map();
    characters = [];
    buildings = [];
    discoveredItems = new Set();
    activeKeywords = new Map();
    discardedKeywords = new Set();
    discoveryLog = []; // This will be a structured type, e.g., DiscoveryEvent[]
    activeMinigame = null;
    invoker = new Invoker();
    hypothetical = null;
    gold;
    clutter;
    totalCharacterUpkeep;
    totalBuildingsClutter;
    taskUidCounter;
    workSpeed;
    clutterRatio;
    dateStarted = Date.now();
    dateModified = Date.now();
    gameTime = 0;
    tick = 0;
    locationId = "turfablie";
    minDeltaTime = C.DEFAULT_MIN_DELTA_TIME;
    timeScale = { current: 1.0, previous: 1.0 };
    allowedUpdates = 0;
    availableTasks = [];
    queuedTasks = [];
    processingTasks = [];
    completedTasks = [];
    /** Reactive state specifically for UI consumption. */
    uiState;
    constructor() {
        this.totalCharacterUpkeep = Stats.createParameter("total_character_upkeep", this.connections);
        this.totalBuildingsClutter = Stats.createParameter("total_buildings_clutter", this.connections);
        this.taskUidCounter = Stats.createStat("task_uid_counter", 0, this.connections);
        this.workSpeed = Stats.createParameter("workSpeed", this.connections);
        Stats.modifyParameterADD(this.workSpeed, 1, this.connections);
        this.clutterRatio = Stats.createParameter("clutterRatio", this.connections);
        this.uiState = reactive({
            resources: {},
            debugStats: {},
            characters: [],
            selectedCharacterId: null,
            activeTabName: '',
            constructedBuildingIds: new Set(),
            uiCompletedTasks: [],
            uiActiveTasks: [],
            uiQueuedTasks: [],
            uiMaintenanceTasks: [],
            uiOpportunityTasks: [],
            uiEndeavourTasks: [],
            uiQuestTasks: [],
            currentTimeScale: this.timeScale.current,
            uiWorkSpeed: 0, // Initialize uiWorkSpeed
            uiClutterRatio: 0, // Initialize uiClutterRatio
            discoveredItemsCount: 0, // Initialize discoveredItemsCount
            activeMinigameType: null,
            activeMinigameState: null,
            debugActiveTab: 'main', // Initialize debug tab
            debugExploreInput: '', // Initialize debug explore input
            activeKeywords: new Map(),
            discardedKeywords: new Set(),
            discoveryLog: [],
        });
        this.setupInitialResources();
        UIStateManager.sync(this);
    }
    update(deltaTime) {
        this.gameTime += deltaTime;
        const newTick = Math.floor(this.gameTime / this.minDeltaTime);
        if (newTick != this.tick)
            this.tick = newTick;
        else
            this.tick = 0;
        updateAllResources(this.resources, deltaTime, this.connections);
        processTasks(this, deltaTime);
        // Update active minigame if present
        if (this.activeMinigame) {
            this.activeMinigame.update(this, deltaTime);
        }
        this.invoker.update(deltaTime, this);
        UIStateManager.sync(this);
        this.dateModified = Date.now();
        this.tick = newTick;
    }
    setupInitialResources() {
        this.gold = addResource(this.resources, "gold", 0, 0, this.connections);
        this.clutter = addResource(this.resources, "clutter", 0, 100, this.connections);
        Stats.connectStat(this.totalCharacterUpkeep, this.gold.income, ConnectionType.SUB, this.connections);
        Stats.connectStat(this.totalBuildingsClutter, this.clutter.income, ConnectionType.ADD, this.connections);
        Stats.connectStat(this.clutterRatio, this.clutter.income, ConnectionType.MULTY, this.connections);
        Stats.connectStat(this.clutter.max, this.clutterRatio, ConnectionType.ADD, this.connections);
        Stats.connectStat(this.clutter.current, this.clutterRatio, ConnectionType.SUB, this.connections);
        Stats.connectStat(this.clutter.max, this.clutterRatio, ConnectionType.DIV, this.connections);
        Stats.connectStat(this.clutterRatio, this.workSpeed, ConnectionType.MULTY, this.connections);
    }
    processEventsForCharacter(eventIds, character, _charDef) {
        for (const eventId of eventIds) {
            const eventDefinition = this.lib.events.get(eventId);
            if (eventDefinition) {
                try {
                    EventProcessor.processSingleEvent(eventDefinition, this, character);
                }
                catch (error) {
                    console.error(`GS-PROC-EVENTS-FOR-CHAR: Error calling processSingleEvent for '${eventId}':`, error);
                }
            }
            else {
                console.warn(`GS-PROC-EVENTS-FOR-CHAR: Event definition NOT FOUND for ID: ${eventId}`);
            }
        }
    }
    addBuilding(buildingId) {
        return BuildingOps.addBuilding(this, buildingId);
    }
    getAndIncrementTaskUidValue() {
        const currentValue = this.taskUidCounter.value;
        Stats.modifyStat(this.taskUidCounter, 1, this.connections);
        return currentValue;
    }
    swapTimeScale() {
        const temp = this.timeScale.current;
        this.timeScale.current = this.timeScale.previous;
        this.timeScale.previous = temp;
    }
    setTimeScale(newScale) {
        this.timeScale.previous = this.timeScale.current;
        this.timeScale.current = newScale;
    }
    setActiveTab(tabName) { this.uiState.activeTabName = tabName; }
    modifyIndependentStat(statName, delta) {
        const stat = this.connections.connectablesByName.get(statName);
        if (stat && 'independent' in stat && stat.independent) {
            Stats.modifyStat(stat, delta, this.connections);
        }
        else {
            console.warn(`Cannot set stat ${statName}: not found or not independent`);
        }
    }
    isDiscovered(itemId) {
        return this.discoveredItems.has(itemId);
    }
    // --- Minigame Management ---
    startMinigame(minigame) {
        if (this.activeMinigame) {
            console.warn("Cannot start a new minigame, one is already active:", this.activeMinigame.type);
            return;
        }
        this.activeMinigame = minigame;
        this.uiState.activeMinigameType = minigame.type;
        this.uiState.activeMinigameState = minigame.state; // Initial state for UI
        console.log(`Minigame started: ${minigame.type}`);
    }
    exitMinigame() {
        if (this.activeMinigame) {
            const minigameType = this.activeMinigame.type;
            console.log(`Exiting minigame: ${this.activeMinigame.type}`);
            this.activeMinigame.destroy(this);
            this.activeMinigame = null;
            this.uiState.activeMinigameType = null;
            this.uiState.activeMinigameState = null;
            const completionEvent = {
                id: 'minigameComplete',
                params: { minigameType: minigameType },
                effects: []
            };
            EventProcessor.processSingleEvent(completionEvent, this);
        }
    }
}
