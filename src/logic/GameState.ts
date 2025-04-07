import { Connections, Stat, Parameter, FormulaStat, IndependentStat } from './core/Stat';
import { Lib } from './lib/Lib';
import { EventProcessor } from './events/EventProcessor';
import { ResourceManager, Resource } from './core/Resource';
import { Stats } from './core/Stats';
import { reactive } from 'vue';
import { CharacterDefinition } from './characters/CharacterDefinition';
import { Character } from './characters/Character';

// Define a type for the resource data structure expected by the UI
interface ResourceUIData {
    current: number;
    max: number;
    income: number;
}

// Define the structure for debug stats data
interface DebugStatInfo {
    value: number;
    params?: Record<string, number>; // Optional parameters map
}

// Added: UI structure for a single attribute
interface AttributeUIInfo {
    key: string;         // e.g., 'strength'
    displayName: string;
    description: string;
    value: number;
}

// Added: UI structure for an attribute category (containing attributes)
interface AttributeCategoryUIInfo {
    key: string;         // e.g., 'physique'
    displayName: string;
    description: string;
    value: number;       // Value of the primary category stat itself
    attributes: AttributeUIInfo[];
}

// Define the structure for character UI data
interface CharacterUIData {
    id: string;
    name: string;
    level: number;
    upkeep: number;
    bio: string;
    attributes: Record<string, AttributeCategoryUIInfo>; // Added hierarchical attributes
}

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

    /** List of currently owned character instances. */
    public characters: Character[] = [];

    /** Tracks the *current* total gold upkeep value applied to income. */
    private appliedUpkeep: number = 0; // Added: Tracks applied value

    /** The currently active tab name */
    private activeTabName: string = '';

    /** Reactive state specifically for UI consumption. */
    public uiState: {
        resources: Record<string, ResourceUIData>;
        debugStats: Record<string, DebugStatInfo>;
        characters: CharacterUIData[]; // Type now includes attributes
        selectedCharacterId: string | null;
    };

    /** Timestamp when the game state was created or loaded. */
    public dateStarted: number = Date.now();

    /** Timestamp of the last modification or save. */
    public dateModified: number = Date.now();

    /** Tracks game time progression. */
    public gameTime: number = 0; // Example: could represent in-game days, seconds, etc.

    constructor() {
        // Initialize ResourceManager *before* using it
        this.resourceManager = new ResourceManager(this.connections);

        // Initialize reactive UI state *before* potential initial population
        this.uiState = reactive({
            resources: {},
            debugStats: {},
            characters: [],
            selectedCharacterId: null
        });

        // Initialize any default state needed when a new game starts.
        this.initializeDefaultState();

        // Process initial events synchronously after Lib is loaded and other managers are ready
        if (this.lib.isLoaded) {
            console.log("Running initial event processing...");
            this.eventProcessor.processEvents(this);
            console.log("Initial event processing complete.");
        } else {
            console.error("Cannot run initial event processing: Lib failed to load.");
        }

        // Ensure uiState reflects the initial resources after events might have added them
        this.syncUiResources();
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
     * @param deltaTime The time elapsed since the last update (in seconds).
     */
    public update(deltaTime: number): void {
        this.gameTime += deltaTime;

        // 0. Recalculate and apply upkeep delta *before* resource updates
        this.applyUpkeepDelta();

        // 1. Update core game logic state
        this.resourceManager.updateAll(deltaTime);

        // 2. Process events (might change resources/stats)
        this.eventProcessor.processEvents(this);

        // 3. Sync core state to reactive UI state
        this.syncUiResources();

        // 4. Other periodic updates

        this.dateModified = Date.now();

        // Update character UI data when the Crew tab is active
        if (this.activeTabName === 'Crew') {
            this.updateCharacterUIData();
        }

        // Update debug stats UI data when the Debug tab is active
        if (this.activeTabName === 'Debug') {
            this.updateDebugView();
        }
    }

    /** Helper method to synchronize ResourceManager state to uiState.resources */
    private syncUiResources(): void {
        const allResources = this.resourceManager.getAllResources();
        const currentUiKeys = new Set(Object.keys(this.uiState.resources));

        allResources.forEach((resource, name) => {
            if (!this.uiState.resources[name]) {
                // Add new resource to UI state
                this.uiState.resources[name] = {
                    current: resource.current.value,
                    max: resource.max.value,
                    income: resource.income.value,
                };
            } else {
                // Update existing resource in UI state
                const uiRes = this.uiState.resources[name];
                uiRes.current = resource.current.value;
                uiRes.max = resource.max.value;
                uiRes.income = resource.income.value;
            }
            currentUiKeys.delete(name); // Mark this key as processed
        });

        // Remove resources from UI state that no longer exist in ResourceManager
        currentUiKeys.forEach(keyToRemove => {
            delete this.uiState.resources[keyToRemove];
        });
    }

    /** Calculates the current total upkeep and applies the difference to gold income. */
    private applyUpkeepDelta(): void {
        let currentTotalUpkeep = 0;
        for (const char of this.characters) {
            currentTotalUpkeep += char.upkeep.value;
        }

        const upkeepDelta = currentTotalUpkeep - this.appliedUpkeep;

        if (Math.abs(upkeepDelta) > 1e-6) {
            const gold = this.resourceManager.getResource("gold");
            if (gold && gold.income instanceof Parameter) {
                Stats.modifyParameterADD(gold.income, -upkeepDelta, this.connections);
                console.log(`Applied upkeep delta of ${-upkeepDelta} to gold income. New total upkeep: ${currentTotalUpkeep}. New gold income: ${gold.income.value.toFixed(2)}`);
                this.appliedUpkeep = currentTotalUpkeep;
            } else {
                console.warn("Could not apply character upkeep delta: Gold resource or its income Parameter not found.");
            }
        }
    }

    /** Updates the reactive debugStats object with current stat values */
    public updateDebugView(): void {
        const currentDebugKeys = new Set(Object.keys(this.uiState.debugStats));

        this.connections.connectablesByName.forEach((stat: Stat, key: string) => {
            let params: Record<string, number> | undefined = undefined;

            // Use instanceof for safe type checking and property access
            if (stat instanceof Parameter) {
                params = { add: stat.add, multiCache: stat.multiCache };
            } else if (stat instanceof FormulaStat) {
                params = { argument: stat.argument };
            } else if (stat instanceof IndependentStat) {
                // Independent stats don't have derived parameters in the same way
                params = undefined; // Or perhaps { baseValue: stat.value } if that's useful?
            }
            // Add handling for other potential Stat types if they exist

            const statData: DebugStatInfo = { value: stat.value };
            if (params) {
                statData.params = params;
            }

            const existing = this.uiState.debugStats[key];

            if (!existing) {
                 this.uiState.debugStats[key] = statData; // Add new
            } else {
                 let changed = false;
                 // Update value
                 if (existing.value !== statData.value) {
                     existing.value = statData.value;
                     changed = true;
                 }

                 // Update params
                 const existingParamsString = existing.params ? JSON.stringify(existing.params) : 'null';
                 const newParamsString = statData.params ? JSON.stringify(statData.params) : 'null';

                 if (existingParamsString !== newParamsString) {
                     if (statData.params) {
                         existing.params = { ...statData.params }; // Update/add
                     } else {
                         delete existing.params; // Remove
                     }
                     changed = true;
                 }

                 // Optionally, could add logging here if changed is true
                 // if (changed) console.log(`Debug stat ${key} updated`);
            }
            currentDebugKeys.delete(key); // Mark as processed
        });

        // Remove stats from UI state that no longer exist
        currentDebugKeys.forEach(keyToRemove => {
            delete this.uiState.debugStats[keyToRemove];
        });
    }

    /** Adds a character to the game state and updates upkeep. */
    public addCharacter(charDef: CharacterDefinition): void {
        if (!charDef) return;

        // Retrieve attribute definitions from the library
        const attributeDefs = this.lib.getAttributeLib().getAttributeDefinitions();
        if (!attributeDefs) {
            console.error(`Cannot add character ${charDef.name}: Attribute definitions not loaded.`);
            return;
        }

        // Check if character stats might already exist (e.g., char_guard_01_level)
        const levelStatName = `${Character['STAT_PREFIX']}${charDef.id}_level`; // Use static prefix
        if (Stats.getStat(levelStatName, this.connections)) {
             console.warn(`Character ${charDef.name} (ID: ${charDef.id}) stats seem to already exist. Cannot add again.`);
             return;
        }

        // Create and store the Character instance, passing attribute definitions
        const newChar = new Character(charDef, this.connections, attributeDefs);
        this.characters.push(newChar);
        console.log(`Added character instance: ${newChar.definition.name}`);

        // Adding the character automatically recalculates their upkeep via stat connections.
        // Now, trigger the recalculation of the *total* upkeep delta.
        this.applyUpkeepDelta();
    }

    /** 
     * Sets the currently active tab name.
     * This allows us to conditionally update UI state based on the active tab.
     */
    public setActiveTab(tabName: string): void {
        this.activeTabName = tabName;
        
        // If the Crew tab was just activated, update character UI data
        if (tabName === 'Crew') {
            this.updateCharacterUIData();
        }
    }

    /** Updates the reactive characters data for the UI, including hierarchical attributes */
    public updateCharacterUIData(): void {
        // Clear the existing array
        this.uiState.characters.length = 0;

        // Get attribute definitions once
        const allAttributeDefs = this.lib.getAttributeLib().getAttributeDefinitions();
        if (!allAttributeDefs) {
            console.error("Cannot update character UI data: Attribute definitions not loaded.");
            return;
        }

        // Add all current characters to the UI state
        for (const char of this.characters) {
            // Corrected: Use public static prefix and double underscore
            const idPrefix = `${Character.STAT_PREFIX}${char.definition.id}__`;
            const charUiAttributes: Record<string, AttributeCategoryUIInfo> = {};

            // Build hierarchical attribute data for the UI
            for (const categoryKey in allAttributeDefs) {
                const categoryDef = allAttributeDefs[categoryKey];
                const primaryStatId = `${idPrefix}${categoryKey}`;
                const primaryStatValue = char.attributes[primaryStatId]?.value ?? 0;

                // Initialize category structure
                const categoryAttributes: AttributeUIInfo[] = [];

                // Populate secondary attributes within the category
                for (const attributeKey in categoryDef.attributes) {
                    const attributeDef = categoryDef.attributes[attributeKey];
                    const secondaryStatId = `${idPrefix}${attributeKey}`;
                    const secondaryStatValue = char.attributes[secondaryStatId]?.value ?? 0;

                    categoryAttributes.push({
                        key: attributeKey,
                        displayName: attributeDef.displayName,
                        description: attributeDef.description,
                        value: secondaryStatValue,
                    });
                }

                // Add the complete category info to the character's UI attributes
                charUiAttributes[categoryKey] = {
                    key: categoryKey,
                    displayName: categoryDef.displayName,
                    description: categoryDef.description,
                    value: primaryStatValue,
                    attributes: categoryAttributes,
                };
            }

            // Push the complete character data (including attributes) to UI state
            this.uiState.characters.push({
                id: char.definition.id,
                name: char.definition.name,
                level: char.level.value,
                upkeep: char.upkeep.value,
                bio: char.definition.bio || '',
                attributes: charUiAttributes, // Add the populated attributes
            });
        }

        // If we have characters but no selection, select the first one
        if (this.uiState.characters.length > 0 && this.uiState.selectedCharacterId === null) {
            this.uiState.selectedCharacterId = this.uiState.characters[0].id;
        }

        console.log(`Updated character UI data with ${this.uiState.characters.length} characters including attributes.`);
    }

    /**
     * Modifies an independent stat by a delta value
     * @param statName The name of the stat to modify
     * @param delta The amount to change the stat by
     */
    public modifyIndependentStat(statName: string, delta: number): void {
        const stat = this.connections.connectablesByName.get(statName);
        if (stat && 'independent' in stat && stat.independent) {
            Stats.modifyStat(stat as IndependentStat, delta, this.connections);
            this.updateDebugView(); // Update the debug view to reflect changes
        } else {
            console.warn(`Cannot modify stat ${statName}: not found or not independent`);
        }
    }

    /**
     * Sets an independent stat to a specific value
     * @param statName The name of the stat to set
     * @param value The new value for the stat
     */
    public setIndependentStat(statName: string, value: number): void {
        const stat = this.connections.connectablesByName.get(statName);
        if (stat && 'independent' in stat && stat.independent) {
            Stats.setIndependentStat(stat as IndependentStat, value, this.connections);
            this.updateDebugView(); // Update the debug view to reflect changes
        } else {
            console.warn(`Cannot set stat ${statName}: not found or not independent`);
        }
    }

    // Add methods for loading/saving state, etc.
} 