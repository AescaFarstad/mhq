import { GameState } from './GameState';
import { EventDefinition, Effect, ModifyResourceParams, /*DiscoverParams, StartDialogParams,*/ ModifyResourceIncomeParams, AddCharacterParams, EventContext, DiscoverEffectParams, StartMinigameParams, ApplyIngressResultsParams, ApplyWelcomeResultsParams } from './lib/definitions/EventDefinition';
import * as effects from './effects';

// Module-level queue for pending events
const eventQueue: { eventDef: EventDefinition; context?: EventContext }[] = [];
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
    export function processSingleEvent(eventDef: EventDefinition, state: GameState, context?: EventContext): void {
        eventQueue.push({ eventDef, context });

        if (isProcessingEvents) {
            return;
        }

        isProcessingEvents = true;
        try {
            while (eventQueue.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { eventDef: currentEventDef, context: currentContext } = eventQueue.shift()!;
                
                if (state.invoker?.logVerbose) {
                    console.log(`[EventProcessor] Processing event: ${currentEventDef.id}`);
                }
                
                console.log("process Event ", currentEventDef.id);
                applyEffects(currentEventDef.effects, state, currentContext);
                state.invoker?.handleEvent(currentEventDef, state, currentContext);
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
     * @param context The event context for context (optional).
     */
    function applyEffects(effectsToApply: Effect[], state: GameState, context?: EventContext): void {
        if (!effectsToApply) return;
        effectsToApply.forEach(effect => executeEffect(effect, state, context));
    }

    /** Executes a single effect */
    function executeEffect(effect: Effect, state: GameState, context?: EventContext): void {
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
                    effects.discoverAllBuildings(state);
                    break;
                case 'discoverAllSkills':
                    effects.discoverAllSkills(state);
                    break;
                case 'discoverAllResources':
                    effects.discoverAllResources(state);
                    break;
                case 'discoverAllAttributes':
                    effects.discoverAllAttributes(state);
                    break;
                case 'discoverAllTabs':
                    effects.discoverAllTabs(state);
                    break;
                case 'discoverAll':
                    effects.discoverAll(state);
                    break;
                case 'startDialog':
                    effects.startDialog();
                    break;
                case 'addCharacterByName':
                    effects.addCharacterByName(state, effect.params as AddCharacterParams);
                    break;
                case 'giveAllSkillsAndSpecsEffect':
                    effects.giveAllSkillsAndSpecsEffect(state, context);
                    break;
                case 'giveSkillsAndSpecs':
                    effects.giveSkillsAndSpecs(state, effect.params, context);
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
                default:
                    console.warn(`Unknown effect key: ${effect.key}`);
            }
        } catch (error) {
            console.error(`Error executing effect ${effect.key} with params:`, effect.params, error);
        }
    }
}