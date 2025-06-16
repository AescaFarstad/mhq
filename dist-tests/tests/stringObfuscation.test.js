/**
 * String Obfuscation Tests
 *
 * Tests for the obfuscateString function from src/utils/stringUtils.ts
 *
 * This test suite validates:
 * - Edge cases (empty strings, single characters)
 * - Progressive obfuscation mechanics
 * - Algorithm stability (once revealed, stays revealed)
 * - Statistical distribution of obfuscation
 * - Deterministic behavior
 */
import { TestAssert } from './testRunner';
// We need to handle imports differently for browser vs Node.js
let obfuscateString;
// Environment-aware import
const isNodeEnvironment = typeof window === 'undefined';
if (isNodeEnvironment) {
    // Node.js environment - use require or dynamic import
    // This will be resolved after compilation
    obfuscateString = require('../src/utils/stringUtils').obfuscateString;
}
else {
    // Browser environment - import will be available directly
    const stringUtilsModule = await import('../src/utils/stringUtils');
    obfuscateString = stringUtilsModule.obfuscateString;
}
// --- Test Helpers ---
function countObfuscatedCharacters(original, obfuscated) {
    let count = 0;
    for (let i = 0; i < original.length; i++) {
        if (original[i] !== obfuscated[i]) {
            count++;
        }
    }
    return count;
}
function getObfuscatedIndices(original, obfuscated) {
    const indices = new Set();
    for (let i = 0; i < original.length; i++) {
        if (original[i] !== obfuscated[i]) {
            indices.add(i);
        }
    }
    return indices;
}
// --- Test Cases ---
function testEdgeCases() {
    // Empty string
    const emptyResult = TestAssert.equals(obfuscateString('', 1), "", "Empty string should remain empty");
    if (!emptyResult.success)
        return emptyResult;
    // Single character tests
    const singleCharObfuscated = TestAssert.equals(obfuscateString('A', 1), "¿", "Single char should be obfuscated with '¿' at 100%");
    if (!singleCharObfuscated.success)
        return singleCharObfuscated;
    const singleCharAboveThreshold = TestAssert.equals(obfuscateString('A', 0.6), "¿", "Single char should be obfuscated with '¿' above 0.5 threshold");
    if (!singleCharAboveThreshold.success)
        return singleCharAboveThreshold;
    const singleCharAtThreshold = TestAssert.equals(obfuscateString('A', 0.5), "A", "Single char should not be obfuscated at 0.5 threshold");
    if (!singleCharAtThreshold.success)
        return singleCharAtThreshold;
    const singleCharBelowThreshold = TestAssert.equals(obfuscateString('A', 0.4), "A", "Single char should not be obfuscated below threshold");
    if (!singleCharBelowThreshold.success)
        return singleCharBelowThreshold;
    // Zero obfuscation
    const zeroObfuscation = TestAssert.equals(obfuscateString('Hello', 0), 'Hello', "0% obfuscation should return original string");
    if (!zeroObfuscation.success)
        return zeroObfuscation;
    return { success: true };
}
function testProgressiveObfuscation() {
    const testString = 'The quick brown fox jumps over the lazy dog.';
    const expectedResults = {
        '1': '¿ՁՀ юລՈзю ଓກʋɗɻ Ճ☋ы ʋՆՅຢລ ՀⵛзՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.8': '¿hՀ qລiзю ଓກʋɗɻ f☋ы ʋՆՅຢລ ՀⵛзՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.6': 'The quiзk bກoɗɻ foы ʋՆՅps ՀveՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.4': 'The quick browɻ fox ʋՆՅps Հver tюe lՃՐՆ ઇՆՎ?',
        '0.2': 'The quick brown fox jumps over the lazy dog?',
        '0': 'The quick brown fox jumps over the lazy dog.'
    };
    for (const [percentageStr, expected] of Object.entries(expectedResults)) {
        const percentage = parseFloat(percentageStr);
        const result = obfuscateString(testString, percentage, 0.5);
        const testResult = TestAssert.equals(result, expected, `Progressive obfuscation at ${percentage * 100}%`);
        if (!testResult.success)
            return testResult;
    }
    return { success: true };
}
function testStability() {
    const text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const percentages = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    let lastIndices = new Set();
    for (const p of percentages) {
        const result = obfuscateString(text, p, 0);
        const currentIndices = getObfuscatedIndices(text, result);
        // Check if lastIndices is a subset of currentIndices
        const isSubset = Array.from(lastIndices).every(idx => currentIndices.has(idx));
        if (!isSubset) {
            return {
                success: false,
                message: `Stability failed: obfuscation at ${p * 100}% is not a superset of ${(p - 0.1) * 100}%`
            };
        }
        lastIndices = currentIndices;
    }
    return { success: true };
}
function testStatisticalDistribution() {
    const text = 'a'.repeat(2000); // A long string with no spaces
    const len = text.length;
    const margin = 0.05; // 5% margin of error
    // Test various percentages
    const percentagesToTest = [0.2, 0.4, 0.5, 0.6, 0.8];
    for (const p of percentagesToTest) {
        // Test standard obfuscation (progressivity = 0)
        const resStandard = obfuscateString(text, p, 0);
        const ratioStandard = countObfuscatedCharacters(text, resStandard) / len;
        const standardDifference = Math.abs(ratioStandard - p);
        if (standardDifference >= margin) {
            return {
                success: false,
                message: `Standard obfuscation ratio is off. Expected ~${p}, got ${ratioStandard.toFixed(3)}, difference: ${standardDifference.toFixed(3)}`
            };
        }
        // Test progressive obfuscation (progressivity = 0.5)
        const resProgressive = obfuscateString(text, p, 0.5);
        const ratioProgressive = countObfuscatedCharacters(text, resProgressive) / len;
        // Calculate expected progressive ratio based on the formula from the original test
        const expectedProgressiveRatio = p <= 0.5 ? 2 * p * p : -2 * p * p + 4 * p - 1;
        const progressiveDifference = Math.abs(ratioProgressive - expectedProgressiveRatio);
        if (progressiveDifference >= margin) {
            return {
                success: false,
                message: `Progressive obfuscation ratio is off. Expected ~${expectedProgressiveRatio.toFixed(3)}, got ${ratioProgressive.toFixed(3)} for p=${p}`
            };
        }
    }
    // Test the distribution of progressive obfuscation
    const pDistribution = 0.75;
    const resDist = obfuscateString(text, pDistribution, 0.5);
    const firstHalfOriginal = text.substring(0, len / 2);
    const firstHalfObfuscated = resDist.substring(0, len / 2);
    const secondHalfOriginal = text.substring(len / 2);
    const secondHalfObfuscated = resDist.substring(len / 2);
    const countFirstHalf = countObfuscatedCharacters(firstHalfOriginal, firstHalfObfuscated);
    const countSecondHalf = countObfuscatedCharacters(secondHalfOriginal, secondHalfObfuscated);
    // Progressive obfuscation should have fewer obfuscated characters in the first half
    // and more in the second half
    if (countFirstHalf >= countSecondHalf) {
        return {
            success: false,
            message: `Progressive distribution failed: first half (${countFirstHalf}) should have fewer obfuscated chars than second half (${countSecondHalf})`
        };
    }
    return { success: true };
}
function testDeterminism() {
    const testStrings = [
        'Hello World',
        'The quick brown fox',
        'a',
        '',
        '!@#$%^&*()',
        'Multiple    spaces   here'
    ];
    const percentages = [0, 0.25, 0.5, 0.75, 1.0];
    const progressivities = [0, 0.5, 1.0];
    for (const text of testStrings) {
        for (const percentage of percentages) {
            for (const progressivity of progressivities) {
                // Run the function multiple times with the same inputs
                const result1 = obfuscateString(text, percentage, progressivity);
                const result2 = obfuscateString(text, percentage, progressivity);
                const result3 = obfuscateString(text, percentage, progressivity);
                // All results should be identical
                if (result1 !== result2 || result2 !== result3) {
                    return {
                        success: false,
                        message: `Determinism failed for input "${text}" with percentage ${percentage} and progressivity ${progressivity}. Got different results: "${result1}", "${result2}", "${result3}"`
                    };
                }
            }
        }
    }
    return { success: true };
}
function testSpacePreservation() {
    const textWithSpaces = 'Hello World Test';
    const result = obfuscateString(textWithSpaces, 1.0, 0);
    // Spaces should be preserved at their original positions
    for (let i = 0; i < textWithSpaces.length; i++) {
        if (textWithSpaces[i] === ' ') {
            const spacePreserved = TestAssert.equals(result[i], ' ', `Space at position ${i} should be preserved`);
            if (!spacePreserved.success)
                return spacePreserved;
        }
    }
    return { success: true };
}
function testFirstLastCharacterRules() {
    const testText = 'Hello';
    // At 100% obfuscation, first char should be ¿ and last should be ?
    const fullObfuscation = obfuscateString(testText, 1.0, 0);
    const firstCharTest = TestAssert.equals(fullObfuscation[0], '¿', 'First character should be ¿ at 100% obfuscation');
    if (!firstCharTest.success)
        return firstCharTest;
    const lastCharTest = TestAssert.equals(fullObfuscation[fullObfuscation.length - 1], '?', 'Last character should be ? at 100% obfuscation');
    if (!lastCharTest.success)
        return lastCharTest;
    return { success: true };
}
// --- Test Suite Export ---
export function createStringObfuscationTests() {
    return {
        name: 'String Obfuscation Tests',
        tests: [
            {
                name: 'Edge Cases',
                run: testEdgeCases
            },
            {
                name: 'Progressive Obfuscation',
                run: testProgressiveObfuscation
            },
            {
                name: 'Algorithm Stability',
                run: testStability
            },
            {
                name: 'Statistical Distribution',
                run: testStatisticalDistribution
            },
            {
                name: 'Deterministic Behavior',
                run: testDeterminism
            },
            {
                name: 'Space Preservation',
                run: testSpacePreservation
            },
            {
                name: 'First/Last Character Rules',
                run: testFirstLastCharacterRules
            }
        ]
    };
}
// --- Standalone Execution ---
// If this file is run directly with Node.js, execute only this test suite
if (isNodeEnvironment && typeof require !== 'undefined' && require.main === module) {
    import('./testRunner').then(({ runTestSuite }) => {
        runTestSuite(createStringObfuscationTests()).then(results => {
            const exitCode = results.failedTests > 0 ? 1 : 0;
            process.exit(exitCode);
        });
    });
}
