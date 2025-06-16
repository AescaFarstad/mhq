import baseSkillsData from '../data/skills';
import { AllKeywords } from '../data/skillKeywordsLoader';
/**
 * Augments skill data with keywords from a provided map **in place**.
 * WARNING: Modifies the input skills object directly.
 * @param items - The SkillsData object to augment (will be modified).
 * @param keywordsMap - Map of displayName to keyword arrays (string[][]).
 * @returns The same SkillsData object reference, now augmented.
 */
function augmentSkillsWithKeywords(items, keywordsMap) {
    // No clone - modify the input object directly
    for (const itemId in items) {
        const item = items[itemId];
        // Augment the skill or specialization itself
        const itemKeywords = keywordsMap.get(item.displayName);
        if (itemKeywords) {
            item.keywords = itemKeywords; // Modify in place
        }
    }
    return items; // Return the modified original object
}
/**
 * Library for managing skill data
 */
export class SkillLib {
    _skills;
    attributeLib;
    id = 'skills';
    name = 'Skills Library';
    description = 'Manages all skill data and provides access methods';
    constructor(attributeLib) {
        this.attributeLib = attributeLib;
        this._skills = {}; // Initialize as empty
        // 1. Transform baseSkillsData to the new flat structure and establish links
        for (const skillKey in baseSkillsData) {
            const baseSkill = baseSkillsData[skillKey]; // Cast to any to access old structure
            const skillId = skillKey; // Assuming skillKey is the intended unique ID for the skill
            const newSkill = {
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
                    const newSpec = {
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
    }
    /**
     * Gets the skill data object (flat map of SkillItems), augmented with keywords.
     */
    get items() {
        return this._skills;
    }
    getSkill(skillId) {
        const item = this._skills[skillId];
        if (item && item.type === 'skill') {
            return item;
        }
        return undefined;
    }
    getSpecialization(specId) {
        const item = this._skills[specId];
        if (item && item.type === 'specialization') {
            return item;
        }
        return undefined;
    }
    getAllSkillItems() {
        return this._skills;
    }
    getAllSkills() {
        const result = {};
        Object.values(this._skills).forEach(item => {
            if (item.type === 'skill') {
                result[item.id] = item;
            }
        });
        return result;
    }
    getSkillsByAttribute(attribute) {
        const result = {};
        Object.values(this._skills).forEach(item => {
            if (item.type === 'skill' && item.attribute === attribute) {
                result[item.id] = item;
            }
        });
        return result;
    }
    /**
     * Gets all skills organized by their primary attribute (category)
     */
    getSkillCategories() {
        const categories = [];
        const attributeDefinitions = this.attributeLib.getAttributeDefinitions();
        Object.entries(attributeDefinitions).forEach(([attributeKey, categoryDef]) => {
            const skillsInThisCategory = this.getSkillsByAttribute(attributeKey);
            // Note: This method creates categories for library browsing, not character-specific data
            // The SkillUIInfo objects here would need actual character stats to be properly populated
            // This is likely used for display purposes where skills don't have character-specific data yet
            const skillUiInfos = []; // Empty for now since we need actual character stats
            if (Object.keys(skillsInThisCategory).length > 0) {
                categories.push({
                    attribute: attributeKey,
                    displayName: categoryDef.displayName,
                    skills: skillUiInfos, // Empty since this is for library browsing
                });
            }
        });
        return categories;
    }
}
// Export a singleton instance (common pattern for libraries)
// Removed singleton export as constructor requires AttributeLib instance
// export const skillLib = new SkillLib(); 
