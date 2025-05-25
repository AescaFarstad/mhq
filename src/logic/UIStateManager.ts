import { Stat, Parameter, FormulaStat, IndependentStat } from './core/Stat';
import type { Character } from './Character';
import { AttributeUIInfo, AttributeCategoryUIInfo, SkillUIInfo, SkillSpecializationUIInfo, DebugStatInfo } from '../types/uiTypes';
import type { GameState } from "./GameState";

/**
 * Manages UI state updates from the game state to the reactive UI objects
 */

/**
 * Synchronizes ResourceManager state to uiState.resources
 */
export function syncUiResources(gameState: GameState): void {
    const allResources = gameState.resourceManager.getAllResources();
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

    // Remove resources from UI state that no longer exist in ResourceManager
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
            let changed = false;
            // Update value
            if (existing.value !== statData.value) {
                existing.value = statData.value;
                changed = true;
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
                changed = true;
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
    const allSkillDefs = gameState.lib.getSkillLib().skills;
    if (!allSkillDefs) {
        console.error("Cannot update character UI data: Skill definitions not loaded.");
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
                const specializations: SkillSpecializationUIInfo[] = [];
                
                // Add specializations for this skill
                for (const specId in skillDef.specializations) {
                    const fullSpecId = `${skillId}.${specId}`;
                    const specDef = skillDef.specializations[specId];
                    const specLevel = char.specializations[fullSpecId]?.value ?? 0;
                    
                    if (specLevel > 0) {
                        specializations.push({
                            id: specId,
                            displayName: specDef.displayName,
                            description: specDef.description,
                            level: specLevel
                        });
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
                    specializations: specializations
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