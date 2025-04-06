import { LibItem } from './LibDefinitions';
import { EventDefinition } from '../events/EventDefinition'; // Import specific definition type
import eventJsonData from '../data/events.json'; // Import the JSON data directly

/**
 * Manages collections of game entity definitions loaded from external sources (like JSON).
 * This provides a central access point for definitions of things like buildings, techs, events, etc.
 */
export class Lib {
    /** Collection of event definitions. */
    public events: Map<string, EventDefinition> = new Map<string, EventDefinition>();

    /** Collection of building definitions. */
    public buildings: Map<string, LibItem> = new Map<string, LibItem>(); // Specific type would be BuildingDefinition

    /** Collection of technology definitions. */
    public techs: Map<string, LibItem> = new Map<string, LibItem>(); // Specific type would be TechDefinition

    // Flag to indicate if loading is complete
    public isLoaded: boolean = false;

    constructor() {
        // Load definitions immediately in the constructor
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
            this.events = this.processImportedJson<EventDefinition>(eventJsonData);
            console.log(`Processed ${this.events.size} events.`);

            // Process other definitions similarly if they were imported
            // this.buildings = this.processImportedJson<BuildingDefinition>(buildingJsonData);
            // this.techs = this.processImportedJson<TechDefinition>(techJsonData);

            this.isLoaded = true;
            console.log("Library definitions processed successfully.");
        } catch (error) {
            console.error("Failed to process library definitions:", error);
            // Handle critical error - perhaps prevent game start
            this.isLoaded = false; // Ensure flag indicates failure
        }
    }

    /**
     * Helper method for processing imported JSON data into a Map.
     *
     * @param jsonData The imported JSON object.
     * @returns A Map where keys are the top-level keys from the JSON and values are the corresponding objects with an added 'id' property.
     */
    private processImportedJson<T extends LibItem>(jsonData: any): Map<string, T> {
        const items = new Map<string, T>();
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const itemData = jsonData[key];
                // Add the id property based on the JSON key
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
}

// Placeholder for file reading function if needed (adjust for environment)
/*
function getFileContentSync(filePath: string): string {
    // Implementation depends on environment (Node.js vs Browser)
    // Example for Node.js:
    // import * as fs from 'fs';
    // import * as path from 'path';
    // return fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
    throw new Error("File loading not implemented in this environment.");
}
*/ 