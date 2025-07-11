import { GameState } from './GameState';
import { EventDefinition, Effect, ModifyResourceParams, /*DiscoverParams, StartDialogParams,*/ ModifyResourceIncomeParams, AddCharacterParams, DiscoverEffectParams, StartMinigameParams, ApplyIngressResultsParams, ApplyWelcomeResultsParams, GivePointsParams } from './lib/definitions/EventDefinition';
import * as effects from './effects';
import { discoverAll, discoverAllBuildings, discoverAllSkills, discoverAllResources, discoverAllAttributes, discoverAllTabs } from './Discovery';

// Module-level queue for pending events
const pendingEvents: EventDefinition[] = [];
let isProcessingEvents = false;

/**
 * Processes game events based on their conditions and applies their effects.
 */
export namespace EventProcessor {
    // Lib is accessed via state.lib

    /**
     * Queues a single event for processing.
     * If not already processing, starts processing the queue.
     *
     * @param eventDef The event definition to process.
     * @param state The current game state (contains lib).
     * @param context The event context for context (optional).
     */
    export function processSingleEvent(eventDef: EventDefinition, state: GameState): void {
        pendingEvents.push(eventDef);

        if (isProcessingEvents) {
            return;
        }

        isProcessingEvents = true;
        try {
            while (pendingEvents.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const currentEventDef = pendingEvents.shift()!;
                
                applyEffects(currentEventDef.effects, state);
                state.invoker?.handleEvent(currentEventDef, state);
            }
        } finally {
            isProcessingEvents = false;
        }
    }

    /**
     * Applies all effects of a triggered event.
     *
     * @param effects Array of effects to apply.
     * @param state The current game state.
     */
    function applyEffects(effectsToApply: Effect[], state: GameState): void {
        if (!effectsToApply) return;
        effectsToApply.forEach(effect => executeEffect(effect, state));
    }

    /** Executes a single effect */
    function executeEffect(effect: Effect, state: GameState): void {
        try {
            switch (effect.key) {
                case 'giveResource':
                    effects.giveResource(state, effect.params as ModifyResourceParams);
                    break;
                case 'giveMaxResource':
                    effects.giveMaxResource(state, effect.params as ModifyResourceParams);
                    break;
                case 'addResourceIncome':
                    effects.addResourceIncome(state, effect.params as ModifyResourceIncomeParams);
                    break;
                case 'discover':
                    effects.discover(state, effect.params as DiscoverEffectParams);
                    break;
                case 'discoverAllBuildings':
                    discoverAllBuildings(state);
                    break;
                case 'discoverAllSkills':
                    discoverAllSkills(state);
                    break;
                case 'discoverAllResources':
                    discoverAllResources(state);
                    break;
                case 'discoverAllAttributes':
                    discoverAllAttributes(state);
                    break;
                case 'discoverAllTabs':
                    discoverAllTabs(state);
                    break;
                case 'discoverAll':
                    discoverAll(state);
                    break;
                case 'startDialog':
                    effects.startDialog();
                    break;
                case 'addCharacterByName':
                    effects.addCharacterByName(state, effect.params as AddCharacterParams);
                    break;
                // case 'giveAllSkillsAndSpecsEffect':
                //     effects.giveAllSkillsAndSpecsEffect(state);
                //     break;
                case 'giveSkillsAndSpecs':
                    effects.giveSkillsAndSpecs(state, effect.params);
                    break;
                case 'construct':
                    effects.construct(state, effect.params as { building: string });
                    break;
                case 'startMinigame':
                    effects.startMinigame(state, effect.params as StartMinigameParams);
                    break;
                case 'startBehTree':
                    effects.startBehTree(state, effect.params as { treeName: string });
                    break;
                case 'ApplyIngressResults':
                    effects.applyIngressResults(state, effect.params as ApplyIngressResultsParams);
                    break;
                case 'applyWelcomeResults':
                    effects.applyWelcomeResults(state, effect.params as ApplyWelcomeResultsParams);
                    break;
                case 'givePoints':
                    effects.givePoints(state, effect.params as GivePointsParams);
                    break;
                case 'skipIngressEngagement':
                    effects.skipIngressEngagement(state);
                    break;
                case 'modifyIndependentStat':
                    effects.modifyIndependentStat(state, effect.params as { statName: string; amount: number });
                    break;
                default:
                    console.warn(`Unknown effect key: ${effect.key}`);
            }
        } catch (error) {
            console.error(`Error executing effect ${effect.key} with params:`, effect.params, error);
        }
    }
}