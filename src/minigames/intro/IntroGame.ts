import type { GameState } from '../../logic/GameState';
import type { BaseMinigame, MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';
import type { IEventListener } from '../../logic/core/behTree/BehTreeTypes';
import type { EventDefinition } from '../../logic/lib/definitions/EventDefinition';
import { startDialog, makeDialogChoice } from '../../logic/dialog/Dialog';
import { MessageDNode, ChoiceDNode } from '../../logic/dialog/DialogTreeNodes';
import { reactive } from 'vue';

export const INTRO_TYPE: MinigameType = 'Intro';

export interface IntroDialogData {
  bg?: string; // Background image identifier
  end?: boolean; // If true, stop at this message and proceed no further
  delay?: number; // Additional delay in seconds to add after this node
}

export interface PendingDialogEntry {
  historyItem: DialogHistoryItem;
  nodeId: string;
  nodeType: 'message' | 'choice';
  text?: string;
  speakerId?: string;
  choices?: Array<{ id: string; text: string; }>;
  backgroundImage?: string;
  isEndingEntry?: boolean;
  isSpecialEnding?: boolean;
  delayAfter?: number; // Additional delay in milliseconds to add after this entry
}

export interface DialogHistoryItem {
  nodeId: string;
  type: 'message' | 'choice' | 'player_choice';
  speakerId?: string;
  text?: string;
  choices?: Array<{ id: string; text: string; }>;
  selectedChoiceId?: string;
  selectedChoiceText?: string;
}

export interface IntroState extends MinigameState {
  currentNodeId?: string;
  currentNodeType?: 'message' | 'choice';
  currentText?: string;
  currentSpeakerId?: string;
  currentChoices?: Array<{ id: string; text: string; }>;
  backgroundImage?: string;
  isWaitingForChoice: boolean;
  isEnded: boolean;
  isEnding: boolean;
  isSpecialEnding: boolean; // True when ending with data.end: true - should never quit
  endingStartTime?: number;
  dialogStarted: boolean;
  dialogHistory: DialogHistoryItem[];
  pendingDialogEntries: PendingDialogEntry[];
  lastDialogRevealTime: number;
  dialogRevealDelay: number; // 1.5 seconds in milliseconds (base delay)
  nextRevealDelay: number; // Dynamic delay for next reveal (base + any additional delay)
}

export class IntroGame implements BaseMinigame<IntroState> {
  readonly id: string;
  readonly type = INTRO_TYPE;
  public state: IntroState;
  public hidesMainUI = true; // Hide main UI during intro

  private gameState?: GameState;
  private eventListener?: IEventListener;

  constructor(id: string) {
    this.id = id;
    
    this.state = reactive<IntroState>({
      currentNodeId: undefined,
      currentNodeType: undefined,
      currentText: undefined,
      currentSpeakerId: undefined,
      currentChoices: undefined,
      backgroundImage: undefined,
      isWaitingForChoice: false,
      isEnded: false,
      isEnding: false,
      isSpecialEnding: false,
      endingStartTime: undefined,
      dialogStarted: false,
      dialogHistory: [],
      pendingDialogEntries: [],
      lastDialogRevealTime: 0,
      dialogRevealDelay: 500,
      nextRevealDelay: 500,
    });
  }

  public startIntro(gameState: GameState): void {
    this.gameState = gameState;
    
    // Create event listener for dialog events
    this.eventListener = {
      uid: `IntroGame_Listener_${this.id}_${Date.now()}`,
      handleEvent: (eventDef: EventDefinition, state: GameState) => {
        this.handleEvent(eventDef, state);
      },
      update: (deltaTime: number, state: GameState) => {
        this.updateListener(deltaTime, state);
      }
    };
    
    // Register for events
    gameState.invoker.addEventListener('dialogFinished', this.eventListener);
    gameState.invoker.addUpdateListener(this.eventListener);
    
    // Start the intro dialog
    const dialogStarted = startDialog('introDialog', 'intro', gameState);
    if (dialogStarted) {
      this.state.dialogStarted = true;
    } else {
      console.warn('[IntroGame] Failed to start intro dialog');
      this.state.isEnded = true;
    }
  }

  public makeChoice(choiceId: string): void {
    if (this.gameState && this.state.isWaitingForChoice) {
      // Find the selected choice text to add to history
      const selectedChoice = this.state.currentChoices?.find(choice => choice.id === choiceId);
      if (selectedChoice) {
        // Check if there's a pending delay from the previous entry
        const now = Date.now();
        const timeSinceLastReveal = now - this.state.lastDialogRevealTime;
        
        if (this.state.lastDialogRevealTime === 0 || timeSinceLastReveal >= this.state.nextRevealDelay) {
          // No pending delay or delay has passed - add choice immediately
          this.state.dialogHistory.push({
            nodeId: `player_choice_${choiceId}`,
            type: 'player_choice',
            selectedChoiceId: choiceId,
            selectedChoiceText: selectedChoice.text
          });
          
          // Reset delay for next entry since we consumed the delay
          this.state.nextRevealDelay = this.state.dialogRevealDelay;
          this.state.lastDialogRevealTime = now;
        } else {
          // There's still a pending delay - queue the choice to respect timing
          const playerChoiceEntry: PendingDialogEntry = {
            historyItem: {
              nodeId: `player_choice_${choiceId}`,
              type: 'player_choice',
              selectedChoiceId: choiceId,
              selectedChoiceText: selectedChoice.text
            },
            nodeId: `player_choice_${choiceId}`,
            nodeType: 'choice'
          };
          
          // Add to front of queue so it appears as soon as the delay expires
          this.state.pendingDialogEntries.unshift(playerChoiceEntry);
        }
      }
      
      makeDialogChoice('intro', choiceId, this.gameState);
      this.state.isWaitingForChoice = false;
    }
  }

  public handleEvent(eventDef: EventDefinition, _state: GameState): void {
    switch (eventDef.id) {
      case 'dialogFinished':
        this.handleDialogFinished(eventDef);
        break;
    }
  }

  private handleDialogFinished(eventDef: EventDefinition): void {
    const dialogName = eventDef.params?.dialogName;
    if (dialogName !== 'intro') return;

    // Check if we're ending on a special ending node (data.end: true)
    const dialog = this.gameState?.dialogs['intro'];
    if (dialog && this.gameState) {
      const dialogDefinition = this.gameState.lib.dialogs?.getDialog(dialog.definitionId);
      if (dialogDefinition) {
        const lastNodeId = dialog.nodes[dialog.nodes.length - 1];
        const lastNode = dialogDefinition.nodes[lastNodeId];
        const data = lastNode?.data as IntroDialogData | undefined;
        
        if (data?.end) {
          // This is a special ending - don't exit, just start the ending sequence
          this.state.isEnding = true;
          this.state.isSpecialEnding = true;
          this.state.endingStartTime = Date.now();
          return;
        }
      }
    }

    // Normal ending - exit the minigame
    this.state.isEnded = true;
    if (this.gameState) {
      this.gameState.endMinigame();
    }
  }

  // MinigameBase update method
  update(gameState: GameState, deltaTime: number): void {
    this.updateListener(deltaTime, gameState);
    
    // Handle ending sequence timing
    // Only exit for normal endings, not special endings (data.end: true)
    if (this.state.isEnding && this.state.endingStartTime && !this.state.isEnded && !this.state.isSpecialEnding) {
      const elapsed = Date.now() - this.state.endingStartTime;
      if (elapsed >= 5000) { // 5 seconds have passed
        this.state.isEnded = true;
        gameState.endMinigame();
      }
    }
  }

  // IEventListener update method
  updateListener(_deltaTime: number, state: GameState): void {
    // Update dialog state by checking current dialog progression
    if (this.state.dialogStarted && !this.state.isEnded) {
      this.updateDialogState(state);
      this.processDialogQueue();
    }
  }

  private processDialogQueue(): void {
    // Process pending dialog entries with delay
    if (this.state.pendingDialogEntries.length > 0) {
      const now = Date.now();
      const timeSinceLastReveal = now - this.state.lastDialogRevealTime;
      
      // Check if enough time has passed since last reveal (or if this is the first reveal)
      if (this.state.lastDialogRevealTime === 0 || timeSinceLastReveal >= this.state.nextRevealDelay) {
        const nextEntry = this.state.pendingDialogEntries.shift();
        if (nextEntry) {
          // Add the entry to dialog history
          this.state.dialogHistory.push(nextEntry.historyItem);
          
          // Update current node tracking
          this.state.currentNodeId = nextEntry.nodeId;
          this.state.currentNodeType = nextEntry.nodeType;
          
          if (nextEntry.nodeType === 'message') {
            this.state.currentText = nextEntry.text;
            this.state.currentSpeakerId = nextEntry.speakerId;
            this.state.isWaitingForChoice = false;
            
            // Handle background image
            if (nextEntry.backgroundImage) {
              this.state.backgroundImage = nextEntry.backgroundImage;
            }
            
            // Check if this is an ending entry
            if (nextEntry.isEndingEntry && !this.state.isEnding) {
              this.state.isEnding = true;
              this.state.endingStartTime = now;
            }
          } else if (nextEntry.nodeType === 'choice') {
            this.state.currentChoices = nextEntry.choices;
            this.state.isWaitingForChoice = true;
          }
          
          // Set next reveal delay
          this.state.lastDialogRevealTime = now;
          const additionalDelay = nextEntry.delayAfter || 0;
          this.state.nextRevealDelay = this.state.dialogRevealDelay + additionalDelay;
        }
      }
    }
  }
  
  private updateDialogState(state: GameState): void {
    const dialog = state.dialogs['intro'];
    if (!dialog) return;

    const dialogDefinition = state.lib.dialogs?.getDialog(dialog.definitionId);
    if (!dialogDefinition) return;

    // Check for new nodes in the dialog
    dialog.nodes.forEach((nodeId: string) => {
      if (!this.state.dialogHistory.some(entry => entry.nodeId === nodeId) && 
        !this.state.pendingDialogEntries.some(entry => entry.nodeId === nodeId)) {
        const node = dialogDefinition.nodes[nodeId];
        if (node instanceof MessageDNode || node instanceof ChoiceDNode) {
          this.addPendingDialogEntry(nodeId, node);
        }
      }
    });
  }

  private addPendingDialogEntry(nodeId: string, node: MessageDNode | ChoiceDNode): void {
    const data = node.data as IntroDialogData | undefined;
    
    if (node instanceof MessageDNode) {
      const historyItem: DialogHistoryItem = {
        nodeId: nodeId,
        type: 'message',
        speakerId: node.speakerId,
        text: node.text
      };
      
      const pendingEntry: PendingDialogEntry = {
        historyItem: historyItem,
        nodeId: nodeId,
        nodeType: 'message',
        text: node.text,
        speakerId: node.speakerId,
        backgroundImage: data?.bg,
        isEndingEntry: data?.end,
        delayAfter: (data?.delay || 0) * 1000
      };
      
      this.state.pendingDialogEntries.push(pendingEntry);
    } else if (node instanceof ChoiceDNode) {
      const choices = node.choices.map((choice: any) => ({
        id: choice.id,
        text: choice.text
      }));
      
      const historyItem: DialogHistoryItem = {
        nodeId: nodeId,
        type: 'choice',
        choices: choices
      };
      
      const pendingEntry: PendingDialogEntry = {
        historyItem: historyItem,
        nodeId: nodeId,
        nodeType: 'choice',
        choices: choices,
        delayAfter: (data?.delay || 0) * 1000
      };
      
      this.state.pendingDialogEntries.push(pendingEntry);
    }
  }

  destroy(gameState: GameState): void {
    // Unregister event listeners
    if (this.eventListener) {
      gameState.invoker.removeEventListener(this.eventListener);
      gameState.invoker.removeUpdateListener(this.eventListener);
    }
  }
} 