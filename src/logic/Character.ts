import { IndependentStat, Parameter, Connections, ConnectionType, FormulaParameter, FormulaParameterFormula, FormulaStat, StatFormula, GateParameter } from './core/Stat';
import { Stats } from './core/Stats';
import { CHARACTER_STAT_PREFIX } from './core/statPrefixes';
import type { GameState } from './GameState';
import { C } from './lib/C';
import * as UIStateManager from './UIStateManager';
import type { Skill } from './lib/definitions/SkillDefinition';

export interface Character {
    characterId: string;
    name: string;
    level: FormulaStat;
    gatedXp: GateParameter;
    lastAwardedLevel: IndependentStat;
    xp: IndependentStat;
    nextLevelXp: FormulaStat;
    nextLevelXpDelta: FormulaStat;
    baseUpkeep: IndependentStat;
    upkeep: Parameter;
    attributes: Record<string, IndependentStat>;
    attributePoints: IndependentStat;
    skillPoints: IndependentStat;
    specPoints: IndependentStat;
    skillPointsByAttribute: Record<string, IndependentStat>;
    skills: Record<string, IndependentStat>;
    specializations: Record<string, IndependentStat>;
    proficienciesRaw: Record<string, Parameter>;
    proficiencies: Record<string, FormulaStat>;
    avgGovAttrStatsCache: Map<string, FormulaParameter>;
}

// Helper type for attribute definitions from the library
export type LibAttributeDefinitions = Record<string, {
    attributes: Record<string, any>; // Attributes within the category
}>;

/**
 * Calculates the total XP required to reach a specific level.
 * Level 1 requires 0 XP (starting level)
 * Level 2 requires BASE_LEVEL_XP XP
 * Level 3 requires BASE_LEVEL_XP + (BASE_LEVEL_XP * XP_EXPONENT) XP
 * etc.
 * XP deltas are rounded to two most significant digits.
 */
function calculateTotalXpForLevel(level: number): number {
    if (level <= 1) return 0;
    
    let totalXp = 0;
    let currentLevelDelta = C.BASE_LEVEL_XP;
    
    for (let i = 2; i <= level; i++) {
        totalXp += currentLevelDelta;
        currentLevelDelta = roundToTwoSignificantDigits(currentLevelDelta * C.XP_EXPONENT);
    }
    
    return totalXp;
}

/**
 * Rounds a number to two most significant digits.
 * Examples: 1210 → 1200, 1331 → 1300, 1464 → 1500
 */
function roundToTwoSignificantDigits(num: number): number {
    if (num === 0) return 0;
    
    const magnitude = Math.floor(Math.log10(Math.abs(num)));
    const divisor = Math.pow(10, magnitude - 1);
    
    return Math.round(num / divisor) * divisor;
}

/**
 * Calculates the XP delta needed to reach a specific level from the previous level.
 * Level 2: BASE_LEVEL_XP (1000 XP to go from level 1 to 2)
 * Level 3: BASE_LEVEL_XP * XP_EXPONENT (1100 XP to go from level 2 to 3)
 * etc.
 * Results are rounded to two most significant digits.
 */
function calculateXpDeltaForLevel(level: number): number {
    if (level <= 1) return 0; // No XP needed to reach level 1
    if (level === 2) return C.BASE_LEVEL_XP; // 1000 XP to reach level 2
    
    let delta = C.BASE_LEVEL_XP;
    for (let i = 3; i <= level; i++) {
        delta = roundToTwoSignificantDigits(delta * C.XP_EXPONENT);
    }
    
    return delta;
}

/**
 * Calculates what level should be awarded based on current XP.
 * Uses the same two significant digit rounding as the XP calculations.
 */
function calculateLevelFromXp(currentXp: number): number {
    if (currentXp < 0) return 1;
    
    let level = 1;
    let xpNeeded = 0;
    let currentDelta = C.BASE_LEVEL_XP;
    
    while (currentXp >= xpNeeded + currentDelta) {
        xpNeeded += currentDelta;
        level++;
        currentDelta = roundToTwoSignificantDigits(currentDelta * C.XP_EXPONENT);
    }
    
    return level;
}

