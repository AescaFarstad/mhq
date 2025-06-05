import type { MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';
import type { WordDefinition } from './lib/definitions/WordDefinition';

export const INGRESS_TYPE: MinigameType = 'Ingress';

// Add any Ingress-specific constants here if needed in the future
// export const EXAMPLE_CONSTANT = 42;

export interface IngressState extends MinigameState {
    // Add any Ingress-specific state properties here
    usefulWords: WordDefinition[];
    offensiveWords: string[];
    blankWords: string[];
    possessionCharges: number;
    // For example:
    // score: number;
    // currentLevel: string;
    // isActive: boolean;
}

// Add any other Ingress-specific type definitions here
// For example:
// export interface IngressItem {
//   id: string;
//   name: string;
//   value: number;
// }