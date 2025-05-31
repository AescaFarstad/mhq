import type { GameState } from './GameState';
import { maintenanceSlowTickGlobal, assignmentSlowTickGlobal } from './GameState';
import type { GameTask } from './TaskTypes';
import { GameTaskType, GameTaskStatus } from './TaskTypes';
import type { Character } from './Character';
import { Character as CharacterNamespace } from './Character';

import { Stats } from './core/Stats';
import { IndependentStat } from './core/Stat';

export const CLUTTER_STEP = 10; // Example value, adjust as needed

// Constants for skill multipliers in task speed calculation
export const SKILL_MULTIPLIERS: { [count: number]: number[] } = {
    1: [1],
    2: [0.6, 0.5],
    3: [0.5, 0.5, 0.2],
    4: [0.4, 0.4, 0.3, 0.2],
};
export const DEFAULT_LAST_SKILL_MULTIPLIER = 0.1;

export function getSkillMultipliers(numSkills: number): number[] {
    if (numSkills <= 0) return [];
    if (SKILL_MULTIPLIERS[numSkills as keyof typeof SKILL_MULTIPLIERS]) {
        return SKILL_MULTIPLIERS[numSkills as keyof typeof SKILL_MULTIPLIERS];
    }
    // For 5 or more skills
    const baseKey = 4 as keyof typeof SKILL_MULTIPLIERS;
    if (!SKILL_MULTIPLIERS[baseKey]) {
        // This case should ideally not be hit if SKILL_MULTIPLIERS[4] is always defined.
        // Consider logging an error or returning a default if it can occur.
        console.error("Base skill multipliers for 4 skills are not defined!");
        return Array(numSkills).fill(DEFAULT_LAST_SKILL_MULTIPLIER);
    }
    const base = SKILL_MULTIPLIERS[baseKey]; 
    const multipliers = [...base];
    for (let i = 4; i < numSkills; i++) {
        multipliers.push(DEFAULT_LAST_SKILL_MULTIPLIER);
    }
    return multipliers;
}

/**
 * Generates the next unique ID for a task.
 * @param gameState The current game state.
 * @returns A string like "TASK_0", "TASK_1", etc.
 */
export function getNextTaskUid(gameState: GameState): string {
    const nextId = gameState.getAndIncrementTaskUidValue();
    return `TASK_${nextId}`;
}

/**
 * Processes all active tasks each game tick
 * @param gameState The current game state
 * @param deltaTime Time elapsed since last update
 */
export function processTasks(gameState: GameState, deltaTime: number): void {
    if (maintenanceSlowTickGlobal.check(gameState.tick)) {
        updateMaintenance(gameState);
    }
    if (assignmentSlowTickGlobal.check(gameState.tick)) {
        assignTasks(gameState);
    }

    const stillProcessingTasks: GameTask[] = [];
    for (const task of gameState.processingTasks) {
        if (task.status !== GameTaskStatus.Processing) {
            // This task might have been paused or errored externally, keep it if not complete
            if (task.status !== GameTaskStatus.Complete) {
                stillProcessingTasks.push(task);
            }
            continue;
        }

        let cumulativeEffortThisTick = 0;
        let characterSpeed = 0; // Used for task.speed if single assignee
        
        if (task.assignedCharacterIds.length > 0) {
            // Assuming single character assignment for now for simplicity in 'task.speed' and 'task.assignedCharacterEffectiveScores'
            // If multiple characters, task.speed would be sum, and scores might need different structure
            const charId = task.assignedCharacterIds[0]; // Taking the first character for speed and scores
            const character = gameState.characters.find(c => c.characterId === charId);

            if (character) {
                const { speed, proficiencies } = calculateCharacterTaskSpeed(character, task, gameState);
                characterSpeed = speed; // Speed of this character for this task
                task.assignedCharacterEffectiveScores = proficiencies; // Update scores each tick
                cumulativeEffortThisTick += characterSpeed * gameState.workSpeed.value * deltaTime; // Apply workSpeed
            } else {
                 task.assignedCharacterEffectiveScores = {}; // Clear if character not found
            }
        } else {
            task.assignedCharacterEffectiveScores = {}; // Clear if no one assigned
        }

        task.investedEffort += cumulativeEffortThisTick;
        task.workTime += deltaTime;

        if (task.assignedCharacterIds.length > 0) {
            task.speed = characterSpeed; // Set task speed based on the (first) assigned character's speed
        } else {
            task.speed = 0;
        }


        if (task.investedEffort >= task.totalEffort) {
            task.status = GameTaskStatus.Complete;

            // Grant rewards
            if (task.resolvedParentDefinition?.reward) {
                const reward = task.resolvedParentDefinition.reward;

                // Clutter reduction based on clutterPerEffort
                if (typeof reward.clutterPerEffort === 'number' && reward.clutterPerEffort < 0) {
                    const clutterResource = gameState.resources.get('clutter');
                    // Ensure connections object is available from gameState for Stats usage
                    if (clutterResource && clutterResource.current && gameState.connections) { 
                        const reductionAmount = reward.clutterPerEffort * task.totalEffort; // clutterPerEffort is negative
                        const currentClutterValue = clutterResource.current.value;
                        const newClutterValue = Math.max(0, currentClutterValue + reductionAmount);
                        
                        // Use Stats.setIndependentStat to modify the stat's value
                        Stats.setIndependentStat(clutterResource.current as IndependentStat, newClutterValue, gameState.connections);
                        
                        task.clutterReduction = newClutterValue - currentClutterValue; // Store the actual change
                    } else {
                        console.warn("[Task Processing] Clutter resource, its .current property, or gameState.connections not found for reward processing.");
                    }
                }
            }

            gameState.completedTasks.push(task);
            console.log(`Task ${task.name} (UID: ${task.uid}) completed. Assigned characters: ${task.assignedCharacterIds.join(', ')} are now free.`);
            
            task.assignedCharacterIds = [];


        } else {
            stillProcessingTasks.push(task); // Task is still in progress
        }
    }
    gameState.processingTasks = stillProcessingTasks;

    if (gameState.completedTasks.length > 20) {
        gameState.completedTasks = gameState.completedTasks.slice(-20);
    }
}

