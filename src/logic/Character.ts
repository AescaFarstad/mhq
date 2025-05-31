import { IndependentStat, Parameter, Connections, ConnectionType, FormulaParameter, FormulaParameterFormula } from './core/Stat';
import { Stats } from './core/Stats';
import { CHARACTER_STAT_PREFIX } from './core/statPrefixes';
import type { GameState } from './GameState';
import * as UIStateManager from './UIStateManager';
import type { Skill } from './lib/definitions/SkillDefinition';

/**
 * Represents an active character instance in the game with dynamic stats.
 */
export interface Character {
    characterId: string;
    level: IndependentStat;
    baseUpkeep: IndependentStat;
    upkeep: Parameter;
    attributes: Record<string, IndependentStat>;
    skills: Record<string, IndependentStat>;
    specializations: Record<string, IndependentStat>;
    proficiencies: Record<string, Parameter>;
    avgGovAttrStatsCache: Map<string, FormulaParameter>;
}

// Helper type for attribute definitions from the library
export type LibAttributeDefinitions = Record<string, {
    attributes: Record<string, any>; // Attributes within the category
}>;


export namespace Character {
    /**
     * Creates and adds a new character to the game state.
     * This function now resides in Character.ts and has GameState passed to it.
     * It also inlines the logic from initializeBaseStats and addInitialAttributes.
     */
    export function addCharacter(
        gameState: GameState,
        characterDefId: string
    ): Character | undefined {
        const charDef = gameState.lib.characters.getCharacter(characterDefId);
        if (!charDef) {
            console.warn(`Character.addCharacter: Character definition not found for ID: ${characterDefId}`);
            return undefined;
        }

        if (gameState.characters.find(c => c.characterId === characterDefId)) {
            console.warn(`Character.addCharacter: Character with ID ${characterDefId} already exists.`);
            return gameState.characters.find(c => c.characterId === characterDefId);
        }

        const attributeDefs = gameState.lib.attributes.getAttributeDefinitions() as LibAttributeDefinitions;
        const allSkillDefs = gameState.lib.skills.getAllSkills();
        const idPrefix = `${CHARACTER_STAT_PREFIX}${charDef.id}__`;

        const newChar: Character = {
            characterId: charDef.id,
            level: Stats.createStat(`${idPrefix}level`, charDef.initialLevel, gameState.connections),
            baseUpkeep: Stats.createStat(`${idPrefix}base_upkeep`, charDef.baseUpkeep, gameState.connections),
            upkeep: Stats.createParameter(`${idPrefix}upkeep`, gameState.connections),
            attributes: {},
            skills: {},
            specializations: {},
            proficiencies: {},
            avgGovAttrStatsCache: new Map<string, FormulaParameter>()
        };

        Stats.connectStat(newChar.baseUpkeep, newChar.upkeep, ConnectionType.ADD, gameState.connections);
        Stats.connectStat(newChar.level, newChar.upkeep, ConnectionType.MULTY, gameState.connections);

        for (const categoryKey in attributeDefs) {
            if (Object.prototype.hasOwnProperty.call(attributeDefs, categoryKey)) {
                const categoryDef = attributeDefs[categoryKey];
                const primaryStatId = `${idPrefix}${categoryKey}`;
                const primaryInitialValue = charDef.initialAttributes?.[categoryKey] ?? 0;
                newChar.attributes[primaryStatId] = Stats.createStat(primaryStatId, primaryInitialValue, gameState.connections);

                if (categoryDef.attributes) {
                    for (const attributeKey in categoryDef.attributes) {
                        if (Object.prototype.hasOwnProperty.call(categoryDef.attributes, attributeKey)) {
                            const secondaryStatId = `${idPrefix}${attributeKey}`;
                            const initialValue = charDef.initialAttributes?.[attributeKey] ?? 0;
                            newChar.attributes[secondaryStatId] = Stats.createStat(secondaryStatId, initialValue, gameState.connections);
                        }
                    }
                }
            }
        }

        if (charDef.initialSkills) {
            for (const skillId in charDef.initialSkills) {
                if (Object.prototype.hasOwnProperty.call(charDef.initialSkills, skillId) && allSkillDefs[skillId]) {
                    const skillData = charDef.initialSkills[skillId];
                    const skillDef = allSkillDefs[skillId];
                    addInitialSkillWithSpecializations(newChar, skillId, skillData, skillDef, idPrefix, gameState.connections);
                }
            }
        }
        
        gameState.characters.push(newChar);
        Stats.connectStat(newChar.upkeep, gameState.totalCharacterUpkeep, ConnectionType.ADD, gameState.connections);

        if (charDef.triggerOnCreated) {
            try {
                gameState.processEventsForCharacter(charDef.triggerOnCreated, newChar, charDef);
            } catch (error) {
                const charDefinition = gameState.lib.characters.getCharacter(newChar.characterId);
                console.error(`Character.addCharacter: ${charDefinition ? charDefinition.name : newChar.characterId} - Error processing triggerOnCreated events:`, error);
            }
        }

        UIStateManager.updateCharacterUIData(gameState);
        return newChar;
    }

