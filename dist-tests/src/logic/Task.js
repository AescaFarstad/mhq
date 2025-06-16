import { maintenanceSlowTickGlobal, assignmentSlowTickGlobal } from './GameState';
import { GameTaskType, GameTaskStatus } from './TaskTypes';
import { Character as CharacterNamespace } from './Character';
import { Stats } from './core/Stats';
import { getWeightedRandomIndex } from './utils/mathUtils';
import { C } from './lib/C';
C.CLUTTER_STEP;
// Constants for skill multipliers in task speed calculation
export function getSkillMultipliers(numSkills) {
    if (numSkills <= 0)
        return [];
    if (C.SKILL_MULTIPLIERS[numSkills]) {
        return C.SKILL_MULTIPLIERS[numSkills];
    }
    // For 5 or more skills
    const baseKey = 4;
    if (!C.SKILL_MULTIPLIERS[baseKey]) {
        // This case should ideally not be hit if SKILL_MULTIPLIERS[4] is always defined.
        // Consider logging an error or returning a default if it can occur.
        console.error("Base skill multipliers for 4 skills are not defined!");
        return Array(numSkills).fill(C.DEFAULT_LAST_SKILL_MULTIPLIER);
    }
    const base = C.SKILL_MULTIPLIERS[baseKey];
    const multipliers = [...base];
    for (let i = 4; i < numSkills; i++) {
        multipliers.push(C.DEFAULT_LAST_SKILL_MULTIPLIER);
    }
    return multipliers;
}
/**
 * Generates the next unique ID for a task.
 * @param gameState The current game state.
 * @returns A string like "TASK_0", "TASK_1", etc.
 */
export function getNextTaskUid(gameState) {
    const nextId = gameState.getAndIncrementTaskUidValue();
    return `TASK_${nextId}`;
}
/**
 * Calculates and sets the effort target for the current step of a task.
 * @param task The task to update.
 */
function setNextStepEffortTarget(task) {
    if (task.stepCount <= 0 || task.stepIdx < 0 || task.stepIdx >= task.stepCount) {
        // No steps, invalid current step, or already past the last declared step index.
        // Set target to total effort to align with task completion or prevent further step processing.
        task.stepEffortTarget = task.totalEffort;
        return;
    }
    const stepsLeftIncludingCurrent = task.stepCount - task.stepIdx;
    const effortAlreadyInvested = task.investedEffort;
    const effortRemainingInTask = Math.max(0, task.totalEffort - effortAlreadyInvested);
    if (effortRemainingInTask === 0) {
        // No effort left in the task, so current step (and all subsequent) effectively met.
        task.stepEffortTarget = effortAlreadyInvested; // Or task.totalEffort
        return;
    }
    // Average effort for each of the remaining steps (including the current one).
    const avgEffortPerRemainingStep = effortRemainingInTask / stepsLeftIncludingCurrent;
    // Apply +/- 25% randomization for this specific step's effort portion.
    const randomizationFactor = 1 + (Math.random() * (C.TASK_STEP_RANDOMIZATION_RANGE * 2) - C.TASK_STEP_RANDOMIZATION_RANGE);
    let effortForThisStep = avgEffortPerRemainingStep * randomizationFactor;
    // Ensure step effort isn't absurdly small (e.g., min 60 effort points, assuming 1 pt/sec is a baseline speed).
    effortForThisStep = Math.max(effortForThisStep, C.MIN_EFFORT_FOR_STEP);
    // The target for the current step is current invested effort + calculated effort for this step.
    task.stepEffortTarget = effortAlreadyInvested + effortForThisStep;
    // However, the step target should not exceed the total effort for the task.
    task.stepEffortTarget = Math.min(task.stepEffortTarget, task.totalEffort);
    // console.log(`Task ${task.uid} step ${task.stepIdx}/${task.stepCount}: new effort target ${task.stepEffortTarget.toFixed(0)} (effort for this step: ${(task.stepEffortTarget - effortAlreadyInvested).toFixed(0)})`);
}
/**
 * Processes all active tasks each game tick
 * @param gameState The current game state
 * @param deltaTime Time elapsed since last update
 */
