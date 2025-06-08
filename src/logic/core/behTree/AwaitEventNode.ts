import type { GameState } from "../../GameState";
import type { EventDefinition, EventContext } from "../../lib/definitions/EventDefinition";
import { BehNode } from "./BehNode";
import type { EventLambda } from "./BehTreeTypes";
import { NodeResult } from "./BehTreeTypes";

type EventCondition = (eventDef: EventDefinition, eventContext?: EventContext) => boolean;

export class AwaitEventNode extends BehNode {
    private readonly eventId: string;
    private readonly lambda: EventLambda;
    private readonly condition?: EventCondition;

    constructor(name: string, eventId: string, lambda: EventLambda, condition?: EventCondition) {
        super(name);
        this.eventId = eventId;
        this.lambda = lambda;
        this.condition = condition;
    }

    public init(state: GameState): void {
        if (this.root.invoker) {
            if (this.root.invoker.logVerbose) {
                console.log(`[BehTree] ${this.getHierarchicalPath()} started, awaiting event '${this.eventId}'.`);
            }
            this.root.invoker.addEventListener(this.eventId, this);
        } else {
            console.error(`[BehTree] ${this.getHierarchicalPath()} cannot listen for event without an invoker.`);
            this.parent?.report(NodeResult.FAILURE, state);
        }
    }
    
    public exit(): void {
        this.root.invoker?.removeEventListener(this);
    }

    public handleEvent(eventDef: EventDefinition, state: GameState, eventContext?: EventContext): void {
        if (eventDef.id === this.eventId && (!this.condition || this.condition(eventDef, eventContext))) {
            if (this.root.invoker?.logVerbose) {
                console.log(`[BehTree] ${this.getHierarchicalPath()} caught event '${this.eventId}' and condition met.`);
            }
            try {
                this.lambda(this, eventDef, state, eventContext);
                this.parent?.report(NodeResult.SUCCESS, state);
            } catch (error) {
                console.error(`[BehTree] Error in ${this.getHierarchicalPath()} event handler:`, error);
                this.parent?.report(NodeResult.FAILURE, state);
            }
        }
    }
} 