import { GameState } from '../../GameState';
// import { Stat } from '../../core/Stat';
import { Character } from '../../Character';
import type { LibItem } from "./LibDefinitions";

// Define the EventContext type
export type EventContext = Character | undefined; // Start with Character, can be extended

/** Represents parameters for modifying a resource amount or capacity */
export interface ModifyResourceParams {
    resource: string;
    amount: number;
}

/** Represents parameters for modifying a resource's income */
export interface ModifyResourceIncomeParams {
    resource: string;
    amount: number;
    /** Optional: Identifier for the source of this income (e.g., building ID, event name) */
    source?: string;
}

/** Represents parameters for discovering something */
export interface DiscoverParams {
    target: string; // Name of the resource, building, tab, etc.
}

/** Represents parameters for starting a dialog */
export interface StartDialogParams {
    dialogId: string;
}

/** Represents parameters for adding a character by name */
export interface AddCharacterParams {
    characterId: string; // The ID of the character definition in CharacterLib
}

/** Represents parameters for the new 'discover' effect */
export interface DiscoverEffectParams {
    key: string; // The item ID to mark as discovered
}

/** Represents parameters for starting a minigame */
export interface StartMinigameParams {
    name: string; // The key/type of the minigame to start (e.g., 'ClickCounter')
    // Optional: any specific parameters to initialize the minigame
    minigameParams?: Record<string, any>; 
}

/** Represents the results of the Ingress minigame */
export interface ApplyIngressResultsParams {
    characterId: string;
    characterName?: string;
    xpBonus: number;
    attributePoints: number;
    skillPoints: number;
    specPoints: number;
}

/** Represents the results of the Welcome minigame */
export interface ApplyWelcomeResultsParams {
    locationId: string;
}

/**
 * Represents an effect that modifies the game state when an event triggers.
 * Specific effect types will implement this interface.
 */
export interface Effect {
    /** A key identifying the type of effect (e.g., 'giveResource', 'modifyStat', 'addFact'). */
    key: string;
    /** Additional parameters needed to apply the effect. */
    params: Record<string, any>;

    /**
     * Applies the effect to the given game state.
     *
     * @param state The current game state.
     */
    apply?(state: GameState): void;
}

/**
 * Represents the definition of a game event, typically loaded from the Lib.
 */
export interface EventDefinition extends LibItem {
    /** Unique identifier for this event. */
    id: string;
    /** Effects to apply when the event triggers. */
    effects: Effect[];
    /** Optional: For generic event data */
    params?: Record<string, any>;
}

export type EventID = string; 