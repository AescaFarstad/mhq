import { Parameter, FormulaStat, IndependentStat } from './core/Stat';
import { getAllResources } from './Resource';
import { GameTaskType, GameTaskStatus } from './TaskTypes'; // Import task types
import { resolveStepPlaceholderFromLib } from './lib/TaskLib'; // Updated import
// import type { MinigameState } from './minigames/MinigameTypes'; // No longer directly needed here
import { minigameUISyncFunctions } from './minigames/MinigameUIStateManager'; // Updated import name
/**
 * Manages UI state updates from the game state to the reactive UI objects
 */
/**
 * Synchronizes the hypothetical state connections to the reactive uiState.
 * This allows UI components to react to changes when a hypothetical preview is created or cleared.
 * @param gameState The global game state.
 */
export function syncHypotheticalState(gameState) {
    const newHypotheticalConnections = gameState.hypothetical?.connections || null;
    // We cast to `any` here because the `UIState` type definition is not in this file.
    // Ideally, `hypotheticalConnections` would be a formal property on the UIState interface.
    if (gameState.uiState.hypotheticalConnections !== newHypotheticalConnections) {
        gameState.uiState.hypotheticalConnections = newHypotheticalConnections;
    }
}
/**
 * Synchronizes resources state to uiState.resources
 */
export function syncUiResources(gameState) {
    const allResources = getAllResources(gameState.resources);
    const currentUiKeys = new Set(Object.keys(gameState.uiState.resources));
    allResources.forEach((resource, name) => {
        if (!gameState.uiState.resources[name]) {
            // Add new resource to UI state
            gameState.uiState.resources[name] = {
                current: resource.current.value,
                max: resource.max.value,
                income: resource.income.value,
            };
        }
        else {
            // Update existing resource in UI state
            const uiRes = gameState.uiState.resources[name];
            uiRes.current = resource.current.value;
            uiRes.max = resource.max.value;
            uiRes.income = resource.income.value;
        }
        currentUiKeys.delete(name); // Mark this key as processed
    });
    // Remove resources from UI state that no longer exist in resources
    currentUiKeys.forEach(keyToRemove => {
        delete gameState.uiState.resources[keyToRemove];
    });
}
/**
 * Updates the reactive debugStats object with current stat values
 */
export function updateDebugView(gameState) {
    const currentDebugKeys = new Set(Object.keys(gameState.uiState.debugStats));
    gameState.connections.connectablesByName.forEach((stat, key) => {
        let params = undefined;
        // Use instanceof for safe type checking and property access
        if (stat instanceof Parameter) {
            params = { add: stat.add, multiCache: stat.multiCache };
        }
        else if (stat instanceof FormulaStat) {
            params = { argument: stat.argument };
        }
        else if (stat instanceof IndependentStat) {
            // Independent stats don't have derived parameters in the same way
            params = undefined; // Or perhaps { baseValue: stat.value } if that's useful?
        }
        // Add handling for other potential Stat types if they exist
        const statData = { value: stat.value };
        if (params) {
            statData.params = params;
        }
        const existing = gameState.uiState.debugStats[key];
        if (!existing) {
            gameState.uiState.debugStats[key] = statData; // Add new
        }
        else {
            // Update value
            if (existing.value !== statData.value) {
                existing.value = statData.value;
            }
            // Update params
            const existingParamsString = existing.params ? JSON.stringify(existing.params) : 'null';
            const newParamsString = statData.params ? JSON.stringify(statData.params) : 'null';
            if (existingParamsString !== newParamsString) {
                if (statData.params) {
                    existing.params = { ...statData.params }; // Update/add
                }
                else {
                    delete existing.params; // Remove
                }
            }
            // Optionally, could add logging here if changed is true
        }
        currentDebugKeys.delete(key); // Mark as processed
    });
    // Remove stats from UI state that no longer exist
    currentDebugKeys.forEach(keyToRemove => {
        delete gameState.uiState.debugStats[keyToRemove];
    });
}
/**
 * Updates the reactive characters data for the UI, including hierarchical attributes
 */