/**
 * Handles maintenance task generation based on clutter levels.
 * @param gameState The current game state.
 */
function updateMaintenance(gameState: GameState): void {
    const totalActiveTasks = gameState.availableTasks.length + gameState.queuedTasks.length + gameState.processingTasks.length;
    if (totalActiveTasks >= 20) {
        return;
    }

    const clutterResource = gameState.resources.get('clutter');
    if (!clutterResource) {
        console.warn("Clutter resource not found in gameState.");
        return;
    }

    const unfinishedMaintenanceTasks = gameState.queuedTasks
        .concat(gameState.processingTasks)
        .concat(gameState.availableTasks)
        .filter(task => task.type === GameTaskType.Maintenance && task.status !== GameTaskStatus.Complete);

    if (clutterResource.current.value > CLUTTER_STEP * unfinishedMaintenanceTasks.length) {
        let potentialClutterReduction = 0;
        for (const task of unfinishedMaintenanceTasks) {
            if (task.resolvedParentDefinition?.reward?.clutterPerEffort) {
                potentialClutterReduction += (task.resolvedParentDefinition.reward.clutterPerEffort < 0 ? -task.resolvedParentDefinition.reward.clutterPerEffort : 0) * task.totalEffort;
            }
        }

        if (clutterResource.current.value - potentialClutterReduction > CLUTTER_STEP) {
            let generatedTask: GameTask | undefined = undefined;
            let attempts = 0;
            const MAX_ATTEMPTS = 5;

            const declutterTaskDef = gameState.lib.tasks.getTask('declutter');
            if (!declutterTaskDef || !(declutterTaskDef.reward?.clutterPerEffort && declutterTaskDef.reward.clutterPerEffort < 0)) {
                console.warn("'declutter' task definition not found or does not reduce clutter. No maintenance task created.");
                return;
            }

            let totalClutterGeneration = 0;
            const clutterProducingBuildings: { id: string, clutterPerSecond: number }[] = [];
            for (const building of gameState.buildings) {
                const buildingDef = gameState.lib.buildings.getBuilding(building.buildingId);
                if (buildingDef && buildingDef.clutterPerSecond > 0) {
                    totalClutterGeneration += buildingDef.clutterPerSecond;
                    clutterProducingBuildings.push({ id: building.buildingId, clutterPerSecond: buildingDef.clutterPerSecond });
                }
            }

            if (totalClutterGeneration === 0 || clutterProducingBuildings.length === 0) {
                console.warn("No buildings generating clutter found or total clutter generation is zero. No maintenance task created.");
                return;
            }

            while (!generatedTask && attempts < MAX_ATTEMPTS) {
                attempts++;

                let randomClutterPoint = Math.random() * totalClutterGeneration;
                let selectedBuildingId: string | undefined = undefined;

                for (const b of clutterProducingBuildings) {
                    if (randomClutterPoint <= b.clutterPerSecond) {
                        selectedBuildingId = b.id;
                        break;
                    }
                    randomClutterPoint -= b.clutterPerSecond;
                }
                // Fallback if no building was selected (should be rare if totalClutterGeneration > 0)
                if (!selectedBuildingId && clutterProducingBuildings.length > 0) {
                    selectedBuildingId = clutterProducingBuildings[Math.floor(Math.random() * clutterProducingBuildings.length)].id;
                }

                if (!selectedBuildingId) {
                    continue;
                }

                let chosenNameDetails: GameTask['resolvedDefinitionDetails'] | undefined = undefined;
                let chosenDefinitionPath: GameTask['definitionPath'] | undefined = undefined;
                let nameDetailsIndex = -1;

                // Try to get task details for the specific building
                const buildingSpecificTaskNameDetailsArray = declutterTaskDef.names?.byBuilding?.[selectedBuildingId];
                if (buildingSpecificTaskNameDetailsArray && buildingSpecificTaskNameDetailsArray.length > 0) {
                    nameDetailsIndex = Math.floor(Math.random() * buildingSpecificTaskNameDetailsArray.length);
                    chosenNameDetails = buildingSpecificTaskNameDetailsArray[nameDetailsIndex];
                    chosenDefinitionPath = ['declutter', 'byBuilding', selectedBuildingId, nameDetailsIndex];
                } else {
                    // Fallback to generic declutter task details
                    const genericTaskNameDetailsArray = declutterTaskDef.names?.byBuilding?.generic;
                    if (genericTaskNameDetailsArray && genericTaskNameDetailsArray.length > 0) {
                        nameDetailsIndex = Math.floor(Math.random() * genericTaskNameDetailsArray.length);
                        chosenNameDetails = genericTaskNameDetailsArray[nameDetailsIndex];
                        chosenDefinitionPath = ['declutter', 'byBuilding', 'generic', nameDetailsIndex];
                    } else {
                        console.warn(`Attempt ${attempts}: No specific or generic declutter task details found for building ${selectedBuildingId} or generic. Retrying.`);
                        continue; // No suitable task details found for this attempt
                    }
                }
                
                if (!chosenNameDetails || !chosenDefinitionPath) { // Should ideally not be reached if previous continue didn't hit
                     console.warn(`Attempt ${attempts}: Failed to resolve task details. Retrying.`);
                     continue;
                }

                const isDuplicate = unfinishedMaintenanceTasks.some(task => {
                    if (task.resolvedParentDefinition?.id !== 'declutter') return false;
                    if (!task.definitionPath || !chosenDefinitionPath) return false; // Should not happen
                    if (task.definitionPath.length !== chosenDefinitionPath.length) return false;
                    return task.definitionPath.every((val, index) => val === chosenDefinitionPath![index]);
                });

                if (!isDuplicate || attempts === MAX_ATTEMPTS) {
                    const newTaskUid = getNextTaskUid(gameState);
                    const newTask: GameTask = {
                        uid: newTaskUid,
                        type: GameTaskType.Maintenance,
                        status: GameTaskStatus.Available,
                        definitionPath: chosenDefinitionPath, // chosenDefinitionPath is guaranteed to be set here
                        resolvedDefinitionDetails: chosenNameDetails, // chosenNameDetails is guaranteed to be set here
                        resolvedParentDefinition: declutterTaskDef,
                        name: chosenNameDetails.name || declutterTaskDef.id,
                        totalEffort: Math.floor(Math.random() * (declutterTaskDef.effortMax - declutterTaskDef.effortMin) * 0.1) * 10 + declutterTaskDef.effortMin,
                        investedEffort: 0,
                        assignedCharacterIds: [],
                        startedAt: 0,
                        workTime: 0,
                    };
                    if (declutterTaskDef.reward?.clutterPerEffort) { // Already checked it's < 0
                        newTask.clutterReduction = declutterTaskDef.reward.clutterPerEffort * newTask.totalEffort;
                    }
                    generatedTask = newTask;
                }
            }

            if (generatedTask) {
                gameState.availableTasks.push(generatedTask);
                console.log(`Generated maintenance task '${generatedTask.name}' UID: ${generatedTask.uid} (${generatedTask.definitionPath[2]}.`);
            } else if (attempts === MAX_ATTEMPTS) {
                console.warn("Max attempts reached for generating a unique 'declutter' task. No task created or duplicate was kept if forced.");
            }
        }
    }
}


