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
import type { HypotheticalState } from './core/Hypothetical';
import type { DiscoveryAction } from '../types/discoveryTypes';
import { markExistingDiscoveredItemsAsEncountered } from './Discovery';

import { C } from './lib/C';

export const maintenanceSlowTickGlobal = new SlowTick(C.DEFAULT_MIN_DELTA_TIME, C.MAINTENANCE_SLOW_TICK_INTERVAL, "maintenance_task_gen");
export const assignmentSlowTickGlobal = new SlowTick(C.DEFAULT_MIN_DELTA_TIME, C.ASSIGNMENT_SLOW_TICK_INTERVAL, "task_assignment_process");

export const globalInputQueue: CmdInput[] = [];

export class GameState {
    public connections: Connections = new Connections();
    public lib: Lib = new Lib();
    public resources: Map<string, Resource> = new Map<string, Resource>();
    public characters: Character[] = [];
    public buildings: Building[] = [];
    public discoveredItems: Set<string> = new Set();
    public encounteredItems: Set<string> = new Set();
    public activeKeywords: Map<string, string[]> = new Map();
    public discardedKeywords: Set<string> = new Set();
    public discoveryAnalysisLog: DiscoveryAction[][] = [];
    public activeMinigame: BaseMinigame<MinigameState> | null = null;
    public invoker: Invoker = new Invoker();
    public hypothetical: HypotheticalState | null = null;
    public ingressGameResults: { [sessionId: string]: any } = {}; // Store results from completed ingress games
    public crystalBallWords: string[] = []; // Words from ingress sessions for crystal ball

    public gold! : Resource;
    public clutter! : Resource;

    public totalCharacterUpkeep: Parameter;
    public totalBuildingsClutter: Parameter;
    public taskUidCounter: IndependentStat;
    public workSpeed: Parameter;
    public clutterRatio: Parameter;
    public discoveryThreshold: IndependentStat;

    public dateStarted: number = Date.now();
    public dateModified: number = Date.now();
    public gameTime: number = 0;
    public tick: number = 0;

    public locationId: string = "turfablie";

    public minDeltaTime: number = C.DEFAULT_MIN_DELTA_TIME;
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
        currentTimeScale: number;
        uiWorkSpeed: number;
        uiClutterRatio: number;
        discoveredItemsCount: number;
        encounteredItemsCount: number;
        activeMinigameType: MinigameType | null;
        activeMinigameState: MinigameState | null;
        debugActiveTab: string;
        debugExploreInput: string;
        // Discovery system reactive state
        activeKeywords: Map<string, string[]>;
        discardedKeywords: Set<string>;
        discoveryAnalysisLog: DiscoveryAction[][];
        // Crystal ball state
        crystalBallWords: string[];
        showCrystalView: boolean;
    };

    constructor() {
        this.totalCharacterUpkeep = Stats.createParameter("total_character_upkeep", this.connections);
        this.totalBuildingsClutter = Stats.createParameter("total_buildings_clutter", this.connections);
        this.taskUidCounter = Stats.createStat("task_uid_counter", 0, this.connections);

        this.workSpeed = Stats.createParameter("workSpeed", this.connections);
        Stats.modifyParameterADD(this.workSpeed, 1, this.connections);

        this.clutterRatio = Stats.createParameter("clutterRatio", this.connections);

        this.discoveryThreshold = Stats.createStat("discovery_threshold", 5, this.connections);

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
            encounteredItemsCount: 0, // Initialize encounteredItemsCount
            activeMinigameType: null,
            activeMinigameState: null,
            debugActiveTab: 'main', // Initialize debug tab
            debugExploreInput: '', // Initialize debug explore input
            activeKeywords: new Map(),
            discardedKeywords: new Set(),
            discoveryAnalysisLog: [],
            crystalBallWords: [],
            showCrystalView: false,
        });

        this.setupInitialResources();

        UIStateManager.sync(this);

        markExistingDiscoveredItemsAsEncountered(this);
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

    public isDiscovered(itemId: string): boolean {
        return this.discoveredItems.has(itemId);
    }

    public isEncountered(itemId: string): boolean {
        return this.encounteredItems.has(itemId);
    }

    public markAsEncountered(itemId: string): void {
        if (this.encounteredItems.has(itemId)) {
            return; // Already encountered
        }
        
        this.encounteredItems.add(itemId);
        
        // If this is a specialization, also mark its parent skill as encountered
        const specDefinition = this.lib.skills.getSpecialization(itemId);
        if (specDefinition && specDefinition.parentId) {
            this.encounteredItems.add(specDefinition.parentId);
        }
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

    public toggleCrystalView(): void {
        this.uiState.showCrystalView = !this.uiState.showCrystalView;
    }

    public closeCrystalView(): void {
        this.uiState.showCrystalView = false;
    }
}