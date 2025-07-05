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
import { getCharacterKeywordsMap, getCombinedWordsMap, getSubstantiveWordsCountFromMap } from './logic/IngressWordLogic';

const CHARGES_BAR_REVEAL_THRESHOLD = 4;
const FIRST_CHAR_UNLOCK_THRESHOLD = 6;
const SUBSEQUENT_CHAR_UNLOCK_THRESHOLD = 2;
const CHAR_EXPLORATION_COSTS = [1, 2, 3]; // Costs for name, portrait, investigate
const MATERIALIZATION_BASE_SPEED = 0.0035;

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
            substantiveWords: [],
            offensiveWords: [],
            blankWords: [],
            allSubmittedWords: [],
            aspectPoints: 0,
            totalAspectPoints: 0,
            chargesBarRevealed: false,
            characterOptions: [],
            charactersAvailableToEnvision: 0,
            hasEnvisioned: false,
            inspectingCharacterId: null,
            renamingCharacterId: null,
            characterRenames: {},
            characterXpBonuses: {},
            characterBioObfuscation: {},
            upgrades: {
                char_attribute_point: false,
                char_skill_point: false,
                char_spec_point: false,
                char_xp_boost: false,
                breach_word_bonus: false,
                breach_typo_tolerance: false,
                breach_word_counter: false,
                breach_materialization_speed: false,
            },
            upgradesRevealed: false,
            materializationProgress: 0,
            engaged: false,
            engagementProgress: 0,
            engagementCompletionTime: null,
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
    ): { classification: 'substantive' | 'offensive' | 'blank'; pointsEarned: number; submittedWord: string; isNewAddition: boolean, sourceCharacterIds?: string[] } {
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
            return this.state.substantiveWords.some(w => w.definition.id === def.id);
        };

        let definition = IngressWordsLib.findWordInMap(cleanedWord, allWords);
        let wasTypo = false;

        let sourceCharacterIds: string[] | undefined;
        const potentialWords = wordify(cleanedWord);
        for (const pWord of potentialWords) {
            sourceCharacterIds = characterKeywords.get(pWord);
            if(sourceCharacterIds) break;
        }

        // If the directly matched word is a substantive word that has already been submitted, invalidate it to trigger a typo search.
        if (definition && definition.type === 'useful' && isAlreadySubmitted(definition)) {
            definition = undefined;
        }

        // Typo tolerance check: if no definition was found (or it was invalidated) and the upgrade is active,
        // search for a one-edit-away un-submitted substantive word.
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
            // Add to comprehensive storage
            if (!this.state.allSubmittedWords.includes(word.trim())) {
                this.state.allSubmittedWords.push(word.trim());
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
            // Add to comprehensive storage
            if (!this.state.allSubmittedWords.includes(word.trim())) {
                this.state.allSubmittedWords.push(word.trim());
            }
            // Also add the matched word if it's different from the original
            if (definition.name !== word.trim() && !this.state.allSubmittedWords.includes(definition.name)) {
                this.state.allSubmittedWords.push(definition.name);
            }
            return { classification: 'offensive', pointsEarned: 0, submittedWord: word.trim(), isNewAddition: isNew };
        }

        if (definition.type === 'useful') {
            // At this point, `definition` is guaranteed to be a new substantive word, either by direct match or typo.
            let pointsToAdd = definition.points;
            if (this.state.upgrades.breach_word_bonus) {
                pointsToAdd += 1;
            }

            let materializationBump = 0;
            if (pointsToAdd === 1) {
                materializationBump = 0.3;
            } else if (pointsToAdd === 2) {
                materializationBump = 0.4;
            } else if (pointsToAdd === 3) {
                materializationBump = 0.5;
            } else if (pointsToAdd === 4) {
                materializationBump = 0.7;
            } else if (pointsToAdd >= 5) {
                materializationBump = 0.8;
            }
            
            if (materializationBump > 0) {
                this.state.materializationProgress = Math.min(100, this.state.materializationProgress + materializationBump);
            }

            const submittedWord: SubmittedWord = {
                definition: definition,
                pointsEarned: pointsToAdd,
                wasTypo: wasTypo,
                sourceCharacterIds: sourceCharacterIds,
                originalTypedWord: word.trim()
            };
            this.state.substantiveWords.push(submittedWord);
            // Add to comprehensive storage
            if (!this.state.allSubmittedWords.includes(word.trim())) {
                this.state.allSubmittedWords.push(word.trim());
            }
            // Also add the corrected word if it was a typo and different from original
            if (wasTypo && definition.name !== word.trim() && !this.state.allSubmittedWords.includes(definition.name)) {
                this.state.allSubmittedWords.push(definition.name);
            }
            this.state.aspectPoints += pointsToAdd;
            this.state.totalAspectPoints += pointsToAdd;
            
            if (sourceCharacterIds) {
                // Check if this is the first character being unlocked via keywords
                const wasFirstCharacterUnlock = !this.state.hasEnvisioned && this.state.characterOptions.length === 0;
                
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
                
                // If this was the first character unlock via keywords, automatically envision for free
                if (wasFirstCharacterUnlock && this.state.characterOptions.length > 0) {
                    this.state.hasEnvisioned = true;
                    // Reset charactersAvailableToEnvision to 0 since we're auto-envisioning
                    this.state.charactersAvailableToEnvision = 0;
                }
            }
            
            return { classification: 'substantive', pointsEarned: pointsToAdd, submittedWord: word.trim(), isNewAddition: true, sourceCharacterIds };
        }
        
        // Fallback for unhandled types, treat as blank for now
        let isNewFallback = false;
        if (!this.state.blankWords.includes(cleanedWord)) {
            this.state.blankWords.push(cleanedWord);
            isNewFallback = true;
        }
        // Add to comprehensive storage
        if (!this.state.allSubmittedWords.includes(word.trim())) {
            this.state.allSubmittedWords.push(word.trim());
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

        if (this.isEngagementHeld) {
            this.state.engagementProgress = Math.min(100, this.state.engagementProgress + 15 * deltaTime);
            if (this.state.engagementProgress >= 100) {
                this.engage();
            }
        }

        if (!this.state.chargesBarRevealed && this.state.aspectPoints >= CHARGES_BAR_REVEAL_THRESHOLD) {
            this.state.chargesBarRevealed = true;
        }

        if (this.state.materializationProgress < 100) {
            let speedMultiplier = 1;
            if (this.state.upgrades.breach_materialization_speed) {
                speedMultiplier = 2;
            }
            const progressToAdd = this.state.totalAspectPoints * deltaTime * MATERIALIZATION_BASE_SPEED * speedMultiplier;
            this.state.materializationProgress = Math.min(100, this.state.materializationProgress + progressToAdd);
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
        this.state.engagementCompletionTime = Date.now();
        this.isEngagementHeld = false;
    }

    private isEngagementHeld = false;
    public handleEngagementClick(): void {
        if (this.state.engaged) return;
        this.state.engagementProgress = Math.min(100, this.state.engagementProgress + 4);
        if (this.state.engagementProgress >= 100) {
            this.engage();
        }
    }

    public handleEngagementMouseDown(): void {
        if (this.state.engaged) return;
        this.isEngagementHeld = true;
    }
    
    public stopEngagementHold(): void {
        this.isEngagementHeld = false;
    }

    public revealUpgrades(): void {
        if (!this.state.upgradesRevealed && this.state.aspectPoints >= 1) {
            this.state.aspectPoints -= 1;
            this.state.upgradesRevealed = true;
        }
    }

    public purchaseUpgrade(upgradeId: IngressUpgradeId, cost: number): void {
        if (this.state.upgrades[upgradeId]) {
            console.warn(`Upgrade ${upgradeId} already purchased.`);
            return;
        }
    
        if (this.state.aspectPoints >= cost) {
            this.state.aspectPoints -= cost;
            this.state.upgrades[upgradeId] = true;
        } else {
            console.warn(`Not enough aspect points to purchase upgrade ${upgradeId}.`);
        }
    }

    public startCharacterInspection(characterId: string): void {
        this.state.inspectingCharacterId = characterId;
        // Only set initial obfuscation if this character hasn't been inspected before
        if (this.state.characterBioObfuscation[characterId] === undefined) {
            this.state.characterBioObfuscation[characterId] = 1.0;
        }
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
        if (this.state.aspectPoints >= 1 && this.state.renamingCharacterId && newName.trim()) {
            this.state.aspectPoints -= 1;
            this.state.characterRenames[this.state.renamingCharacterId] = newName.trim();
            this.closeRenameDialog();
        }
    }

    public deobfuscateBio(): void {
        const characterId = this.state.inspectingCharacterId;
        if (!characterId) {
            console.warn("No character is currently being inspected.");
            return;
        }

        if (this.state.aspectPoints >= 1 && this.state.characterBioObfuscation[characterId] > 0) {
            this.state.aspectPoints -= 1;
            
            // To avoid floating point issues, we work with integer steps
            const currentObfuscationSteps = Math.round(this.state.characterBioObfuscation[characterId] * 5);
            
            let stepsToReduce = 1;
            if (this.state.characterBioObfuscation[characterId] === 1.0) {
                stepsToReduce = 2;
            }

            const newObfuscationSteps = Math.max(0, currentObfuscationSteps - stepsToReduce);
            this.state.characterBioObfuscation[characterId] = newObfuscationSteps / 5;
        }
    }

    public commitAndMaterialize(gameState: GameState): void {
        const characterId = this.state.inspectingCharacterId;
        if (this.state.materializationProgress < 100 || !characterId) {
            console.warn("Cannot materialize yet. Progress must be 100% and a character must be selected.");
            return;
        }

        if (this.state.aspectPoints < 10) {
            console.warn("Not enough aspect points to commit and materialize.");
            return;
        }

        const characterOption = this.state.characterOptions.find(co => co.characterId === characterId);
        if (!characterOption || characterOption.discoveryState !== 'portrait_revealed') {
            console.warn("Selected character is not fully investigated.");
            return;
        }

        this.state.aspectPoints -= 10;

        const xpBonusFromKeywords = this.state.characterXpBonuses[characterId] || 0;
        const universalXpBonus = this.state.upgrades.char_xp_boost ? 25 : 0;

        const params: ApplyIngressResultsParams = {
            characterId: characterId,
            characterName: this.state.characterRenames[characterId],
            xpBonus: xpBonusFromKeywords + universalXpBonus,
            attributePoints: this.state.upgrades.char_attribute_point ? 1 : 0,
            skillPoints: this.state.upgrades.char_skill_point ? 1 : 0,
            specPoints: this.state.upgrades.char_spec_point ? 1 : 0,
            allSubmittedWords: [...this.state.allSubmittedWords],
        };

        effects.applyIngressResults(gameState, params);

        gameState.exitMinigame();
    }

    public envisionCharacters(gameState: GameState): void {
        const ENVISION_COST = 2;
        
        if (this.state.hasEnvisioned) {
            console.warn('Characters have already been envisioned.');
            return;
        }

        if (this.state.charactersAvailableToEnvision === 0) {
            console.warn('No characters available to envision.');
            return;
        }

        if (this.state.aspectPoints < ENVISION_COST) {
            console.warn('Not enough aspect points to envision characters.');
            return;
        }

        this.state.aspectPoints -= ENVISION_COST;
        this.state.hasEnvisioned = true;

        // Now add the available characters to the options
        const eligibleChars = Array.from(gameState.lib.characters.values())
            .filter(c => c.location === gameState.locationId && !this.state.characterOptions.some(co => co.characterId === c.id));

        for (let i = 0; i < this.state.charactersAvailableToEnvision && i < eligibleChars.length; i++) {
            const charToUnlock = eligibleChars[i];
            const newOption: IngressCharacterOption = {
                characterId: charToUnlock.id,
                discoveryState: 'unexplored',
                explorationCosts: CHAR_EXPLORATION_COSTS,
            };
            this.state.characterOptions.push(newOption);
        }

        this.state.charactersAvailableToEnvision = 0;
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

        if (this.state.aspectPoints >= currentCost) {
            this.state.aspectPoints -= currentCost;

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
            console.log('Not enough aspect points to explore.');
            // Optionally, provide feedback to the player here
        }
    }

    private updateCharacterUnlocks(gameState: GameState): void {
        const totalCharges = this.state.totalAspectPoints;
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

            // If this is the first time characters are available and player hasn't envisioned yet
            if (this.unlockedCharacterCount === 0 && !this.state.hasEnvisioned) {
                this.state.charactersAvailableToEnvision = Math.min(newUnlocksCount, eligibleChars.length);
            } else {
                // Normal character unlocking (after envision or subsequent unlocks)
                for (let i = 0; i < newUnlocksCount && i < eligibleChars.length; i++) {
                    const charToUnlock = eligibleChars[i];
                    const newOption: IngressCharacterOption = {
                        characterId: charToUnlock.id,
                        discoveryState: 'unexplored',
                        explorationCosts: CHAR_EXPLORATION_COSTS,
                    };
                    this.state.characterOptions.push(newOption);
                }
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

    public getSubstantiveWordsCount(ingressWordsLib: IngressWordsLib, gameState: GameState): number {
        if (!this.combinedWords) {
            this.initializeWordLists(ingressWordsLib, gameState);
        }
        
        if (!this.combinedWords) {
            return 0;
        }

        return getSubstantiveWordsCountFromMap(this.combinedWords);
    }
} 