import { IndependentStat, Parameter, Connections, ConnectionType } from './core/Stat';
import { CharacterDefinition } from './lib/definitions/CharacterDefinition';
import { Stats } from './core/Stats';
import { CHARACTER_STAT_PREFIX } from './core/statPrefixes';

/**
 * Represents an active character instance in the game with dynamic stats.
 */
export interface Character {
    definition: CharacterDefinition;
    level: IndependentStat;
    baseUpkeep: IndependentStat;
    upkeep: Parameter;
    attributes: Record<string, IndependentStat>;
    skills: Record<string, IndependentStat>;
    specializations: Record<string, IndependentStat>;
}

// Helper type for skill definitions from the library
export type LibSkillDefinition = {
    specializations?: Record<string, any>; // Specs defined in the library
};

// Helper type for attribute definitions from the library
export type LibAttributeDefinitions = Record<string, {
    attributes: Record<string, any>; // Attributes within the category
}>;


export namespace CharacterOps {
    /**
     * Initializes the base stats (level, baseUpkeep, upkeep) for a character
     * and sets up their connections.
     */
    export function initializeBaseStats(
        character: Character,
        charDef: CharacterDefinition,
        idPrefix: string,
        connections: Connections
    ): void {
        character.level = Stats.createStat(`${idPrefix}level`, charDef.initialLevel, connections);
        character.baseUpkeep = Stats.createStat(`${idPrefix}base_upkeep`, charDef.baseUpkeep, connections);
        character.upkeep = Stats.createParameter(`${idPrefix}upkeep`, connections);

        Stats.connectStat(character.baseUpkeep, character.upkeep, ConnectionType.ADD, connections);
        Stats.connectStat(character.level, character.upkeep, ConnectionType.MULTY, connections);
    }

    /**
     * Adds initial attributes to the character based on their definition and library attribute definitions.
     */
    export function addInitialAttributes(
        character: Character,
        charDef: CharacterDefinition,
        attributeDefs: LibAttributeDefinitions,
        idPrefix: string,
        connections: Connections
    ): void {
        for (const categoryKey in attributeDefs) {
            if (Object.prototype.hasOwnProperty.call(attributeDefs, categoryKey)) {
                const categoryDef = attributeDefs[categoryKey];
                const primaryStatId = `${idPrefix}${categoryKey}`;
                const primaryInitialValue = charDef.initialAttributes?.[categoryKey] ?? 0;
                character.attributes[primaryStatId] = Stats.createStat(primaryStatId, primaryInitialValue, connections);

                if (categoryDef.attributes) {
                    for (const attributeKey in categoryDef.attributes) {
                        if (Object.prototype.hasOwnProperty.call(categoryDef.attributes, attributeKey)) {
                            const secondaryStatId = `${idPrefix}${attributeKey}`;
                            const initialValue = charDef.initialAttributes?.[attributeKey] ?? 0;
                            character.attributes[secondaryStatId] = Stats.createStat(secondaryStatId, initialValue, connections);
                        }
                    }
                }
            }
        }
    }

    /**
     * Adds an initial skill and its specified specializations to the character.
     */
    export function addInitialSkillWithSpecializations(
        character: Character,
        skillId: string,
        // Assuming charDef.initialSkills provides this structure:
        initialSkillData: { level: number; specializations?: Record<string, number> },
        skillDefinitionFromLib: LibSkillDefinition, // The skill definition from allSkillDefs
        idPrefix: string,
        connections: Connections
    ): void {
        const skillStatId = `${idPrefix}skill_${skillId}`;
        character.skills[skillId] = Stats.createStat(skillStatId, initialSkillData.level, connections);

        if (initialSkillData.specializations && skillDefinitionFromLib.specializations) {
            for (const specId in initialSkillData.specializations) {
                if (Object.prototype.hasOwnProperty.call(initialSkillData.specializations, specId) &&
                    skillDefinitionFromLib.specializations[specId]) { // Check spec exists in library definition
                    const specLevel = initialSkillData.specializations[specId];
                    const fullSpecId = `${skillId}.${specId}`;
                    const specStatId = `${idPrefix}spec_${fullSpecId}`;
                    character.specializations[fullSpecId] = Stats.createStat(specStatId, specLevel, connections);
                }
            }
        }
    }

    /**
     * Sets or updates a specific skill and all its library-defined specializations to a given level.
     */
    export function setOrUpdateSkillAndAllSpecializations(
        character: Character,
        skillId: string,
        skillDefinitionFromLib: LibSkillDefinition,
        level: number,
        connections: Connections
    ): void {
        const idPrefix = `${CHARACTER_STAT_PREFIX}${character.definition.id}__`;
        let skillStat = character.skills[skillId];
        if (skillStat) {
            Stats.setIndependentStat(skillStat, level, connections);
        } else {
            const skillStatId = `${idPrefix}skill_${skillId}`;
            skillStat = Stats.createStat(skillStatId, level, connections);
            character.skills[skillId] = skillStat;
        }

        if (skillDefinitionFromLib.specializations) {
            for (const specId in skillDefinitionFromLib.specializations) {
                if (Object.prototype.hasOwnProperty.call(skillDefinitionFromLib.specializations, specId)) {
                    const fullSpecId = `${skillId}.${specId}`;
                    let specStat = character.specializations[fullSpecId];
                    if (specStat) {
                        Stats.setIndependentStat(specStat, level, connections);
                    } else {
                        const specStatId = `${idPrefix}spec_${fullSpecId}`;
                        specStat = Stats.createStat(specStatId, level, connections);
                        character.specializations[fullSpecId] = specStat;
                    }
                }
            }
        }
    }
}