export function updateCharacterUIData(gameState) {
    // Clear the existing array
    gameState.uiState.characters.length = 0;
    // Get attribute definitions once
    const allAttributeDefs = gameState.lib.attributes.getAttributeDefinitions();
    if (!allAttributeDefs) {
        console.error("Cannot update character UI data: Attribute definitions not loaded.");
        return;
    }
    // Get skill definitions once
    const allSkillDefs = gameState.lib.skills.getAllSkills();
    if (!allSkillDefs) {
        console.error("Cannot update character UI data: Skill definitions not loaded or empty.");
        return;
    }
    // Add all current characters to the UI state
    for (const char of gameState.characters) {
        const charDef = gameState.lib.characters.getCharacter(char.characterId); // Assume charDef exists
        // Use public static prefix and double underscore
        const idPrefix = `chr_${charDef.id}__`; // Use charDef.id from the fetched definition
        const charUiAttributes = [];
        // Build hierarchical attribute data for the UI
        for (const categoryKey in allAttributeDefs) {
            const categoryDef = allAttributeDefs[categoryKey];
            const primaryStatId = `${idPrefix}${categoryKey}`;
            const primaryStat = char.attributes[primaryStatId];
            if (!primaryStat) {
                console.warn(`Primary attribute stat not found: ${primaryStatId}`);
                continue;
            }
            // Initialize category structure
            const categoryAttributes = [];
            // Populate secondary attributes within the category
            for (const attributeKey in categoryDef.attributes) {
                const attributeDef = categoryDef.attributes[attributeKey];
                const secondaryStatId = `${idPrefix}${attributeKey}`;
                const secondaryStat = char.attributes[secondaryStatId];
                if (secondaryStat) {
                    categoryAttributes.push({
                        key: attributeKey,
                        stat: secondaryStat,
                        definition: attributeDef,
                    });
                }
                else {
                    console.warn(`Secondary attribute stat not found: ${secondaryStatId}`);
                }
            }
            // Add the complete category info to the character's UI attributes
            charUiAttributes.push({
                key: categoryKey,
                stat: primaryStat,
                definition: categoryDef,
                attributes: categoryAttributes,
            });
        }
        // Build skill data for the UI
        const charUiSkills = [];
        // Add skills with levels
        for (const skillId in char.skills) {
            const skillDef = allSkillDefs[skillId];
            if (skillDef) {
                const skillStat = char.skills[skillId];
                const skillProficiencyStat = char.proficiencies[skillId];
                if (!skillStat) {
                    console.warn(`Skill stat not found: ${skillId}`);
                    continue;
                }
                if (!skillProficiencyStat) {
                    console.warn(`Skill proficiency stat not found: ${skillId}`);
                    continue;
                }
                const specializationsUiInfo = [];
                // Add specializations for this skill (skillDef.specializations is string[] of globally unique IDs)
                for (const specId of skillDef.specializations) { // Iterate over globally unique specialization IDs
                    const specDef = gameState.lib.skills.getSpecialization(specId);
                    const specStat = char.specializations[specId];
                    const specProficiencyStat = char.proficiencies[specId];
                    if (specDef && specStat && specProficiencyStat && specStat.value > 0) { // Only add if character has levels in it
                        specializationsUiInfo.push({
                            id: specId,
                            stat: specStat,
                            proficiencyStat: specProficiencyStat,
                            definition: specDef,
                        });
                    }
                    else if (specStat && specStat.value > 0) {
                        console.warn(`UIStateManager: Specialization definition or proficiency stat not found for ID: ${specId} (parent skill: ${skillId})`);
                    }
                }
                // Add the skill with its specializations
                charUiSkills.push({
                    id: skillId,
                    stat: skillStat,
                    proficiencyStat: skillProficiencyStat,
                    definition: skillDef,
                    specializations: specializationsUiInfo,
                });
            }
        }
        // Calculate XP progress data
        const currentXp = char.xp.value;
        const currentLevel = char.level.value;
        const nextLevelXpDelta = char.nextLevelXpDelta.value;
        // Calculate XP needed for current level (this should match the calculateTotalXpForLevel function)
        const calculateTotalXpForLevel = (level) => {
            if (level <= 1)
                return 0;
            const XP_EXPONENT = 1.1;
            const BASE_LEVEL_XP = 1000;
            // Helper function for rounding to two significant digits
            const roundToTwoSignificantDigits = (num) => {
                if (num === 0)
                    return 0;
                const magnitude = Math.floor(Math.log10(Math.abs(num)));
                const divisor = Math.pow(10, magnitude - 1);
                return Math.round(num / divisor) * divisor;
            };
            let totalXp = 0;
            let currentLevelDelta = BASE_LEVEL_XP;
            for (let i = 2; i <= level; i++) {
                totalXp += currentLevelDelta;
                currentLevelDelta = roundToTwoSignificantDigits(currentLevelDelta * XP_EXPONENT);
            }
            return totalXp;
        };
        const currentLevelXp = calculateTotalXpForLevel(currentLevel);
        const xpProgress = currentXp - currentLevelXp;
        // Push the complete character data to UI state
        gameState.uiState.characters.push({
            id: char.characterId, // Use char.characterId
            name: char.name, // Use char.name
            level: char.level.value,
            upkeep: char.upkeep.value,
            bio: charDef.bio || '', // Use charDef.bio
            attributes: charUiAttributes,
            skills: charUiSkills,
            attributePoints: char.attributePoints.value,
            skillPoints: char.skillPoints.value,
            specPoints: char.specPoints.value,
            xp: {
                current: currentXp,
                progress: xpProgress,
                nextLevelDelta: nextLevelXpDelta
            }
        });
    }
    // If we have characters but no selection, select the first one
    if (gameState.uiState.characters.length > 0 && gameState.uiState.selectedCharacterId === null) {
        gameState.uiState.selectedCharacterId = gameState.uiState.characters[0].id;
    }
}
/**
 * Synchronizes the constructed building IDs to uiState.constructedBuildingIds
 */
