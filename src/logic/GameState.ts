import { Connections, Parameter, IndependentStat, ConnectionType } from './core/Stat';
import { Lib } from './lib/Lib';
import { EventProcessor } from './Event';
import { Resource, updateAllResources, addResource } from './Resource';
import { Stats } from './core/Stats';
import { reactive } from 'vue';
import type { Character } from './Character';
import type { Building } from './Building';
import { Building as BuildingOps } from './Building';
import type { CharacterDefinition } from './lib/definitions/CharacterDefinition';
import { SelectedCharacterInfo } from '../types/uiTypes';
import * as UIStateManager from './UIStateManager';
import type { DebugStatInfo } from '../types/uiTypes';
import type { CmdInput } from './input/InputCommands';
import { processTasks } from './Task';
import type { GameTask } from './TaskTypes';
import { SlowTick } from './utils/SlowTick';
import type { ResourceUIData } from './UIStateManager';
import type { BaseMinigame, MinigameType, MinigameState } from './minigames/MinigameTypes';
import { Invoker } from './core/behTree/Invoker';
import type { EventDefinition } from './lib/definitions/EventDefinition';

export const ALL_TAB_IDS = ['Castle', 'Crew', 'Quests', 'Tasks', 'Debug'];
export const DEFAULT_MIN_DELTA_TIME = 0.05;
export const maintenanceSlowTickGlobal = new SlowTick(DEFAULT_MIN_DELTA_TIME, 5, "maintenance_task_gen");
export const assignmentSlowTickGlobal = new SlowTick(DEFAULT_MIN_DELTA_TIME, 1.5, "task_assignment_process");

export const globalInputQueue: CmdInput[] = [];

export class GameState {
    public connections: Connections = new Connections();
    public lib: Lib = new Lib();
    public resources: Map<string, Resource> = new Map<string, Resource>();
    public characters: Character[] = [];
    public buildings: Building[] = [];
    public discoveredItems: Record<string, boolean> = {};
    public activeMinigame: BaseMinigame<MinigameState> | null = null;
    public invoker: Invoker = new Invoker();

    public gold! : Resource;
    public clutter! : Resource;

    public totalCharacterUpkeep: Parameter;
    public totalBuildingsClutter: Parameter;
    public taskUidCounter: IndependentStat;
    public workSpeed: Parameter;
    public clutterRatio: Parameter;

    public dateStarted: number = Date.now();
    public dateModified: number = Date.now();
    public gameTime: number = 0;
    public tick: number = 0;

    public locationId: string = "turfablie";

    public minDeltaTime: number = DEFAULT_MIN_DELTA_TIME;
    public timeScale: { current: number; previous: number } = { current: 1.0, previous: 1.0 };
    public allowedUpdates: number = 0;

    public availableTasks: GameTask[] = [];
    public queuedTasks: GameTask[] = [];
    public processingTasks: GameTask[] = [];
    public completedTasks: GameTask[] = [];

