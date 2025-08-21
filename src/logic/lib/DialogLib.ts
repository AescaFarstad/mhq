import type { DialogDefinition } from '../dialog/Dialog';
import { createDialogNode, generateDialogIds, type DialogNode, type DialogNodeDef } from '../dialog/DialogTreeNodes';
import { C } from './C';

// JSON-like dialog definition that will be converted to DialogDefinition
export interface DialogDefRaw {
    nodes: DialogNodeDef[];
    behTreeId?: string; // Optional behavior tree to process this dialog (defaults to 'dialog')
    verificationKey?: 'full' | 'skipAccessibility';
}

type DialogVerificationFunction = (dialogDefinition: DialogDefinition, dialogId: string) => string[];

/**
 * DialogLib manages all dialog definitions and provides access methods.
 */
export class DialogLib {
    private dialogs: Map<string, DialogDefinition> = new Map();
    private verificationFunctions: Record<string, DialogVerificationFunction>;

    constructor() {
        this.verificationFunctions = {
            'full': this.fullVerification.bind(this),
            'skipAccessibility': this.skipAccessibilityVerification.bind(this)
        };
    }

    /**
     * Load dialog definitions from raw dialog data.
     * @param rawDialogData Object containing raw dialog definitions
     */
    public loadRawDialogs(rawDialogData: Record<string, DialogDefRaw>): void {
        for (const [dialogId, rawDef] of Object.entries(rawDialogData)) {
            // Add orderIndex to each node definition
            rawDef.nodes.forEach((nodeDef, index) => {
                nodeDef.orderIndex = index;
            });

            // Convert JSON-like nodes to DialogNode instances
            const dialogNodesArray = rawDef.nodes.map(nodeDef => createDialogNode(nodeDef));
            
            // Auto-generate IDs
            generateDialogIds(dialogId, dialogNodesArray);
            
            // Convert nodes array to dict with ids as keys
            const nodesDict: Record<string, DialogNode> = {};
            dialogNodesArray.forEach(node => {
                nodesDict[node.id] = node;
            });
            
            // Create the final DialogDefinition with specified or default behavior tree
            const dialogDefinition: DialogDefinition = {
                nodes: nodesDict,
                startingNodeId: dialogNodesArray.length > 0 ? dialogNodesArray[0].id : '',
                treeId: rawDef.behTreeId || C.DEFAULT_DIALOG_TREE // Use specified behavior tree or default
            };
            
            // Verify dialog integrity
            const verificationKey = rawDef.verificationKey || 'full';
            const verificationFn = this.verificationFunctions[verificationKey];

            if (verificationFn) {
                const errors = verificationFn(dialogDefinition, dialogId);
                if (errors.length > 0) {
                    console.error(`DialogLib: Dialog '${dialogId}' has integrity issues:`);
                    errors.forEach(error => console.error(`  - ${error}`));
                    // Still add the dialog to allow for partial functionality, but warn about issues
                }
            } else {
                console.warn(`[DialogLib] Unknown verification key '${verificationKey}' for dialog '${dialogId}'. Skipping verification.`);
            }
            
            this.dialogs.set(dialogId, dialogDefinition);
        }
        const totalErrors = Array.from(this.dialogs.entries())
            .map(([dialogId, dialogDef]) => this.fullVerification(dialogDef, dialogId))
            .reduce((total, errors) => total + errors.length, 0);
            
        if (totalErrors != 0) {
            console.log(`DialogLib: ${this.dialogs.size} dialogs. (${totalErrors} PROBLEMS found)`);
        }
    }

    /**
     * Load dialog definitions from a data object (for backwards compatibility).
     * @param dialogData Object containing dialog definitions
     */
    public loadDialogs(dialogData: Record<string, DialogDefinition>): void {
        for (const [dialogId, dialogDef] of Object.entries(dialogData)) {
            this.dialogs.set(dialogId, dialogDef);
        }
        console.log(`DialogLib: Loaded ${this.dialogs.size} dialog definitions`);
    }

    /**
     * Get a dialog definition by ID.
     * @param dialogId The ID of the dialog to retrieve
     * @returns The dialog definition or undefined if not found
     */
    public getDialog(dialogId: string): DialogDefinition | undefined {
        return this.dialogs.get(dialogId);
    }

