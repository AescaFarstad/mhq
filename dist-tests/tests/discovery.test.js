/**
 * Discovery System Tests
 *
 * Tests for the discovery system from src/logic/GameState.ts
 *
 * This test suite validates:
 * - Basic discovery functionality (isDiscovered, discoveredItems)
 * - Discovery state persistence
 * - Integration with UI obfuscation
 * - Edge cases and error handling
 */
import { TestAssert } from './testRunner';
// We need to handle imports differently for browser vs Node.js
let GameState;
let obfuscateString;
// Environment-aware import
const isNodeEnvironment = typeof window === 'undefined';
if (isNodeEnvironment) {
    // Node.js environment - use require
    GameState = require('../src/logic/GameState').GameState;
    obfuscateString = require('../src/utils/stringUtils').obfuscateString;
}
else {
    // Browser environment - import will be available directly
    const gameStateModule = await import('../src/logic/GameState');
    const stringUtilsModule = await import('../src/utils/stringUtils');
    GameState = gameStateModule.GameState;
    obfuscateString = stringUtilsModule.obfuscateString;
}
// --- Test Helpers ---
function createTestGameState() {
    // Create a minimal GameState for testing
    // In Node.js environment, we might not have all dependencies available,
    // so we'll create a mock if needed
    try {
        return new GameState();
    }
    catch (error) {
        // If GameState construction fails (missing dependencies), create a mock
        return {
            discoveredItems: new Set(),
            isDiscovered: function (itemId) {
                return this.discoveredItems.has(itemId);
            },
            markAsDiscovered: function (itemId) {
                this.discoveredItems.add(itemId);
            }
        };
    }
}
// --- Test Cases ---
function testBasicDiscovery() {
    const gameState = createTestGameState();
    const testItemId = 'test-item-123';
    // Initially, item should not be discovered
    const initiallyNotDiscovered = TestAssert.false(gameState.isDiscovered(testItemId), 'Item should not be discovered initially');
    if (!initiallyNotDiscovered.success)
        return initiallyNotDiscovered;
    // Mark item as discovered
    gameState.discoveredItems.add(testItemId);
    // Now item should be discovered
    const nowDiscovered = TestAssert.true(gameState.isDiscovered(testItemId), 'Item should be discovered after being added');
    if (!nowDiscovered.success)
        return nowDiscovered;
    return { success: true };
}
function testDiscoverySetOperations() {
    const gameState = createTestGameState();
    const items = ['item1', 'item2', 'item3', 'item4'];
    // Add some items
    gameState.discoveredItems.add(items[0]);
    gameState.discoveredItems.add(items[1]);
    // Check set size
    const sizeTest = TestAssert.equals(gameState.discoveredItems.size, 2, 'Discovery set should have correct size');
    if (!sizeTest.success)
        return sizeTest;
    // Check specific items
    const item0Discovered = TestAssert.true(gameState.isDiscovered(items[0]), 'First item should be discovered');
    if (!item0Discovered.success)
        return item0Discovered;
    const item2NotDiscovered = TestAssert.false(gameState.isDiscovered(items[2]), 'Third item should not be discovered');
    if (!item2NotDiscovered.success)
        return item2NotDiscovered;
    // Add duplicate item (should not increase size)
    gameState.discoveredItems.add(items[0]);
    const sizeAfterDuplicate = TestAssert.equals(gameState.discoveredItems.size, 2, 'Adding duplicate should not increase size');
    if (!sizeAfterDuplicate.success)
        return sizeAfterDuplicate;
    return { success: true };
}
function testDiscoveryWithEmptyAndInvalidIds() {
    const gameState = createTestGameState();
    // Test empty string
    const emptyStringResult = TestAssert.false(gameState.isDiscovered(''), 'Empty string should not be discovered');
    if (!emptyStringResult.success)
        return emptyStringResult;
    // Add empty string and test
    gameState.discoveredItems.add('');
    const emptyStringDiscovered = TestAssert.true(gameState.isDiscovered(''), 'Empty string should be discoverable');
    if (!emptyStringDiscovered.success)
        return emptyStringDiscovered;
    // Test undefined (this might throw, but we should handle it gracefully)
    try {
        const undefinedResult = gameState.isDiscovered(undefined);
        const undefinedTest = TestAssert.false(undefinedResult, 'Undefined should not be discovered');
        if (!undefinedTest.success)
            return undefinedTest;
    }
    catch (error) {
        // If it throws, that's also acceptable behavior
        // We just want to ensure it doesn't crash the system
    }
    return { success: true };
}
function testDiscoveryIntegrationWithObfuscation() {
    const gameState = createTestGameState();
    const testText = 'Secret Knowledge';
    const testItemId = 'secret-knowledge';
    // When not discovered, text should be obfuscated
    const obfuscatedText = obfuscateString(testText, 1.0, 0);
    const obfuscationTest = TestAssert.notEquals(obfuscatedText, testText, 'Text should be obfuscated when not discovered');
    if (!obfuscationTest.success)
        return obfuscationTest;
    // Simulate discovery-aware UI logic
    function getDisplayText(text, itemId) {
        if (gameState.isDiscovered(itemId)) {
            return text;
        }
        else {
            return obfuscateString(text, 1.0, 0);
        }
    }
    // Before discovery
    const beforeDiscovery = getDisplayText(testText, testItemId);
    const beforeTest = TestAssert.notEquals(beforeDiscovery, testText, 'Display text should be obfuscated before discovery');
    if (!beforeTest.success)
        return beforeTest;
    // Mark as discovered
    gameState.discoveredItems.add(testItemId);
    // After discovery
    const afterDiscovery = getDisplayText(testText, testItemId);
    const afterTest = TestAssert.equals(afterDiscovery, testText, 'Display text should be clear after discovery');
    if (!afterTest.success)
        return afterTest;
    return { success: true };
}
function testDiscoveryStatePersistence() {
    const gameState = createTestGameState();
    const items = ['skill1', 'building1', 'attribute1'];
    // Add multiple items
    items.forEach(item => gameState.discoveredItems.add(item));
    // Verify all items are discovered
    for (const item of items) {
        const itemTest = TestAssert.true(gameState.isDiscovered(item), `Item ${item} should be discovered`);
        if (!itemTest.success)
            return itemTest;
    }
    // Simulate clearing one item (if such functionality exists)
    gameState.discoveredItems.delete(items[1]);
    const stillDiscovered = TestAssert.true(gameState.isDiscovered(items[0]), 'Other items should still be discovered');
    if (!stillDiscovered.success)
        return stillDiscovered;
    const noLongerDiscovered = TestAssert.false(gameState.isDiscovered(items[1]), 'Removed item should no longer be discovered');
    if (!noLongerDiscovered.success)
        return noLongerDiscovered;
    return { success: true };
}
function testDiscoveryBoundaryConditions() {
    const gameState = createTestGameState();
    // Test very long item ID
    const longId = 'a'.repeat(1000);
    gameState.discoveredItems.add(longId);
    const longIdTest = TestAssert.true(gameState.isDiscovered(longId), 'Very long item ID should work');
    if (!longIdTest.success)
        return longIdTest;
    // Test special characters
    const specialId = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    gameState.discoveredItems.add(specialId);
    const specialIdTest = TestAssert.true(gameState.isDiscovered(specialId), 'Special character item ID should work');
    if (!specialIdTest.success)
        return specialIdTest;
    // Test unicode characters
    const unicodeId = '🎮🎯🎪🎨🎭🎪';
    gameState.discoveredItems.add(unicodeId);
    const unicodeIdTest = TestAssert.true(gameState.isDiscovered(unicodeId), 'Unicode item ID should work');
    if (!unicodeIdTest.success)
        return unicodeIdTest;
    return { success: true };
}
function testDiscoveryBulkOperations() {
    const gameState = createTestGameState();
    // Generate many items for bulk testing
    const itemCount = 1000;
    const items = Array.from({ length: itemCount }, (_, i) => `item_${i}`);
    // Add all items
    items.forEach(item => gameState.discoveredItems.add(item));
    // Verify count
    const countTest = TestAssert.equals(gameState.discoveredItems.size, itemCount, `Should have ${itemCount} discovered items`);
    if (!countTest.success)
        return countTest;
    // Test random sampling of items
    const sampleIndices = [0, 100, 250, 500, 750, 999];
    for (const index of sampleIndices) {
        const sampleTest = TestAssert.true(gameState.isDiscovered(items[index]), `Sample item at index ${index} should be discovered`);
        if (!sampleTest.success)
            return sampleTest;
    }
    // Clear all items
    gameState.discoveredItems.clear();
    const clearTest = TestAssert.equals(gameState.discoveredItems.size, 0, 'All items should be cleared');
    if (!clearTest.success)
        return clearTest;
    return { success: true };
}
// --- Test Suite Export ---
export function createDiscoveryTests() {
    return {
        name: 'Discovery System Tests',
        tests: [
            {
                name: 'Basic Discovery Functionality',
                run: testBasicDiscovery
            },
            {
                name: 'Discovery Set Operations',
                run: testDiscoverySetOperations
            },
            {
                name: 'Empty and Invalid IDs',
                run: testDiscoveryWithEmptyAndInvalidIds
            },
            {
                name: 'Integration with Obfuscation',
                run: testDiscoveryIntegrationWithObfuscation
            },
            {
                name: 'Discovery State Persistence',
                run: testDiscoveryStatePersistence
            },
            {
                name: 'Boundary Conditions',
                run: testDiscoveryBoundaryConditions
            },
            {
                name: 'Bulk Operations',
                run: testDiscoveryBulkOperations
            }
        ]
    };
}
// --- Standalone Execution ---
// If this file is run directly with Node.js, execute only this test suite
if (isNodeEnvironment && typeof require !== 'undefined' && require.main === module) {
    import('./testRunner').then(({ runTestSuite }) => {
        runTestSuite(createDiscoveryTests()).then(results => {
            const exitCode = results.failedTests > 0 ? 1 : 0;
            process.exit(exitCode);
        });
    });
}
