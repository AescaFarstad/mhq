import { LibItem } from './LibDefinitions';

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
}