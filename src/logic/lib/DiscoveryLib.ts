import { DiscoverableItem } from '../../types/discoveryTypes';
import { SkillLib } from './SkillLib';
import { AttributeLib } from './AttributeLib';  
import { BuildingLib } from './BuildingLib';
import { C } from './C';

/**
 * Central library for all discoverable items in the game.
 * Aggregates data from SkillLib, AttributeLib, BuildingLib and creates efficient lookup indexes.
 */
export class DiscoveryLib {
    private _byId: Map<string, DiscoverableItem> = new Map();
    private _bySearchableName: Map<string, DiscoverableItem> = new Map();
    
    id: string = 'discovery';
    name: string = 'Discovery Library';
    description: string = 'Central repository for all discoverable game items';
    
    constructor(skillLib: SkillLib, attributeLib: AttributeLib, buildingLib: BuildingLib) {
        this.aggregateDiscoverableItems(skillLib, attributeLib, buildingLib);
        this.verifyNameWordCounts();
        this.verifyKeywordUniqueness();
    }
    
    /**
     * Gets a discoverable item by its ID
     */
    public getById(id: string): DiscoverableItem | undefined {
        return this._byId.get(id);
    }
    
    /**
     * Gets a discoverable item by its searchable name
     */
    public getBySearchableName(searchableName: string): DiscoverableItem | undefined {
        return this._bySearchableName.get(searchableName);
    }
    
    /**
     * Gets all discoverable items
     */
    public getAllItems(): ReadonlyMap<string, DiscoverableItem> {
        return this._byId;
    }
    
    /**
     * Gets the lookup index by searchable name
     */
    public getSearchableNameIndex(): ReadonlyMap<string, DiscoverableItem> {
        return this._bySearchableName;
    }
    
    /**
     * Aggregates discoverable items from all source libraries
     */
    private aggregateDiscoverableItems(skillLib: SkillLib, attributeLib: AttributeLib, buildingLib: BuildingLib): void {
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
    private aggregateSkills(skillLib: SkillLib): void {
        const allSkills = skillLib.getAllSkillItems();
        
        for (const [skillId, skillItem] of Object.entries(allSkills)) {
            if (skillItem.type === 'skill') {
                const skill = skillItem as any; // Cast to access properties
                const discoverableSkill: DiscoverableItem = {
                    id: skillId,
                    type: 'skill',
                    originalItem: skill,
                    searchableName: this.createSearchableName(skill.displayName),
                    keywords: skill.keywords || []
                };
                
                this.addDiscoverableItem(discoverableSkill);
            } else if (skillItem.type === 'specialization') {
                const specialization = skillItem as any; // Cast to access properties
                const discoverableSpecialization: DiscoverableItem = {
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
    private aggregateAttributes(attributeLib: AttributeLib): void {
        const attributeDefs = attributeLib.getAttributeDefinitions();
        
        for (const [categoryKey, categoryDef] of Object.entries(attributeDefs)) {
            // Add the attribute category itself
            const discoverableCategory: DiscoverableItem = {
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
                    const discoverableAttribute: DiscoverableItem = {
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
    private aggregateBuildings(buildingLib: BuildingLib): void {
        for (const buildingDef of buildingLib.values()) {
            const discoverableBuilding: DiscoverableItem = {
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
    private aggregateStaticItems(): void {
        // Tab items - these are the main UI tabs
        const tabs = C.ALL_TAB_IDS.map(tabId => ({
            id: tabId,
            displayName: tabId,
            description: `${tabId} management and overview`
        }));
        
        for (const tab of tabs) {
            const discoverableTab: DiscoverableItem = {
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
            const discoverableResource: DiscoverableItem = {
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
    private addDiscoverableItem(item: DiscoverableItem): void {
        this._byId.set(item.id, item);
        this._bySearchableName.set(item.searchableName, item);
    }
    
    /**
     * Creates a searchable name from a display name by cleaning and normalizing it
     */
    private createSearchableName(displayName: string): string {
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
    private verifyNameWordCounts(): void {
        const errors: string[] = [];
        
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
    private verifyKeywordUniqueness(): void {
        const errors: string[] = [];
        
        for (const [id, item] of this._byId) {
            if (item.type === 'skill' || item.type === 'skill_specialization') {
                const keywords = item.keywords || [];
                if (keywords.length > 0) {
                    const uniqueKeywords = new Set(keywords);
                    if (uniqueKeywords.size !== keywords.length) {
                        const originalName = item.originalItem.displayName || item.originalItem.name || id;
                        const duplicates = keywords.filter((keyword, index) => keywords.indexOf(keyword) !== index);
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
} 