    /**
     * Adds an initial skill and its specified specializations to the character.
     */
    export function addInitialSkillWithSpecializations(
        character: Character,
        skillId: string,
        initialSkillData: { level: number; specializations?: Record<string, number> },
        skillDefinitionFromLib: Skill,
        idPrefix: string,
        connections: Connections,
    ): void {
        upsertSkillAndProficiency(character, skillId, initialSkillData.level, skillDefinitionFromLib, idPrefix, connections);

        if (initialSkillData.specializations && skillDefinitionFromLib.specializations) {
            for (const globalSpecId of skillDefinitionFromLib.specializations) {
                const shortSpecId = globalSpecId.substring(skillId.length + 1);
                
                if (Object.prototype.hasOwnProperty.call(initialSkillData.specializations, shortSpecId)) {
                    const specLevel = initialSkillData.specializations[shortSpecId];
                    upsertSpecializationAndProficiency(character, globalSpecId, specLevel, skillDefinitionFromLib, idPrefix, connections);
                }
            }
        }
    }

    /**
     * Creates or updates a skill and its proficiency for a character.
     */
    export function upsertSkillAndProficiency(
        character: Character,
        skillId: string,
        level: number,
        skillDefinitionFromLib: Skill,
        idPrefix: string,
        connections: Connections
    ): void {
        const skillStatId = `${idPrefix}skill_${skillId}`;
        let skillStat = character.skills[skillId];

        if (skillStat) {
            Stats.setIndependentStat(skillStat, level, connections);
        } else {
            skillStat = Stats.createStat(skillStatId, level, connections);
            character.skills[skillId] = skillStat;
        }

        // --- Average Governing Attribute Calculation for the Skill (remains FormulaParameter) ---
        let avgGovAttrCalcStat_ForSkill = character.avgGovAttrStatsCache.get(skillId);
        if (!avgGovAttrCalcStat_ForSkill) {
            const avgGoverningFormula: FormulaParameterFormula = (inputs) => {
                const inputValues = Object.values(inputs);
                if (inputValues.length === 0) return 0;
                const sum = inputValues.reduce((acc, val) => acc + (val || 0), 0);
                return sum / inputValues.length;
            };
            avgGovAttrCalcStat_ForSkill = Stats.createFormulaParameter(`${idPrefix}avg_gov_attr_${skillId}`, avgGoverningFormula, connections, {});
            
            if (skillDefinitionFromLib.governedBy && skillDefinitionFromLib.governedBy.length > 0) {
                for (const attrName of skillDefinitionFromLib.governedBy) {
                    let foundAttrStat: IndependentStat | undefined = undefined;
                    for (const charAttrKey in character.attributes) {
                        if (charAttrKey.endsWith(`__${attrName}`)) { 
                            foundAttrStat = character.attributes[charAttrKey];
                            break;
                        }
                    }
                    if (foundAttrStat) {
                        Stats.connectStat(foundAttrStat, avgGovAttrCalcStat_ForSkill, ConnectionType.NAMED_INPUT, connections, attrName);
                    } else {
                        console.warn(`Governing attribute ${attrName} not found on character ${character.characterId} for skill ${skillId}. It will not contribute to proficiency calculation if its value is 0.`);
                    }
                }
            }
            character.avgGovAttrStatsCache.set(skillId, avgGovAttrCalcStat_ForSkill);
        } else {
            // Ensure it recalculates if attributes might have changed before this skill was upserted
            // This is a bit of a catch-all; ideally, attribute changes directly propagate to their FormulaParameters.
            // However, if attributes are set before this skill's avgGovAttrCalcStat is first created and connected,
            // we might need to nudge it. For existing stats, NAMED_INPUT connections should update it.
            // If avgGovAttrCalcStat_ForSkill already exists, its connections to attributes should already be live.
        }

        // --- Skill Proficiency Calculation (now a Parameter) ---
        const skillProficiencyStatId = `${idPrefix}prof_${skillId}`;
        let skillProficiencyStat = character.proficiencies[skillId] as Parameter | undefined;

        if (skillProficiencyStat) {
            // Parameter exists, ensure its connections are correct if they could have changed (unlikely for this setup)
            // Its value will update automatically based on changes to skillStat and avgGovAttrCalcStat_ForSkill.
        } else {
            skillProficiencyStat = Stats.createParameter(skillProficiencyStatId, connections);
            character.proficiencies[skillId] = skillProficiencyStat;
        }

        // Initialize/ensure 'add' component is 1 for the (level + 1) part
        if (skillProficiencyStat.add !== 1) {
            const currentAdd = skillProficiencyStat.add;
            Stats.modifyParameterADD(skillProficiencyStat, 1 - currentAdd, connections); // Adjust to make .add = 1
        }
        
        // Connect skill level (IndependentStat) to proficiency (Parameter) with ADD
        Stats.connectStat(skillStat, skillProficiencyStat, ConnectionType.ADD, connections);

        // Connect average governing attributes (FormulaParameter) to proficiency (Parameter) with MULTY
        Stats.connectStat(avgGovAttrCalcStat_ForSkill, skillProficiencyStat as Parameter, ConnectionType.MULTY, connections);

        // The Parameter's value will be automatically recalculated by the connections
    }

