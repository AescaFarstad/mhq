import { GameState } from './GameState';
import { Lib } from './lib/Lib';
import { EventDefinition, Condition, Effect, ModifyResourceParams, DiscoverParams, StartDialogParams, ModifyResourceIncomeParams, AddCharacterParams, EventContext } from './lib/definitions/EventDefinition';
import { Stats } from './core/Stats';
import { Parameter } from './core/Stat';
import { Character, CharacterOps, LibSkillDefinition } from './Character';
import { CHARACTER_STAT_PREFIX } from './core/statPrefixes';

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
     * Processes a single event definition, typically for a specific character context.
     * Checks conditions and applies effects.
     *
     * @param eventDef The event definition to process.
     * @param state The current game state.
     * @param context The event context for context (optional).
     */
    public processSingleEvent(eventDef: EventDefinition, state: GameState, context?: EventContext): void {
        if (this.checkConditions(eventDef.conditions, state, context)) {
            console.log("process Event ", eventDef.id);
            this.applyEffects(eventDef.effects, state, context);
        }
    }

    /**
     * Checks if all conditions for an event are met.
     *
     * @param conditions Array of conditions to check.
     * @param state The current game state.
     * @param context The event context for context (optional).
     * @returns True if all conditions are met, false otherwise.
     */
    private checkConditions(conditions: Condition[], state: GameState, context?: EventContext): boolean {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        return conditions.every(condition => this.evaluateCondition(condition, state, context));
    }

    /**
     * Applies all effects of a triggered event.
     *
     * @param effects Array of effects to apply.
     * @param state The current game state.
     * @param context The event context for context (optional).
     */
    private applyEffects(effects: Effect[], state: GameState, context?: EventContext): void {
        if (!effects) return;
        effects.forEach(effect => this.executeEffect(effect, state, context));
    }

    /** Evaluates a single condition */
    private evaluateCondition(condition: Condition, state: GameState, context?: EventContext): boolean {
        switch (condition.key) {
            case 'alwaysTrue':
                return true;
            default:
                console.warn(`Unknown condition key: ${condition.key}`);
                return false;
        }
    }

    /** Executes a single effect */
    private executeEffect(effect: Effect, state: GameState, context?: EventContext): void {
        try {
            switch (effect.key) {
                case 'giveResource': {
                    const params = effect.params as ModifyResourceParams;
                    const res = state.resourceManager.getResource(params.resource);
                    if (res) {
                        Stats.modifyStat(res.current, params.amount, state.connections);
                    } else {
                        console.warn(`Effect 'giveResource': Resource "${params.resource}" not found.`);
                    }
                    break;
                }
                case 'giveMaxResource': {
                    const params = effect.params as ModifyResourceParams;
                    let res = state.resourceManager.getResource(params.resource);
                    if (!res) {
                         res = state.resourceManager.addResource(params.resource, 0, 0);
                    }
                    const currentMax = res.max.add;
                    const delta = params.amount - currentMax;
                    Stats.modifyParameterADD(res.max, delta, state.connections);
                    break;
                }
                case 'addResourceIncome': {
                    const params = effect.params as ModifyResourceIncomeParams;
                    const res = state.resourceManager.getResource(params.resource);
                    if (res) {
                        Stats.modifyParameterADD(res.income, params.amount, state.connections);
                    } else {
                        console.warn(`Effect 'addResourceIncome': Resource "${params.resource}" not found.`);
                    }
                    break;
                }
                case 'discoverResource': {
                    const params = effect.params as DiscoverParams;
                    break;
                }
                case 'discoverTab': {
                    const params = effect.params as DiscoverParams;
                    break;
                }
                case 'startDialog': {
                     const params = effect.params as StartDialogParams;
                    break;
                }
                case 'addCharacterByName': {
                    const params = effect.params as AddCharacterParams;
                    const charDef = this.lib.characters.getCharacter(params.characterId);
                    if (charDef) {
                        state.addCharacter(charDef.id);
                    } else {
                        console.warn(`Effect 'addCharacterByName': Character definition "${params.characterId}" not found in Lib.`);
                    }
                    break;
                }
                case 'giveAllSkillsAndSpecsEffect': {
                    if (!context || !('definition' in context) || !('skills' in context) || !('specializations' in context)) {
                        console.warn("[giveAllSkillsAndSpecsEffect]: Invalid character context provided:");
                        console.log(context);
                        return;
                    }
                    const character = context as Character;
                    const allSkillDefs = state.lib.skills.getAllSkills() as Record<string, LibSkillDefinition>;

                    if (Object.keys(allSkillDefs).length === 0) {
                        console.warn(`[giveAllSkillsAndSpecsEffect] For ${character.definition.name}: No skill definitions found in state.lib.skills.getAllSkills(). Cannot give skills.`);
                        return;
                    }

                    const connections = state.connections;

                    for (const skillId in allSkillDefs) {
                        if (Object.prototype.hasOwnProperty.call(allSkillDefs, skillId)) {
                            const skillDef = allSkillDefs[skillId];
                            CharacterOps.setOrUpdateSkillAndAllSpecializations(character, skillId, skillDef, 1, connections);
                        }
                    }
                    break;
                }
                default:
                    console.warn(`Unknown effect key: ${effect.key}`);
            }
        } catch (error) {
            console.error(`Error executing effect ${effect.key} with params:`, effect.params, error);
        }
    }
}