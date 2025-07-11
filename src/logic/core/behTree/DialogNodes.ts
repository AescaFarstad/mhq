import { BehNode } from './BehNode';
import type { GameState } from '../../GameState';
import { NodeResult } from './BehTreeTypes';
import { C } from '../../lib/C';
import { Character } from '../../Character';
import { SkillCheckNode } from '../../DialogTreeNodes';
import { EventProcessor } from '../../Event';

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
        
        if (C.BEH_LOG_VERBOSE) {
            console.log(`[BehTree] ${this.getHierarchicalPath()} type check ${success ? 'succeeded' : 'failed'}.`);
        }

        this.parent?.report(success ? NodeResult.SUCCESS : NodeResult.FAILURE, state, this);
    }
}

export class ProcessSkillCheckDNNode extends BehNode {
    constructor(name: string) {
        super(name);
    }

    public init(state: GameState): void {
        const dialog = state.dialogs[this.root.blackboard.dialogName];
        const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
        
        const lastNodeId = dialog.nodes[dialog.nodes.length - 1];
        const currentNode = dialogDefinition.nodes[lastNodeId] as SkillCheckNode;
        
        if (!currentNode || currentNode.type !== 'skill_check') {
            console.warn('[ProcessSkillCheckDNNode] Current node is not a skill check node');
            this.parent?.report(NodeResult.FAILURE, state, this);
            return;
        }

        const protagonist = Character.getProtagonistCharacter(state);
        if (!protagonist) {
            console.warn('[ProcessSkillCheckDNNode] No protagonist character found');
            this.parent?.report(NodeResult.FAILURE, state, this);
            return;
        }

        let hasSuccess = false;
        const threshold = currentNode.successThreshold || 1;
        
        for (const skillId of currentNode.skillIds) {
            const proficiency = Character.getProficiency(protagonist, skillId, state);
            if (C.BEH_LOG_VERBOSE) {
                console.log(`[ProcessSkillCheckDNNode] Skill ${skillId}: proficiency=${proficiency}, threshold=${threshold}`);
            }
            if (proficiency >= threshold) {
                hasSuccess = true;
                break;
            }
        }

        // Process effects if present
        if (currentNode.effects) {
            for (const effect of currentNode.effects) {
                EventProcessor.processSingleEvent({
                    id: 'dialogNodeEffect',
                    params: {},
                    effects: [effect]
                }, state);
            }
        }

        // Determine next node based on skill check result
        const nextNodeId = hasSuccess ? currentNode.successNext : currentNode.failureNext;
        
        if (C.BEH_LOG_VERBOSE) {
            console.log(`[ProcessSkillCheckDNNode] Skill check ${hasSuccess ? 'succeeded' : 'failed'}, going to node: ${nextNodeId}`);
        }

        if (nextNodeId) {
            dialog.nodes.push(nextNodeId);
            this.parent?.report(NodeResult.SUCCESS, state, this);
        } else {
            this.parent?.report(NodeResult.FAILURE, state, this);
        }
    }
}

export class ProcessMessageDNNode extends BehNode {
    constructor(name: string) {
        super(name);
    }

    public init(state: GameState): void {
        const dialog = state.dialogs[this.root.blackboard.dialogName];
        const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
        
        const lastNodeId = dialog.nodes[dialog.nodes.length - 1];
        const currentNode = dialogDefinition.nodes[lastNodeId];
        
        // Process effects if present
        if ((currentNode as any).effects) {
            for (const effect of (currentNode as any).effects) {
                EventProcessor.processSingleEvent({
                    id: 'dialogNodeEffect',
                    params: {},
                    effects: [effect]
                }, state);
            }
        }
        
        if (currentNode?.next) {
            dialog.nodes.push(currentNode.next);
            this.parent?.report(NodeResult.SUCCESS, state, this);
        } else {
            this.parent?.report(NodeResult.FAILURE, state, this);
        }
    }
}

export class ProcessChoiceDNNode extends BehNode {
    constructor(name: string) {
        super(name);
    }

    public init(state: GameState): void {
        const dialog = state.dialogs[this.root.blackboard.dialogName];
        const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
        
        const lastChoiceId = dialog.choicesMade[dialog.choicesMade.length - 1];
        const lastNodeId = dialog.nodes[dialog.nodes.length - 1];
        const choiceNode = dialogDefinition.nodes[lastNodeId] as any;
        const choice = choiceNode.choices.find((c: any) => c.id === lastChoiceId);
        
        if (choiceNode.effects) {
            for (const effect of choiceNode.effects) {
                EventProcessor.processSingleEvent({
                    id: 'dialogNodeEffect',
                    params: {},
                    effects: [effect]
                }, state);
            }
        }
        
        if (choice?.next) {
            dialog.nodes.push(choice.next);
            this.parent?.report(NodeResult.SUCCESS, state, this);
        } else {
            this.parent?.report(NodeResult.FAILURE, state, this);
        }
    }
}