import { SequencerNode } from "./SequencerNode";
import { NodeResult } from "./BehTreeTypes";
import type { GameState } from "../../GameState";
import type { IBehNode } from "./BehTreeTypes";

export class SelectorNode extends SequencerNode {
    constructor(name: string, children: IBehNode[]) {
        super(name, children);
    }

    public report(result: NodeResult, state: GameState, _child: IBehNode): void {
        if (result === NodeResult.SUCCESS) {
            // A child succeeded, so the selector succeeds.
            this.parent?.report(NodeResult.SUCCESS, state, this);
            return;
        }

        const isSequenceComplete = this.advance(state);
        
        if (isSequenceComplete) {
            this.parent?.report(NodeResult.FAILURE, state, this);
        }
    }
} 