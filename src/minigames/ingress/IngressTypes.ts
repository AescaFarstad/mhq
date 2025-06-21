import type { MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';
import type { WordDefinition } from './lib/definitions/WordDefinition';

export const INGRESS_TYPE: MinigameType = 'Ingress';

export interface SubmittedWord {
    definition: WordDefinition;
    pointsEarned: number;
    wasTypo: boolean;
    sourceCharacterIds?: string[];
    originalTypedWord: string; // The word actually typed by the user
}

// Simple array to store all words entered during the game as strings
export type AllSubmittedWords = string[];

export type IngressUpgradeId = 
    | 'char_attribute_point'
    | 'char_skill_point'
    | 'char_spec_point'
    | 'char_xp_boost'
    | 'breach_word_bonus'
    | 'breach_typo_tolerance'
    | 'breach_word_counter'
    | 'breach_possession_speed';

export type IngressUpgrades = {
    [K in IngressUpgradeId]: boolean;
};

/**
 * Represents the discovery state of a character option in the Ingress minigame.
 * - 'locked': The character is not yet available to be discovered.
 * - 'unexplored': The character option is visible but completely unknown (shows a '?').
 * - 'name_revealed': The character's name has been revealed.
 * - 'portrait_revealed': The character's portrait and name are visible.
 */
export type IngressCharacterDiscoveryState = 'locked' | 'unexplored' | 'name_revealed' | 'portrait_revealed';

/**
 * Represents a discoverable character within the Ingress minigame.
 */
export interface IngressCharacterOption {
    characterId: string;
    discoveryState: IngressCharacterDiscoveryState;
    explorationCosts: number[]; // Costs for each stage of discovery
    characterName?: string;
    characterImage?: {
        full: string;
        portrait?: string;
    };
}

/**
 * Defines the state structure for the Ingress minigame.
 * This state is managed by IngressGame and synced to the UI.
 */
export interface IngressState extends MinigameState {
    usefulWords: SubmittedWord[];
    offensiveWords: string[];
    blankWords: string[];
    allSubmittedWords: AllSubmittedWords; // Comprehensive storage of all words entered
    possessionCharges: number;
    totalPossessionCharges: number; // Total charges earned over time
    chargesBarRevealed: boolean;
    characterOptions: IngressCharacterOption[]; // Discoverable characters
    inspectingCharacterId: string | null; // ID of character being viewed in detail
    renamingCharacterId: string | null; // ID of character being renamed
    characterRenames: { [characterId: string]: string }; // Map of characterId -> new name
    characterXpBonuses: { [characterId: string]: number }; // Map of characterId -> % xp bonus
    bioObfuscation: number; // Obfuscation percentage for bio (1.0 = 100%)
    upgrades: IngressUpgrades;
    upgradesRevealed: boolean;
    possessionProgress: number; // From 0 to 100
    engaged: boolean;
    engagementProgress: number;
    engagementCompletionTime: number | null;
}
