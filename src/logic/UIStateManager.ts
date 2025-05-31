import { Stat, Parameter, FormulaStat, IndependentStat } from './core/Stat';
// import type { Character } from './Character';
import { Character as CharacterNamespace } from './Character'; // Import the namespace
import { AttributeUIInfo, AttributeCategoryUIInfo, SkillUIInfo, SkillSpecializationUIInfo, DebugStatInfo } from '../types/uiTypes';
import type { GameState } from "./GameState";
import { getAllResources } from './Resource';
import { GameTaskType, GameTaskStatus, type GameTask } from './TaskTypes'; // Import task types

/**
 * Manages UI state updates from the game state to the reactive UI objects
 */

export interface ResourceUIData {
    current: number;
    max: number;
    income: number;
}

/**
 * Synchronizes resources state to uiState.resources
 */
export function syncUiResources(gameState: GameState): void {
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
        } else {
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
export function updateDebugView(gameState: GameState): void {
    const currentDebugKeys = new Set(Object.keys(gameState.uiState.debugStats));

    gameState.connections.connectablesByName.forEach((stat: Stat, key: string) => {
        let params: Record<string, number> | undefined = undefined;

        // Use instanceof for safe type checking and property access
        if (stat instanceof Parameter) {
            params = { add: stat.add, multiCache: stat.multiCache };
        } else if (stat instanceof FormulaStat) {
            params = { argument: stat.argument };
        } else if (stat instanceof IndependentStat) {
            // Independent stats don't have derived parameters in the same way
            params = undefined; // Or perhaps { baseValue: stat.value } if that's useful?
        }
        // Add handling for other potential Stat types if they exist

        const statData: DebugStatInfo = { value: stat.value };
        if (params) {
            statData.params = params;
        }

        const existing = gameState.uiState.debugStats[key];

        if (!existing) {
            gameState.uiState.debugStats[key] = statData; // Add new
        } else {
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
                } else {
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
export function updateCharacterUIData(gameState: GameState): void {
    // Clear the existing array
    gameState.uiState.characters.length = 0;

    // Get attribute definitions once
    const allAttributeDefs = gameState.lib.getAttributeLib().getAttributeDefinitions();
    if (!allAttributeDefs) {
        console.error("Cannot update character UI data: Attribute definitions not loaded.");
        return;
    }
    
    // Get skill definitions once
    const allSkillDefs = gameState.lib.getSkillLib().getAllSkills();
    if (!allSkillDefs) {
        console.error("Cannot update character UI data: Skill definitions not loaded or empty.");
        return;
    }

    // Add all current characters to the UI state
    for (const char of gameState.characters) {
        const charDef = gameState.lib.characters.getCharacter(char.characterId)!; // Assume charDef exists

        // Use public static prefix and double underscore
        const idPrefix = `chr_${charDef.id}__`; // Use charDef.id from the fetched definition
        const charUiAttributes: AttributeCategoryUIInfo[] = [];

        // Build hierarchical attribute data for the UI
        for (const categoryKey in allAttributeDefs) {
            const categoryDef = allAttributeDefs[categoryKey];
            const primaryStatId = `${idPrefix}${categoryKey}`;
            const primaryStatValue = char.attributes[primaryStatId]?.value ?? 0;

            // Initialize category structure
            const categoryAttributes: AttributeUIInfo[] = [];

            // Populate secondary attributes within the category
            for (const attributeKey in categoryDef.attributes) {
                const attributeDef = categoryDef.attributes[attributeKey];
                const secondaryStatId = `${idPrefix}${attributeKey}`;
                const secondaryStatValue = char.attributes[secondaryStatId]?.value ?? 0;

                categoryAttributes.push({
                    key: attributeKey,
                    displayName: attributeDef.displayName,
                    description: attributeDef.description,
                    value: secondaryStatValue as number, // Type assertion to ensure compatibility
                });
            }

            // Add the complete category info to the character's UI attributes
            charUiAttributes.push({
                key: categoryKey,
                displayName: categoryDef.displayName,
                description: categoryDef.description,
                value: primaryStatValue as number, // Type assertion to ensure compatibility
                attributes: categoryAttributes,
            });
        }
        
        // Build skill data for the UI
        const charUiSkills: SkillUIInfo[] = [];
        
        // Add skills with levels
        for (const skillId in char.skills) {
            const skillDef = allSkillDefs[skillId];
            if (skillDef) {
                const specializationsUiInfo: SkillSpecializationUIInfo[] = [];
                
                // Add specializations for this skill (skillDef.specializations is string[] of full IDs)
                for (const fullSpecId of skillDef.specializations) { // Iterate over full specialization IDs
                    const specDef = gameState.lib.getSkillLib().getSpecialization(fullSpecId);
                    
                    if (specDef) { // specDef is of type SkillSpecialization
                        const specLevel = char.specializations[fullSpecId]?.value ?? 0;
                        const specProficiency = CharacterNamespace.getProficiency(char, fullSpecId, gameState);
                    
                        if (specLevel > 0) { // Only add if character has levels in it
                            // Extract localId for UI: e.g., "striking" from "unarmed_combat.striking"
                            const localSpecId = fullSpecId.substring(specDef.parentId.length + 1);
                            specializationsUiInfo.push({
                                id: localSpecId, // Use the local part of the ID
                                displayName: specDef.displayName,
                                description: specDef.description,
                                level: specLevel,
                                proficiency: specProficiency
                            });
                        }
                    } else {
                        console.warn(`UIStateManager: Full specialization definition not found for ID: ${fullSpecId} (parent skill: ${skillId})`);
                    }
                }
                
                // Add the skill with its specializations
                charUiSkills.push({
                    id: skillId,
                    displayName: skillDef.displayName,
                    description: skillDef.description,
                    attribute: skillDef.attribute,
                    governedBy: skillDef.governedBy,
                    assistedBy: skillDef.assistedBy,
                    level: char.skills[skillId].value,
                    specializations: specializationsUiInfo,
                    proficiency: CharacterNamespace.getProficiency(char, skillId, gameState)
                });
            }
        }

        // Push the complete character data to UI state
        gameState.uiState.characters.push({
            id: charDef.id,       // Use charDef.id
            name: charDef.name,   // Use charDef.name
            level: char.level.value,
            upkeep: char.upkeep.value,
            bio: charDef.bio || '', // Use charDef.bio
            attributes: charUiAttributes,
            skills: charUiSkills
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
export function syncConstructedBuildings(gameState: GameState): void {
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
export function syncTasksView(gameState: GameState): void {
    const allTasks = [
        ...gameState.availableTasks,
        ...gameState.queuedTasks,
        ...gameState.processingTasks,
        ...gameState.completedTasks,
    ];

    // Helper function to update an existing UI array with new tasks
    const updateTaskArray = (uiArray: GameTask[], newTasks: GameTask[]) => {
        // Create a map of existing tasks by UID for quick lookup
        const existingTaskMap = new Map<string, GameTask>();
        for (const task of uiArray) {
            existingTaskMap.set(task.uid, task);
        }

        // Clear the array but keep the reference
        uiArray.length = 0;

        // Add tasks, reusing existing objects where possible to maintain Vue reactivity
        for (const newTask of newTasks) {
            const existingTask = existingTaskMap.get(newTask.uid);
            if (existingTask) {
                // Create a new object for the update to ensure Vue detects a change in the array element reference.
                // This is a more forceful way to trigger reactivity if direct property updates are not being picked up.
                const updatedTask = { 
                    ...existingTask, // Spread existing properties
                    ...newTask     // Spread and overwrite with new properties
                };
                uiArray.push(updatedTask);
            } else {
                // New task, add it directly (it's already a new object)
                uiArray.push(newTask);
            }
        }
    };

    const completed: GameTask[] = [];
    const active: GameTask[] = [];
    const queued: GameTask[] = [];
    const maintenance: GameTask[] = [];
    const opportunity: GameTask[] = [];
    const endeavour: GameTask[] = [];
    const quest: GameTask[] = [];

    for (const task of allTasks) {
        if (task.status === GameTaskStatus.Complete) {
            completed.push(task);
        } else if (task.status === GameTaskStatus.Processing) {
            active.push(task);
        } else if (task.status === GameTaskStatus.Queued) {
            queued.push(task);
        } else if (task.status === GameTaskStatus.Available) {
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
export function syncTimeScale(gameState: GameState): void {
    if (gameState.uiState.currentTimeScale !== gameState.timeScale.current) {
        gameState.uiState.currentTimeScale = gameState.timeScale.current;
    }
}

/**
 * Synchronizes core game parameters like workSpeed and clutterRatio to uiState.
 */
export function syncCoreParameters(gameState: GameState): void {
    if (gameState.uiState.uiWorkSpeed !== gameState.workSpeed.value) {
        gameState.uiState.uiWorkSpeed = gameState.workSpeed.value;
    }
    if (gameState.uiState.uiClutterRatio !== gameState.clutterRatio.value) {
        gameState.uiState.uiClutterRatio = gameState.clutterRatio.value;
    }
}

/**
 * Central synchronization function to update UI state based on active tab and global needs.
 */
export function sync(gameState: GameState): void {
    // Always sync resources as they might be globally displayed (e.g., top bar)
    syncUiResources(gameState);
    // Always sync time scale as it's globally displayed
    syncTimeScale(gameState);
    // Always sync core parameters for components like BuffBar
    syncCoreParameters(gameState);
    // syncTasksView(gameState); // Reverted: No longer called unconditionally

    // Sync data specific to the active tab
    const activeTab = gameState.uiState.activeTabName;
    if (activeTab === 'Crew') {
        updateCharacterUIData(gameState);
    } else if (activeTab === 'Debug') {
        updateDebugView(gameState);
    } else if (activeTab === 'Castle') {
        syncConstructedBuildings(gameState);
    } else if (activeTab === 'Tasks') {
        syncTasksView(gameState); // Called only when Tasks tab is active
    }
    // Add other tabs here as needed, e.g.:
    // else if (activeTab === 'Quests') { syncQuestsView(gameState); }
} 