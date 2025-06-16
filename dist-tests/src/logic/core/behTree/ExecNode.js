import { BehNode } from "./BehNode";
import { NodeResult } from "./BehTreeTypes";
export class ExecNode extends BehNode {
    lambda;
    constructor(name, lambda) {
        super(name);
        this.lambda = lambda;
    }
    init(state) {
        if (this.root.invoker?.logVerbose) {
            console.log(`[BehTree] ${this.getHierarchicalPath()} started.`);
        }
        try {
            this.lambda(this, state);
            this.parent?.report(NodeResult.SUCCESS, state);
        }
        catch (error) {
            console.error(`[BehTree] Error in ${this.getHierarchicalPath()}:`, error);
            this.parent?.report(NodeResult.FAILURE, state);
        }
    }
}
