import { NodeResult } from "./BehTreeTypes";
import { SequencerNode } from "./SequencerNode";
export class BehTree extends SequencerNode {
    invoker;
    blackboard = {};
    constructor(name, children) {
        super(name, children);
        this.wireTree(this, undefined);
    }
    report(result, state) {
        if (result === NodeResult.FAILURE) {
            if (this.invoker?.logVerbose) {
                console.log(`[BehTree] ${this.getHierarchicalPath()} (ROOT) reported ${result}.`);
            }
            this.exit();
            this.invoker?.reportTreeComplete(this);
            return;
        }
        // On success, advance the sequence. If the sequence is complete, finalize the tree.
        if (this.advance(state)) {
            if (this.invoker?.logVerbose) {
                console.log(`[BehTree] ${this.getHierarchicalPath()} (ROOT) reported SUCCESS.`);
            }
            this.exit();
            this.invoker?.reportTreeComplete(this);
        }
    }
    advance(state) {
        if (this.currentIndex > -1) {
            this.children[this.currentIndex].exit();
        }
        this.currentIndex++;
        if (this.currentIndex < this.children.length) {
            const child = this.children[this.currentIndex];
            child.init(state);
            return false;
        }
        else {
            return true;
        }
    }
}