export namespace Character {
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

        // Define formulas for next level calculations
        const nextLevelXpFormula: StatFormula = (currentLevel: number) => {
            return calculateTotalXpForLevel(currentLevel + 1);
        };
        
        const nextLevelXpDeltaFormula: StatFormula = (currentLevel: number) => {
            return calculateXpDeltaForLevel(currentLevel + 1);
        };

        const newChar: Character = {
            characterId: charDef.id,
            name: charDef.name,
            level: Stats.createFormulaStat(`${idPrefix}level`, calculateLevelFromXp, gameState.connections),
            gatedXp: Stats.createGateParameter(`${idPrefix}gatedXp`, 0, true, gameState.connections),
            lastAwardedLevel: Stats.createStat(`${idPrefix}lastAwardedLevel`, charDef.initialLevel || 1, gameState.connections),
            xp: Stats.createStat(`${idPrefix}xp`, 0, gameState.connections),
            nextLevelXp: Stats.createFormulaStat(`${idPrefix}nextLevelXp`, nextLevelXpFormula, gameState.connections),
            nextLevelXpDelta: Stats.createFormulaStat(`${idPrefix}nextLevelXpDelta`, nextLevelXpDeltaFormula, gameState.connections),
            baseUpkeep: Stats.createStat(`${idPrefix}base_upkeep`, charDef.baseUpkeep, gameState.connections),
            upkeep: Stats.createParameter(`${idPrefix}upkeep`, gameState.connections),
            attributes: {},
            attributePoints: Stats.createStat(`${idPrefix}attributePoints`, 0, gameState.connections),
            skillPoints: Stats.createStat(`${idPrefix}skillPoints`, 0, gameState.connections),
            specPoints: Stats.createStat(`${idPrefix}specPoints`, 0, gameState.connections),
            skillPointsByAttribute: {},
            skills: {},
            specializations: {},
            proficienciesRaw: {},
            proficiencies: {},
            avgGovAttrStatsCache: new Map<string, FormulaParameter>()
        };

        Stats.connectStat(newChar.baseUpkeep, newChar.upkeep, ConnectionType.ADD, gameState.connections);
        Stats.connectStat(newChar.level, newChar.upkeep, ConnectionType.MULTY, gameState.connections);
        
        // Connect XP to gatedXp, nextLevelXp as threshold
        Stats.connectStat(newChar.xp, newChar.gatedXp, ConnectionType.GATE_VALUE, gameState.connections);
        Stats.connectStat(newChar.nextLevelXp, newChar.gatedXp, ConnectionType.GATE_THRESHOLD, gameState.connections);
        
        // Connect gatedXp to level calculation 
        Stats.connectStat(newChar.gatedXp, newChar.level, ConnectionType.FORMULA, gameState.connections);
        
        // Connect level to XP calculation stats (these calculate next level requirements)
        Stats.connectStat(newChar.level, newChar.nextLevelXp, ConnectionType.FORMULA, gameState.connections);
        Stats.connectStat(newChar.level, newChar.nextLevelXpDelta, ConnectionType.FORMULA, gameState.connections);

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

