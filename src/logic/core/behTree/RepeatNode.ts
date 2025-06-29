import { SequencerNode } from "./SequencerNode";
import { NodeResult } from "./BehTreeTypes";
import type { GameState } from "../../GameState";
import type { IBehNode } from "./BehTreeTypes";

export class RepeatNode extends SequencerNode {
    constructor(name: string, children: IBehNode[]) {
        super(name, children);
    }

    public report(result: NodeResult, state: GameState): void {
        if (result === NodeResult.FAILURE) {
            this.parent?.report(NodeResult.FAILURE, state);
            return;
        }

        const isSequenceComplete = this.advance(state);
        
        if (isSequenceComplete) {
            // The sequence completed successfully, so we loop.
            this.currentIndex = -1;
            this.advance(state);
        }
    }
} 