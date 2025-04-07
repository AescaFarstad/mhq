import { GameState } from '../GameState';
import { Lib } from '../lib/Lib';
import { EventDefinition, Condition, Effect, ModifyResourceParams, DiscoverParams, StartDialogParams, ModifyResourceIncomeParams, AddCharacterParams } from './EventDefinition';
import { Stats } from '../core/Stats'; // Needed for effects
import { Parameter } from '../core/Stat'; // Needed for effects

/**
 * Processes game events based on their conditions and applies their effects.
 * Relies on the Lib being loaded.
 */
export class EventProcessor {
    private lib: Lib;

    constructor(lib: Lib) {
        this.lib = lib;
    }

    /**
     * Checks all available events from the Lib and triggers those whose conditions are met.
     *
     * @param state The current game state.
     */
    public processEvents(state: GameState): void {
        if (!this.lib.isLoaded) {
            // console.warn("EventProcessor.processEvents called before Lib was loaded.");
            return; // Don't process if Lib isn't ready
        }

        // Iterate through events provided by the Lib
        for (const eventDef of this.lib.events.values()) {
            // Skip already processed one-time events
            if (eventDef.triggerOnce && eventDef.hasRun) {
                continue;
            }

            if (this.checkConditions(eventDef.conditions, state)) {
                console.log(`Event triggered: ${eventDef.id}`);
                this.applyEffects(eventDef.effects, state);

                // Mark as processed if it's a one-time event
                // Note: This modifies the definition in the Lib directly. Consider cloning if needed.
                if (eventDef.triggerOnce) {
                    eventDef.hasRun = true; // Update the flag in the loaded definition
                }
                // Optionally break if only one event per tick, or handle priorities
            }
        }
    }

    /**
     * Checks if all conditions for an event are met.
     *
     * @param conditions Array of conditions to check.
     * @param state The current game state.
     * @returns True if all conditions are met, false otherwise.
     */
    private checkConditions(conditions: Condition[], state: GameState): boolean {
        if (!conditions || conditions.length === 0) {
            return true; // No conditions means it can always trigger
        }
        return conditions.every(condition => this.evaluateCondition(condition, state));
    }

    /**
     * Applies all effects of a triggered event.
     *
     * @param effects Array of effects to apply.
     * @param state The current game state.
     */
    private applyEffects(effects: Effect[], state: GameState): void {
        if (!effects) return;
        effects.forEach(effect => this.executeEffect(effect, state));
    }

    /** Evaluates a single condition */
    private evaluateCondition(condition: Condition, state: GameState): boolean {
        switch (condition.key) {
            case 'alwaysTrue':
                return true;
            // --- Add other condition evaluations here ---
            // Example:
            // case 'hasResource': {
            //     const params = condition.params as ModifyResourceParams;
            //     const res = state.resourceManager.getResource(params.resource);
            //     return !!res && res.current.value >= params.amount;
            // }
            default:
                console.warn(`Unknown condition key: ${condition.key}`);
                return false;
        }
    }

    /** Executes a single effect */
    private executeEffect(effect: Effect, state: GameState): void {
        console.log(`Executing effect: ${effect.key}`, effect.params);
        try {
            switch (effect.key) {
                case 'giveResource': {
                    const params = effect.params as ModifyResourceParams;
                    const res = state.resourceManager.getResource(params.resource);
                    if (res) {
                        Stats.modifyStat(res.current, params.amount, state.connections);
                        console.log(`Gave ${params.amount} ${params.resource}. New total: ${res.current.value.toFixed(1)}`);
                    } else {
                        console.warn(`Effect 'giveResource': Resource "${params.resource}" not found.`);
                    }
                    break;
                }
                case 'giveMaxResource': {
                    const params = effect.params as ModifyResourceParams;
                    let res = state.resourceManager.getResource(params.resource);
                    if (!res) {
                         console.log(`Effect 'giveMaxResource': Resource "${params.resource}" not found, creating it.`);
                         res = state.resourceManager.addResource(params.resource, 0, 0);
                    }
                    const currentMax = res.max.add;
                    const delta = params.amount - currentMax;
                    Stats.modifyParameterADD(res.max, delta, state.connections);
                    console.log(`Set max ${params.resource} to ${params.amount}.`);
                    break;
                }
                case 'addResourceIncome': {
                    const params = effect.params as ModifyResourceIncomeParams;
                    const res = state.resourceManager.getResource(params.resource);
                    if (res) {
                        Stats.modifyParameterADD(res.income, params.amount, state.connections);
                        console.log(`Added ${params.amount}/sec income to ${params.resource} from ${params.source || 'unknown'}. New income: ${res.income.value.toFixed(2)}`);
                    } else {
                        console.warn(`Effect 'addResourceIncome': Resource "${params.resource}" not found.`);
                    }
                    break;
                }
                case 'discoverResource': {
                    const params = effect.params as DiscoverParams;
                    console.log(`Resource discovered: ${params.target}`);
                    // Example: if (state.resourceManager.getResource(params.target)) state.resourceManager.getResource(params.target).isDiscovered = true;
                    break;
                }
                case 'discoverTab': {
                    const params = effect.params as DiscoverParams;
                    console.log(`Tab discovered: ${params.target}`);
                    // Example: state.discoveredTabs.add(params.target);
                    break;
                }
                case 'startDialog': {
                     const params = effect.params as StartDialogParams;
                     console.log(`Dialog started: ${params.dialogId}`);
                     // Example: state.activeDialog = { id: params.dialogId, currentNode: 'start' };
                    break;
                }
                case 'addCharacterByName': {
                    const params = effect.params as AddCharacterParams;
                    const charDef = this.lib.getCharacter(params.characterId);
                    if (charDef) {
                        state.addCharacter(charDef);
                    } else {
                        console.warn(`Effect 'addCharacterByName': Character definition "${params.characterId}" not found in Lib.`);
                    }
                    break;
                }
                // --- Add other effect implementations here ---
                default:
                    console.warn(`Unknown effect key: ${effect.key}`);
            }
        } catch (error) {
            console.error(`Error executing effect ${effect.key} with params:`, effect.params, error);
        }
    }
} 