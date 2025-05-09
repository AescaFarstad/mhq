import baseSkillsData from '../data/skills.ts';
import { AllKeywords } from '../data/skillKeywordsLoader.ts';
import { SkillsData, Skill, SkillSpecialization } from './definitions/SkillDefinition.ts';
import { SkillCategoryUIInfo, SkillUIInfo, SkillSpecializationUIInfo } from '../../types/uiTypes';
import { AttributeLib } from './AttributeLib';

/**
 * Augments skill data with keywords from a provided map **in place**.
 * WARNING: Modifies the input skills object directly.
 * @param skills - The SkillsData object to augment (will be modified).
 * @param keywordsMap - Map of displayName to keyword arrays (string[][]).
 * @returns The same SkillsData object reference, now augmented.
 */
function augmentSkillsWithKeywords(skills: SkillsData, keywordsMap: ReadonlyMap<string, string[][]>): SkillsData {
    // No clone - modify the input object directly
    for (const skillKey in skills) {
        const skill = skills[skillKey];

        // Augment the skill itself
        const skillKeywords = keywordsMap.get(skill.displayName);
        if (skillKeywords) {
            (skill as any).keywords = skillKeywords; // Modify in place (using 'as any' to bypass readonly if necessary, or adjust type)
        }

        // Augment specializations
        if (skill.specializations) {
            for (const specKey in skill.specializations) {
                const specialization = skill.specializations[specKey];
                const specKeywords = keywordsMap.get(specialization.displayName);
                if (specKeywords) {
                    (specialization as any).keywords = specKeywords; // Modify in place
                }
            }
        }
    }
    return skills; // Return the modified original object
}

/**
 * Creates a reverse lookup map from keywords to technical skill/specialization names.
 * @param augmentedSkills - The SkillsData object already augmented with keywords.
 * @returns A Map where keys are keywords and values are comma-separated technical names.
 */
function createKeywordLookup(augmentedSkills: SkillsData): Map<string, string> {
    const lookup = new Map<string, string[]>(); // Temp map: keyword -> string[]

    for (const skillKey in augmentedSkills) {
        const skill = augmentedSkills[skillKey];

        // Process skill keywords
        if (skill.keywords) {
            for (const keywordGroup of skill.keywords) {
                for (const keyword of keywordGroup) {
                    const lowerKeyword = keyword.toLowerCase(); // Normalize keyword
                    if (!lookup.has(lowerKeyword)) {
                        lookup.set(lowerKeyword, []);
                    }
                    // Avoid adding duplicate technical names for the same keyword within the same skill/spec
                    const currentList = lookup.get(lowerKeyword);
                    if (currentList && !currentList.includes(skillKey)) {
                         currentList.push(skillKey);
                    }
                   
                }
            }
        }

        // Process specialization keywords
        if (skill.specializations) {
            for (const specKey in skill.specializations) {
                const specialization = skill.specializations[specKey];
                const technicalName = `${skillKey}.${specKey}`; // Format: skillKey.specKey

                if (specialization.keywords) {
                    for (const keywordGroup of specialization.keywords) {
                        for (const keyword of keywordGroup) {
                             const lowerKeyword = keyword.toLowerCase(); // Normalize keyword
                             if (!lookup.has(lowerKeyword)) {
                                lookup.set(lowerKeyword, []);
                             }
                             // Avoid adding duplicate technical names
                              const currentList = lookup.get(lowerKeyword);
                              if (currentList && !currentList.includes(technicalName)) {
                                currentList.push(technicalName);
                             }
                        }
                    }
                }
            }
        }
    }

    // Convert the string[] to comma-separated string
    const finalLookup = new Map<string, string>();
    for (const [keyword, techNames] of lookup.entries()) {
        finalLookup.set(keyword, techNames.join(','));
    }

    return finalLookup;
}

/**
 * Library for managing skill data
 */
export class SkillLib {
  private _skills: SkillsData;
  private attributeLib: AttributeLib;
  private _keywordLookup: ReadonlyMap<string, string>;
  
  id: string = 'skills';
  name: string = 'Skills Library';
  description: string = 'Manages all skill data and provides access methods';

  constructor(attributeLib: AttributeLib) {
    this.attributeLib = attributeLib;

    // 1. Augment the base skills data IN PLACE with loaded keywords
    this._skills = augmentSkillsWithKeywords(baseSkillsData, AllKeywords);

    // 2. Create the reverse keyword lookup from the now-augmented base data
    this._keywordLookup = createKeywordLookup(this._skills);

    // Note: Since we modified baseSkillsData, freezing is not applicable 
    // unless we want to prevent further changes after SkillLib construction.
  }

  /**
   * Gets the skill data object, augmented with keywords.
   * WARNING: This is the originally imported object, now modified.
   */
  get skills(): SkillsData {
    return this._skills;
  }

  /**
   * Gets the map allowing lookup of technical skill/specialization names by keyword.
   * Keys are lowercase keywords.
   * Values are comma-separated technical names (e.g., "melee_combat,unarmed_combat.striking").
   */
  get keywordLookup(): ReadonlyMap<string, string> {
    return this._keywordLookup;
  }

  getSkill(skillId: string): Skill | undefined {
    return this._skills[skillId];
  }

  getAllSkills(): SkillsData {
    return this._skills;
  }

