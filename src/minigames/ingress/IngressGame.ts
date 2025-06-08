import type { GameState } from '../../logic/GameState';
import type { BaseMinigame } from '../../logic/minigames/MinigameTypes';
import { INGRESS_TYPE, type IngressState, type IngressCharacterOption, type IngressUpgradeId, type SubmittedWord } from './IngressTypes';
import { reactive } from 'vue'; // Or shallowReactive if preferred for root
import { IngressWordsLib } from './lib/IngressWordsLib';
import type { WordDefinition } from './lib/definitions/WordDefinition';
import { areOneEditAway } from '../../utils/stringUtils';
import { wordify } from '../../utils/stringUtils';
import type { ApplyIngressResultsParams } from '../../logic/lib/definitions/EventDefinition';
import * as effects from '../../logic/effects';
import { getCharacterKeywordsMap, getCombinedWordsMap, getUsefulWordsCountFromMap } from './logic/IngressWordLogic';

const CHARGES_BAR_REVEAL_THRESHOLD = 4;
const FIRST_CHAR_UNLOCK_THRESHOLD = 6;
const SUBSEQUENT_CHAR_UNLOCK_THRESHOLD = 2;
const CHAR_EXPLORATION_COSTS = [1, 2, 3]; // Costs for name, portrait, investigate
const POSSESSION_BASE_SPEED = 0.005;

export class IngressGame implements BaseMinigame<IngressState> {
    readonly id: string;
    readonly type = INGRESS_TYPE;
    public state: IngressState;
    public hidesMainUI = false; // Set to true for full-screen minigame

