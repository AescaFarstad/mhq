import { LibItem } from './LibDefinitions';
import { Effect } from './EventDefinition';

/**
 * Represents the definition of a building
 */
export interface BuildingDefinition extends LibItem {
    /** Display name of the building */
    name: string;
    /** Description of what the building does */
    description: string;
    /** Resource costs to construct this building */
    cost: Record<string, number>;
    /** Amount of clutter generated per second by this building */
    clutterPerSecond: number;
    /** XP multiplier for tasks performed in this building */
    xpMult?: number;
    /** Effects to execute when this building is constructed */
    effects?: Effect[];
}