    /**
     * Verify dialog integrity by checking for orphaned nodes and invalid references.
     * @param dialogDefinition The dialog definition to verify
     * @param dialogId The ID of the dialog being verified (for error reporting)
     * @returns Array of error messages, empty if no issues found
     */
    private fullVerification(dialogDefinition: DialogDefinition, dialogId: string): string[] {
        const errors: string[] = [];
        const nodeIds = new Set(Object.keys(dialogDefinition.nodes));
        const reachableNodes = new Set<string>();
        
        // Check if starting node exists
        if (!nodeIds.has(dialogDefinition.startingNodeId)) {
            errors.push(`Dialog '${dialogId}': Starting node '${dialogDefinition.startingNodeId}' does not exist`);
            return errors; // Can't continue verification without valid starting node
        }
        
        // Traverse from starting node to find all reachable nodes
        this.traverseNodes(dialogDefinition.startingNodeId, dialogDefinition, nodeIds, reachableNodes, errors, dialogId);
        
        // Find orphaned nodes (exist but not reachable from starting node)
        const orphanedNodes = Array.from(nodeIds).filter(nodeId => !reachableNodes.has(nodeId));
        if (orphanedNodes.length > 0) {
            errors.push(`Dialog '${dialogId}': Orphaned nodes found (unreachable from starting node): ${orphanedNodes.join(', ')}`);
        }
        
        return errors;
    }

    /**
     * Verify dialog integrity without checking for orphaned (unreachable) nodes.
     */
    private skipAccessibilityVerification(dialogDefinition: DialogDefinition, dialogId: string): string[] {
        const errors: string[] = [];
        const nodeIds = new Set(Object.keys(dialogDefinition.nodes));
        const reachableNodes = new Set<string>();

        // Check if starting node exists
        if (!nodeIds.has(dialogDefinition.startingNodeId)) {
            errors.push(`Dialog '${dialogId}': Starting node '${dialogDefinition.startingNodeId}' does not exist`);
            return errors; // Can't continue verification without a valid starting node
        }

        // Traverse from the starting node to find all reachable nodes and check for invalid references
        this.traverseNodes(dialogDefinition.startingNodeId, dialogDefinition, nodeIds, reachableNodes, errors, dialogId);

        return errors;
    }

    private traverseNodes(
        startingNode: string, 
        dialogDefinition: DialogDefinition, 
        nodeIds: Set<string>, 
        reachableNodes: Set<string>, 
        errors: string[], 
        dialogId: string
    ) {
        const toVisit: string[] = [startingNode];
        const visited = new Set<string>();

        while (toVisit.length > 0) {
            const currentNodeId = toVisit.pop()!;
            
            if (visited.has(currentNodeId)) {
                continue; // Already processed this node
            }
            
            visited.add(currentNodeId);
            reachableNodes.add(currentNodeId);
            
            const currentNode = dialogDefinition.nodes[currentNodeId];
            if (!currentNode) {
                errors.push(`Dialog '${dialogId}': Referenced node '${currentNodeId}' does not exist`);
                continue;
            }
            
            // Check next field if it exists
            if (currentNode.next) {
                if (!nodeIds.has(currentNode.next)) {
                    errors.push(`Dialog '${dialogId}': Node '${currentNodeId}' references non-existent next node '${currentNode.next}'`);
                } else {
                    toVisit.push(currentNode.next);
                }
            }
            
            // Check choice options if this is a choice node
            if (currentNode.type === 'choice') {
                const choiceNode = currentNode as any; // Cast to access choices
                if (choiceNode.choices) {
                    for (const choice of choiceNode.choices) {
                        if (choice.next) {
                            if (!nodeIds.has(choice.next)) {
                                errors.push(`Dialog '${dialogId}': Choice '${choice.id || choice.text}' in node '${currentNodeId}' references non-existent node '${choice.next}'`);
                            } else {
                                toVisit.push(choice.next);
                            }
                        }
                    }
                }
            }

            // Check skill check options
            if (currentNode.type === 'skill_check') {
                const skillCheckNode = currentNode as any;
                if (skillCheckNode.successNext) {
                    if (!nodeIds.has(skillCheckNode.successNext)) {
                        errors.push(`Dialog '${dialogId}': Node '${currentNodeId}' references non-existent successNext node '${skillCheckNode.successNext}'`);
                    } else {
                        toVisit.push(skillCheckNode.successNext);
                    }
                }
                if (skillCheckNode.failureNext) {
                    if (!nodeIds.has(skillCheckNode.failureNext)) {
                        errors.push(`Dialog '${dialogId}': Node '${currentNodeId}' references non-existent failureNext node '${skillCheckNode.failureNext}'`);
                    } else {
                        toVisit.push(skillCheckNode.failureNext);
                    }
                }
            }
        }
    }
} 