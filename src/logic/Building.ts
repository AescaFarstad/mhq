import { IndependentStat, ConnectionType } from './core/Stat';
import { Stats } from './core/Stats';
import { BUILDING_STAT_PREFIX } from './core/statPrefixes';
import type { GameState } from './GameState';
import { EventProcessor } from './Event';
import type { EventDefinition } from './lib/definitions/EventDefinition';

export interface Building {
    buildingId: string;
    level: IndependentStat;
    clutterGeneration: IndependentStat;
}

export namespace Building {
    /**
     * Adds a building to the game state, executes its construction effects, and dispatches a construction event.
     */
    export function addBuilding(gameState: GameState, buildingId: string): Building | undefined {
        const buildingDef = gameState.lib.buildings.getBuilding(buildingId);
        if (!buildingDef) {
            console.warn(`Building.addBuilding: Building definition not found for ID: ${buildingId}`);
            return undefined;
        }

        const idPrefix = `${BUILDING_STAT_PREFIX}${buildingDef.id}__`;

        const newBuilding: Building = {
            buildingId: buildingDef.id,
            level: Stats.createStat(`${idPrefix}level`, 1, gameState.connections),
            clutterGeneration: Stats.createStat(`${idPrefix}clutter_generation`, buildingDef.clutterPerSecond, gameState.connections)
        };
        
        gameState.buildings.push(newBuilding);
        Stats.connectStat(newBuilding.clutterGeneration, gameState.totalBuildingsClutter, ConnectionType.ADD, gameState.connections);

        // Execute building construction effects
        if (buildingDef.effects && buildingDef.effects.length > 0) {
            const constructionEvent: EventDefinition = {
                id: `building_${buildingDef.id}_construction_effects`,
                effects: buildingDef.effects
            };
            EventProcessor.processSingleEvent(constructionEvent, gameState, undefined);
        }

        // Dispatch generic building constructed event
        const buildingConstructedEvent: EventDefinition = {
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
} 