    private unlockedCharacterCount = 0;
    private combinedWords: Map<string, WordDefinition> | null = null;
    private characterKeywords: Map<string, string[]> | null = null;

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
            totalPossessionCharges: 0,
            chargesBarRevealed: false,
            characterOptions: [],
            inspectingCharacterId: null,
            renamingCharacterId: null,
            characterRenames: {},
            characterXpBonuses: {},
            bioObfuscation: 1.0,
            upgrades: {
                char_attribute_point: false,
                char_skill_point: false,
                char_spec_point: false,
                char_xp_boost: false,
                breach_word_bonus: false,
                breach_typo_tolerance: false,
                breach_word_counter: false,
                breach_possession_speed: false,
            },
            upgradesRevealed: false,
            possessionProgress: 0,
            engaged: false,
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
        ingressWordsLib: IngressWordsLib,
        gameState: GameState,
    ): { classification: 'useful' | 'offensive' | 'blank'; pointsEarned: number; submittedWord: string; isNewAddition: boolean, sourceCharacterIds?: string[] } {
        if (!this.combinedWords || !this.characterKeywords) {
            this.initializeWordLists(ingressWordsLib, gameState);
        }
        const allWords = this.combinedWords!;
        const characterKeywords = this.characterKeywords!;

        const cleanedWord = word.trim().toLowerCase();
        if (!cleanedWord) {
            return { classification: 'blank', pointsEarned: 0, submittedWord: word.trim(), isNewAddition: false };
        }

        const isAlreadySubmitted = (def: WordDefinition): boolean => {
            return this.state.usefulWords.some(w => w.definition.id === def.id);
        };

        let definition = IngressWordsLib.findWordInMap(cleanedWord, allWords);
        let wasTypo = false;

        let sourceCharacterIds: string[] | undefined;
        const potentialWords = wordify(cleanedWord);
        for (const pWord of potentialWords) {
            sourceCharacterIds = characterKeywords.get(pWord);
            if(sourceCharacterIds) break;
        }

        // If the directly matched word is a useful word that has already been submitted, invalidate it to trigger a typo search.
        if (definition && definition.type === 'useful' && isAlreadySubmitted(definition)) {
            definition = undefined;
        }

        // Typo tolerance check: if no definition was found (or it was invalidated) and the upgrade is active,
        // search for a one-edit-away un-submitted useful word.
        if (!definition && this.state.upgrades.breach_typo_tolerance) {
            for (const wordDef of allWords.values()) {
                if (wordDef.type === 'useful' && areOneEditAway(cleanedWord, wordDef.name) && !isAlreadySubmitted(wordDef)) {
                    definition = wordDef;
                    wasTypo = true;
                    break; // Found the first valid typo match
                }
            }
        }

        // From here, the logic is about processing the `definition` we ended up with.

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
            // At this point, `definition` is guaranteed to be a new useful word, either by direct match or typo.
            let pointsToAdd = definition.points;
            if (this.state.upgrades.breach_word_bonus) {
                pointsToAdd += 1;
            }

            let possessionBump = 0;
            if (pointsToAdd === 1) {
                possessionBump = 0.3;
            } else if (pointsToAdd === 2) {
                possessionBump = 0.4;
            } else if (pointsToAdd === 3) {
                possessionBump = 0.5;
            } else if (pointsToAdd >= 4) {
                possessionBump = 0.6;
            }
            
            if (possessionBump > 0) {
                this.state.possessionProgress = Math.min(100, this.state.possessionProgress + possessionBump);
            }

            const submittedWord: SubmittedWord = {
                definition: definition,
                pointsEarned: pointsToAdd,
                wasTypo: wasTypo,
                sourceCharacterIds: sourceCharacterIds
            };
            this.state.usefulWords.push(submittedWord);
            this.state.possessionCharges += pointsToAdd;
            this.state.totalPossessionCharges += pointsToAdd;
            
            if (sourceCharacterIds) {
                for (const charId of sourceCharacterIds) {
                    if (!this.state.characterXpBonuses[charId]) {
                        this.state.characterXpBonuses[charId] = 0;
                    }
                    this.state.characterXpBonuses[charId] += pointsToAdd;

                    let charOption = this.state.characterOptions.find(co => co.characterId === charId);
        
                    if (!charOption) {
                        const charDef = gameState.lib.characters.getCharacter(charId);
                        if (charDef) {
                            const newOption: IngressCharacterOption = {
                                characterId: charDef.id,
                                characterName: charDef.name,
                                discoveryState: 'name_revealed',
                                explorationCosts: CHAR_EXPLORATION_COSTS,
                            };
                            this.state.characterOptions.push(newOption);
                        }
                    } else if (charOption.discoveryState === 'unexplored') {
                        charOption.discoveryState = 'name_revealed';
                        const charDef = gameState.lib.characters.getCharacter(charId);
                        if (charDef) {
                            charOption.characterName = charDef.name;
                        }
                    }
                }
            }
            
            return { classification: 'useful', pointsEarned: pointsToAdd, submittedWord: word.trim(), isNewAddition: true, sourceCharacterIds };
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
    update(gameState: GameState, deltaTime: number): void {
        this.updateCharacterUnlocks(gameState);

        if (!this.state.chargesBarRevealed && this.state.possessionCharges >= CHARGES_BAR_REVEAL_THRESHOLD) {
            this.state.chargesBarRevealed = true;
        }

        if (this.state.possessionProgress < 100) {
            let speedMultiplier = 1;
            if (this.state.upgrades.breach_possession_speed) {
                speedMultiplier = 2;
            }
            const progressToAdd = this.state.totalPossessionCharges * deltaTime * POSSESSION_BASE_SPEED * speedMultiplier;
            this.state.possessionProgress = Math.min(100, this.state.possessionProgress + progressToAdd);
        }
    }

    /**
     * Called when the minigame is being exited or shut down.
     * Use this to clean up any resources, listeners, or ongoing processes.
     * @param _gameState The global game state.
     */
    destroy(_gameState: GameState): void {}

    public engage(): void {
        this.state.engaged = true;
    }

    public revealUpgrades(): void {
        if (!this.state.upgradesRevealed && this.state.possessionCharges >= 1) {
            this.state.possessionCharges -= 1;
            this.state.upgradesRevealed = true;
        }
    }

    public purchaseUpgrade(upgradeId: IngressUpgradeId, cost: number): void {
        if (this.state.upgrades[upgradeId]) {
            console.warn(`Upgrade ${upgradeId} already purchased.`);
            return;
        }
    
        if (this.state.possessionCharges >= cost) {
            this.state.possessionCharges -= cost;
            this.state.upgrades[upgradeId] = true;
        } else {
            console.warn(`Not enough possession charges to purchase upgrade ${upgradeId}.`);
        }
    }

    public startCharacterInspection(characterId: string): void {
        this.state.inspectingCharacterId = characterId;
        this.state.bioObfuscation = 1.0;
    }

    public closeCharacterInspection(): void {
        this.state.inspectingCharacterId = null;
    }

    public openRenameDialog(): void {
        if (this.state.inspectingCharacterId) {
            this.state.renamingCharacterId = this.state.inspectingCharacterId;
        }
    }

    public closeRenameDialog(): void {
        this.state.renamingCharacterId = null;
    }

    public renameCharacter(newName: string): void {
        if (this.state.possessionCharges >= 1 && this.state.renamingCharacterId && newName.trim()) {
            this.state.possessionCharges -= 1;
            this.state.characterRenames[this.state.renamingCharacterId] = newName.trim();
            this.closeRenameDialog();
        }
    }

    public deobfuscateBio(): void {
        if (this.state.possessionCharges >= 1 && this.state.bioObfuscation > 0) {
            this.state.possessionCharges -= 1;
            
            // To avoid floating point issues, we work with integer steps
            const currentObfuscationSteps = Math.round(this.state.bioObfuscation * 5);
            
            let stepsToReduce = 1;
            if (this.state.bioObfuscation === 1.0) {
                stepsToReduce = 2;
            }

            const newObfuscationSteps = Math.max(0, currentObfuscationSteps - stepsToReduce);
            this.state.bioObfuscation = newObfuscationSteps / 5;
        }
    }

    public commitAndPossess(gameState: GameState): void {
        const characterId = this.state.inspectingCharacterId;
        if (this.state.possessionProgress < 100 || !characterId) {
            console.warn("Cannot possess yet. Progress must be 100% and a character must be selected.");
            return;
        }

        if (this.state.possessionCharges < 10) {
            console.warn("Not enough possession charges to commit and possess.");
            return;
        }

        const characterOption = this.state.characterOptions.find(co => co.characterId === characterId);
        if (!characterOption || characterOption.discoveryState !== 'portrait_revealed') {
            console.warn("Selected character is not fully investigated.");
            return;
        }

        this.state.possessionCharges -= 10;

        const xpBonusFromKeywords = this.state.characterXpBonuses[characterId] || 0;
        const universalXpBonus = this.state.upgrades.char_xp_boost ? 25 : 0;

        const params: ApplyIngressResultsParams = {
            characterId: characterId,
            characterName: this.state.characterRenames[characterId],
            xpBonus: xpBonusFromKeywords + universalXpBonus,
            attributePoints: this.state.upgrades.char_attribute_point ? 1 : 0,
            skillPoints: this.state.upgrades.char_skill_point ? 1 : 0,
            specPoints: this.state.upgrades.char_spec_point ? 1 : 0,
        };

        effects.applyIngressResults(gameState, params);

        gameState.exitMinigame();
    }

    public exploreCharacter(characterId: string, gameState: GameState): void {
        const characterOption = this.state.characterOptions.find(c => c.characterId === characterId);
        if (!characterOption) {
            console.warn(`exploreCharacter called with invalid characterId: ${characterId}`);
            return;
        }

        const currentCost = this.getExplorationCost(characterOption);
        if (currentCost === undefined) {
            console.warn('Character already fully explored.');
            return;
        }

        if (this.state.possessionCharges >= currentCost) {
            this.state.possessionCharges -= currentCost;

            switch (characterOption.discoveryState) {
                case 'unexplored':
                    characterOption.discoveryState = 'name_revealed';
                    const charDef = gameState.lib.characters.getCharacter(characterId);
                    if (charDef) {
                        characterOption.characterName = charDef.name;
                    }
                    break;
                case 'name_revealed':
                    characterOption.discoveryState = 'portrait_revealed';
                    const charDef2 = gameState.lib.characters.getCharacter(characterId);
                    if (charDef2) {
                        characterOption.characterImage = {
                            full: charDef2.fullImage,
                            portrait: charDef2.portraitImage,
                        };
                    }
                    break;
            }
        } else {
            console.log('Not enough possession charges to explore.');
            // Optionally, provide feedback to the player here
        }
    }

    private updateCharacterUnlocks(gameState: GameState): void {
        const totalCharges = this.state.totalPossessionCharges;
        let requiredCharges = FIRST_CHAR_UNLOCK_THRESHOLD;
        let potentialUnlocks = 0;

        if (totalCharges >= requiredCharges) {
            potentialUnlocks++;
            while (totalCharges >= requiredCharges + SUBSEQUENT_CHAR_UNLOCK_THRESHOLD) {
                potentialUnlocks++;
                requiredCharges += SUBSEQUENT_CHAR_UNLOCK_THRESHOLD;
            }
        }
        
        if (potentialUnlocks > this.unlockedCharacterCount) {
            const newUnlocksCount = potentialUnlocks - this.unlockedCharacterCount;
            const eligibleChars = Array.from(gameState.lib.characters.values())
                .filter(c => c.location === gameState.locationId && !this.state.characterOptions.some(co => co.characterId === c.id));

            for (let i = 0; i < newUnlocksCount && i < eligibleChars.length; i++) {
                const charToUnlock = eligibleChars[i];
                const newOption: IngressCharacterOption = {
                    characterId: charToUnlock.id,
                    discoveryState: 'unexplored',
                    explorationCosts: CHAR_EXPLORATION_COSTS,
                };
                this.state.characterOptions.push(newOption);
            }
            this.unlockedCharacterCount = potentialUnlocks;
        }
    }

    private getExplorationCost(characterOption: IngressCharacterOption): number | undefined {
        switch (characterOption.discoveryState) {
            case 'unexplored':
                return characterOption.explorationCosts[0];
            case 'name_revealed':
                return characterOption.explorationCosts[1];
            default:
                return undefined; // Fully explored or no direct cost
        }
    }

    private initializeWordLists(ingressWordsLib: IngressWordsLib, gameState: GameState): void {
        this.combinedWords = getCombinedWordsMap(ingressWordsLib, gameState);
        this.characterKeywords = getCharacterKeywordsMap(gameState);
    }

    public getUsefulWordsCount(ingressWordsLib: IngressWordsLib, gameState: GameState): number {
        if (!this.combinedWords) {
            this.initializeWordLists(ingressWordsLib, gameState);
        }
        
        if (!this.combinedWords) {
            return 0;
        }

        return getUsefulWordsCountFromMap(this.combinedWords);
    }
} 