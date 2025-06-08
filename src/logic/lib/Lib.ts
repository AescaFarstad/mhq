import { LibItem } from './definitions/LibDefinitions';
import { EventDefinition } from './definitions/EventDefinition';
import { CharacterLib } from './CharacterLib';
import { CharacterDefinition } from './definitions/CharacterDefinition';
import { BuildingDefinition } from './definitions/BuildingDefinition';
import { AttributeLib } from './AttributeLib';
import { SkillLib } from './SkillLib';
import { TaskLib } from './TaskLib';
import { BuildingLib } from './BuildingLib';
import { IngressWordsLib } from '../../minigames/ingress/lib/IngressWordsLib';
import { WelcomeLocationsLib } from '../../minigames/welcome/lib/WelcomeLocationsLib';
import { BehTreeLib } from './BehTreeLib';

import eventsData from '../data/events';
import mainCharacters from '../data/characters';
import turfablieCharacters from '../data/turfablieCharacters';
import aeigareikaCharacters from '../data/aeigareikaCharacters';
import sequoiterCharacters from '../data/sequoiterCharacters';
import { taskDefinitions } from '../data/tasks';
import { buildingDefinitions } from '../data/buildings';

/**
 * The Lib class is a container for all the game's static data definitions.
 * It is responsible for loading data from the /data folder and making it accessible.
 */
export class Lib {
    public events: Map<string, EventDefinition> = new Map<string, EventDefinition>();
    public characters: CharacterLib = new CharacterLib();
    public attributes: AttributeLib = new AttributeLib();
    public skills: SkillLib;
    public tasks: TaskLib = new TaskLib();
    public buildings: BuildingLib = new BuildingLib();
    public techs: Map<string, LibItem> = new Map<string, LibItem>();
    public ingressWords: IngressWordsLib;
    public welcomeLocations: WelcomeLocationsLib;
    public behTrees: BehTreeLib;
    public isLoaded: boolean = false;

    constructor() {
        this.skills = new SkillLib(this.attributes);
        this.ingressWords = new IngressWordsLib();
        this.welcomeLocations = new WelcomeLocationsLib();
        this.behTrees = new BehTreeLib();
        this.loadAllDefinitions();
    }

    private loadAllDefinitions(): void {
        if (this.isLoaded) {
            return;
        }

        console.log("Processing library definitions...");
        try {
            this.events = this._processDataDefinitions<EventDefinition>(eventsData);
            this.characters.loadCharacters(mainCharacters);
            this.characters.loadCharacters(turfablieCharacters);
            this.characters.loadCharacters(aeigareikaCharacters);
            this.characters.loadCharacters(sequoiterCharacters);
            this.buildings.loadBuildings(buildingDefinitions);
            this.tasks.loadTasks(taskDefinitions);
            this.tasks.verifyAllTasks(this.skills, this.buildings);
            this.isLoaded = true;
            console.log("Library definitions processed successfully.");
        } catch (error) {
            console.error("Failed to process library definitions:", error);
            this.isLoaded = false;
        }
    }

    private _processDataDefinitions<T extends LibItem>(data: Record<string, any>): Map<string, T> {
        const items = new Map<string, T>();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const itemData = data[key];
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
    public getBuilding(id: string): BuildingDefinition | undefined {
        return this.buildings.getBuilding(id);
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

    /**
     * Retrieves the TaskLib instance.
     * @returns The TaskLib instance.
     */
    public getTaskLib(): TaskLib {
        return this.tasks;
    }

    /**
     * Retrieves the BuildingLib instance.
     * @returns The BuildingLib instance.
     */
    public getBuildingLib(): BuildingLib {
        return this.buildings;
    }

    /**
     * Retrieves the IngressWordsLib instance.
     * @returns The IngressWordsLib instance.
     */
    public getIngressWordsLib(): IngressWordsLib {
        return this.ingressWords;
    }
}