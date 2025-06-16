import { C } from './C';
/**
 * Central library for all discoverable items in the game.
 * Aggregates data from SkillLib, AttributeLib, BuildingLib and creates efficient lookup indexes.
 */
export class DiscoveryLib {
    _byId = new Map();
    _bySearchableName = new Map();
    _keywordLookup = new Map();
    id = 'discovery';
    name = 'Discovery Library';
    description = 'Central repository for all discoverable game items';
    constructor(skillLib, attributeLib, buildingLib) {
        this.aggregateDiscoverableItems(skillLib, attributeLib, buildingLib);
        this.createKeywordLookup();
        this.verifyNameWordCounts();
        this.verifyKeywordUniqueness();
    }
    /**
     * Gets a discoverable item by its ID
     */
    getById(id) {
        return this._byId.get(id);
    }
    /**
     * Gets a discoverable item by its searchable name
     */
    getBySearchableName(searchableName) {
        return this._bySearchableName.get(searchableName);
    }
    /**
     * Gets all discoverable items
     */
    getAllItems() {
        return this._byId;
    }
    /**
     * Gets the lookup index by searchable name
     */
    getSearchableNameIndex() {
        return this._bySearchableName;
    }
    /**
     * Gets item IDs that relate to a given keyword
     * @param keyword - The keyword to look up (will be normalized to lowercase)
     * @returns Array of item IDs that have this keyword, or empty array if none
     */
    getItemIdsByKeyword(keyword) {
        return this._keywordLookup.get(keyword.toLowerCase()) || [];
    }
    /**
     * Gets the complete keyword lookup map
     * Keys are lowercase keywords, values are arrays of item IDs
     */
    getKeywordLookup() {
        return this._keywordLookup;
    }
    /**
     * Aggregates discoverable items from all source libraries
     */
    aggregateDiscoverableItems(skillLib, attributeLib, buildingLib) {
        // Clear existing data
        this._byId.clear();
        this._bySearchableName.clear();
        // Aggregate skills and specializations
        this.aggregateSkills(skillLib);
        // Aggregate attributes
        this.aggregateAttributes(attributeLib);
        // Aggregate buildings
        this.aggregateBuildings(buildingLib);
        // Add static discoverable items (tabs, resources, etc.)
        this.aggregateStaticItems();
    }
    /**
     * Aggregates skills and specializations from SkillLib
     */
    aggregateSkills(skillLib) {
        const allSkills = skillLib.getAllSkillItems();
        for (const [skillId, skillItem] of Object.entries(allSkills)) {
            if (skillItem.type === 'skill') {
                const skill = skillItem; // Cast to access properties
                const discoverableSkill = {
                    id: skillId,
                    type: 'skill',
                    originalItem: skill,
                    searchableName: this.createSearchableName(skill.displayName),
                    keywords: skill.keywords || []
                };
                this.addDiscoverableItem(discoverableSkill);
            }
            else if (skillItem.type === 'specialization') {
                const specialization = skillItem; // Cast to access properties
                const discoverableSpecialization = {
                    id: skillId,
                    type: 'skill_specialization',
                    originalItem: specialization,
                    searchableName: this.createSearchableName(specialization.displayName),
                    keywords: specialization.keywords || []
                };
                this.addDiscoverableItem(discoverableSpecialization);
            }
        }
    }
    /**
     * Aggregates attributes from AttributeLib
     */
    aggregateAttributes(attributeLib) {
        const attributeDefs = attributeLib.getAttributeDefinitions();
        for (const [categoryKey, categoryDef] of Object.entries(attributeDefs)) {
            // Add the attribute category itself
            const discoverableCategory = {
                id: categoryKey,
                type: 'attribute_category',
                originalItem: categoryDef,
                searchableName: this.createSearchableName(categoryDef.displayName)
            };
            this.addDiscoverableItem(discoverableCategory);
            // Add individual attributes within the category
            if (categoryDef.attributes) {
                for (const [attributeKey, attributeDef] of Object.entries(categoryDef.attributes)) {
                    const fullAttributeId = `${categoryKey}.${attributeKey}`;
                    const discoverableAttribute = {
                        id: fullAttributeId,
                        type: 'attribute',
                        originalItem: attributeDef,
                        searchableName: this.createSearchableName(attributeDef.displayName)
                    };
                    this.addDiscoverableItem(discoverableAttribute);
                }
            }
        }
    }
    /**
     * Aggregates buildings from BuildingLib
     */
    aggregateBuildings(buildingLib) {
        for (const buildingDef of buildingLib.values()) {
            const discoverableBuilding = {
                id: buildingDef.id,
                type: 'building',
                originalItem: buildingDef,
                searchableName: this.createSearchableName(buildingDef.name)
            };
            this.addDiscoverableItem(discoverableBuilding);
        }
    }
    /**
     * Aggregates static discoverable items like tabs and resources
     */
    aggregateStaticItems() {
        // Tab items - these are the main UI tabs
        const tabs = C.ALL_TAB_IDS.map(tabId => ({
            id: tabId,
            displayName: tabId,
            description: `${tabId} management and overview`
        }));
        for (const tab of tabs) {
            const discoverableTab = {
                id: tab.id,
                type: 'tab',
                originalItem: tab,
                searchableName: this.createSearchableName(tab.displayName)
            };
            this.addDiscoverableItem(discoverableTab);
        }
        // Resource items - basic game resources
        const resources = [
            { id: 'gold', displayName: 'Gold', description: 'Primary currency' },
            { id: 'clutter', displayName: 'Clutter', description: 'Mess and disorder in the castle' }
        ];
        for (const resource of resources) {
            const discoverableResource = {
                id: resource.id,
                type: 'resource',
                originalItem: resource,
                searchableName: this.createSearchableName(resource.displayName)
            };
            this.addDiscoverableItem(discoverableResource);
        }
    }
    /**
     * Adds a discoverable item to both indexes
     */
    addDiscoverableItem(item) {
        this._byId.set(item.id, item);
        this._bySearchableName.set(item.searchableName, item);
    }
    /**
     * Creates a searchable name from a display name by cleaning and normalizing it
     */
    createSearchableName(displayName) {
        return displayName
            .replace(/ and /g, ' ') // Replace ' and ' with single space
            .replace(/&/g, '') // Remove ampersands 
            .replace(/-/g, ' ') // Replace hyphens with spaces
            .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
            .trim()
            .toLowerCase();
    }
    /**
     * Verifies that no discoverable item name consists of more than 3 words (after removing '&')
     * This is a startup verification as specified in the plan
     */
    verifyNameWordCounts() {
        const errors = [];
        for (const [id, item] of this._byId) {
            const wordCount = item.searchableName.split(/\s+/).length;
            if (wordCount > 3) {
                const originalName = item.originalItem.displayName || item.originalItem.name || id;
                errors.push(`Item "${id}" (${originalName}) has ${wordCount} words in searchable name: "${item.searchableName}"`);
            }
        }
        if (errors.length > 0) {
            console.error('DiscoveryLib: Items with more than 3 words detected:');
            errors.forEach(error => console.error('  ' + error));
            throw new Error(`DiscoveryLib: ${errors.length} items violate the 3-word name limit. See console for details.`);
        }
    }
    /**
     * Verifies that each skill and specialization has unique keywords within its own keywords array
     */
    verifyKeywordUniqueness() {
        const errors = [];
        for (const [id, item] of this._byId) {
            if (item.type === 'skill' || item.type === 'skill_specialization') {
                const keywords = item.keywords || [];
                if (keywords.length > 0) {
                    // Flatten the keywords array since keywords are stored as string[][]
                    const flatKeywords = keywords.flat();
                    const uniqueKeywords = new Set(flatKeywords);
                    if (uniqueKeywords.size !== flatKeywords.length) {
                        const originalName = item.originalItem.displayName || item.originalItem.name || id;
                        const duplicates = flatKeywords.filter((keyword, index) => flatKeywords.indexOf(keyword) !== index);
                        errors.push(`${item.type} "${id}" (${originalName}) has duplicate keywords: [${duplicates.join(', ')}]`);
                    }
                }
            }
        }
        if (errors.length > 0) {
            console.error('DiscoveryLib: Skills/specializations with duplicate keywords detected:');
            errors.forEach(error => console.error('  ' + error));
            throw new Error(`DiscoveryLib: ${errors.length} skills/specializations have duplicate keywords. See console for details.`);
        }
    }
    /**
     * Creates a keyword lookup map
     */
    createKeywordLookup() {
        for (const [id, item] of this._byId) {
            if (item.keywords && item.keywords.length > 0) {
                for (const keywordGroup of item.keywords) {
                    for (const keyword of keywordGroup) {
                        const lowerKeyword = keyword.toLowerCase();
                        if (!this._keywordLookup.has(lowerKeyword)) {
                            this._keywordLookup.set(lowerKeyword, []);
                        }
                        const keywordItems = this._keywordLookup.get(lowerKeyword);
                        if (keywordItems && !keywordItems.includes(id)) {
                            keywordItems.push(id);
                        }
                    }
                }
            }
        }
    }
}
