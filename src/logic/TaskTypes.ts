import type { TaskDefinition, TaskNameDetails } from './lib/definitions/TaskDefinition';

export enum GameTaskType {
    Maintenance = "Maintenance",
    Opportunity = "Opportunity",
    Endeavour = "Endeavour",
    Quest = "Quest"
}

export enum GameTaskStatus {
    Available = "Available",
    Queued = "Queued",
    Processing = "Processing",
    Paused = "Paused", // Considered part of the Queued list for management, but distinct status
    Complete = "Complete"
}

export interface GameTask {
    uid: string;                     // Unique instance ID (e.g., "TASK_123")
    type: GameTaskType;
    status: GameTaskStatus;

    // Path to the specific TaskNameDetails within TaskLib.
    // The first element is always the TaskDefinition id.
    // e.g., ["declutter", "byBuilding", "library", 0]
    definitionPath: Array<string | number>;

    // Direct reference to the specific TaskNameDetails object from TaskLib, resolved at instantiation.
    resolvedDefinitionDetails: TaskNameDetails;
    // Direct reference to the parent TaskDefinition object from TaskLib, resolved at instantiation.
    resolvedParentDefinition: TaskDefinition;

    name: string;                    // Display name, sourced from resolvedDefinitionDetails.name

    totalEffort: number;             // Total effort required, randomized from resolvedParentDefinition.effortMin/Max.
    investedEffort: number;          // Current progress towards totalEffort.

    assignedCharacterIds: string[];  // IDs of characters currently working on this. Empty if not Processing.
    queuedForCharacterId?: string;   // Optional: If specifically queued for one character by the player.

    startedAt: number;               // Game time (timestamp) when task last moved to 'Processing' status. Initialized to 0.
    workTime: number;                // Total accumulated game time (in seconds) characters have actively spent on this task.

    // UI-specific fields, populated during task processing/assignment
    speed?: number;                  // Calculated speed if task is active
    clutterReduction?: number;       // Calculated clutter reduction if applicable
    assignedCharacterEffectiveScores?: { [skillOrSpecName: string]: number }; // Character's scores for required skills
} 