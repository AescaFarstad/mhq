import type { TreeDefinitionFn, TreeDefinitionRegistry } from '../core/behTree/BehTreeTypes';
import { behTreeDefinitions } from '../data/behTrees';

export class BehTreeLib {
    private trees: TreeDefinitionRegistry;

    constructor() {
        this.trees = behTreeDefinitions;
        if (this.trees) {
            console.log(`BehTreeLib loaded ${Object.keys(this.trees).length} tree definitions.`);
        } else {
            console.error("BehTreeLib: Tree definitions not found.");
            this.trees = {};
        }
    }

    public getTree(name: string): TreeDefinitionFn | undefined {
        return this.trees[name];
    }
} 