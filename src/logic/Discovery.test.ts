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