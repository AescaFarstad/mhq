import type { GameState } from "../../GameState";
import { BehNode } from "./BehNode";
import type { IBehNode, IContainerNode, IBehTree } from "./BehTreeTypes";
import { NodeResult } from "./BehTreeTypes";

export class SequencerNode extends BehNode implements IContainerNode {
    public readonly children: IBehNode[];
    protected currentIndex: number = -1;

    constructor(name: string, children: IBehNode[]) {
        super(name);
        this.children = children;
    }

    public wireTree(root: IBehTree, parent: IContainerNode | undefined): void {
        this.root = root;
        this.parent = parent;
        this.uid = this.getHierarchicalPath();
        
        for (const child of this.children) {
            if (child instanceof SequencerNode) {
                child.wireTree(root, this);
            } else {
                child.root = root;
                child.parent = this;
                child.uid = child.getHierarchicalPath();
            }
        }
    }

    public init(state: GameState): void {
        if (this.root.invoker?.logVerbose) {
            console.log(`[BehTree] ${this.getHierarchicalPath()} started.`);
        }
        this.currentIndex = -1;
        this.advance(state);
    }

    public exit(): void {
        if (this.currentIndex >= 0 && this.currentIndex < this.children.length) {
            this.children[this.currentIndex].exit();
        }
    }

    public report(result: NodeResult, state: GameState): void {
        if (result === NodeResult.SUCCESS) {
            if (this.advance(state)) {
                this.parent?.report(NodeResult.SUCCESS, state);
            }
        } else {
            this.parent?.report(NodeResult.FAILURE, state);
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