    /**
     * Creates or updates a specialization and its proficiency for a character.
     */
    export function upsertSpecializationAndProficiency(
        character: Character,
        globalSpecId: string, // e.g., "melee_combat.one_handed_blades"
        level: number,
        baseSkillDefinitionFromLib: Skill, // Definition of the parent skill
        idPrefix: string,
        connections: Connections
    ): void {
        const specStatId = `${idPrefix}spec_${globalSpecId}`;
        let specStat = character.specializations[globalSpecId];

        if (specStat) {
            Stats.setIndependentStat(specStat, level, connections);
        } else {
            specStat = Stats.createStat(specStatId, level, connections);
            character.specializations[globalSpecId] = specStat;
        }

        const baseSkillId = baseSkillDefinitionFromLib.id;
        // const baseSkillStat = character.skills[baseSkillId]; // Not directly needed for proficiency connection anymore
        const parentSkillProficiencyStat = character.proficiencies[baseSkillId]; // This is a Parameter

        if (!parentSkillProficiencyStat) {
            console.warn(`upsertSpecializationAndProficiency: Parent skill proficiency stat for ${baseSkillId} not found on character ${character.characterId} when upserting spec ${globalSpecId}. Spec proficiency will be incorrect.`);
            // Optionally, could try to create/upsert parent skill proficiency here if truly missing,
            // but current flow assumes parent skill is processed first.
            return; 
        }

        // --- Specialization Proficiency Calculation (now a Parameter) ---
        const specProficiencyStatId = `${idPrefix}prof_${globalSpecId}`;
        let specProficiencyStat = character.proficiencies[globalSpecId] as Parameter | undefined;

        if (specProficiencyStat) {
            // Parameter exists, value will update automatically from connections.
        } else {
            specProficiencyStat = Stats.createParameter(specProficiencyStatId, connections);
            character.proficiencies[globalSpecId] = specProficiencyStat;
        }

        // Initialize/ensure 'add' component is 1 for the (spec_level + 1) part
        if (specProficiencyStat.add !== 1) {
            const currentAdd = specProficiencyStat.add;
            Stats.modifyParameterADD(specProficiencyStat, 1 - currentAdd, connections); // Adjust to make .add = 1
        }

        // Connect specialization level (IndependentStat) to its proficiency (Parameter) with ADD
        Stats.connectStat(specStat, specProficiencyStat, ConnectionType.ADD, connections);

        // Connect parent skill's proficiency (Parameter) to spec proficiency (Parameter) with MULTY
        Stats.connectStat(parentSkillProficiencyStat, specProficiencyStat, ConnectionType.MULTY, connections);

        // The Parameter's value will be automatically recalculated by the connections
    }

