import { BehNode } from './BehNode';
import type { GameState } from '../../GameState';
import { NodeResult } from './BehTreeTypes';

export class CheckDNTypeNode extends BehNode {
    private readonly nodeType: string;

    constructor(name: string, nodeType: string) {
        super(name);
        this.nodeType = nodeType;
    }

    public init(state: GameState): void {
        const dialog = state.dialogs[this.root.blackboard.dialogName];
        const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
        
        const lastNodeId = dialog.nodes[dialog.nodes.length - 1];
        const currentNode = dialogDefinition.nodes[lastNodeId];
        
        const success = currentNode?.type === this.nodeType;
        
        if (this.root.invoker?.logVerbose) {
            console.log(`[BehTree] ${this.getHierarchicalPath()} type check ${success ? 'succeeded' : 'failed'}.`);
        }

        this.parent?.report(success ? NodeResult.SUCCESS : NodeResult.FAILURE, state);
    }
} 