  getSkillsByAttribute(attribute: string): Record<string, Skill> {
    const result: Record<string, Skill> = {};
    Object.entries(this._skills).forEach(([id, skill]) => {
      if (skill.attribute === attribute) {
        result[id] = skill;
      }
    });
    return result;
  }

  /**
   * Gets all skills organized by their primary attribute (category)
   */
  getSkillCategories(): SkillCategoryUIInfo[] {
    const categories: SkillCategoryUIInfo[] = [];
    const attributeDefinitions = this.attributeLib.getAttributeDefinitions();
    
    // For each primary attribute from AttributeLib
    Object.entries(attributeDefinitions).forEach(([attributeKey, categoryDef]) => {
      const skillsInCategory = this.getSkillUIInfoByAttribute(attributeKey);
      
      if (skillsInCategory.length > 0) {
        categories.push({
          attribute: attributeKey,
          displayName: categoryDef.displayName,
          skills: skillsInCategory
        });
      }
    });
    
    return categories;
  }

  getSkillUIInfo(skillId: string): SkillUIInfo | undefined {
    const skill = this.getSkill(skillId);
    if (!skill) return undefined;

    return {
      id: skillId,
      displayName: skill.displayName,
      description: skill.description,
      attribute: skill.attribute,
      governedBy: skill.governedBy,
      assistedBy: skill.assistedBy,
      specializations: this.getSpecializationsUIInfo(skill.specializations)
    };
  }

  private getSkillUIInfoByAttribute(attribute: string): SkillUIInfo[] {
    const result: SkillUIInfo[] = [];
    
    Object.entries(this._skills).forEach(([id, skill]) => {
      if (skill.attribute === attribute) {
        result.push({
          id,
          displayName: skill.displayName,
          description: skill.description,
          attribute: skill.attribute,
          governedBy: skill.governedBy,
          assistedBy: skill.assistedBy,
          specializations: this.getSpecializationsUIInfo(skill.specializations)
        });
      }
    });
    
    return result;
  }

  private getSpecializationsUIInfo(
    specializations: Record<string, SkillSpecialization>
  ): SkillSpecializationUIInfo[] {
    return Object.entries(specializations).map(([id, spec]) => ({
      id,
      displayName: spec.displayName,
      description: spec.description
    }));
  }

  /**
   * Gets skills organized by primary attribute for a specific character
   * @param characterSkills Record mapping skill IDs to skill levels
   * @returns Array of skill categories with character-specific skill levels
   */
  getCharacterSkillCategories(characterSkills: Record<string, number> = {}): SkillCategoryUIInfo[] {
    const categories: SkillCategoryUIInfo[] = [];
    const attributeDefinitions = this.attributeLib.getAttributeDefinitions();
    
    // For each primary attribute from AttributeLib
    Object.entries(attributeDefinitions).forEach(([attributeKey, categoryDef]) => {
      const skillsInCategory = this.getCharacterSkillUIInfoByAttribute(attributeKey, characterSkills);
      
      if (skillsInCategory.length > 0) {
        categories.push({
          attribute: attributeKey,
          displayName: categoryDef.displayName,
          skills: skillsInCategory
        });
      }
    });
    
    return categories;
  }

  /**
   * Gets character-specific UI info for a skill with skill level
   * @param skillId The skill ID
   * @param characterSkills Record mapping skill IDs to skill levels
   * @returns SkillUIInfo with level information
   */
  getCharacterSkillUIInfo(skillId: string, characterSkills: Record<string, number> = {}): SkillUIInfo | undefined {
    const skill = this.getSkill(skillId);
    if (!skill) return undefined;

    const level = characterSkills[skillId] || 0;
    
    return {
      id: skillId,
      displayName: skill.displayName,
      description: skill.description,
      attribute: skill.attribute,
      governedBy: skill.governedBy,
      assistedBy: skill.assistedBy,
      specializations: this.getCharacterSpecializationsUIInfo(skill.specializations, characterSkills, skillId),
      level: level
    };
  }

  private getCharacterSkillUIInfoByAttribute(
    attribute: string, 
    characterSkills: Record<string, number>
  ): SkillUIInfo[] {
    const result: SkillUIInfo[] = [];
    
    Object.entries(this._skills).forEach(([id, skill]) => {
      if (skill.attribute === attribute) {
        const level = characterSkills[id] || 0;
        
        result.push({
          id,
          displayName: skill.displayName,
          description: skill.description,
          attribute: skill.attribute,
          governedBy: skill.governedBy,
          assistedBy: skill.assistedBy,
          specializations: this.getCharacterSpecializationsUIInfo(skill.specializations, characterSkills, id),
          level: level
        });
      }
    });
    
    return result;
  }

  private getCharacterSpecializationsUIInfo(
    specializations: Record<string, SkillSpecialization>,
    characterSkills: Record<string, number>,
    skillId: string
  ): SkillSpecializationUIInfo[] {
    return Object.entries(specializations).map(([specId, spec]) => {
      // Check for specialization-specific levels (format: skillId.specializationId)
      const specializationKey = `${skillId}.${specId}`;
      const level = characterSkills[specializationKey] || 0;
      
      return {
        id: specId,
        displayName: spec.displayName,
        description: spec.description,
        level: level
      };
    });
  }
}

// Export a singleton instance (common pattern for libraries)
// Removed singleton export as constructor requires AttributeLib instance
// export const skillLib = new SkillLib(); 