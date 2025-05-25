import { Connections, Parameter, IndependentStat, ConnectionType } from './core/Stat';
import { Lib } from './lib/Lib';
import { EventProcessor } from './EventProcessor';
import { ResourceManager } from './Resource';
import { Stats } from './core/Stats';
import { reactive } from 'vue';
import type { Character } from './Character';
import { CharacterOps, LibAttributeDefinitions, LibSkillDefinition } from './Character';
import type { CharacterDefinition } from './lib/definitions/CharacterDefinition';
import { SelectedCharacterInfo } from '../types/uiTypes';
import * as UIStateManager from './UIStateManager';
import { CHARACTER_STAT_PREFIX } from './core/statPrefixes';
import type { DebugStatInfo } from '../types/uiTypes';
import type { CmdInput } from './input/InputCommands';
import { processInputs as processAllInputs } from './input/InputProcessor';

// Export a global input queue
export const globalInputQueue: CmdInput[] = [];

// Define a type for the resource data structure expected by the UI
interface ResourceUIData {
    current: number;
    max: number;
    income: number;
}

/**
 * Represents the overall state of the game.
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

    /** Total upkeep cost of all characters (Parameter that automatically updates). */
    private totalCharacterUpkeep: Parameter;

    private activeTabName: string = '';

    public dateStarted: number = Date.now();
    public dateModified: number = Date.now();
    public gameTime: number = 0;

    /** Reactive state specifically for UI consumption. */
    public uiState: {
        resources: Record<string, ResourceUIData>;
        debugStats: Record<string, DebugStatInfo>;
        characters: SelectedCharacterInfo[]; // Using imported type from uiTypes.ts
        selectedCharacterId: string | null;
    };

    constructor() {
        this.resourceManager = new ResourceManager(this.connections);
        this.totalCharacterUpkeep = Stats.createParameter("total_character_upkeep", this.connections);

        this.uiState = reactive({
            resources: {},
            debugStats: {},
            characters: [],
            selectedCharacterId: null
        });

        if (this.lib.isLoaded) {
            // Process the startGame event
            const startGameEvent = this.lib.events.get("startGame");
            if (startGameEvent) {
                this.eventProcessor.processSingleEvent(startGameEvent, this);
            } else {
                console.error("GameState Constructor: 'startGame' event not found in Lib.");
            }
        } else {
            console.error("Cannot run initial event processing: Lib failed to load.");
        }

        this.setupTotalUpkeepStat();
        UIStateManager.syncUiResources(this);
    }

    /**
     * Sets up the connection between total character upkeep and gold income.
     */
    private setupTotalUpkeepStat(): void {
        const gold = this.resourceManager.getResource("gold");
        if (gold && gold.income instanceof Parameter) {
            Stats.connectStat(this.totalCharacterUpkeep, gold.income, ConnectionType.SUB, this.connections);
        } else {
            console.warn("Could not connect total character upkeep: Gold resource or its income Parameter not found.");
        }
    }

    /**
     * Updates the game state based on elapsed time.
     *
     * @param deltaTime The time elapsed since the last update (in seconds).
     */
    public update(deltaTime: number): void {
        processAllInputs(this, deltaTime);

        this.gameTime += deltaTime;

        this.resourceManager.updateAll(deltaTime);
        UIStateManager.syncUiResources(this);

        this.dateModified = Date.now();

        if (this.activeTabName === 'Crew') {
            UIStateManager.updateCharacterUIData(this);
        }

        if (this.activeTabName === 'Debug') {
            UIStateManager.updateDebugView(this);
        }
    }

    /** Adds a character to the game state and updates upkeep. */
    public addCharacter(characterId: string): Character | undefined {
        const charDef = this.lib.characters.getCharacter(characterId);
        if (!charDef) {
            console.warn(`GameState.addCharacter: Character definition not found for ID: ${characterId}`);
            return undefined;
        }

        if (this.characters.find(c => c.characterId === characterId)) {
            console.warn(`GameState.addCharacter: Character with ID ${characterId} already exists.`);
            return this.characters.find(c => c.characterId === characterId);
        }

        const attributeDefs = this.lib.attributes.getAttributeDefinitions() as LibAttributeDefinitions;
        const allSkillDefs = this.lib.skills.getAllSkills() as Record<string, LibSkillDefinition>;
        const idPrefix = `${CHARACTER_STAT_PREFIX}${charDef.id}__`;

        const newChar: Character = {
            characterId: charDef.id,
            level: undefined as unknown as IndependentStat,
            baseUpkeep: undefined as unknown as IndependentStat,
            upkeep: undefined as unknown as Parameter,
            attributes: {},
            skills: {},
            specializations: {}
        };

        CharacterOps.initializeBaseStats(newChar, charDef, idPrefix, this.connections);
        CharacterOps.addInitialAttributes(newChar, charDef, attributeDefs, idPrefix, this.connections);

        if (charDef.initialSkills) {
            for (const skillId in charDef.initialSkills) {
                if (Object.prototype.hasOwnProperty.call(charDef.initialSkills, skillId) && allSkillDefs[skillId]) {
                    const skillData = charDef.initialSkills[skillId];
                    const skillDef = allSkillDefs[skillId];
                    CharacterOps.addInitialSkillWithSpecializations(newChar, skillId, skillData, skillDef, idPrefix, this.connections);
                }
            }
        }
        
        this.characters.push(newChar);
        Stats.connectStat(newChar.upkeep, this.totalCharacterUpkeep, ConnectionType.ADD, this.connections);

        if (charDef.triggerOnCreated) {
            try {
                this.processEventsForCharacter(charDef.triggerOnCreated, newChar, charDef);
            } catch (error) {
                const charDefinition = this.lib.characters.getCharacter(newChar.characterId);
                console.error(`GS.addCharacter: ${charDefinition ? charDefinition.name : newChar.characterId} - Error processing triggerOnCreated events:`, error);
            }
        }

        UIStateManager.updateCharacterUIData(this);
        return newChar;
    }

    /**
     * Processes a list of event IDs specifically for a character.
     * @param eventIds Array of event IDs to process.
     * @param character The character instance for context.
     * @param charDef The character definition for context (optional, but good for performance).
     */
    public processEventsForCharacter(eventIds: string[], character: Character, charDef?: CharacterDefinition): void {
        const characterDefinition = charDef || this.lib.characters.getCharacter(character.characterId)!;

        for (const eventId of eventIds) {
            const eventDefinition = this.lib.events.get(eventId);
            
            if (eventDefinition) {
                try {
                    this.eventProcessor.processSingleEvent(eventDefinition, this, character);
                } catch (error) {
                    console.error(`GS-PROC-EVENTS-FOR-CHAR: Error calling processSingleEvent for '${eventId}':`, error);
                }
            } else {
                console.warn(`GS-PROC-EVENTS-FOR-CHAR: Event definition NOT FOUND for ID: ${eventId}`);
            }
        }
    }

    /** Sets the currently active tab name. */
    public setActiveTab(tabName: string): void {
        this.activeTabName = tabName;
        
        if (tabName === 'Crew') {
            UIStateManager.updateCharacterUIData(this);
        }
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
            UIStateManager.updateDebugView(this);
        } else {
            console.warn(`Cannot set stat ${statName}: not found or not independent`);
        }
    }
}