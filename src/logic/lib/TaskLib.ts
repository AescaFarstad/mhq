import { TaskDefinition, TaskNameDetails } from "./definitions/TaskDefinition";
import { SkillLib } from "./SkillLib";
import { BuildingLib } from "./BuildingLib";
import { Skill } from "./definitions/SkillDefinition";

type TaskData = Record<string, Omit<TaskDefinition, 'id'>>;

// Helper type for the verification logic
interface UnifiedSkillInfo {
    id: string; // The name/id of the skill or specialization itself
    isSpecialization: boolean;
    parentSkillId?: string; // The ID of the parent skill, if it's a specialization
    originalDefinition: Skill | any; // Actual type would be Skill or a SkillSpecialization from SkillDefinition.ts
}

export class TaskLib {
    private tasks: Map<string, TaskDefinition> = new Map();
    public isLoaded: boolean = false;

    /**
     * Verifies a single task definition.
     * @param taskId The ID of the task.
     * @param taskDef The full TaskDefinition object.
     * @param skillLib Instance of SkillLib for skill validation.
     * @param buildingLib Instance of BuildingLib for building validation.
     * @returns An array of error messages. Empty if the task is valid.
     */
    private verifyTask(taskId: string, taskDef: TaskDefinition, skillLib: SkillLib, buildingLib: BuildingLib): string[] {
        const errors: string[] = [];
        const addError = (message: string) => { errors.push(`[${taskId}] ${message}`); };

        const getUnifiedSkillInfo = (skillOrSpecName: string): UnifiedSkillInfo | undefined => {
            // skillOrSpecName is a unique ID, could be for a skill or a specialization.

            // 1. Check if it's a base skill
            const baseSkillDefinition = skillLib.getSkill(skillOrSpecName);
            if (baseSkillDefinition) {
                return {
                    id: skillOrSpecName, // The ID of the skill
                    isSpecialization: false,
                    originalDefinition: baseSkillDefinition
                };
            }

            // 2. Check if it's a specialization
            const specDefinition = skillLib.getSpecialization(skillOrSpecName);
            if (specDefinition) {
                return {
                    id: skillOrSpecName, // The ID of the specialization
                    isSpecialization: true,
                    parentSkillId: specDefinition.parentId, // Get parentId from the spec's definition
                    originalDefinition: specDefinition
                };
            }
            
            // 3. If not found as either, it's an invalid skill/spec name for the task
            return undefined;
        };

        const verifyNameDetails = (details: TaskNameDetails, context: string) => {
            const unifiedSkillsInThisTask: UnifiedSkillInfo[] = [];
            const skillAndSpecNamesUsedInTask = new Set<string>();

            if (details.skills && details.skills.length > 0) {
                for (const skillOrSpecName of details.skills) {
                    const unifiedInfo = getUnifiedSkillInfo(skillOrSpecName);
                    if (!unifiedInfo) {
                        addError(`${skillOrSpecName} not found (${context}).`);
                    } else {
                        unifiedSkillsInThisTask.push(unifiedInfo);
                        skillAndSpecNamesUsedInTask.add(skillOrSpecName);
                    }
                }

                // for (const unifiedInfo of unifiedSkillsInThisTask) {
                //     if (unifiedInfo.isSpecialization && unifiedInfo.parentSkillId) {
                //         if (skillAndSpecNamesUsedInTask.has(unifiedInfo.parentSkillId)) {
                //             addError(`${unifiedInfo.parentSkillId} / ${unifiedInfo.id} spec from skill (${context})`);
                //         }
                //     }
                // }
            }

            if (details.intermediates) {
                for (const intermediateText of details.intermediates) {
                    const placeholders = intermediateText.match(/{_OPTION\d+}/g);
                    if (placeholders) {
                        for (const placeholder of placeholders) {
                            const optionKey = placeholder.substring(1, placeholder.length - 1);
                            if (!details[optionKey]) {
                                addError(`'${placeholder}' in '${intermediateText}', but is missing (${context}).`);
                            }
                        }
                    }
                }
            }
        };

        if (taskDef.names) {
            if (taskDef.names.byBuilding) {
                for (const buildingId in taskDef.names.byBuilding) {
                    if (!buildingLib.getBuilding(buildingId)) {
                        addError(`${buildingId} in 'names.byBuilding' not found`);
                    }
                    taskDef.names.byBuilding[buildingId].forEach(nameDetail => verifyNameDetails(nameDetail, `${buildingId}`));
                }
            }
        }
        return errors;
    }

    /**
     * Loads task definitions from TypeScript data without immediate verification.
     * @param taskData The task data with proper typing
     */
    public loadTasks(taskData: TaskData): void {
        this.tasks.clear();
        let loadedCount = 0;
        for (const id in taskData) {
            if (Object.prototype.hasOwnProperty.call(taskData, id)) {
                const data = taskData[id];
                const taskDef: TaskDefinition = {
                    id: id,
                    ...data
                };
                this.tasks.set(id, taskDef);
                loadedCount++;
            }
        }
        this.isLoaded = true; // Mark as loaded, verification is separate
        console.log(`TaskLib loaded ${loadedCount} task definitions. Verification pending.`);
    }

    /**
     * Verifies all loaded tasks.
     * @param skillLib Instance of SkillLib for skill validation.
     * @param buildingLib Instance of BuildingLib for building validation.
     * @returns An object with verification counts and error details.
     */
    public verifyAllTasks(skillLib: SkillLib, buildingLib: BuildingLib): { verifiedCount: number, errorCount: number, errorDetails: Map<string, string[]> } {
        let verifiedCount = 0;
        let errorCount = 0;
        const errorDetails: Map<string, string[]> = new Map();

        if (!this.isLoaded) {
            console.warn("TaskLib: Attempted to verify tasks before loading. Please call loadTasks first.");
            return { verifiedCount, errorCount, errorDetails };
        }
        
        if (!skillLib) {
            console.warn("TaskLib: SkillLib instance not provided. Skill verification will be skipped or incomplete.");
        }
        if (!buildingLib) {
            console.warn("TaskLib: BuildingLib instance not provided. Building verification will be skipped or incomplete.");
        }

        for (const [taskId, taskDef] of this.tasks) {
            const errors = this.verifyTask(taskId, taskDef, skillLib, buildingLib);
            if (errors.length === 0) {
                verifiedCount++;
            } else {
                errorCount++;
                errorDetails.set(taskId, errors);
                console.warn(`Validation errors for task '${taskId}':\n- ${errors.join('\n- ')}`);
            }
        }
        if (errorCount > 0) {
            console.warn("TaskLib: Details for tasks with errors:", errorDetails);
        }
        return { verifiedCount, errorCount, errorDetails };
    }

    /**
     * Gets a task definition by its ID.
     * @param id The task ID.
     * @returns The TaskDefinition or undefined if not found.
     */
    public getTask(id: string): TaskDefinition | undefined {
        return this.tasks.get(id);
    }

    /**
     * Gets all loaded task definitions.
     * @returns An iterable iterator of TaskDefinition values.
     */
    public values(): IterableIterator<TaskDefinition> {
        return this.tasks.values();
    }
}