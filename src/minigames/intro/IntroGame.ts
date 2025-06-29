import type { GameState } from '../../logic/GameState';
import type { BaseMinigame, MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';
import { shallowReactive } from 'vue';

export const INTRO_TYPE: MinigameType = 'Intro';

export interface IntroState extends MinigameState {
    // Add intro-specific state properties here
    introProgress: number;
    currentStep: number;
    isCompleted: boolean;
}

export class IntroGame implements BaseMinigame<IntroState> {
    readonly id: string;
    readonly type = INTRO_TYPE;
    public state: IntroState;
    public hidesMainUI = false; // Set to true if you want to hide the main UI

    constructor(id: string) {
        this.id = id;
        
        this.state = shallowReactive<IntroState>({
            introProgress: 0,
            currentStep: 0,
            isCompleted: false,
        });
    }

    public startIntro(): void {
        this.state.introProgress = 0;
        this.state.currentStep = 0;
        this.state.isCompleted = false;
    }

    public nextStep(): void {
        if (!this.state.isCompleted) {
            this.state.currentStep++;
            // Add logic for step progression
        }
    }

    public completeIntro(gameState: GameState): void {
        this.state.isCompleted = true;
        // Add any completion effects here
        gameState.exitMinigame();
    }

    update(_gameState: GameState, _deltaTime: number): void {
        // Add game logic update here
        // For example, auto-progression, timers, etc.
        if (!this.state.isCompleted) {
            // Update intro progress based on deltaTime
            // this.state.introProgress += deltaTime * someRate;
        }
    }

    destroy(_gameState: GameState): void {
        // Cleanup logic if needed
    }
} 