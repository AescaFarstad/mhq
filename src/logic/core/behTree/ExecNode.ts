import type { GameState } from "../../GameState";
import { BehNode } from "./BehNode";
import type { ExecLambda } from "./BehTreeTypes";
import { NodeResult } from "./BehTreeTypes";

export class ExecNode extends BehNode {
    private readonly lambda: ExecLambda;

    constructor(name: string, lambda: ExecLambda) {
        super(name);
        this.lambda = lambda;
    }

    public init(state: GameState): void {
        if (this.root.invoker?.logVerbose) {
            console.log(`[BehTree] ${this.getHierarchicalPath()} started.`);
        }
        try {
            this.lambda(this, state);
            this.parent?.report(NodeResult.SUCCESS, state);
        } catch (error) {
            console.error(`[BehTree] Error in ${this.getHierarchicalPath()}:`, error);
            this.parent?.report(NodeResult.FAILURE, state);
        }
    }
} 