/**
 * Calculates the total speed at which a character performs a given task
 * and their individual proficiencies for the required skills.
 * @param character The character.
 * @param task The task.
 * @param gameState The current game state.
 * @returns An object containing the character's total speed for the task and a map of their skill proficiencies.
 */
function calculateCharacterTaskSpeed(character: Character, task: GameTask, gameState: GameState): { speed: number, proficiencies: Record<string, number> } {
    const requiredSkillNames = task.resolvedDefinitionDetails.skills;
    const proficiencies: Record<string, number> = {};
    let totalSpeed = 0;

    if (!requiredSkillNames || requiredSkillNames.length === 0) {
        // Base speed if no skills are required.
        // Still return an empty proficiencies map.
        return { speed: 1, proficiencies };
    }

    const skillProficienciesNumeric: number[] = [];
    for (const skillOrSpecName of requiredSkillNames) {
        const proficiency = CharacterNamespace.getProficiency(character, skillOrSpecName, gameState);
        proficiencies[skillOrSpecName] = proficiency;
        skillProficienciesNumeric.push(proficiency);
    }

    const multipliers = getSkillMultipliers(skillProficienciesNumeric.length);

    for (let i = 0; i < skillProficienciesNumeric.length; i++) {
        totalSpeed += skillProficienciesNumeric[i] * (multipliers[i] || 0); // Ensure multiplier exists
    }

    return { speed: totalSpeed > 0 ? totalSpeed : 0, proficiencies };
}