export function processTasks(gameState, deltaTime) {
    if (maintenanceSlowTickGlobal.check(gameState.tick)) {
        updateMaintenance(gameState);
    }
    if (assignmentSlowTickGlobal.check(gameState.tick)) {
        assignTasks(gameState);
    }
    const stillProcessingTasks = [];
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
                // Grant XP for the effort invested this tick
                if (cumulativeEffortThisTick > 0) {
                    const xpThisTick = cumulativeEffortThisTick * task.xpMultiplier;
                    const currentXp = character.xp.value;
                    const newXp = currentXp + xpThisTick;
                    Stats.setIndependentStat(character.xp, newXp, gameState.connections);
                }
            }
            else {
                task.assignedCharacterEffectiveScores = {}; // Clear if character not found
            }
        }
        else {
            task.assignedCharacterEffectiveScores = {}; // Clear if no one assigned
        }
        task.investedEffort += cumulativeEffortThisTick;
        task.workTime += deltaTime;
        if (task.assignedCharacterIds.length > 0) {
            task.speed = characterSpeed; // Set task speed based on the (first) assigned character's speed
        }
        else {
            task.speed = 0;
        }
        // Step progression logic based on effort
        if (task.stepCount > 0 && task.stepIdx >= 0 && task.investedEffort >= task.stepEffortTarget) {
            if (task.stepIdx < task.stepCount - 1) { // Not the last step yet
                task.stepIdx++;
                const newStepDetails = generateSingleTaskStepDetails(task.resolvedDefinitionDetails.intermediates || [], task.resolvedDefinitionDetails);
                if (newStepDetails) {
                    task.stepIntermediateIdx = newStepDetails.intermediateIndex;
                    task.stepOptionIdx = newStepDetails.optionIndex;
                }
                else {
                    console.warn(`Task ${task.uid}: Failed to generate details for step ${task.stepIdx}. Step progression might halt.`);
                    // To prevent issues, we can mark remaining steps as 'done' by setting target to total.
                    task.stepEffortTarget = task.totalEffort;
                }
                // Recalculate effort target for the new current step.
                setNextStepEffortTarget(task);
            }
            else {
                // It was the last step (task.stepIdx === task.stepCount - 1) and its effort target is met.
                // No new step to advance to. Task continues until total effort is met.
                // We can set stepEffortTarget to totalEffort to ensure this condition isn't re-triggered pointlessly.
                task.stepEffortTarget = task.totalEffort;
            }
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
                        Stats.setIndependentStat(clutterResource.current, newClutterValue, gameState.connections);
                        task.clutterReduction = newClutterValue - currentClutterValue; // Store the actual change
                    }
                    else {
                        console.warn("[Task Processing] Clutter resource, its .current property, or gameState.connections not found for reward processing.");
                    }
                }
            }
            gameState.completedTasks.push(task);
            console.log(`Task ${task.name} (UID: ${task.uid}) completed. Assigned characters: ${task.assignedCharacterIds.join(', ')} are now free.`);
            task.assignedCharacterIds = [];
        }
        else {
            stillProcessingTasks.push(task); // Task is still in progress
        }
    }
    gameState.processingTasks = stillProcessingTasks;
    if (gameState.completedTasks.length > C.MAX_COMPLETED_TASKS_HISTORY) {
        gameState.completedTasks = gameState.completedTasks.slice(-C.MAX_COMPLETED_TASKS_HISTORY);
    }
}
/**
 * Generates the details for a single task step based on available intermediates and their options.
 * @param intermediates Array of intermediate description strings from TaskNameDetails.
 * @param taskNameDetails The TaskNameDetails object containing option arrays (_OPTION1, etc.).
 * @returns An object with intermediateIndex and optionIndex, or null if no step can be generated.
 */
function generateSingleTaskStepDetails(intermediates, taskNameDetails) {
    if (!intermediates || intermediates.length === 0) {
        return null;
    }
    const weights = [];
    for (const intermediateText of intermediates) {
        let weight = 3;
        const placeholders = intermediateText.match(/{[a-zA-Z0-9_]+}/g);
        if (placeholders && placeholders.length > 0) {
            const placeholder = placeholders[0];
            const optionKey = placeholder.substring(1, placeholder.length - 1);
            const optionsArray = taskNameDetails[optionKey];
            if (optionsArray && Array.isArray(optionsArray)) {
                weight += optionsArray.length;
            }
        }
        weights.push(weight);
    }
    if (weights.length === 0) { // Should not happen if intermediates.length > 0
        return null;
    }
    const chosenIntermediateOverallIndex = getWeightedRandomIndex(weights);
    if (chosenIntermediateOverallIndex === -1) {
        // Fallback if weighted random somehow fails (e.g., all weights zero)
        // Return the first intermediate with no option as a default.
        return { intermediateIndex: 0, optionIndex: -1 };
    }
    let chosenOptionIndex = -1;
    const chosenIntermediateText = intermediates[chosenIntermediateOverallIndex];
    const placeholdersInChosen = chosenIntermediateText.match(/{[a-zA-Z0-9_]+}/g);
    if (placeholdersInChosen && placeholdersInChosen.length > 0) {
        const placeholder = placeholdersInChosen[0];
        const optionKey = placeholder.substring(1, placeholder.length - 1);
        const optionsArray = taskNameDetails[optionKey];
        if (optionsArray && Array.isArray(optionsArray) && optionsArray.length > 0) {
            chosenOptionIndex = Math.floor(Math.random() * optionsArray.length);
        }
    }
    return { intermediateIndex: chosenIntermediateOverallIndex, optionIndex: chosenOptionIndex };
}
/**
 * Handles maintenance task generation based on clutter levels.
 * @param gameState The current game state.
 */