    /** Reactive state specifically for UI consumption. */
    public uiState: {
        resources: Record<string, ResourceUIData>;
        debugStats: Record<string, DebugStatInfo>;
        characters: SelectedCharacterInfo[]; // Using imported type from uiTypes.ts
        selectedCharacterId: string | null;
        activeTabName: string;
        constructedBuildingIds: Set<string>; // Added for reactive building updates
        // Task lists for TasksView
        uiCompletedTasks: GameTask[];
        uiActiveTasks: GameTask[];
        uiQueuedTasks: GameTask[];
        uiMaintenanceTasks: GameTask[];
        uiOpportunityTasks: GameTask[];
        uiEndeavourTasks: GameTask[];
        uiQuestTasks: GameTask[];
        currentTimeScale: number; // Added for reactive time scale UI
        uiWorkSpeed: number; // Added for BuffBar
        uiClutterRatio: number; // Added for BuffBar
        discoveredItemsCount: number; // Added for discovery system reactivity
        activeMinigameType: MinigameType | null;
        activeMinigameState: MinigameState | null;
        debugActiveTab: string; // Added for debug view tab persistence
    };

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
            constructedBuildingIds: new Set<string>(),
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
        });

        this.setupInitialResources();

        if (this.lib.isLoaded) {
            const startGameEvent = this.lib.events.get("startGame");
            if (startGameEvent) {
                EventProcessor.processSingleEvent(startGameEvent, this);
            } else {
                console.error("GameState Constructor: 'startGame' event not found in Lib.");
            }
        } else {
            console.error("Cannot run initial event processing: Lib failed to load.");
        }

        UIStateManager.sync(this);
    }

    public update(deltaTime: number): void {
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

    private setupInitialResources(): void {
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

    public processEventsForCharacter(eventIds: string[], character: Character, _charDef?: CharacterDefinition): void {
        for (const eventId of eventIds) {
            const eventDefinition = this.lib.events.get(eventId);
            
            if (eventDefinition) {
                try {
                    EventProcessor.processSingleEvent(eventDefinition, this, character);
                } catch (error) {
                    console.error(`GS-PROC-EVENTS-FOR-CHAR: Error calling processSingleEvent for '${eventId}':`, error);
                }
            } else {
                console.warn(`GS-PROC-EVENTS-FOR-CHAR: Event definition NOT FOUND for ID: ${eventId}`);
            }
        }
    }

    public addBuilding(buildingId: string): Building | undefined {
        return BuildingOps.addBuilding(this, buildingId);
    }

    public getAndIncrementTaskUidValue(): number {
        const currentValue = this.taskUidCounter.value;
        Stats.modifyStat(this.taskUidCounter, 1, this.connections);
        return currentValue;
    }

    public swapTimeScale(): void {
        const temp = this.timeScale.current;
        this.timeScale.current = this.timeScale.previous;
        this.timeScale.previous = temp;
    }

    public setTimeScale(newScale: number): void {
        this.timeScale.previous = this.timeScale.current;
        this.timeScale.current = newScale;
    }

    public setActiveTab(tabName: string): void { this.uiState.activeTabName = tabName; }

    public modifyIndependentStat(statName: string, delta: number): void {
        const stat = this.connections.connectablesByName.get(statName);
        if (stat && 'independent' in stat && stat.independent) {
            Stats.modifyStat(stat as IndependentStat, delta, this.connections);
        } else {
            console.warn(`Cannot set stat ${statName}: not found or not independent`);
        }
    }

    public markAsDiscovered(itemId: string): void {
        if (!this.discoveredItems[itemId]) {
            this.discoveredItems[itemId] = true;
            this.uiState.discoveredItemsCount = Object.keys(this.discoveredItems).length;
        }
    }

    public isDiscovered(itemId: string): boolean {
        return !!this.discoveredItems[itemId];
    }

    // --- Minigame Management ---
    public startMinigame(minigame: BaseMinigame<MinigameState>): void {
        if (this.activeMinigame) {
            console.warn("Cannot start a new minigame, one is already active:", this.activeMinigame.type);
            return;
        }
        this.activeMinigame = minigame;
        this.uiState.activeMinigameType = minigame.type;
        this.uiState.activeMinigameState = minigame.state; // Initial state for UI
        console.log(`Minigame started: ${minigame.type}`);
    }

    public exitMinigame(): void {
        if (this.activeMinigame) {
            const minigameType = this.activeMinigame.type;
            console.log(`Exiting minigame: ${this.activeMinigame.type}`);
            this.activeMinigame.destroy(this);
            this.activeMinigame = null;
            this.uiState.activeMinigameType = null;
            this.uiState.activeMinigameState = null;

            const completionEvent: EventDefinition = {
                id: 'minigameComplete',
                params: { minigameType: minigameType },
                effects: []
            };
            EventProcessor.processSingleEvent(completionEvent, this);
        }
    }
}