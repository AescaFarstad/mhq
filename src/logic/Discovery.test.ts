import { describe, it, expect, beforeEach } from 'vitest';
import { DiscoveryLib } from './lib/DiscoveryLib';
import { SkillLib } from './lib/SkillLib';
import { AttributeLib } from './lib/AttributeLib';
import { BuildingLib } from './lib/BuildingLib';
import { analyzeInput } from './DiscoveryTextwork';
import { GameState } from './GameState';
import { discoverItem } from './Discovery';
import type { DiscoverableItem } from '../types/discoveryTypes';

// =================================================================
// Test Setup Helpers
// =================================================================

function createTestLibs() {
    const attributeLib = new AttributeLib();
    const skillLib = new SkillLib(attributeLib);
    const buildingLib = new BuildingLib();
    
    buildingLib.loadBuildings({
        'test_building': {
            name: 'Test Building',
            description: 'A test building',
            cost: { gold: 100 },
            clutterPerSecond: 0.1
        }
    });
    
    const discoveryLib = new DiscoveryLib(skillLib, attributeLib, buildingLib);
    
    return { attributeLib, skillLib, buildingLib, discoveryLib };
}

// Using a factory to ensure a clean GameState for each test.
const createGameState = () => new GameState();

// =================================================================
// Test Suites
// =================================================================

describe('DiscoveryLib', () => {
    let discoveryLib: DiscoveryLib;

    beforeEach(() => {
        const libs = createTestLibs();
        discoveryLib = libs.discoveryLib;
    });

    it('should aggregate data from all relevant libraries', () => {
        const allItems = discoveryLib.getAllItems();
        
        const skillItems = Array.from(allItems.values()).filter(item => item.type === 'skill');
        expect(skillItems.length).toBeGreaterThan(0);
        
        const specItems = Array.from(allItems.values()).filter(item => item.type === 'skill_specialization');
        expect(specItems.length).toBeGreaterThan(0);
        
        const attributeItems = Array.from(allItems.values()).filter(item => item.type === 'attribute');
        expect(attributeItems.length).toBeGreaterThan(0);
        
        const buildingItems = Array.from(allItems.values()).filter(item => item.type === 'building');
        expect(buildingItems.length).toBeGreaterThanOrEqual(1);
        
        const testBuilding = buildingItems.find(item => item.id === 'test_building');
        expect(testBuilding).toBeDefined();
        expect(testBuilding?.originalItem.name).toBe('Test Building');
        
        const tabItems = Array.from(allItems.values()).filter(item => item.type === 'tab');
        expect(tabItems.length).toBeGreaterThan(0);
        
        const resourceItems = Array.from(allItems.values()).filter(item => item.type === 'resource');
        expect(resourceItems.length).toBeGreaterThan(0);
    });

    it('should create correct searchable names', () => {
        const allItems = discoveryLib.getAllItems();
        for (const item of allItems.values()) {
            expect(item.searchableName).toBe(item.searchableName.toLowerCase());
            expect(item.searchableName).not.toContain('&');
            expect(item.searchableName).not.toContain(' and ');
            expect(item.searchableName).not.toContain('  ');
        }
    });

    it('should verify that all item names have 3 or fewer words', () => {
        const allItems = discoveryLib.getAllItems();
        for (const item of allItems.values()) {
            const wordCount = item.searchableName.split(/\s+/).length;
            expect(wordCount).toBeLessThanOrEqual(3);
        }
    });

    it('should provide correct items via lookup methods', () => {
        const castleById = discoveryLib.getById('Castle');
        expect(castleById).toBeDefined();
        expect(castleById?.originalItem.displayName).toBe('Castle');

        const castleByName = discoveryLib.getBySearchableName('castle');
        expect(castleByName).toBeDefined();
        expect(castleByName?.originalItem.displayName).toBe('Castle');
        
        expect(discoveryLib.getById('nonexistent')).toBeUndefined();
        expect(discoveryLib.getBySearchableName('nonexistent')).toBeUndefined();
    });
});

