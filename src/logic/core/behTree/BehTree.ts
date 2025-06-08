import { IBehNode, IBehTree, IInvoker, NodeResult } from "./BehTreeTypes";
import { SequencerNode } from "./SequencerNode";
import type { GameState } from "../../GameState";

export class BehTree extends SequencerNode implements IBehTree {
    public invoker?: IInvoker;
    public blackboard: Record<string, any> = {};

    constructor(name: string, children: IBehNode[]) {
        super(name, children);
        this.wireTree(this, undefined);
    }

    public report(result: NodeResult, state: GameState): void {
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

    protected advance(state: GameState): boolean {
        if (this.currentIndex > -1) {
            this.children[this.currentIndex].exit();
        }
        
        this.currentIndex++;
        if (this.currentIndex < this.children.length) {
            const child = this.children[this.currentIndex];
            child.init(state);
            return false;
        } else {
            return true;
        }
    }
} 