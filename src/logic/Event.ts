import { GameState } from './GameState';
import { EventDefinition, Condition, Effect, ModifyResourceParams, /*DiscoverParams, StartDialogParams,*/ ModifyResourceIncomeParams, AddCharacterParams, EventContext, DiscoverEffectParams } from './lib/definitions/EventDefinition';
import { Stats } from './core/Stats';
import { Character } from './Character';
import type { Skill } from './lib/definitions/SkillDefinition';
import { getResource, addResource } from './Resource';
import { Building } from './Building';

/**
 * Processes game events based on their conditions and applies their effects.
 */
export namespace EventProcessor {
    // Lib is accessed via state.lib

    /**
     * Processes a single event definition.
     * Checks conditions and applies effects.
     *
     * @param eventDef The event definition to process.
     * @param state The current game state (contains lib).
     * @param context The event context for context (optional).
     */
    export function processSingleEvent(eventDef: EventDefinition, state: GameState, context?: EventContext): void {
        if (checkConditions(eventDef.conditions, state, context)) {
            console.log("process Event ", eventDef.id);
            applyEffects(eventDef.effects, state, context);
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
    function checkConditions(conditions: Condition[], state: GameState, context?: EventContext): boolean {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        return conditions.every(condition => evaluateCondition(condition, state, context));
    }

    /**
     * Applies all effects of a triggered event.
     *
     * @param effects Array of effects to apply.
     * @param state The current game state.
     * @param context The event context for context (optional).
     */
    function applyEffects(effects: Effect[], state: GameState, context?: EventContext): void {
        if (!effects) return;
        effects.forEach(effect => executeEffect(effect, state, context));
    }

    /** Evaluates a single condition */
    function evaluateCondition(condition: Condition, _state: GameState, _context?: EventContext): boolean {
        switch (condition.key) {
            case 'alwaysTrue':
                return true;
            default:
                console.warn(`Unknown condition key: ${condition.key}`);
                return false;
        }
    }

    /** Executes a single effect */
    function executeEffect(effect: Effect, state: GameState, context?: EventContext): void {
        try {
            switch (effect.key) {
                case 'giveResource': {
                    const params = effect.params as ModifyResourceParams;
                    const res = getResource(state.resources, params.resource);
                    if (res) {
                        Stats.modifyStat(res.current, params.amount, state.connections);
                    } else {
                        console.warn(`Effect 'giveResource': Resource "${params.resource}" not found.`);
                    }
                    break;
                }
                case 'giveMaxResource': {
                    const params = effect.params as ModifyResourceParams;
                    let res = getResource(state.resources, params.resource);
                    if (!res) {
                         res = addResource(state.resources, params.resource, 0, 0, state.connections);
                    }
                    const currentMax = res.max.add;
                    const delta = params.amount - currentMax;
                    Stats.modifyParameterADD(res.max, delta, state.connections);
                    break;
                }
                case 'addResourceIncome': {
                    const params = effect.params as ModifyResourceIncomeParams;
                    const res = getResource(state.resources, params.resource);
                    if (res) {
                        Stats.modifyParameterADD(res.income, params.amount, state.connections);
                    } else {
                        console.warn(`Effect 'addResourceIncome': Resource "${params.resource}" not found.`);
                    }
                    break;
                }
                case 'discoverResource': {
                    // const params = effect.params as DiscoverParams;
                    break;
                }
                case 'discoverTab': {
                    // const params = effect.params as DiscoverParams;
                    break;
                }
                case 'discover': {
                    const params = effect.params as DiscoverEffectParams;
                    state.markAsDiscovered(params.key);
                    break;
                }
                case 'discoverAllBuildings': {
                    for (const buildingDef of state.lib.buildings.values()) {
                        state.markAsDiscovered(buildingDef.id);
                    }
                    break;
                }
                case 'discoverAllSkills': {
                    const allSkills = state.lib.skills.getAllSkillItems();
                    for (const skillId in allSkills) {
                        state.markAsDiscovered(skillId); // Discover skill itself
                        const skillItem = allSkills[skillId];
                        if (skillItem.type === 'skill') {
                            // Discover attribute
                            state.markAsDiscovered(skillItem.attribute);
                            // Discover specializations
                            skillItem.specializations.forEach(specId => state.markAsDiscovered(specId));
                        }
                    }
                    // Discover all attribute categories as well
                    const attributeDefs = state.lib.attributes.getAttributeDefinitions();
                    for (const attrKey in attributeDefs) {
                        state.markAsDiscovered(attrKey);
                    }
                    break;
                }
                case 'discoverAllResources': {
                    for (const resourceName of state.resources.keys()) {
                        state.markAsDiscovered(resourceName);
                    }
                    break;
                }
                case 'discoverAll': {
                    // Buildings
                    for (const buildingDef of state.lib.buildings.values()) {
                        state.markAsDiscovered(buildingDef.id);
                    }
                    // Skills, Attributes, Specializations
                    const allSkills = state.lib.skills.getAllSkillItems();
                    for (const skillId in allSkills) {
                        state.markAsDiscovered(skillId);
                        const skillItem = allSkills[skillId];
                        if (skillItem.type === 'skill') {
                            state.markAsDiscovered(skillItem.attribute);
                            skillItem.specializations.forEach(specId => state.markAsDiscovered(specId));
                        }
                    }
                    const attributeDefs = state.lib.attributes.getAttributeDefinitions();
                    for (const attrKey in attributeDefs) {
                        state.markAsDiscovered(attrKey);
                    }
                    // Resources
                    for (const resourceName of state.resources.keys()) {
                        state.markAsDiscovered(resourceName);
                    }
                    // Optionally, discover tabs or other general items if needed.
                    // For example, discovering all defined tabs if you have a TabLib
                    // state.lib.tabs.getAllTabIds().forEach(tabId => state.markAsDiscovered(tabId));
                    break;
                }
                case 'startDialog': {
                     // const params = effect.params as StartDialogParams;
                    break;
                }
                case 'addCharacterByName': {
                    const params = effect.params as AddCharacterParams;
                    const charDef = state.lib.characters.getCharacter(params.characterId);
                    if (charDef) {
                        Character.addCharacter(state, charDef.id);
                    } else {
                        console.warn(`Effect 'addCharacterByName': Character definition "${params.characterId}" not found in Lib.`);
                    }
                    break;
                }
                case 'giveAllSkillsAndSpecsEffect': {
                    if (!context || !('characterId' in context) || !('skills' in context) || !('specializations' in context)) {
                        console.warn("[giveAllSkillsAndSpecsEffect]: Invalid character context provided (must be a Character object):");
                        console.log(context);
                        return;
                    }
                    const character = context as Character; // context is expected to be Character here
                    const charDef = state.lib.characters.getCharacter(character.characterId)!; // Assume charDef exists

                    const allSkillDefs = state.lib.skills.getAllSkills() as Record<string, Skill>;

                    if (Object.keys(allSkillDefs).length === 0) {
                        console.warn(`[giveAllSkillsAndSpecsEffect] For ${charDef.name}: No skill definitions found in state.lib.skills.getAllSkills(). Cannot give skills.`);
                        return;
                    }

                    const connections = state.connections;

                    for (const skillId in allSkillDefs) {
                        if (Object.prototype.hasOwnProperty.call(allSkillDefs, skillId)) {
                            const skillDef = allSkillDefs[skillId];
                            Character.setOrUpdateSkillAndAllSpecializations(character, skillId, skillDef, 1, connections);
                        }
                    }
                    break;
                }
                case 'construct': {
                    const params = effect.params as { building: string };
                    if (params.building) {
                        Building.addBuilding(state, params.building);
                    } else {
                        console.warn(`Effect 'construct': Missing 'building' parameter.`);
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