import { Connections } from './core/Stat';
import { Lib } from './lib/Lib';
import { EventProcessor } from './events/EventProcessor';
import { ResourceManager } from './core/Resource';
import { Stats } from './core/Stats';

/**
 * Represents the overall state of the game.
 * This class consolidates various state components like stats, resources, etc.
 */
export class GameState {
    /** Manages all stat connections and holds stat objects. */
    public connections: Connections = new Connections();

    /** Holds loaded definitions for game entities (buildings, techs, events, etc.). */
    public lib: Lib = new Lib();

    /** Processes events based on conditions and applies effects. */
    public eventProcessor: EventProcessor = new EventProcessor(this.lib);

    /** Manages game resources. */
    public resourceManager: ResourceManager;

    /** Timestamp when the game state was created or loaded. */
    public dateStarted: number = Date.now();

    /** Timestamp of the last modification or save. */
    public dateModified: number = Date.now();

    /** Tracks game time progression. */
    public gameTime: number = 0; // Example: could represent in-game days, seconds, etc.

    // Add other state properties as needed for your game:
    // public resources: Map<string, number> = new Map<string, number>();
    // public buildings: any[] = [];
    // public research: any = {};
    // public playerFacts: Set<string> = new Set<string>();

    constructor() {
        // Initialize ResourceManager *before* using it
        this.resourceManager = new ResourceManager(this.connections);

        // Initialize any default state needed when a new game starts.
        this.initializeDefaultState();
    }

    private initializeDefaultState(): void {
        console.log("Initializing Default GameState...");

        // Resource initialization is now handled by the 'startGame' event
        // const gold = this.resourceManager.addResource("gold", 0, 1000);
        // Stats.modifyParameterADD(gold.income, 10, this.connections);

        // We might still initialize other non-event-driven things here

        console.log("Default GameState setup complete (Events will initialize resources).");
    }

    /**
     * Updates the game state based on elapsed time.
     * This is where core game loop logic like resource generation, event processing, etc., happens.
     *
     * @param deltaTime The time elapsed since the last update (in milliseconds or seconds).
     */
    public update(deltaTime: number): void {
        this.gameTime += deltaTime;

        // 1. Update resources/stats based on rates (if applicable)
        this.resourceManager.updateAll(deltaTime); // Update resources based on time

        // 2. Process events
        this.eventProcessor.processEvents(this);

        // 3. Other periodic updates

        this.dateModified = Date.now();
    }

    // Add methods for loading/saving state, etc.
} 