export function syncConstructedBuildings(gameState) {
    const currentUiBuildingIds = new Set(gameState.uiState.constructedBuildingIds);
    const actualConstructedBuildingIds = new Set(gameState.buildings.map(b => b.buildingId));
    // Add new building IDs to UI state
    actualConstructedBuildingIds.forEach(id => {
        if (!currentUiBuildingIds.has(id)) {
            gameState.uiState.constructedBuildingIds.add(id);
        }
    });
    // Remove building IDs from UI state that are no longer constructed (if that becomes possible)
    currentUiBuildingIds.forEach(id => {
        if (!actualConstructedBuildingIds.has(id)) {
            gameState.uiState.constructedBuildingIds.delete(id);
        }
    });
}
/**
 * Synchronizes task lists for the TasksView.
 */
export function syncTasksView(gameState) {
    const allTasks = [
        ...gameState.availableTasks,
        ...gameState.queuedTasks,
        ...gameState.processingTasks,
        ...gameState.completedTasks,
    ];
    // Helper function to update an existing UI array with new tasks
    const updateTaskArray = (uiArray, newTasks) => {
        // Create a map of existing tasks by UID for quick lookup
        const existingTaskMap = new Map();
        for (const task of uiArray) {
            existingTaskMap.set(task.uid, task);
        }
        // Clear the array but keep the reference
        uiArray.length = 0;
        // Add tasks, reusing existing objects where possible to maintain Vue reactivity
        for (const newTask of newTasks) {
            const existingTask = existingTaskMap.get(newTask.uid);
            let resolvedText = '';
            if (existingTask) {
                // It's an update to an existing task object
                // Check if step has changed before re-resolving
                if (existingTask.stepIdx === newTask.stepIdx) {
                    resolvedText = existingTask.currentStepResolvedText;
                }
                else {
                    // Step has changed or was not previously resolved, so resolve now
                    if (newTask.stepCount > 0 && newTask.stepIdx >= 0 &&
                        newTask.stepIntermediateIdx >= 0 &&
                        newTask.resolvedDefinitionDetails?.intermediates &&
                        newTask.stepIntermediateIdx < newTask.resolvedDefinitionDetails.intermediates.length) {
                        const rawIntermediateText = newTask.resolvedDefinitionDetails.intermediates[newTask.stepIntermediateIdx];
                        resolvedText = resolveStepPlaceholderFromLib(rawIntermediateText, newTask.resolvedDefinitionDetails, newTask.stepOptionIdx);
                    }
                }
                const updatedTask = {
                    ...existingTask,
                    ...newTask,
                    currentStepResolvedText: resolvedText
                };
                uiArray.push(updatedTask);
            }
            else {
                // It's a new task object
                const taskToAdd = { ...newTask }; // Clone to ensure we can modify
                if (taskToAdd.stepCount > 0 && taskToAdd.stepIdx >= 0 &&
                    taskToAdd.stepIntermediateIdx >= 0 &&
                    taskToAdd.resolvedDefinitionDetails?.intermediates &&
                    taskToAdd.stepIntermediateIdx < taskToAdd.resolvedDefinitionDetails.intermediates.length) {
                    const rawIntermediateText = taskToAdd.resolvedDefinitionDetails.intermediates[taskToAdd.stepIntermediateIdx];
                    resolvedText = resolveStepPlaceholderFromLib(rawIntermediateText, taskToAdd.resolvedDefinitionDetails, taskToAdd.stepOptionIdx);
                }
                taskToAdd.currentStepResolvedText = resolvedText;
                uiArray.push(taskToAdd);
            }
        }
    };
    const completed = [];
    const active = [];
    const queued = [];
    const maintenance = [];
    const opportunity = [];
    const endeavour = [];
    const quest = [];
    for (const task of allTasks) {
        if (task.status === GameTaskStatus.Complete) {
            completed.push(task);
        }
        else if (task.status === GameTaskStatus.Processing) {
            active.push(task);
        }
        else if (task.status === GameTaskStatus.Queued) {
            queued.push(task);
        }
        else if (task.status === GameTaskStatus.Available) {
            // Available tasks are sorted into their type-specific columns
            switch (task.type) {
                case GameTaskType.Maintenance:
                    maintenance.push(task);
                    break;
                case GameTaskType.Opportunity:
                    opportunity.push(task);
                    break;
                case GameTaskType.Endeavour:
                    endeavour.push(task);
                    break;
                case GameTaskType.Quest:
                    quest.push(task);
                    break;
            }
        }
    }
    // Update reactive arrays while preserving object references for Vue reactivity
    updateTaskArray(gameState.uiState.uiCompletedTasks, completed);
    updateTaskArray(gameState.uiState.uiActiveTasks, active);
    updateTaskArray(gameState.uiState.uiQueuedTasks, queued);
    updateTaskArray(gameState.uiState.uiMaintenanceTasks, maintenance);
    updateTaskArray(gameState.uiState.uiOpportunityTasks, opportunity);
    updateTaskArray(gameState.uiState.uiEndeavourTasks, endeavour);
    updateTaskArray(gameState.uiState.uiQuestTasks, quest);
}
/**
 * Synchronizes the current time scale to uiState.currentTimeScale
 */
