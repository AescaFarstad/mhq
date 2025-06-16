export class BuildingLib {
    buildings = new Map();
    isLoaded = false;
    /**
     * Loads building definitions from TypeScript data
     * @param buildingData The building data with proper typing
     */
    loadBuildings(buildingData) {
        this.buildings.clear();
        for (const id in buildingData) {
            if (Object.prototype.hasOwnProperty.call(buildingData, id)) {
                const data = buildingData[id];
                const buildingDef = {
                    id: id,
                    ...data
                };
                this.buildings.set(id, buildingDef);
            }
        }
        this.isLoaded = true;
    }
    /**
     * Gets a building definition by its ID.
     * @param id The building ID.
     * @returns The BuildingDefinition or undefined if not found.
     */
    getBuilding(id) {
        return this.buildings.get(id);
    }
    /**
     * Gets all loaded building definitions.
     * @returns An iterable iterator of BuildingDefinition values.
     */
    values() {
        return this.buildings.values();
    }
}
