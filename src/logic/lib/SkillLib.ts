import baseSkillsData from '../data/skills.ts';
import { AllKeywords } from '../data/skillKeywordsLoader.ts';
import { SkillsData, Skill, SkillSpecialization } from './definitions/SkillDefinition.ts';
import { SkillCategoryUIInfo, SkillUIInfo, SkillSpecializationUIInfo } from '../../types/uiTypes';
import { AttributeLib } from './AttributeLib';

/**
 * Augments skill data with keywords from a provided map **in place**.
 * WARNING: Modifies the input skills object directly.
 * @param items - The SkillsData object to augment (will be modified).
 * @param keywordsMap - Map of displayName to keyword arrays (string[][]).
 * @returns The same SkillsData object reference, now augmented.
 */
function augmentSkillsWithKeywords(items: SkillsData, keywordsMap: ReadonlyMap<string, string[][]>): SkillsData {
    // No clone - modify the input object directly
    for (const itemId in items) {
        const item = items[itemId];

        // Augment the skill or specialization itself
        const itemKeywords = keywordsMap.get(item.displayName);
        if (itemKeywords) {
            (item as any).keywords = itemKeywords; // Modify in place
        }
    }
    return items; // Return the modified original object
}

/**
 * Creates a reverse lookup map from keywords to technical skill/specialization names.
 * @param augmentedItems - The SkillsData object already augmented with keywords.
 * @returns A Map where keys are keywords and values are comma-separated technical names.
 */
function createKeywordLookup(augmentedItems: SkillsData): Map<string, string> {
    const lookup = new Map<string, string[]>(); // Temp map: keyword -> string[]

    for (const itemId in augmentedItems) {
        const item = augmentedItems[itemId];

        if (item.keywords) {
            for (const keywordGroup of item.keywords) {
                for (const keyword of keywordGroup) {
                    const lowerKeyword = keyword.toLowerCase(); // Normalize keyword
                    if (!lookup.has(lowerKeyword)) {
                        lookup.set(lowerKeyword, []);
                    }
                    const currentList = lookup.get(lowerKeyword);
                    // Use item.id directly as it's globally unique
                    if (currentList && !currentList.includes(item.id)) {
                         currentList.push(item.id);
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
    this._skills = {}; // Initialize as empty

    // 1. Transform baseSkillsData to the new flat structure and establish links
    for (const skillKey in baseSkillsData) {
        const baseSkill = (baseSkillsData as any)[skillKey]; // Cast to any to access old structure
        const skillId = skillKey; // Assuming skillKey is the intended unique ID for the skill

        const newSkill: Skill = {
            type: 'skill',
            id: skillId,
            displayName: baseSkill.displayName,
            description: baseSkill.description,
            attribute: baseSkill.attribute,
            governedBy: baseSkill.governedBy,
            assistedBy: baseSkill.assistedBy,
            keywords: baseSkill.keywords, // Keywords will be augmented later
            specializations: [] // Initialize, will be populated below
        };
        this._skills[skillId] = newSkill;

        if (baseSkill.specializations) {
            for (const specKey in baseSkill.specializations) { // specKey (e.g., "runes") IS the unique ID
                const baseSpecData = baseSkill.specializations[specKey];
                
                const uniqueSpecId = specKey; // Use specKey as the globally unique ID

                const newSpec: SkillSpecialization = {
                    type: 'specialization',
                    id: uniqueSpecId, // Assign the unique specKey as the ID
                    parentId: skillId, // skillId is the parent's unique ID
                    displayName: baseSpecData.displayName,
                    description: baseSpecData.description,
                    keywords: baseSpecData.keywords 
                };
                this._skills[uniqueSpecId] = newSpec; // Store the specialization by its unique simple ID
                newSkill.specializations.push(uniqueSpecId); // Parent skill's list stores this unique simple ID
            }
        }
    }

    // 2. Augment the transformed skills data IN PLACE with loaded keywords
    this._skills = augmentSkillsWithKeywords(this._skills, AllKeywords);

    // 3. Create the reverse keyword lookup from the now-augmented data
    this._keywordLookup = createKeywordLookup(this._skills);
  }

  /**
   * Gets the skill data object (flat map of SkillItems), augmented with keywords.
   */
  get items(): SkillsData {
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
    const item = this._skills[skillId];
    if (item && item.type === 'skill') {
        return item as Skill;
    }
    return undefined;
  }

  getSpecialization(specId: string): SkillSpecialization | undefined {
    const item = this._skills[specId];
    if (item && item.type === 'specialization') {
        return item as SkillSpecialization;
    }
    return undefined;
  }

  getAllSkillItems(): SkillsData {
    return this._skills;
  }

  getAllSkills(): Record<string, Skill> {
    const result: Record<string, Skill> = {};
    Object.values(this._skills).forEach(item => {
      if (item.type === 'skill') {
        result[item.id] = item as Skill;
      }
    });
    return result;
  }

  getSkillsByAttribute(attribute: string): Record<string, Skill> {
    const result: Record<string, Skill> = {};
    Object.values(this._skills).forEach(item => {
      if (item.type === 'skill' && (item as Skill).attribute === attribute) {
        result[item.id] = item as Skill;
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

    Object.entries(attributeDefinitions).forEach(([attributeKey, categoryDef]) => {
      const skillsInThisCategory = this.getSkillsByAttribute(attributeKey);
      const skillUiInfos: SkillUIInfo[] = Object.values(skillsInThisCategory).map(skill => {
        const specializationsUiInfo: SkillSpecializationUIInfo[] = skill.specializations.map(specId => {
          const spec = this.getSpecialization(specId);
          return {
            id: spec ? spec.id : specId,
            displayName: spec ? spec.displayName : 'Unknown Spec',
            description: spec ? spec.description : '',
            level: 0, 
            proficiency: 0 
          };
        });

        return {
          id: skill.id,
          displayName: skill.displayName,
          description: skill.description,
          attribute: skill.attribute,
          governedBy: skill.governedBy,
          assistedBy: skill.assistedBy,
          specializations: specializationsUiInfo,
          level: 0, 
          proficiency: 0 
        };
      });

      if (skillUiInfos.length > 0) {
        categories.push({
          attribute: attributeKey,
          displayName: categoryDef.displayName,
          skills: skillUiInfos
        });
      }
    });

    return categories;
  }

  // All legacy UI functions below are removed.
}

// Export a singleton instance (common pattern for libraries)
// Removed singleton export as constructor requires AttributeLib instance
// export const skillLib = new SkillLib(); 