import { BehNode } from "./BehNode";
import { NodeResult } from "./BehTreeTypes";
export class SequencerNode extends BehNode {
    children;
    currentIndex = -1;
    constructor(name, children) {
        super(name);
        this.children = children;
    }
    wireTree(root, parent) {
        this.root = root;
        this.parent = parent;
        this.uid = this.getHierarchicalPath();
        for (const child of this.children) {
            if (child instanceof SequencerNode) {
                child.wireTree(root, this);
            }
            else {
                child.root = root;
                child.parent = this;
                child.uid = child.getHierarchicalPath();
            }
        }
    }
    init(state) {
        if (this.root.invoker?.logVerbose) {
            console.log(`[BehTree] ${this.getHierarchicalPath()} started.`);
        }
        this.currentIndex = -1;
        this.advance(state);
    }
    exit() {
        if (this.currentIndex >= 0 && this.currentIndex < this.children.length) {
            this.children[this.currentIndex].exit();
        }
    }
    report(result, state) {
        if (result === NodeResult.SUCCESS) {
            if (this.advance(state)) {
                this.parent?.report(NodeResult.SUCCESS, state);
            }
        }
        else {
            this.parent?.report(NodeResult.FAILURE, state);
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
