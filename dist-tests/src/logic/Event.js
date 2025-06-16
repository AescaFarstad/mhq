import * as effects from './effects';
import { discoverAll, discoverAllBuildings, discoverAllSkills, discoverAllResources, discoverAllAttributes, discoverAllTabs } from './Discovery';
// Module-level queue for pending events
const eventQueue = [];
let isProcessingEvents = false;
/**
 * Processes game events based on their conditions and applies their effects.
 */
export var EventProcessor;
(function (EventProcessor) {
    // Lib is accessed via state.lib
    /**
     * Queues a single event for processing.
     * If not already processing, starts processing the queue.
     *
     * @param eventDef The event definition to process.
     * @param state The current game state (contains lib).
     * @param context The event context for context (optional).
     */
    function processSingleEvent(eventDef, state, context) {
        eventQueue.push({ eventDef, context });
        if (isProcessingEvents) {
            return;
        }
        isProcessingEvents = true;
        try {
            while (eventQueue.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { eventDef: currentEventDef, context: currentContext } = eventQueue.shift();
                if (state.invoker?.logVerbose) {
                    console.log(`[EventProcessor] Processing event: ${currentEventDef.id}`);
                }
                console.log("process Event ", currentEventDef.id);
                applyEffects(currentEventDef.effects, state, currentContext);
                state.invoker?.handleEvent(currentEventDef, state, currentContext);
            }
        }
        finally {
            isProcessingEvents = false;
        }
    }
    EventProcessor.processSingleEvent = processSingleEvent;
    /**
     * Applies all effects of a triggered event.
     *
     * @param effects Array of effects to apply.
     * @param state The current game state.
     * @param context The event context for context (optional).
     */
    function applyEffects(effectsToApply, state, context) {
        if (!effectsToApply)
            return;
        effectsToApply.forEach(effect => executeEffect(effect, state, context));
    }
    /** Executes a single effect */
    function executeEffect(effect, state, context) {
        try {
            switch (effect.key) {
                case 'giveResource':
                    effects.giveResource(state, effect.params);
                    break;
                case 'giveMaxResource':
                    effects.giveMaxResource(state, effect.params);
                    break;
                case 'addResourceIncome':
                    effects.addResourceIncome(state, effect.params);
                    break;
                case 'discover':
                    effects.discover(state, effect.params);
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
                    effects.addCharacterByName(state, effect.params);
                    break;
                case 'giveAllSkillsAndSpecsEffect':
                    effects.giveAllSkillsAndSpecsEffect(state, context);
                    break;
                case 'giveSkillsAndSpecs':
                    effects.giveSkillsAndSpecs(state, effect.params, context);
                    break;
                case 'construct':
                    effects.construct(state, effect.params);
                    break;
                case 'startMinigame':
                    effects.startMinigame(state, effect.params);
                    break;
                case 'startBehTree':
                    effects.startBehTree(state, effect.params);
                    break;
                case 'ApplyIngressResults':
                    effects.applyIngressResults(state, effect.params);
                    break;
                case 'applyWelcomeResults':
                    effects.applyWelcomeResults(state, effect.params);
                    break;
                case 'givePoints':
                    effects.givePoints(state, effect.params);
                    break;
                default:
                    console.warn(`Unknown effect key: ${effect.key}`);
            }
        }
        catch (error) {
            console.error(`Error executing effect ${effect.key} with params:`, effect.params, error);
        }
    }
})(EventProcessor || (EventProcessor = {}));
