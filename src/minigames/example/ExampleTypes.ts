import type { MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';

export const EXAMPLE_TYPE: MinigameType = 'Example';

// Add any Example-specific constants here if needed in the future
// export const EXAMPLE_CONSTANT = 42;

export interface ExampleState extends MinigameState {
    // Add any Example-specific state properties here
    // For example:
    // score: number;
    // currentLevel: string;
    // isActive: boolean;
}

// Add any other Example-specific type definitions here
// For example:
// export interface ExampleItem {
//   id: string;
//   name: string;
//   value: number;
// }