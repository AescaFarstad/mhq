import { BuildingDefinition } from "./definitions/BuildingDefinition";

type BuildingData = Record<string, Omit<BuildingDefinition, 'id'>>;

export class BuildingLib {
    private buildings: Map<string, BuildingDefinition> = new Map();
    public isLoaded: boolean = false;

    /**
     * Loads building definitions from TypeScript data
     * @param buildingData The building data with proper typing
     */
    public loadBuildings(buildingData: BuildingData): void {
        this.buildings.clear();
        for (const id in buildingData) {
            if (Object.prototype.hasOwnProperty.call(buildingData, id)) {
                const data = buildingData[id];
                const buildingDef: BuildingDefinition = {
                    id: id,
                    ...data
                };
                this.buildings.set(id, buildingDef);
            }
        }
        this.isLoaded = true;
        console.log(`BuildingLib loaded ${this.buildings.size} building definitions.`);
    }

    /**
     * Gets a building definition by its ID.
     * @param id The building ID.
     * @returns The BuildingDefinition or undefined if not found.
     */
    public getBuilding(id: string): BuildingDefinition | undefined {
        return this.buildings.get(id);
    }

    /**
     * Gets all loaded building definitions.
     * @returns An iterable iterator of BuildingDefinition values.
     */
    public values(): IterableIterator<BuildingDefinition> {
        return this.buildings.values();
    }
}