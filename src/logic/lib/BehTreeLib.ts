import type { TreeDefinitionFn, TreeDefinitionRegistry } from '../core/behTree/BehTreeTypes';
import { behTreeDefinitions } from '../data/behTrees';
import { storyDialogDefinitions } from '../data/storyDialogTrees';

export class BehTreeLib {
    private trees: TreeDefinitionRegistry;

    constructor() {
        // Merge both tree definition registries
        this.trees = {
            ...behTreeDefinitions,
            ...storyDialogDefinitions
        };
        
        if (this.trees) {
        } else {
            console.error("BehTreeLib: Tree definitions not found.");
            this.trees = {};
        }
    }

    public getTree(name: string): TreeDefinitionFn | undefined {
        return this.trees[name];
    }
} 