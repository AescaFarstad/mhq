/**
 * UI Sync function for the Welcome minigame.
 * This function copies the relevant state from the logic-side minigame state
 * to the UI-side minigame state, allowing Vue components to react to changes.
 */
export const welcomeUISync = (gameState) => {
    const logicState = gameState.activeMinigame?.state;
    // Ensure UIMinigameState is also typed as WelcomeState or has a compatible structure
    const uiState = gameState.uiState.activeMinigameState;
    if (logicState && uiState) {
        // Sync selectedLocation
        // Check for undefined explicitly as null is not used in our selectedLocation type
        if (logicState.selectedLocation !== undefined) {
            uiState.selectedLocation = { ...logicState.selectedLocation };
        }
        else {
            uiState.selectedLocation = undefined;
        }
        // Sync explorableChoices
        if (logicState.explorableChoices && Array.isArray(logicState.explorableChoices)) {
            if (!uiState.explorableChoices || uiState.explorableChoices.length !== logicState.explorableChoices.length) {
                // If UI array is not initialized or length mismatch, replace it (Vue will react)
                // Ensure items are plain objects if they are to be reactive, or that reactivity is handled correctly
                uiState.explorableChoices = logicState.explorableChoices.map((choice) => ({ ...choice }));
            }
            else {
                // If arrays match in length, update each item property by property
                // This is generally better for Vue's reactivity if UI choices are already reactive objects
                logicState.explorableChoices.forEach((logicChoice, index) => {
                    const uiChoice = uiState.explorableChoices[index];
                    if (uiChoice && uiChoice.id === logicChoice.id) {
                        // Sync all relevant mutable properties
                        uiChoice.explorationProgress = logicChoice.explorationProgress;
                        uiChoice.isExploring = logicChoice.isExploring;
                        uiChoice.nameObfuscationPercentage = logicChoice.nameObfuscationPercentage;
                        uiChoice.isDescriptionVisible = logicChoice.isDescriptionVisible;
                        uiChoice.descriptionObfuscationPercentage = logicChoice.descriptionObfuscationPercentage;
                        uiChoice.areProsConsTitlesVisible = logicChoice.areProsConsTitlesVisible;
                        uiChoice.revealedProsCount = logicChoice.revealedProsCount;
                        uiChoice.revealedConsCount = logicChoice.revealedConsCount;
                        uiChoice.canBeSelected = logicChoice.canBeSelected;
                        // Static properties like id, name, pros, cons, description, imageName, atlasName, totalExplorationSteps
                        // are set initially and don't need to be synced every frame unless they can change in logicState.
                        // For safety, one could sync them, but it's usually not necessary if they are truly static post-init.
                        // uiChoice.name = logicChoice.name; // etc. if they could change.
                    }
                    else {
                        // Fallback: if IDs don't match or uiChoice is missing, replace the specific item.
                        // This might indicate a structural mismatch that needs addressing.
                        console.warn('Sync issue: Mismatch at index ' + index + ' for explorableChoices');
                        uiState.explorableChoices[index] = { ...logicChoice };
                    }
                });
            }
        }
        else {
            uiState.explorableChoices = []; // Ensure it's an empty array if logic has none
        }
        // Sync other WelcomeState properties if any are added later
        // e.g., uiState.someOtherProperty = logicState.someOtherProperty;
    }
    else {
        console.warn('welcomeUISync: logicState or uiState is null or undefined during sync.');
    }
};
