import { GameState } from '../GameState';
import { Stat } from '../core/Stat';

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

/**
 * Represents a condition that must be met for an event to trigger.
 * Specific condition types will implement this interface.
 */
export interface Condition {
    /** A key identifying the type of condition (e.g., 'hasResource', 'statValue', 'hasFact'). */
    key: string;
    /** Additional parameters needed for the condition check. */
    params?: any; // Keep flexible for now, or create specific param types

    /**
     * Checks if the condition is met in the given game state.
     *
     * @param state The current game state.
     * @returns True if the condition is met, false otherwise.
     */
    check(state: GameState): boolean;
}

/**
 * Represents an effect that modifies the game state when an event triggers.
 * Specific effect types will implement this interface.
 */
export interface Effect {
    /** A key identifying the type of effect (e.g., 'giveResource', 'modifyStat', 'addFact'). */
    key: string;
    /** Additional parameters needed to apply the effect. */
    params: any; // Use specific param types like ModifyResourceParams

    /**
     * Applies the effect to the given game state.
     *
     * @param state The current game state.
     */
    apply(state: GameState): void;
}

/**
 * Represents the definition of a game event, typically loaded from the Lib.
 */
export interface EventDefinition {
    /** Unique identifier for this event. */
    id: string;
    /** Conditions that must all be met for the event to trigger. */
    conditions: Condition[];
    /** Effects to apply when the event triggers. */
    effects: Effect[];
    /** Optional: Can this event only trigger once? */
    triggerOnce?: boolean;
    /** Optional: Priority for processing if multiple events trigger simultaneously. */
    priority?: number;
    /** Optional: Flag to check if this event has already run (for triggerOnce). Set by EventProcessor */
    hasRun?: boolean;
} 