export function syncTimeScale(gameState) {
    if (gameState.uiState.currentTimeScale !== gameState.timeScale.current) {
        gameState.uiState.currentTimeScale = gameState.timeScale.current;
    }
}
/**
 * Synchronizes core game parameters like workSpeed and clutterRatio to uiState.
 */
export function syncCoreParameters(gameState) {
    if (gameState.uiState.uiWorkSpeed !== gameState.workSpeed.value) {
        gameState.uiState.uiWorkSpeed = gameState.workSpeed.value;
    }
    if (gameState.uiState.uiClutterRatio !== gameState.clutterRatio.value) {
        gameState.uiState.uiClutterRatio = gameState.clutterRatio.value;
    }
}
/**
 * Synchronizes the discovered items count to uiState.discoveredItemsCount
 */
export function syncDiscoveredItems(gameState) {
    const currentCount = gameState.discoveredItems.size;
    if (gameState.uiState.discoveredItemsCount !== currentCount) {
        gameState.uiState.discoveredItemsCount = currentCount;
    }
}
/**
 * Synchronizes the active minigame's state to uiState.activeMinigameState
 */
export function syncMinigameState(gameState) {
    if (gameState.activeMinigame && gameState.uiState.activeMinigameState) {
        const syncFn = minigameUISyncFunctions.get(gameState.activeMinigame.type);
        if (syncFn) {
            syncFn(gameState);
        }
    }
    else if (!gameState.activeMinigame && gameState.uiState.activeMinigameState !== null) {
        gameState.uiState.activeMinigameState = null;
    }
}
/**
 * Synchronizes discovery state to uiState.
 * Optimized to avoid copying when discoveredItems count and array lengths haven't changed.
 */
