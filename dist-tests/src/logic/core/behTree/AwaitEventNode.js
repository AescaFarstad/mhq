import { BehNode } from "./BehNode";
import { NodeResult } from "./BehTreeTypes";
export class AwaitEventNode extends BehNode {
    eventId;
    predicate;
    constructor(name, eventId, predicate) {
        super(name);
        this.eventId = eventId;
        this.predicate = predicate;
    }
    init(state) {
        if (this.root.invoker) {
            if (this.root.invoker.logVerbose) {
                console.log(`[BehTree] ${this.getHierarchicalPath()} started, awaiting event '${this.eventId}'.`);
            }
            this.root.invoker.addEventListener(this.eventId, this);
        }
        else {
            console.error(`[BehTree] ${this.getHierarchicalPath()} cannot listen for event without an invoker.`);
            this.parent?.report(NodeResult.FAILURE, state);
        }
    }
    exit() {
        this.root.invoker?.removeEventListener(this);
    }
    handleEvent(eventDef, state, eventContext) {
        if (eventDef.id === this.eventId && (!this.predicate || this.predicate(eventDef, eventContext))) {
            if (this.root.invoker?.logVerbose) {
                console.log(`[BehTree] ${this.getHierarchicalPath()} caught event '${this.eventId}' and predicate passed.`);
            }
            this.parent?.report(NodeResult.SUCCESS, state);
        }
    }
}
