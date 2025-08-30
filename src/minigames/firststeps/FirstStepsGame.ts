import type { GameState } from '../../logic/GameState';
import type { BaseMinigame, MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';
import { reactive } from 'vue'; // Or shallowReactive if preferred for root
import { startDialog } from '../../logic/dialog/Dialog';

export const FIRSTSTEPS_TYPE: MinigameType = 'FirstSteps';

export interface FirstStepsState extends MinigameState {
  dialogStarted: boolean;
  dialogState?: {
    nodes: string[];
    choicesMade: string[];
  }
}

export class FirstStepsGame implements BaseMinigame<FirstStepsState> {
  readonly id: string;
  readonly type = FIRSTSTEPS_TYPE;
  public state: FirstStepsState;
  public hidesMainUI = false;

  constructor(id: string) {
    this.id = id;
    
    // Initialize your minigame's state here
    // All state properties that need to be reactive for the UI
    // should be within this reactive object.
    this.state = reactive<FirstStepsState>({
      dialogStarted: false,
    });
  }

  /**
   * Called every game tick while the minigame is active.
   * @param gameState The global game state.
   * @param _deltaTime The time elapsed since the last update, in seconds.
   */
  update(gameState: GameState, _deltaTime: number): void {
    if (!this.state.dialogStarted) {
      this.start(gameState);
    }
  }

  /**
   * Called when the minigame is being exited or shut down.
   * Use this to clean up any resources, listeners, or ongoing processes.
   * @param _gameState The global game state.
   */
  destroy(_gameState: GameState): void {
    // TODO: Add any cleanup logic specific to your minigame
    // This could include stopping timers, removing event listeners, etc.
    // console.log('FirstStepsGame destroyed');
  }

  public start(gameState: GameState): void {
    startDialog('firstStepsDialog', this.id, gameState);
    this.state.dialogStarted = true;
  }

  // TODO: Add your custom minigame methods here
  // For example:
  // public increaseScore(points: number): void {
  //  if (this.state.isActive) {
  //    this.state.score += points;
  //  }
  // }
  //
  // public completeLevel(): void {
  //   this.state.currentLevel = 'nextLevel'; // Or some other logic
  // }
} 