function updateMaintenance(gameState) {
    const totalActiveTasks = gameState.availableTasks.length + gameState.queuedTasks.length + gameState.processingTasks.length;
    if (totalActiveTasks >= C.MAX_ACTIVE_MAINTENANCE_TASKS) {
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
    if (clutterResource.current.value > C.CLUTTER_STEP * unfinishedMaintenanceTasks.length) {
        let potentialClutterReduction = 0;
        for (const task of unfinishedMaintenanceTasks) {
            if (task.resolvedParentDefinition?.reward?.clutterPerEffort) {
                potentialClutterReduction += (task.resolvedParentDefinition.reward.clutterPerEffort < 0 ? -task.resolvedParentDefinition.reward.clutterPerEffort : 0) * task.totalEffort;
            }
        }
        if (clutterResource.current.value - potentialClutterReduction > C.CLUTTER_STEP) {
            let generatedTask = undefined;
            let attempts = 0;
            const declutterTaskDef = gameState.lib.tasks.getTask('declutter');
            if (!declutterTaskDef || !(declutterTaskDef.reward?.clutterPerEffort && declutterTaskDef.reward.clutterPerEffort < 0)) {
                console.warn("'declutter' task definition not found or does not reduce clutter. No maintenance task created.");
                return;
            }
            let totalClutterGeneration = 0;
            const clutterProducingBuildings = [];
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
            while (!generatedTask && attempts < C.MAX_MAINTENANCE_ATTEMPTS) {
                attempts++;
                let randomClutterPoint = Math.random() * totalClutterGeneration;
                let selectedBuildingId = undefined;
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
                let chosenNameDetails = undefined;
                let chosenDefinitionPath = undefined;
                let nameDetailsIndex = -1;
                // Try to get task details for the specific building
                const buildingSpecificTaskNameDetailsArray = declutterTaskDef.names?.byBuilding?.[selectedBuildingId];
                if (buildingSpecificTaskNameDetailsArray && buildingSpecificTaskNameDetailsArray.length > 0) {
                    nameDetailsIndex = Math.floor(Math.random() * buildingSpecificTaskNameDetailsArray.length);
                    chosenNameDetails = buildingSpecificTaskNameDetailsArray[nameDetailsIndex];
                    chosenDefinitionPath = ['declutter', 'byBuilding', selectedBuildingId, nameDetailsIndex];
                }
                else {
                    // Fallback to generic declutter task details
                    const genericTaskNameDetailsArray = declutterTaskDef.names?.byBuilding?.generic;
                    if (genericTaskNameDetailsArray && genericTaskNameDetailsArray.length > 0) {
                        nameDetailsIndex = Math.floor(Math.random() * genericTaskNameDetailsArray.length);
                        chosenNameDetails = genericTaskNameDetailsArray[nameDetailsIndex];
                        chosenDefinitionPath = ['declutter', 'byBuilding', 'generic', nameDetailsIndex];
                    }
                    else {
                        console.warn(`Attempt ${attempts}: No specific or generic declutter task details found for building ${selectedBuildingId} or generic. Retrying.`);
                        continue; // No suitable task details found for this attempt
                    }
                }
                if (!chosenNameDetails || !chosenDefinitionPath) { // Should ideally not be reached if previous continue didn't hit
                    console.warn(`Attempt ${attempts}: Failed to resolve task details. Retrying.`);
                    continue;
                }
                const isDuplicate = unfinishedMaintenanceTasks.some(task => {
                    if (task.resolvedParentDefinition?.id !== 'declutter')
                        return false;
                    if (!task.definitionPath || !chosenDefinitionPath)
                        return false; // Should not happen
                    if (task.definitionPath.length !== chosenDefinitionPath.length)
                        return false;
                    return task.definitionPath.every((val, index) => val === chosenDefinitionPath[index]);
                });
                if (!isDuplicate || attempts === C.MAX_MAINTENANCE_ATTEMPTS) {
                    const newTaskUid = getNextTaskUid(gameState);
                    const taskTotalEffort = Math.floor(Math.random() * (declutterTaskDef.effortMax - declutterTaskDef.effortMin) * 0.1) * 10 + declutterTaskDef.effortMin;
                    const randomSeed = Math.random();
                    const intermediates = chosenNameDetails.intermediates || [];
                    let stepCount = 0;
                    let initialStepIntermediateIdx = -1;
                    let initialStepOptionIdx = -1;
                    if (intermediates.length > 0) {
                        const clampedEffort = Math.max(C.MIN_EXPECTED_TASK_EFFORT, Math.min(C.MAX_EXPECTED_TASK_EFFORT, taskTotalEffort));
                        const effortRatio = (clampedEffort - C.MIN_EXPECTED_TASK_EFFORT) / (C.MAX_EXPECTED_TASK_EFFORT - C.MIN_EXPECTED_TASK_EFFORT);
                        let calculatedSteps = C.MIN_TASK_STEPS_BASE + effortRatio * (C.MAX_TASK_STEPS_BASE - C.MIN_TASK_STEPS_BASE);
                        const randomizationFactor = 1 + (Math.random() * (C.TASK_STEP_RANDOMIZATION_RANGE * 2) - C.TASK_STEP_RANDOMIZATION_RANGE);
                        calculatedSteps *= randomizationFactor;
                        stepCount = Math.round(Math.max(C.MIN_TASK_STEPS_BASE, Math.min(C.MAX_TASK_STEPS_BASE, calculatedSteps)));
                        // Generate details for the first step (stepIdx = 0)
                        const firstStepDetails = generateSingleTaskStepDetails(intermediates, chosenNameDetails);
                        if (firstStepDetails) {
                            initialStepIntermediateIdx = firstStepDetails.intermediateIndex;
                            initialStepOptionIdx = firstStepDetails.optionIndex;
                        }
                        else {
                            // This case should ideally not be hit if intermediates.length > 0 led to stepCount > 0
                            // If it is, it implies an issue with generateSingleTaskStepDetails or no valid first step.
                            // Setting stepCount to 0 to reflect no valid steps can be formed.
                            stepCount = 0;
                            console.warn(`Task ${newTaskUid}: Could not generate first step details despite having intermediates. Setting stepCount to 0.`);
                        }
                    } // If no intermediates, stepCount remains 0, and idx fields remain -1.
                    // Calculate building level and pre-computed XP multiplier at task generation time
                    let taskLevel = 1; // Default level if no building found
                    let taskXpMultiplier = C.EFFORT_TO_XP_RATIO; // Start with base ratio
                    if (selectedBuildingId && selectedBuildingId !== 'generic') {
                        // Find the building instance for level
                        const building = gameState.buildings.find(b => b.buildingId === selectedBuildingId);
                        if (building) {
                            taskLevel = building.level.value;
                            taskXpMultiplier *= building.level.value;
                        }
                        // Get the building definition for xpMult
                        const buildingDef = gameState.lib.buildings.getBuilding(selectedBuildingId);
                        if (buildingDef && buildingDef.xpMult) {
                            taskXpMultiplier *= buildingDef.xpMult;
                        }
                    }
                    const newTask = {
                        uid: newTaskUid,
                        type: GameTaskType.Maintenance,
                        status: GameTaskStatus.Available,
                        definitionPath: chosenDefinitionPath,
                        resolvedDefinitionDetails: chosenNameDetails,
                        resolvedParentDefinition: declutterTaskDef,
                        name: chosenNameDetails.name || declutterTaskDef.id,
                        totalEffort: taskTotalEffort,
                        investedEffort: 0,
                        level: taskLevel,
                        xpMultiplier: taskXpMultiplier,
                        assignedCharacterIds: [],
                        startedAt: 0,
                        workTime: 0,
                        // Initialize new step fields
                        stepIntermediateIdx: initialStepIntermediateIdx,
                        stepOptionIdx: initialStepOptionIdx,
                        stepIdx: stepCount > 0 ? 0 : -1, // Current step is 0 if there are steps, otherwise -1
                        stepCount: stepCount,
                        stepEffortTarget: 0, // Will be set by setNextStepEffortTarget if task starts
                        randomSeed: randomSeed,
                    };
                    if (declutterTaskDef.reward?.clutterPerEffort && declutterTaskDef.reward.clutterPerEffort < 0) {
                        newTask.clutterReduction = declutterTaskDef.reward.clutterPerEffort * newTask.totalEffort;
                    }
                    generatedTask = newTask;
                }
            }
            if (generatedTask) {
                gameState.availableTasks.push(generatedTask);
                console.log(`Generated maintenance task '${generatedTask.name}' UID: ${generatedTask.uid} (${generatedTask.definitionPath[2]}.`);
            }
            else if (attempts === C.MAX_MAINTENANCE_ATTEMPTS) {
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
function calculateCharacterTaskSpeed(character, task, gameState) {
    const requiredSkillNames = task.resolvedDefinitionDetails.skills;
    const proficiencies = {};
    let totalSpeed = 0;
    if (!requiredSkillNames || requiredSkillNames.length === 0) {
        // Base speed if no skills are required.
        // Still return an empty proficiencies map.
        return { speed: 1, proficiencies };
    }
    const skillProficienciesNumeric = [];
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
function findBestTaskForCharacterBySpeed(character, taskPool, gameState) {
    let bestTask = undefined;
    let maxSpeed = -1; // Initialize to -1 to ensure any valid task speed (even 0) is chosen over no task
    let bestProficiencies = {};
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
function assignTasks(gameState) {
    const availableCharacters = gameState.characters.filter(char => {
        const isProcessing = gameState.processingTasks.some(t => t.assignedCharacterIds.includes(char.characterId));
        const isAssignedInQueue = gameState.queuedTasks.some(t => t.assignedCharacterIds.includes(char.characterId) &&
            (t.status === GameTaskStatus.Queued || t.status === GameTaskStatus.Paused));
        return !isProcessing && !isAssignedInQueue;
    });
    if (availableCharacters.length === 0) {
        return;
    }
    let bestOverallAssignment = { character: null, task: null, speed: 0, proficiencies: {}, sourceList: null };
    for (const character of availableCharacters) {
        // Priority 1: Character-Specific Queued Task
        const charSpecificQueuedTasks = gameState.queuedTasks.filter(task => task.status === GameTaskStatus.Queued &&
            (!task.assignedCharacterIds || task.assignedCharacterIds.length === 0) &&
            task.queuedForCharacterId === character.characterId);
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
        const maintenancePool = gameState.availableTasks.filter(task => task.type === GameTaskType.Maintenance &&
            task.status === GameTaskStatus.Available);
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
        const generalQueuedTasks = gameState.queuedTasks.filter(task => task.status === GameTaskStatus.Queued &&
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
        const opportunityPool = gameState.availableTasks.filter(task => task.type === GameTaskType.Opportunity &&
            task.status === GameTaskStatus.Available);
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
    if (bestOverallAssignment.task && bestOverallAssignment.character && bestOverallAssignment.speed >= 0) {
        const assignedTask = bestOverallAssignment.task;
        const assignedCharacter = bestOverallAssignment.character;
        assignedTask.status = GameTaskStatus.Processing;
        assignedTask.assignedCharacterIds = [assignedCharacter.characterId];
        assignedTask.startedAt = gameState.gameTime;
        assignedTask.speed = bestOverallAssignment.speed;
        assignedTask.assignedCharacterEffectiveScores = bestOverallAssignment.proficiencies; // Set initial scores
        // If it's the first step of a task with steps, and its effort target hasn't been set, set it now.
        // Check stepEffortTarget <= investedEffort because investedEffort is 0 when task is first assigned.
        // A target of 0 would mean it's not yet properly initialized for the first step.
        if (assignedTask.stepCount > 0 && assignedTask.stepIdx === 0 && assignedTask.stepEffortTarget <= assignedTask.investedEffort) {
            setNextStepEffortTarget(assignedTask);
        }
        gameState.processingTasks.push(assignedTask);
        if (bestOverallAssignment.sourceList === 'availableTasks') {
            gameState.availableTasks = gameState.availableTasks.filter(t => t.uid !== assignedTask.uid);
        }
        else if (bestOverallAssignment.sourceList === 'queuedTasks') {
            gameState.queuedTasks = gameState.queuedTasks.filter(t => t.uid !== assignedTask.uid);
            gameState.availableTasks = gameState.availableTasks.filter(t => t.uid !== assignedTask.uid); // Safeguard
        }
        console.log(`Auto-assigned ${assignedTask.type} task '${assignedTask.name}' (UID: ${assignedTask.uid}) to ${assignedCharacter.characterId} with speed ${bestOverallAssignment.speed.toFixed(2)}.`);
    }
}
