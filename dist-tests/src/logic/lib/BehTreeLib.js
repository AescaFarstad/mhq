import { behTreeDefinitions } from '../data/behTrees';
export class BehTreeLib {
    trees;
    constructor() {
        this.trees = behTreeDefinitions;
        if (this.trees) {
        }
        else {
            console.error("BehTreeLib: Tree definitions not found.");
            this.trees = {};
        }
    }
    getTree(name) {
        return this.trees[name];
    }
}