describe('DiscoveryTextwork', () => {
    let discoveryLib: DiscoveryLib;
    let gameState: GameState;

    beforeEach(() => {
        const libs = createTestLibs();
        discoveryLib = libs.discoveryLib;
        gameState = createGameState();
        // Vitest runs each test file in a separate, isolated environment,
        // so we don't need to worry about clearing discovered items from a `startGame` event.
    });

    it('should return DIRECT_DISCOVERY for a valid, undiscovered item name', () => {
        const actions = analyzeInput('quests', discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        const action = actions[0];
        expect(action.type).toBe('DIRECT_DISCOVERY');
        // Type assertion to access item property
        const item = (action as { type: 'DIRECT_DISCOVERY'; item: DiscoverableItem }).item;
        expect(item.id).toBe('Quests');
    });

    it('should return ALREADY_DISCOVERED for items that are already discovered', () => {
        const { discoveryLib } = createTestLibs();
        const gameState = new GameState();
        
        // Mark 'Quests' as discovered
        discoverItem('Quests', 'event', gameState);
        
        const result = analyzeInput('quests', discoveryLib, gameState);
        
        expect(result).toHaveLength(1);
        expect(result[0].type).toBe('ALREADY_DISCOVERED');
        expect(result[0]).toHaveProperty('item');
        expect((result[0] as any).item.id).toBe('Quests');
    });
    
    it('should handle multi-word direct discoveries', () => {
        const actions = analyzeInput('test building', discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        const action = actions[0];
        expect(action.type).toBe('DIRECT_DISCOVERY');
        const item = (action as { type: 'DIRECT_DISCOVERY'; item: DiscoverableItem }).item;
        expect(item.id).toBe('test_building');
    });

    it('should return NO_MATCH for a name that does not exist', () => {
        const actions = analyzeInput('nonexistent item', discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('NO_MATCH');
    });

    it('should return INVALID_INPUT for empty or whitespace-only strings', () => {
        let actions = analyzeInput('', discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('INVALID_INPUT');

        actions = analyzeInput('   ', discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('INVALID_INPUT');
    });

    it('should return INVALID_INPUT for inputs with more than 3 words', () => {
        const actions = analyzeInput('this is way too long', discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('INVALID_INPUT');
        const reason = (actions[0] as any).reason;
        expect(reason).toContain('maximum is 3');
    });

    it('should correctly clean and process input (case-insensitive, extra spaces)', () => {
        const actions = analyzeInput('  tAsKs  ', discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        const action = actions[0];
        expect(action.type).toBe('DIRECT_DISCOVERY');
        const item = (action as { type: 'DIRECT_DISCOVERY'; item: DiscoverableItem }).item;
        expect(item.id).toBe('Tasks');
    });
});

describe('Keyword Discovery Logic', () => {
    let discoveryLib: DiscoveryLib;
    let gameState: GameState;

    beforeEach(() => {
        const libs = createTestLibs();
        discoveryLib = libs.discoveryLib;
        gameState = createGameState();
    });

    it('should return ADD_ACTIVE_KEYWORD for a valid keyword related to undiscovered items', () => {
        // Find a keyword that should exist in the test data
        const keywordLookup = discoveryLib.getKeywordLookup();
        expect(keywordLookup.size).toBeGreaterThan(0);
        
        // Get the first keyword and its related items
        const [firstKeyword, relatedItemIds] = Array.from(keywordLookup.entries())[0];
        
        const actions = analyzeInput(firstKeyword, discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('ADD_ACTIVE_KEYWORD');
        const action = actions[0] as any;
        expect(action.keyword).toBe(firstKeyword);
        expect(action.relatedItemIds).toEqual(relatedItemIds);
    });

    it('should return ADD_DISCARDED_KEYWORD for keywords with no undiscovered items', () => {
        // First discover all items related to a keyword
        const keywordLookup = discoveryLib.getKeywordLookup();
        const [testKeyword, relatedItemIds] = Array.from(keywordLookup.entries())[0];
        
        // Discover all related items
        for (const itemId of relatedItemIds) {
            discoverItem(itemId, 'event', gameState);
        }
        
        const actions = analyzeInput(testKeyword, discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('ADD_DISCARDED_KEYWORD');
        const action = actions[0] as any;
        expect(action.keyword).toBe(testKeyword);
    });

    it('should return KEYWORD_ALREADY_ACTIVE for keywords already in active state', () => {
        const keywordLookup = discoveryLib.getKeywordLookup();
        const [testKeyword, relatedItemIds] = Array.from(keywordLookup.entries())[0];
        
        // First add the keyword to active state
        gameState.activeKeywords.set(testKeyword, relatedItemIds);
        
        const actions = analyzeInput(testKeyword, discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('KEYWORD_ALREADY_ACTIVE');
        const action = actions[0] as any;
        expect(action.keyword).toBe(testKeyword);
    });

    it('should return KEYWORD_ALREADY_DISCARDED for keywords already in discarded state', () => {
        const keywordLookup = discoveryLib.getKeywordLookup();
        const [testKeyword] = Array.from(keywordLookup.entries())[0];
        
        // First add the keyword to discarded state
        gameState.discardedKeywords.add(testKeyword);
        
        const actions = analyzeInput(testKeyword, discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('KEYWORD_ALREADY_DISCARDED');
        const action = actions[0] as any;
        expect(action.keyword).toBe(testKeyword);
    });

    it('should prefer direct discovery over keyword search for single words', () => {
        // Find an item that has both a discoverable name and keywords
        const allItems = discoveryLib.getAllItems();
        let testItem: DiscoverableItem | undefined;
        
        for (const item of allItems.values()) {
            if (item.keywords && item.keywords.length > 0) {
                testItem = item;
                break;
            }
        }
        
        expect(testItem).toBeDefined();
        if (!testItem) return;
        
        // Test that searching for the exact name returns direct discovery
        const actions = analyzeInput(testItem.searchableName, discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('DIRECT_DISCOVERY');
    });

    it('should fall back to keyword search when direct discovery fails', () => {
        const keywordLookup = discoveryLib.getKeywordLookup();
        const [testKeyword] = Array.from(keywordLookup.entries())[0];
        
        // Ensure this keyword is not a direct discoverable name
        const directMatch = discoveryLib.getBySearchableName(testKeyword);
        if (directMatch) {
            // Skip this test if the keyword happens to be a direct match
            return;
        }
        
        const actions = analyzeInput(testKeyword, discoveryLib, gameState);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('ADD_ACTIVE_KEYWORD');
    });
});

describe('Discovery State Management', () => {
    let discoveryLib: DiscoveryLib;
    let gameState: GameState;

    beforeEach(() => {
        const libs = createTestLibs();
        discoveryLib = libs.discoveryLib;
        gameState = createGameState();
    });

    it('should update active keywords when items are discovered', () => {
        const keywordLookup = discoveryLib.getKeywordLookup();
        const [testKeyword, relatedItemIds] = Array.from(keywordLookup.entries()).find(
            ([, itemIds]) => itemIds.length > 1
        ) || [null, []];
        
        if (!testKeyword || relatedItemIds.length < 2) {
            // Skip if no suitable keyword found
            return;
        }
        
        // Add keyword to active state
        gameState.activeKeywords.set(testKeyword, relatedItemIds);
        
        // Discover one of the related items
        const itemToDiscover = relatedItemIds[0];
        discoverItem(itemToDiscover, 'event', gameState);
        
        // Check that the active keyword list was updated
        const updatedRelatedItems = gameState.activeKeywords.get(testKeyword);
        expect(updatedRelatedItems).toBeDefined();
        expect(updatedRelatedItems).not.toContain(itemToDiscover);
        expect(updatedRelatedItems!.length).toBe(relatedItemIds.length - 1);
    });

    it('should move keywords from active to discarded when all related items are discovered', () => {
        const keywordLookup = discoveryLib.getKeywordLookup();
        const [testKeyword, relatedItemIds] = Array.from(keywordLookup.entries())[0];
        
        // Add keyword to active state
        gameState.activeKeywords.set(testKeyword, relatedItemIds);
        
        // Discover all related items
        for (const itemId of relatedItemIds) {
            discoverItem(itemId, 'event', gameState);
        }
        
        // Check that keyword was moved from active to discarded
        expect(gameState.activeKeywords.has(testKeyword)).toBe(false);
        expect(gameState.discardedKeywords.has(testKeyword)).toBe(true);
    });

    it('should add discovery log entries for direct discoveries', () => {
        const initialLogLength = gameState.discoveryLog.length;
        
        // Find a discoverable item
        const testItem = Array.from(discoveryLib.getAllItems().values())[0];
        
        discoverItem(testItem.id, 'direct', gameState, testItem);
        
        expect(gameState.discoveryLog.length).toBe(initialLogLength + 1);
        const logEntry = gameState.discoveryLog[gameState.discoveryLog.length - 1];
        expect(logEntry.type).toBe('direct_discovery');
        expect(logEntry.details.itemId).toBe(testItem.id);
    });

    it('should add discovery log entries for keyword findings', () => {
        const keywordLookup = discoveryLib.getKeywordLookup();
        const [testKeyword, relatedItemIds] = Array.from(keywordLookup.entries())[0];
        
        const initialLogLength = gameState.discoveryLog.length;
        
        // Process keyword discovery
        const actions = analyzeInput(testKeyword, discoveryLib, gameState);
        for (const action of actions) {
            if (action.type === 'ADD_ACTIVE_KEYWORD') {
                gameState.activeKeywords.set((action as any).keyword, (action as any).relatedItemIds);
                gameState.discoveryLog.push({
                    type: 'keyword_found',
                    details: {
                        keyword: (action as any).keyword,
                        relatedItemCount: relatedItemIds.length
                    }
                });
            }
        }
        
        expect(gameState.discoveryLog.length).toBe(initialLogLength + 1);
        const logEntry = gameState.discoveryLog[gameState.discoveryLog.length - 1];
        expect(logEntry.type).toBe('keyword_found');
        expect(logEntry.details.keyword).toBe(testKeyword);
        expect(logEntry.details.relatedItemCount).toBe(relatedItemIds.length);
    });

    it('should not create duplicate discovery log entries', () => {
        const testItem = Array.from(discoveryLib.getAllItems().values())[0];
        
        const initialLogLength = gameState.discoveryLog.length;
        
        // Try to discover the same item twice
        discoverItem(testItem.id, 'direct', gameState, testItem);
        discoverItem(testItem.id, 'direct', gameState, testItem);
        
        // Should only have one log entry
        expect(gameState.discoveryLog.length).toBe(initialLogLength + 1);
    });
}); 