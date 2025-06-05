import type { GameState } from '../../logic/GameState';
import type { BaseMinigame } from '../../logic/minigames/MinigameTypes';
import { INGRESS_TYPE, type IngressState } from './IngressTypes';
import { reactive } from 'vue'; // Or shallowReactive if preferred for root
import type { IngressWordsLib } from './lib/IngressWordsLib';
import type { WordDefinition } from './lib/definitions/WordDefinition';

export class IngressGame implements BaseMinigame<IngressState> {
    readonly id: string;
    readonly type = INGRESS_TYPE;
    public state: IngressState;
    public hidesMainUI = false; // Set to true for full-screen minigame

    constructor(id: string) {
        this.id = id;
        
        // Initialize your minigame's state here
        // All state properties that need to be reactive for the UI
        // should be within this reactive object.
        this.state = reactive<IngressState>({
            usefulWords: [],
            offensiveWords: [],
            blankWords: [],
            possessionCharges: 0,
            // Example initial state:
            // score: 0,
            // currentLevel: 'level1',
            // isActive: true,
        });
    }

    /**
     * Processes a submitted word, classifies it, and updates the game state.
     * @param word The word submitted by the player.
     * @param ingressWordsLib The library instance for word definitions.
     * @returns An object detailing the classification, points earned, and if the word was a new addition.
     */
    public processSubmittedWord(
        word: string, 
        ingressWordsLib: IngressWordsLib
    ): { classification: 'useful' | 'offensive' | 'blank'; pointsEarned: number; submittedWord: string; isNewAddition: boolean } {
        const cleanedWord = word.trim().toLowerCase();
        if (!cleanedWord) {
            return { classification: 'blank', pointsEarned: 0, submittedWord: word.trim(), isNewAddition: false };
        }

        const definition = ingressWordsLib.getWordByName(cleanedWord);

        if (!definition) {
            let isNew = false;
            if (!this.state.blankWords.includes(cleanedWord)) {
                 this.state.blankWords.push(cleanedWord);
                 isNew = true;
            }
            return { classification: 'blank', pointsEarned: 0, submittedWord: word.trim(), isNewAddition: isNew };
        }

        if (definition.type === 'offensive') {
            let isNew = false;
            const offensiveWordToStore = definition.name.toLowerCase();
            if (!this.state.offensiveWords.includes(offensiveWordToStore)) {
                this.state.offensiveWords.push(offensiveWordToStore);
                isNew = true;
            }
            return { classification: 'offensive', pointsEarned: 0, submittedWord: word.trim(), isNewAddition: isNew };
        }

        if (definition.type === 'useful') {
            let isNew = false;
            if (!this.state.usefulWords.some(w => w.id === definition.id)) {
                this.state.usefulWords.push(definition);
                this.state.possessionCharges += definition.points;
                isNew = true;
            }
            return { classification: 'useful', pointsEarned: definition.points, submittedWord: word.trim(), isNewAddition: isNew };
        }
        
        // Fallback for unhandled types, treat as blank for now
        let isNewFallback = false;
        if (!this.state.blankWords.includes(cleanedWord)) {
            this.state.blankWords.push(cleanedWord);
            isNewFallback = true;
        }
        return { classification: 'blank', pointsEarned: 0, submittedWord: word.trim(), isNewAddition: isNewFallback };
    }

    /**
     * Called every game tick while the minigame is active.
     * @param _gameState The global game state.
     * @param deltaTime The time elapsed since the last update, in seconds.
     */
    update(_gameState: GameState, deltaTime: number): void {
        // TODO: Implement your minigame's core logic here
        // This method is called repeatedly - use deltaTime for frame-rate independent updates.
        // console.log(`IngressGame update, deltaTime: \${deltaTime}`);
    }

    /**
     * Called when the minigame is being exited or shut down.
     * Use this to clean up any resources, listeners, or ongoing processes.
     * @param _gameState The global game state.
     */
    destroy(_gameState: GameState): void {
        // TODO: Add any cleanup logic specific to your minigame
        // This could include stopping timers, removing event listeners, etc.
        // console.log('IngressGame destroyed');
    }

    // TODO: Add your custom minigame methods here
    // For example:
    // public increaseScore(points: number): void {
    //    if (this.state.isActive) {
    //        this.state.score += points;
    //    }
    // }
    //
    // public completeLevel(): void {
    //     this.state.currentLevel = 'nextLevel'; // Or some other logic
    // }
} 