import { LibItem } from './LibDefinitions';

/**
 * Represents the definition of a task
 */
export interface TaskDefinition extends LibItem {
    effortMin: number;
    effortMax: number;
    reward?: {
        clutterPerEffort?: number;
        // Other reward types can be added here
    };
    names: {
        byBuilding?: Record<string, TaskNameDetails[]>;
    };
}

export interface TaskNameDetails {
    name: string;
    skills: string[];
    intermediates: string[];
    [key: string]: string[] | string;
}