        // Initialize skillPointsByAttribute for each primary attribute
        for (const categoryKey in attributeDefs) {
            if (Object.prototype.hasOwnProperty.call(attributeDefs, categoryKey)) {
                const skillPointsStatId = `${idPrefix}skillPointsByAttribute_${categoryKey}`;
                newChar.skillPointsByAttribute[categoryKey] = Stats.createStat(skillPointsStatId, 0, gameState.connections);
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
                console.error(`Character.addCharacter: ${newChar.name} - Error processing triggerOnCreated events:`, error);
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
            for (const specId of skillDefinitionFromLib.specializations) {
                // Since all IDs are globally unique, check if this specialization ID exists in initial data
                if (Object.prototype.hasOwnProperty.call(initialSkillData.specializations, specId)) {
                    const specLevel = initialSkillData.specializations[specId];
                    upsertSpecializationAndProficiency(character, specId, specLevel, skillDefinitionFromLib, idPrefix, connections);
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
        let isNewSkill = false;

        if (skillStat) {
            Stats.setIndependentStat(skillStat, level, connections);
        } else {
            skillStat = Stats.createStat(skillStatId, level, connections);
            character.skills[skillId] = skillStat;
            isNewSkill = true;
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

        // --- Skill Proficiency Calculation (raw Parameter) ---
        const skillProficiencyRawStatId = `${idPrefix}prof_raw_${skillId}`;
        let skillProficiencyRawStat = character.proficienciesRaw[skillId];
        let isNewProficiencyRaw = false;

        if (skillProficiencyRawStat) {
            // Parameter exists, ensure its connections are correct if they could have changed (unlikely for this setup)
            // Its value will update automatically based on changes to skillStat and avgGovAttrCalcStat_ForSkill.
        } else {
            skillProficiencyRawStat = Stats.createParameter(skillProficiencyRawStatId, connections);
            character.proficienciesRaw[skillId] = skillProficiencyRawStat;
            isNewProficiencyRaw = true;
        }

        // Initialize/ensure 'add' component is 1 for the (level + 1) part
        if (skillProficiencyRawStat.add !== 1) {
            const currentAdd = skillProficiencyRawStat.add;
            Stats.modifyParameterADD(skillProficiencyRawStat, 1 - currentAdd, connections); // Adjust to make .add = 1
        }
        
        // Only establish connections when creating new stats to avoid duplicates
        if (isNewSkill || isNewProficiencyRaw) {
            // Connect skill level (IndependentStat) to raw proficiency (Parameter) with ADD
            Stats.connectStat(skillStat, skillProficiencyRawStat, ConnectionType.ADD, connections);

            // Connect average governing attributes (FormulaParameter) to raw proficiency (Parameter) with MULTY
            Stats.connectStat(avgGovAttrCalcStat_ForSkill, skillProficiencyRawStat, ConnectionType.MULTY, connections);
        }

        // --- Skill Proficiency (sqrt of raw) ---
        const skillProficiencyStatId = `${idPrefix}prof_${skillId}`;
        let skillProficiencyStat = character.proficiencies[skillId];

        if (!skillProficiencyStat) {
            skillProficiencyStat = Stats.createFormulaStat(skillProficiencyStatId,  Math.sqrt, connections);
            character.proficiencies[skillId] = skillProficiencyStat;

            // Connect raw proficiency to final proficiency
            Stats.connectStat(skillProficiencyRawStat, skillProficiencyStat, ConnectionType.FORMULA, connections);
        }

        // The Parameter's value will be automatically recalculated by the connections
    }

    /**
     * Creates or updates a specialization and its proficiency for a character.
     */
    export function upsertSpecializationAndProficiency(
        character: Character,
        specId: string, // Globally unique specialization ID
        level: number,
        baseSkillDefinitionFromLib: Skill, // Definition of the parent skill
        idPrefix: string,
        connections: Connections
    ): void {
        const specStatId = `${idPrefix}spec_${specId}`;
        let specStat = character.specializations[specId];
        let isNewSpec = false;

        if (specStat) {
            Stats.setIndependentStat(specStat, level, connections);
        } else {
            specStat = Stats.createStat(specStatId, level, connections);
            character.specializations[specId] = specStat;
            isNewSpec = true;
        }

        const baseSkillId = baseSkillDefinitionFromLib.id;
        // const baseSkillStat = character.skills[baseSkillId]; // Not directly needed for proficiency connection anymore
        const parentSkillProficiencyRawStat = character.proficienciesRaw[baseSkillId]; // This is a Parameter

        if (!parentSkillProficiencyRawStat) {
            console.warn(`upsertSpecializationAndProficiency: Parent skill raw proficiency stat for ${baseSkillId} not found on character ${character.characterId} when upserting spec ${specId}. Spec proficiency will be incorrect.`);
            // Optionally, could try to create/upsert parent skill proficiency here if truly missing,
            // but current flow assumes parent skill is processed first.
            return; 
        }

        // --- Specialization Raw Proficiency Calculation (Parameter) ---
        const specProficiencyRawStatId = `${idPrefix}prof_raw_${specId}`;
        let specProficiencyRawStat = character.proficienciesRaw[specId];
        let isNewSpecProficiencyRaw = false;

        if (specProficiencyRawStat) {
            // Parameter exists, value will update automatically from connections.
        } else {
            specProficiencyRawStat = Stats.createParameter(specProficiencyRawStatId, connections);
            character.proficienciesRaw[specId] = specProficiencyRawStat;
            isNewSpecProficiencyRaw = true;
        }

        // Initialize/ensure 'add' component is 1 for the (spec_level + 1) part
        if (specProficiencyRawStat.add !== 1) {
            const currentAdd = specProficiencyRawStat.add;
            Stats.modifyParameterADD(specProficiencyRawStat, 1 - currentAdd, connections); // Adjust to make .add = 1
        }

        // Only establish connections when creating new stats to avoid duplicates
        if (isNewSpec || isNewSpecProficiencyRaw) {
            // Connect specialization level (IndependentStat) to its raw proficiency (Parameter) with ADD
            Stats.connectStat(specStat, specProficiencyRawStat, ConnectionType.ADD, connections);

            // Connect parent skill's raw proficiency (Parameter) to spec raw proficiency (Parameter) with MULTY
            Stats.connectStat(parentSkillProficiencyRawStat, specProficiencyRawStat, ConnectionType.MULTY, connections);
        }

        // --- Specialization Proficiency (sqrt of raw) ---
        const specProficiencyStatId = `${idPrefix}prof_${specId}`;
        let specProficiencyStat = character.proficiencies[specId];

        if (!specProficiencyStat) {
            specProficiencyStat = Stats.createFormulaStat(specProficiencyStatId,  Math.sqrt, connections);
            character.proficiencies[specId] = specProficiencyStat;

            // Connect raw proficiency to final proficiency
            Stats.connectStat(specProficiencyRawStat, specProficiencyStat, ConnectionType.FORMULA, connections);
        }

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
            for (const specId of skillDefinitionFromLib.specializations) {
                // It's assumed that if we are setting/updating a skill and "all" its specializations,
                // we grant/update all specializations defined in the library for that skill to the same level.
                // If a specialization is not meant to be granted, it shouldn't be in skillDefinitionFromLib.specializations
                upsertSpecializationAndProficiency(character, specId, level, skillDefinitionFromLib, idPrefix, connections);
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
            return proficiencyStat.value; // No more sqrt here, it's built into the proficiency
        }

        // Proficiency stat not found, try fallbacks
        const skillLib = gameState.lib.skills;
        const skillItem = skillLib.getAllSkillItems()[skillOrSpecId]; // Gets Skill or SkillSpecialization

        if (skillItem && skillItem.type === 'specialization') {
            const specDef = skillItem as import('./lib/definitions/SkillDefinition').SkillSpecialization;
            // Try to get parent skill's proficiency
            // The parentId on specDef is the skillId of the parent.
            if (specDef.parentId) {
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



/**
 * XP and Leveling System
 * =====================
 * 
 * The character XP and leveling system works as follows:
 * 
 * - Characters start at level 1 with 0 XP
 * - Base XP requirement for level 2 is 1000 XP
 * - Each subsequent level requires XP_EXPONENT (1.1) times more XP than the previous level's delta
 * - XP requirements are rounded to integers
 * 
 * Example progression:
 * - Level 1: 0 XP (starting level)
 * - Level 2: 1000 XP total (1000 XP delta)
 * - Level 3: 2100 XP total (1100 XP delta) 
 * - Level 4: 3310 XP total (1210 XP delta)
 * 
 * Stats involved:
 * - xp: IndependentStat - current total XP earned
 * - level: FormulaStat - true character level calculated automatically from XP
 * - lastAwardedLevel: IndependentStat - level for which level-up events have occurred (manual)
 * - nextLevelXp: FormulaStat - total XP needed to reach the next level (calculated)
 * - nextLevelXpDelta: FormulaStat - XP needed just for the next level increment (calculated)
 * 
 * The level, nextLevelXp and nextLevelXpDelta are automatically recalculated when XP changes
 * via the Stat system's FORMULA connections.
 * 
 * The difference between level and lastAwardedLevel indicates pending level-ups.
 */
