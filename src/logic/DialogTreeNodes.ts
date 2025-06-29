// Dialog node type constants
export const MESSAGE = 'message' as const;
export const CHOICE = 'choice' as const;

export type DialogNodeType = typeof MESSAGE | typeof CHOICE;

export abstract class DialogNode {
    public id: string;
    public type: string;
    public next?: string;

    constructor(id: string, type: string, next?: string) {
        this.id = id;
        this.type = type;
        this.next = next;
    }
}

export interface MessageDNodeParams {
    id?: string;
    text: string;
    speakerId: string;
    next?: string;
}

export class MessageDNode extends DialogNode {
    public text: string;
    public speakerId: string;

    constructor(params: MessageDNodeParams) {
        super(params.id || '', 'message', params.next);
        this.text = params.text;
        this.speakerId = params.speakerId;
    }
}

export interface DialogChoiceParams {
    id?: string;
    text: string;
    next?: string;
}

export class DialogChoice {
    public id: string;
    public text: string;
    public next?: string;

    constructor(params: DialogChoiceParams) {
        this.id = params.id || '';
        this.text = params.text;
        this.next = params.next;
    }
}

export interface ChoiceDNodeParams {
    id?: string;
    choices: DialogChoice[];
    next?: string;
}

export class ChoiceDNode extends DialogNode {
    public choices: DialogChoice[];

    constructor(params: ChoiceDNodeParams) {
        super(params.id || '', 'choice', params.next);
        this.choices = params.choices;
    }
}

// JSON-like dialog node definitions
export interface MessageNodeDef {
    type: typeof MESSAGE;
    id?: string;
    text: string;
    speakerId: string;
    next?: string;
}

export interface ChoiceOptionDef {
    id?: string;
    text: string;
    next?: string;
}

export interface ChoiceNodeDef {
    type: typeof CHOICE;
    id?: string;
    choices: ChoiceOptionDef[];
    next?: string;
}

export type DialogNodeDef = MessageNodeDef | ChoiceNodeDef;

// Factory function to create DialogNode instances from JSON-like definitions
export function createDialogNode(nodeDef: DialogNodeDef): DialogNode {
    switch (nodeDef.type) {
        case MESSAGE:
            return new MessageDNode({
                id: nodeDef.id,
                text: nodeDef.text,
                speakerId: nodeDef.speakerId,
                next: nodeDef.next
            });
        case CHOICE:
            return new ChoiceDNode({
                id: nodeDef.id,
                next: nodeDef.next,
                choices: nodeDef.choices.map(choiceDef => new DialogChoice({
                    id: choiceDef.id,
                    text: choiceDef.text,
                    next: choiceDef.next
                }))
            });
        default:
            throw new Error(`Unknown dialog node type: ${(nodeDef as any).type}`);
    }
}

// Helper function to auto-generate IDs and next fields for dialog nodes
export function generateDialogIds(dialogName: string, nodes: DialogNode[]): void {
    let messageIndex = 0;
    let choiceIndex = 0;
    
    // First pass: Generate IDs for nodes that don't have them
    nodes.forEach(node => {
        let currentChoiceIndex = choiceIndex;
        
        if (!node.id) {
            if (node.type === 'message') {
                node.id = `${dialogName}_message_${messageIndex}`;
            } else if (node.type === 'choice') {
                node.id = `${dialogName}_choice_${choiceIndex}`;
            }
        }
        
        // Update counters
        if (node.type === 'message') {
            messageIndex++;
        } else if (node.type === 'choice') {
            choiceIndex++;
        }
        
        // Generate IDs for choice options that don't have them
        if (node instanceof ChoiceDNode) {
            let subChoiceIndex = 0;
            node.choices.forEach(choice => {
                if (!choice.id) {
                    choice.id = `${dialogName}_choice_${currentChoiceIndex}_option_${subChoiceIndex}`;
                }
                subChoiceIndex++;
            });
        }
    });
    
    // Second pass: Auto-generate next fields for nodes that don't have them
    nodes.forEach((node, index) => {
        // For nodes without explicit next field, point to next node in sequence
        if (!node.next && index < nodes.length - 1) {
            const nextNode = nodes[index + 1];
            if (nextNode.id) {
                node.next = nextNode.id;
            }
        }
        
        // For choice nodes, handle choice options that don't have next specified
        if (node instanceof ChoiceDNode && index < nodes.length - 1) {
            const nextNode = nodes[index + 1];
            node.choices.forEach(choice => {
                if (!choice.next && nextNode.id) {
                    choice.next = nextNode.id;
                }
            });
        }
    });
} 