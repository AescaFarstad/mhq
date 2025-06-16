import { ConnectionType } from './core/Stat';
import { Stats } from './core/Stats';
import { BUILDING_STAT_PREFIX } from './core/statPrefixes';
import { EventProcessor } from './Event';
export var Building;
(function (Building) {
    /**
     * Adds a building to the game state, executes its construction effects, and dispatches a construction event.
     */
    function addBuilding(gameState, buildingId) {
        const buildingDef = gameState.lib.buildings.getBuilding(buildingId);
        if (!buildingDef) {
            console.warn(`Building.addBuilding: Building definition not found for ID: ${buildingId}`);
            return undefined;
        }
        const idPrefix = `${BUILDING_STAT_PREFIX}${buildingDef.id}__`;
        const newBuilding = {
            buildingId: buildingDef.id,
            level: Stats.createStat(`${idPrefix}level`, 1, gameState.connections),
            clutterGeneration: Stats.createStat(`${idPrefix}clutter_generation`, buildingDef.clutterPerSecond, gameState.connections)
        };
        gameState.buildings.push(newBuilding);
        Stats.connectStat(newBuilding.clutterGeneration, gameState.totalBuildingsClutter, ConnectionType.ADD, gameState.connections);
        // Execute building construction effects
        if (buildingDef.effects && buildingDef.effects.length > 0) {
            const constructionEvent = {
                id: `building_${buildingDef.id}_construction_effects`,
                effects: buildingDef.effects
            };
            EventProcessor.processSingleEvent(constructionEvent, gameState, undefined);
        }
        // Dispatch generic building constructed event
        const buildingConstructedEvent = {
            id: 'buildingConstructed',
            params: {
                buildingId: buildingDef.id,
                buildingName: buildingDef.name
            },
            effects: []
        };
        EventProcessor.processSingleEvent(buildingConstructedEvent, gameState, undefined);
        return newBuilding;
    }
    Building.addBuilding = addBuilding;
})(Building || (Building = {}));