export function syncDiscoveryState(gameState) {
    const discoveredItemsCount = gameState.discoveredItems.size;
    const activeKeywordsSize = gameState.activeKeywords.size;
    const discardedKeywordsSize = gameState.discardedKeywords.size;
    const discoveryLogLength = gameState.discoveryLog.length;
    // Check if we need to sync activeKeywords
    if (gameState.uiState.activeKeywords.size !== activeKeywordsSize ||
        gameState.uiState.discoveredItemsCount !== discoveredItemsCount) {
        // Clear and rebuild activeKeywords
        gameState.uiState.activeKeywords.clear();
        for (const [keyword, itemIds] of gameState.activeKeywords) {
            gameState.uiState.activeKeywords.set(keyword, [...itemIds]);
        }
    }
    // Check if we need to sync discardedKeywords
    if (gameState.uiState.discardedKeywords.size !== discardedKeywordsSize) {
        // Clear and rebuild discardedKeywords
        gameState.uiState.discardedKeywords.clear();
        for (const keyword of gameState.discardedKeywords) {
            gameState.uiState.discardedKeywords.add(keyword);
        }
    }
    // Check if we need to sync discoveryLog (test latest item for equality)
    const uiLogLength = gameState.uiState.discoveryLog.length;
    if (uiLogLength !== discoveryLogLength ||
        (discoveryLogLength > 0 && uiLogLength > 0 &&
            gameState.uiState.discoveryLog[uiLogLength - 1] !==
                gameState.discoveryLog[discoveryLogLength - 1])) {
        // Copy the discovery log
        gameState.uiState.discoveryLog.length = 0;
        gameState.uiState.discoveryLog.push(...gameState.discoveryLog);
    }
}
/**
 * Central synchronization function to update UI state based on active tab and global needs.
 */
export function sync(gameState) {
    // First, handle minigame UI state. This is always needed.
    syncMinigameState(gameState);
    // If a minigame is active and it hides the main UI, skip the rest of the main UI sync.
    if (gameState.activeMinigame && gameState.activeMinigame.hidesMainUI) {
        return; // Stop here, only minigame UI is relevant
    }
    // Always sync resources as they might be globally displayed (e.g., top bar)
    syncUiResources(gameState);
    // Always sync time scale as it's globally displayed
    syncTimeScale(gameState);
    // Always sync core parameters for components like BuffBar
    syncCoreParameters(gameState);
    // Always sync hypothetical state for previews
    syncHypotheticalState(gameState);
    // Always sync discovered items count for UI reactivity
    syncDiscoveredItems(gameState);
    // Sync data specific to the active tab
    const activeTab = gameState.uiState.activeTabName;
    if (activeTab === 'Crew') {
        updateCharacterUIData(gameState);
    }
    else if (activeTab === 'Debug') {
        updateDebugView(gameState);
    }
    else if (activeTab === 'Castle') {
        syncConstructedBuildings(gameState);
    }
    else if (activeTab === 'Tasks') {
        syncTasksView(gameState);
    }
    else if (activeTab === 'Discover') {
        syncDiscoveryState(gameState);
    }
}