/**
 * Finds the task from a pool that a character can perform with the highest speed.
 * @param character The character.
 * @param taskPool The pool of available tasks.
 * @param gameState The current game state.
 * @returns An object with the best GameTask and the speed, or undefined if no suitable task.
 */
function findBestTaskForCharacterBySpeed(character: Character, taskPool: GameTask[], gameState: GameState): { task: GameTask, speed: number, proficiencies: Record<string, number> } | undefined {
    let bestTask: GameTask | undefined = undefined;
    let maxSpeed = 0; // Initialize to 0, as speed cannot be negative
    let bestProficiencies: Record<string, number> = {};

    for (const task of taskPool) {
        const { speed, proficiencies } = calculateCharacterTaskSpeed(character, task, gameState);
        if (speed > maxSpeed) {
            maxSpeed = speed;
            bestTask = task;
            bestProficiencies = proficiencies;
        }
    }

    if (bestTask) {
        return { task: bestTask, speed: maxSpeed, proficiencies: bestProficiencies };
    }
    return undefined;
}

/**
 * Assigns a single best task to an available character based on priority and highest speed.
 * @param gameState The current game state.
 */
function assignTasks(gameState: GameState): void {
    const availableCharacters = gameState.characters.filter(char => {
        const isProcessing = gameState.processingTasks.some(t => t.assignedCharacterIds.includes(char.characterId));
        const isAssignedInQueue = gameState.queuedTasks.some(t =>
            t.assignedCharacterIds.includes(char.characterId) &&
            (t.status === GameTaskStatus.Queued || t.status === GameTaskStatus.Paused)
        );
        return !isProcessing && !isAssignedInQueue;
    });

    if (availableCharacters.length === 0) {
        return;
    }

    let bestOverallAssignment: {
        character: Character | null;
        task: GameTask | null;
        speed: number; 
        proficiencies: Record<string, number>; // Added proficiencies
        sourceList: 'availableTasks' | 'queuedTasks' | null;
    } = { character: null, task: null, speed: 0, proficiencies: {}, sourceList: null };

    for (const character of availableCharacters) {
        // Priority 1: Character-Specific Queued Task
        const charSpecificQueuedTasks = gameState.queuedTasks.filter(task =>
            task.status === GameTaskStatus.Queued &&
            (!task.assignedCharacterIds || task.assignedCharacterIds.length === 0) &&
            task.queuedForCharacterId === character.characterId
        );
        // Since findBestTaskForCharacterBySpeed finds the *best* among a pool,
        // and here we are checking specific tasks for a character, we can iterate or pick the first if only one is expected.
        // For simplicity, assuming a character might have multiple specific tasks queued, find the one they do fastest.
        const bestCharSpecificTaskDetails = findBestTaskForCharacterBySpeed(character, charSpecificQueuedTasks, gameState);
        if (bestCharSpecificTaskDetails && bestCharSpecificTaskDetails.speed > bestOverallAssignment.speed) {
            bestOverallAssignment = {
                character,
                task: bestCharSpecificTaskDetails.task,
                speed: bestCharSpecificTaskDetails.speed,
                proficiencies: bestCharSpecificTaskDetails.proficiencies, // Store proficiencies
                sourceList: 'queuedTasks'
            };
        }

        // Priority 2: Maintenance Tasks (only if not overridden by a faster character-specific task)
        const maintenancePool = gameState.availableTasks.filter(task =>
            task.type === GameTaskType.Maintenance &&
            task.status === GameTaskStatus.Available
        );
        const bestMaintenanceDetails = findBestTaskForCharacterBySpeed(character, maintenancePool, gameState);
        if (bestMaintenanceDetails && bestMaintenanceDetails.speed > bestOverallAssignment.speed) {
            bestOverallAssignment = {
                character,
                task: bestMaintenanceDetails.task,
                speed: bestMaintenanceDetails.speed,
                proficiencies: bestMaintenanceDetails.proficiencies, // Store proficiencies
                sourceList: 'availableTasks'
            };
        }

        // Priority 3: General Queued Tasks (not character-specific)
        const generalQueuedTasks = gameState.queuedTasks.filter(task =>
            task.status === GameTaskStatus.Queued &&
            (!task.assignedCharacterIds || task.assignedCharacterIds.length === 0) &&
            !task.queuedForCharacterId // Ensure it's not character-specific
        );
        const bestGeneralQueuedDetails = findBestTaskForCharacterBySpeed(character, generalQueuedTasks, gameState);
        if (bestGeneralQueuedDetails && bestGeneralQueuedDetails.speed > bestOverallAssignment.speed) {
            bestOverallAssignment = {
                character,
                task: bestGeneralQueuedDetails.task,
                speed: bestGeneralQueuedDetails.speed,
                proficiencies: bestGeneralQueuedDetails.proficiencies, // Store proficiencies
                sourceList: 'queuedTasks'
            };
        }
        
        // Priority 4: Opportunity Tasks
        const opportunityPool = gameState.availableTasks.filter(task =>
            task.type === GameTaskType.Opportunity &&
            task.status === GameTaskStatus.Available
        );
        const bestOpportunityDetails = findBestTaskForCharacterBySpeed(character, opportunityPool, gameState);
        if (bestOpportunityDetails && bestOpportunityDetails.speed > bestOverallAssignment.speed) {
            bestOverallAssignment = {
                character,
                task: bestOpportunityDetails.task,
                speed: bestOpportunityDetails.speed,
                proficiencies: bestOpportunityDetails.proficiencies, // Store proficiencies
                sourceList: 'availableTasks'
            };
        }
    }

    // Assign the single best task found (highest speed)
    if (bestOverallAssignment.task && bestOverallAssignment.character && bestOverallAssignment.speed > 0) {
        const assignedTask = bestOverallAssignment.task;
        const assignedCharacter = bestOverallAssignment.character;

        assignedTask.status = GameTaskStatus.Processing;
        assignedTask.assignedCharacterIds = [assignedCharacter.characterId];
        assignedTask.startedAt = gameState.gameTime;
        assignedTask.speed = bestOverallAssignment.speed; 
        assignedTask.assignedCharacterEffectiveScores = bestOverallAssignment.proficiencies; // Set initial scores

        gameState.processingTasks.push(assignedTask);

        if (bestOverallAssignment.sourceList === 'availableTasks') {
            gameState.availableTasks = gameState.availableTasks.filter(t => t.uid !== assignedTask.uid);
        } else if (bestOverallAssignment.sourceList === 'queuedTasks') {
            gameState.queuedTasks = gameState.queuedTasks.filter(t => t.uid !== assignedTask.uid);
            gameState.availableTasks = gameState.availableTasks.filter(t => t.uid !== assignedTask.uid); // Safeguard
        }

        console.log(`Auto-assigned ${assignedTask.type} task '${assignedTask.name}' (UID: ${assignedTask.uid}) to ${assignedCharacter.characterId} with speed ${bestOverallAssignment.speed.toFixed(2)}.`);
    }
}