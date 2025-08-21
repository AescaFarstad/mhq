import { DialogNode } from './DialogTreeNodes';
import type { GameState } from '../GameState';
import { EventProcessor } from '../Event';
import type { EventDefinition } from '../lib/definitions/EventDefinition';

export interface DialogDefinition {
    nodes: Record<string, DialogNode>; // Changed from array to dict with ids as keys
    startingNodeId: string;
    treeId: string; // Behavior tree ID for processing this dialog
}

export interface DialogState {
    name: string; // Unique dialog name
    definitionId: string; // Reference to the dialog definition id
    nodes: string[]; // IDs of nodes that have been shown to the player
    choicesMade: string[];
}

export function makeDialogChoice(dialogName: string, choiceId: string, gameState: GameState): void {
    // Find the dialog by name
    const dialog = gameState.dialogs[dialogName];
    
    if (!dialog) {
        console.warn(`Dialog with name ${dialogName} not found`);
        return;
    }

    // Add the choice to the choicesMade array if it's not already there
    if (!dialog.choicesMade.includes(choiceId)) {
        dialog.choicesMade.push(choiceId);
        
        // Trigger event for behavior trees to listen to
        const dialogChoiceEvent: EventDefinition = {
            id: 'dialogChoice',
            params: { 
                dialogName: dialogName,
                choiceId: choiceId 
            },
            effects: []
        };
        
        EventProcessor.processSingleEvent(dialogChoiceEvent, gameState);
    } else {
        console.warn(`Choice ${choiceId} was already made in dialog ${dialogName}`);
    }
}

export function startDialog(definitionId: string, dialogName: string, gameState: GameState): boolean {
    console.log(`[startDialog] Starting dialog '${definitionId}' with name '${dialogName}'`);
    const dialogDefinition = gameState.lib.dialogs.getDialog(definitionId);
    if (!dialogDefinition) {
        console.warn(`[startDialog] Dialog definition '${definitionId}' not found in library`);
        return false;
    }
    console.log(`[startDialog] Found dialog definition:`, dialogDefinition);

    // Check if dialog with this name already exists
    if (gameState.dialogs[dialogName]) {
        console.warn(`[startDialog] Dialog with name '${dialogName}' already exists`);
        return false;
    }

    const dialogState: DialogState = {
        name: dialogName,
        definitionId: definitionId,
        nodes: [],
        choicesMade: []
    };
    gameState.dialogs[dialogName] = dialogState;
    console.log(`[startDialog] Created dialog state:`, dialogState);
    
    // Start the dialog behavior tree
    const treeDef = gameState.lib.behTrees.getTree(dialogDefinition.treeId);
    if (treeDef) {
        const treeInstance = treeDef();
        treeInstance.blackboard.dialogName = dialogName; // Changed from dialogId to dialogName
        gameState.invoker.addTree(treeInstance, gameState);
        return true;
    } else {
        console.warn(`[startDialog] Dialog behavior tree '${dialogDefinition.treeId}' not found`);
        return false;
    }
}