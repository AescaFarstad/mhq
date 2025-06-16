import { reactive, shallowReactive } from 'vue';
import { WelcomeLib } from './lib/WelcomeLib';
import * as effects from '../../logic/effects';
export const WELCOME_TYPE = 'Welcome';
export const EXPLORATION_RATE = 0.07; // Progress per second
export const THRESHOLD_DESCRIPTION_OBFUSCATED_REVEAL = 0.4;
export const THRESHOLD_PROS_CONS_TITLES_REVEAL = 0.5;
// Thresholds for individual pros/cons will be dynamic
export const THRESHOLD_DESCRIPTION_REVEAL = 0.9;
export const THRESHOLD_SELECTABLE = 1.0;
export class WelcomeGame {
    id;
    type = WELCOME_TYPE;
    state;
    hidesMainUI = false; // Set to true if you want to hide the main UI
    constructor(id) {
        this.id = id;
        const welcomeLibInstance = new WelcomeLib(); // Create a full instance
        this.state = shallowReactive({
            lib: welcomeLibInstance, // Use the full instance here
            explorableChoices: [],
            selectedLocation: undefined,
            lastSelectedLocationId: undefined, // Initialize lastSelectedLocationId
        });
        this.initializeExplorableChoices();
    }
    initializeExplorableChoices() {
        const locations = this.state.lib.locations.getAllLocations();
        this.state.explorableChoices = locations.map(loc => {
            const prosCount = loc.pros?.length || 0;
            const consCount = loc.cons?.length || 0;
            // Steps: 1 for name, 1 for description reveal (obfuscated), 1 for pros/cons titles, N for pros, M for cons, 1 for description de-obfuscation, 1 for selectable
            const totalExplorationSteps = 1 + 1 + 1 + prosCount + consCount + 1 + 1;
            return reactive({
                ...loc,
                id: loc.id, // Ensure all fields from ExplorableWelcomeChoice are present
                name: loc.name,
                imageName: loc.imageName,
                atlasName: 'locations',
                pros: loc.pros,
                cons: loc.cons,
                description: loc.description,
                explorationProgress: 0,
                isExploring: false,
                totalExplorationSteps: totalExplorationSteps,
                currentExplorationStep: 0,
                nameObfuscationPercentage: 1, // Start fully obfuscated
                isDescriptionVisible: false,
                descriptionObfuscationPercentage: 1, // Start fully obfuscated
                areProsConsTitlesVisible: false,
                revealedProsCount: 0,
                revealedConsCount: 0,
                canBeSelected: false,
            });
        });
    }
    startExploration(choiceId) {
        this.state.explorableChoices.forEach(choice => {
            choice.isExploring = choice.id === choiceId;
        });
    }
    stopExploration(choiceId) {
        const choice = this.state.explorableChoices.find(c => c.id === choiceId);
        if (choice) {
            choice.isExploring = false;
        }
    }
    stopAllExplorations() {
        this.state.explorableChoices.forEach(choice => {
            choice.isExploring = false;
        });
    }
    makeChoiceAndPrepareExit(choiceId, gameState) {
        const selectedChoiceDefinition = this.state.lib.locations.getLocation(choiceId);
        if (selectedChoiceDefinition) {
            const params = {
                locationId: selectedChoiceDefinition.id,
            };
            effects.applyWelcomeResults(gameState, params);
            this.state.lastSelectedLocationId = selectedChoiceDefinition.id;
            gameState.exitMinigame();
        }
        else {
            console.error('WelcomeGame: Could not find location definition for id:', choiceId);
        }
    }
    update(_gameState, deltaTime) {
        this.state.explorableChoices.forEach(choice => {
            if (choice.isExploring && choice.explorationProgress < 1) {
                choice.explorationProgress = Math.min(1, choice.explorationProgress + EXPLORATION_RATE * deltaTime);
                // Update based on thresholds with gradual deobfuscation
                // Gradual name deobfuscation: starts early and completes by when first pro appears
                // First pro appears just after pros/cons titles (around 0.5 + small offset)
                const firstProThreshold = THRESHOLD_PROS_CONS_TITLES_REVEAL + 0.05;
                const nameDeobfuscationStart = 0.05; // Start very early
                const nameDeobfuscationRange = firstProThreshold - nameDeobfuscationStart;
                if (choice.explorationProgress >= nameDeobfuscationStart) {
                    if (choice.explorationProgress >= firstProThreshold) {
                        choice.nameObfuscationPercentage = 0; // Fully revealed
                    }
                    else {
                        const progressInRange = choice.explorationProgress - nameDeobfuscationStart;
                        choice.nameObfuscationPercentage = Math.max(0, 1 - (progressInRange / nameDeobfuscationRange));
                    }
                }
                if (choice.explorationProgress >= THRESHOLD_DESCRIPTION_OBFUSCATED_REVEAL) {
                    choice.isDescriptionVisible = true;
                }
                if (choice.explorationProgress >= THRESHOLD_PROS_CONS_TITLES_REVEAL) {
                    choice.areProsConsTitlesVisible = true;
                }
                // Dynamically reveal pros and cons
                const prosConsStartThreshold = THRESHOLD_PROS_CONS_TITLES_REVEAL;
                const descriptionRevealStartThreshold = THRESHOLD_DESCRIPTION_REVEAL; // When pros/cons finish
                const totalProsCons = (choice.pros?.length || 0) + (choice.cons?.length || 0);
                if (totalProsCons > 0) {
                    const progressRangeForProsCons = descriptionRevealStartThreshold - prosConsStartThreshold;
                    const progressPerProConItem = progressRangeForProsCons / totalProsCons;
                    let revealedItems = 0;
                    // Reveal Pros
                    for (let i = 0; i < (choice.pros?.length || 0); i++) {
                        if (choice.explorationProgress >= prosConsStartThreshold + (revealedItems + 1) * progressPerProConItem) {
                            if (i + 1 > choice.revealedProsCount)
                                choice.revealedProsCount = i + 1;
                            revealedItems++;
                        }
                    }
                    // Reveal Cons
                    for (let i = 0; i < (choice.cons?.length || 0); i++) {
                        if (choice.explorationProgress >= prosConsStartThreshold + (revealedItems + 1) * progressPerProConItem) {
                            if (i + 1 > choice.revealedConsCount)
                                choice.revealedConsCount = i + 1;
                            revealedItems++;
                        }
                    }
                }
                // Gradual description deobfuscation: starts when visible, completes at the very end
                if (choice.explorationProgress >= THRESHOLD_DESCRIPTION_OBFUSCATED_REVEAL && choice.isDescriptionVisible) {
                    const descriptionDeobfuscationStart = THRESHOLD_DESCRIPTION_OBFUSCATED_REVEAL;
                    const descriptionDeobfuscationEnd = THRESHOLD_SELECTABLE; // Very end
                    const descriptionDeobfuscationRange = descriptionDeobfuscationEnd - descriptionDeobfuscationStart;
                    if (choice.explorationProgress >= descriptionDeobfuscationEnd) {
                        choice.descriptionObfuscationPercentage = 0; // Fully revealed
                    }
                    else {
                        const progressInRange = choice.explorationProgress - descriptionDeobfuscationStart;
                        choice.descriptionObfuscationPercentage = Math.max(0, 1 - (progressInRange / descriptionDeobfuscationRange));
                    }
                }
                if (choice.explorationProgress >= THRESHOLD_SELECTABLE) {
                    choice.canBeSelected = true;
                    // Optionally stop exploration once fully explored
                    choice.isExploring = false;
                }
            }
        });
    }
    destroy(_gameState) {
        this.stopAllExplorations();
    }
}
