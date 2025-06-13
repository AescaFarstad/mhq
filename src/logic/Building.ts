import { IndependentStat, ConnectionType } from './core/Stat';
import { Stats } from './core/Stats';
import { BUILDING_STAT_PREFIX } from './core/statPrefixes';
import type { GameState } from './GameState';

export interface Building {
    buildingId: string;
    level: IndependentStat;
    clutterGeneration: IndependentStat;
}

export namespace Building {
    /**
     * Adds a building to the game state and updates clutter generation.
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
        return newBuilding;
    }
} 