    /**
     * Sets or updates a specific skill and all its library-defined specializations to a given level.
     * This function will now also handle proficiency calculations via upsert methods.
     */
    export function setOrUpdateSkillAndAllSpecializations(
        character: Character,
        skillId: string,
        skillDefinitionFromLib: Skill,
        level: number,
        connections: Connections
    ): void {
        const idPrefix = `${CHARACTER_STAT_PREFIX}${character.characterId}__`;

        // Upsert the base skill and its proficiency
        upsertSkillAndProficiency(character, skillId, level, skillDefinitionFromLib, idPrefix, connections);

        // Upsert all library-defined specializations for this skill and their proficiencies
        if (skillDefinitionFromLib.specializations) {
            for (const globalSpecId of skillDefinitionFromLib.specializations) {
                // It's assumed that if we are setting/updating a skill and "all" its specializations,
                // we grant/update all specializations defined in the library for that skill to the same level.
                // If a specialization is not meant to be granted, it shouldn't be in skillDefinitionFromLib.specializations
                upsertSpecializationAndProficiency(character, globalSpecId, level, skillDefinitionFromLib, idPrefix, connections);
            }
        }
    }

    /**
     * Retrieves the proficiency value for a given skill or specialization ID.
     * If the proficiency stat doesn't exist, it attempts fallbacks:
     * - For specializations, tries the parent skill's proficiency.
     * - As a last resort, calculates average governing attributes directly (effectively proficiency at skill level 0).
     */
    export function getProficiency(
        character: Character,
        skillOrSpecId: string,
        gameState: GameState // To access lib for definitions
    ): number {
        const proficiencyStat = character.proficiencies[skillOrSpecId];
        if (proficiencyStat) {
            return Math.sqrt(proficiencyStat.value);
        }

        // Proficiency stat not found, try fallbacks
        const skillLib = gameState.lib.skills;
        const skillItem = skillLib.getAllSkillItems()[skillOrSpecId]; // Gets Skill or SkillSpecialization

        if (skillItem && skillItem.type === 'specialization') {
            const specDef = skillItem as import('./lib/definitions/SkillDefinition').SkillSpecialization;
            // Try to get parent skill's proficiency
            // The parentId on specDef is the skillId of the parent.
            if (specDef.parentId) {

                // The square root will be applied by the recursive call.
                return getProficiency(character, specDef.parentId, gameState);
            }
        }

        // Fallback for base skills, or if spec parent lookup failed, or if it's not a spec
        // Calculate average governing attributes directly. This implies (skill_level + 1) * (spec_level + 1) effectively becomes 1.
        let skillDefinitionForGovAttr: Skill | undefined;
        if (skillItem && skillItem.type === 'skill') {
            skillDefinitionForGovAttr = skillItem as Skill;
        } else if (skillItem && skillItem.type === 'specialization') {
            // If it's a spec, find its base skill def for governedBy
            const parentSkillDef = skillLib.getSkill((skillItem as import('./lib/definitions/SkillDefinition').SkillSpecialization).parentId);
            if (parentSkillDef) {
                skillDefinitionForGovAttr = parentSkillDef;
            }
        }
        
        if (skillDefinitionForGovAttr && skillDefinitionForGovAttr.governedBy && skillDefinitionForGovAttr.governedBy.length > 0) {
            let sumOfGovAttrs = 0;
            let countOfGovAttrs = 0;
            for (const attrName of skillDefinitionForGovAttr.governedBy) {
                let foundAttrStat: IndependentStat | undefined = undefined;
                for (const charAttrKey in character.attributes) {
                    if (charAttrKey.endsWith(`__${attrName}`)) {
                        foundAttrStat = character.attributes[charAttrKey];
                        break;
                    }
                }
                if (foundAttrStat) {
                    sumOfGovAttrs += foundAttrStat.value;
                    countOfGovAttrs++;
                }
            }
            if (countOfGovAttrs > 0) {
                const avgGovAttr = sumOfGovAttrs / countOfGovAttrs;
                return Math.sqrt(avgGovAttr); // This is sqrt(avg_gov_attr * (0+1) * (0+1))
            }
        }

        console.warn(`Proficiency for ${skillOrSpecId} not found, and no governing attributes defined or found for fallback calculation. Returning 0.`);
        return 0;
    }
}