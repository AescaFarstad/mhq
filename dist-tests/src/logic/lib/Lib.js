import { CharacterLib } from './CharacterLib';
import { AttributeLib } from './AttributeLib';
import { SkillLib } from './SkillLib';
import { TaskLib } from './TaskLib';
import { BuildingLib } from './BuildingLib';
import { DiscoveryLib } from './DiscoveryLib';
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
    events = new Map();
    characters = new CharacterLib();
    attributes = new AttributeLib();
    skills;
    tasks = new TaskLib();
    buildings = new BuildingLib();
    discovery;
    techs = new Map();
    ingressWords;
    welcomeLocations;
    behTrees;
    isLoaded = false;
    constructor() {
        this.skills = new SkillLib(this.attributes);
        this.ingressWords = new IngressWordsLib();
        this.welcomeLocations = new WelcomeLocationsLib();
        this.behTrees = new BehTreeLib();
        this.loadAllDefinitions();
        // Initialize DiscoveryLib after other libs are loaded
        this.discovery = new DiscoveryLib(this.skills, this.attributes, this.buildings);
    }
    loadAllDefinitions() {
        if (this.isLoaded) {
            return;
        }
        try {
            this.events = this._processDataDefinitions(eventsData);
            this.characters.loadCharacters(mainCharacters);
            this.characters.loadCharacters(turfablieCharacters);
            this.characters.loadCharacters(aeigareikaCharacters);
            this.characters.loadCharacters(sequoiterCharacters);
            this.buildings.loadBuildings(buildingDefinitions);
            this.tasks.loadTasks(taskDefinitions);
            this.tasks.verifyAllTasks(this.skills, this.buildings);
            this.isLoaded = true;
        }
        catch (error) {
            console.error("Failed to process library definitions:", error);
            this.isLoaded = false;
        }
    }
    _processDataDefinitions(data) {
        const items = new Map();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const itemData = data[key];
                const item = { ...itemData, id: key };
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
    getEvent(id) {
        return this.events.get(id);
    }
    /**
     * Retrieves a specific building definition by its ID.
     *
     * @param id The unique ID of the building.
     * @returns The building definition or undefined if not found.
     */
    getBuilding(id) {
        return this.buildings.getBuilding(id);
    }
    /**
     * Retrieves a specific technology definition by its ID.
     *
     * @param id The unique ID of the technology.
     * @returns The technology definition or undefined if not found.
     */
    getTech(id) {
        return this.techs.get(id);
    }
    /**
     * Retrieves a specific character definition by its ID.
     *
     * @param id The unique ID of the character.
     * @returns The character definition or undefined if not found.
     */
    getCharacter(id) {
        return this.characters.getCharacter(id);
    }
}
