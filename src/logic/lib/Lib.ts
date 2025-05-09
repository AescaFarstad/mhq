import { LibItem } from './definitions/LibDefinitions';
import { EventDefinition } from './definitions/EventDefinition';
import { CharacterLib } from './CharacterLib';
import { CharacterDefinition } from './definitions/CharacterDefinition';
import { AttributeLib } from './AttributeLib';
import { SkillLib } from './SkillLib';

import eventsData from '../data/events';
import charactersData from '../data/characters';
// Note: Attribute data is imported directly within AttributeLib.ts
// Note: Skills data is imported directly within SkillLib.ts

/**
 * Manages collections of game entity definitions loaded from external sources (like JSON).
 * This provides a central access point for definitions of things like buildings, techs, events, etc.
 */
export class Lib {
    public events: Map<string, EventDefinition> = new Map<string, EventDefinition>();

    public characters: CharacterLib = new CharacterLib();
    public attributes: AttributeLib = new AttributeLib();
    public skills: SkillLib;

    public buildings: Map<string, LibItem> = new Map<string, LibItem>(); // Specific type would be BuildingDefinition
    public techs: Map<string, LibItem> = new Map<string, LibItem>(); // Specific type would be TechDefinition
    public isLoaded: boolean = false;

    constructor() {
        this.skills = new SkillLib(this.attributes);
        this.loadAllDefinitions();
    }

    /**
     * Loads all library definitions from their sources.
     * (Now synchronous due to direct JSON import)
     */
    private loadAllDefinitions(): void {
        if (this.isLoaded) {
            return;
        }

        console.log("Processing library definitions...");
        try {
            // Process events from imported JSON
            this.events = this._processDataDefinitions<EventDefinition>(eventsData);
            this.characters.loadCharacters(charactersData);

            // Process other definitions similarly if they were imported

            this.isLoaded = true;
            console.log("Library definitions processed successfully.");
        } catch (error) {
            console.error("Failed to process library definitions:", error);
            // Handle critical error - perhaps prevent game start
            this.isLoaded = false; // Ensure flag indicates failure
        }
    }

    /**
     * Helper method for processing imported TypeScript data into a Map.
     *
     * @param data The imported TypeScript object.
     * @returns A Map where keys are the top-level keys from the data and values are the corresponding objects with an added 'id' property.
     */
    private _processDataDefinitions<T extends LibItem>(data: Record<string, any>): Map<string, T> {
        const items = new Map<string, T>();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const itemData = data[key];
                // Add the id property based on the key
                const item: T = { ...itemData, id: key } as T;
                items.set(key, item);
            }
        }
        return items;
    }

    /**
     * Retrieves a specific event definition by its ID.
     *
     * @param id The unique ID of the event.
     * @returns The event definition or undefined if not found.
     */
    public getEvent(id: string): EventDefinition | undefined {
        return this.events.get(id);
    }

    /**
     * Retrieves a specific building definition by its ID.
     *
     * @param id The unique ID of the building.
     * @returns The building definition or undefined if not found.
     */
    public getBuilding(id: string): LibItem | undefined { // Should return specific BuildingDefinition
        return this.buildings.get(id);
    }

    /**
     * Retrieves a specific technology definition by its ID.
     *
     * @param id The unique ID of the technology.
     * @returns The technology definition or undefined if not found.
     */
    public getTech(id: string): LibItem | undefined { // Should return specific TechDefinition
        return this.techs.get(id);
    }

    /**
     * Retrieves a specific character definition by its ID.
     *
     * @param id The unique ID of the character.
     * @returns The character definition or undefined if not found.
     */
    public getCharacter(id: string): CharacterDefinition | undefined {        return this.characters.getCharacter(id);    }
    /** // Added block
     * Retrieves the AttributeLib instance.     * @returns The AttributeLib instance.     */    public getAttributeLib(): AttributeLib {        return this.attributes;    }
    /**
     * Retrieves the SkillLib instance.
     * @returns The SkillLib instance.
     */
    public getSkillLib(): SkillLib {
        return this.skills;
    }
}