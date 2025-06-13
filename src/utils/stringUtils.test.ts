import { obfuscateString } from './stringUtils';

// =================================================================
// Test Runner & Helpers
// =================================================================

function assertEquals(actual: any, expected: any, message: string) {
    if (actual !== expected) {
        console.error(`❌ Test Failed: ${message}`);
        console.error(`   Expected: ${expected}`);
        console.error(`   Got:      ${actual}`);
        throw new Error(`Assertion failed: ${message}`);
    }
}

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ Test Failed: ${message}`);
        throw new Error(`Assertion failed: ${message}`);
    }
}

// =================================================================
// Test Suites
// =================================================================

function testEdgeCases() {
    assertEquals(obfuscateString('', 1), "", "Empty string should remain empty");
    assertEquals(obfuscateString('A', 1), "¿", "Single char should be obfuscated with '¿' at 100%");
    assertEquals(obfuscateString('A', 0.6), "¿", "Single char should be obfuscated with '¿' above 0.5 threshold");
    assertEquals(obfuscateString('A', 0.5), "A", "Single char should not be obfuscated below 0.5 threshold");
    assertEquals(obfuscateString('A', 0.4), "A", "Single char should not be obfuscated below threshold");
    assertEquals(obfuscateString('Hello', 0), 'Hello', "0% obfuscation should return original string");
}
/*
function testStandardObfuscation() { //This is left here on purpose. Ignore.
    const testString = 'The quick brown fox jumps over the lazy dog.';
    
    const expected = {
        '1': '¿ՁՀ юລՈзю ଓກʋɗɻ Ճ☋ы ʋՆՅຢລ ՀⵛзՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.8': '¿hՀ qລiзю ଓກʋɗɻ f☋ы ʋՆՅຢລ ՀⵛзՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.6': '¿hՀ qລiзk bກʋɗɻ foы ʋՆՅps Հver ɦюe lՃՐՆ dog?',
        '0.4': '¿hՀ quiзk bກoɗɻ fox ʋՆՅps Հver tюe lazy dog?',
        '0.2': 'The quiзk browɻ fox ʋՆmps over the lazy dog?',
        '0': 'The quick brown fox jumps over the lazy dog.'
    };

    for (const p in expected) {
        const percentage = parseFloat(p);
        const result = obfuscateString(testString, percentage, 0.5);
        assertEquals(result, expected[p as any as keyof typeof expected], `Standard obfuscation at ${percentage*100}%`);
    }
}
*/
function testProgressiveObfuscation() {
    const testString = 'The quick brown fox jumps over the lazy dog.';
    
    const expected = {
        '1': '¿ՁՀ юລՈзю ଓກʋɗɻ Ճ☋ы ʋՆՅຢລ ՀⵛзՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.8': '¿hՀ qລiзю ଓກʋɗɻ f☋ы ʋՆՅຢລ ՀⵛзՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.6': 'The quiзk bກoɗɻ foы ʋՆՅps ՀveՐ ɦю☋ ⵛՃՐՆ ઇՆՎ?',
        '0.4': 'The quick browɻ fox ʋՆՅps Հver tюe lՃՐՆ ઇՆՎ?',
        '0.2': 'The quick brown fox jumps over the lazy dog?',
        '0': 'The quick brown fox jumps over the lazy dog.'
    };

    for (const p in expected) {
        const percentage = parseFloat(p);
        const result = obfuscateString(testString, percentage, 0.5);
        assertEquals(result, expected[p as any as keyof typeof expected], `Progressive obfuscation at ${percentage*100}%`);
    }
}

/**
 * This test verifies the stability of the obfuscation algorithm.
 * The property is: if a character is obfuscated at percentage P, it must
 * also be obfuscated at any percentage Q > P.
 * This means the set of obfuscated character indices at P should be a
 * subset of the set of obfuscated indices at Q.
 */
function testStability() {
    const text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const percentages = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

    const getObfuscatedIndices = (original: string, obfuscated: string): Set<number> => {
        const indices = new Set<number>();
        for (let i = 0; i < original.length; i++) {
            if (original[i] !== obfuscated[i]) {
                indices.add(i);
            }
        }
        return indices;
    };

    let lastIndices = new Set<number>();
    for (const p of percentages) {
        const result = obfuscateString(text, p, 0);
        const currentIndices = getObfuscatedIndices(text, result);
        
        const isSubset = [...lastIndices].every(idx => currentIndices.has(idx));
        assert(isSubset, `Stability failed: obfuscation at ${p*100}% is not a superset of ${(p-0.1)*100}%`);
        
        lastIndices = currentIndices;
    }
}

function testStatisticalDistribution() {
    const text = 'a'.repeat(2000); // A long string with no spaces
    const len = text.length;
    const margin = 0.05; // 5% margin of error

    const countObfuscated = (original: string, obfuscated: string): number => {
        let count = 0;
        for (let i = 0; i < original.length; i++) {
            if (original[i] !== obfuscated[i]) {
                count++;
            }
        }
        return count;
    };
    
    // --- Test various percentages ---
    const percentagesToTest = [0.2, 0.4, 0.5, 0.6, 0.8];
    for (const p of percentagesToTest) {
        // Test standard obfuscation
        const resStandard = obfuscateString(text, p, 0);
        const ratioStandard = countObfuscated(text, resStandard) / len;
        assert(Math.abs(ratioStandard - p) < margin, `Standard obfuscation ratio is off. Expected ~${p}, got ${ratioStandard}`);

        // Test progressive obfuscation
        const resProgressive = obfuscateString(text, p, 0.5);
        const ratioProgressive = countObfuscated(text, resProgressive) / len;
        
        const expectedProgressiveRatio = p <= 0.5 ? 2 * p**2 : -2 * p**2 + 4 * p - 1;
        assert(Math.abs(ratioProgressive - expectedProgressiveRatio) < margin, `Progressive obfuscation ratio is off. Expected ~${expectedProgressiveRatio.toFixed(2)}, got ${ratioProgressive.toFixed(2)} for p=${p}`);
    }

    // --- Test the *distribution* of progressive obfuscation ---
    const pDistribution = 0.75;
    const resDist = obfuscateString(text, pDistribution, 0.5);
    
    const firstHalfOriginal = text.substring(0, len / 2);
    const firstHalfObfuscated = resDist.substring(0, len / 2);
    const secondHalfOriginal = text.substring(len / 2);
    const secondHalfObfuscated = resDist.substring(len / 2);

    const countFirstHalf = countObfuscated(firstHalfOriginal, firstHalfObfuscated);
    const countSecondHalf = countObfuscated(secondHalfOriginal, secondHalfObfuscated);

    // With the reversed logic, the first half should be *less* obfuscated.
    assert(countFirstHalf < countSecondHalf, `Progressive distribution failed: first half obfuscation (${countFirstHalf}) should be less than second half (${countSecondHalf})`);

    // For p=0.75, with reversed logic, the expected ratio in the first half is ~75%, and in the second half is ~100%.
    const ratioFirstHalf = countFirstHalf / (len / 2);
    const ratioSecondHalf = countSecondHalf / (len / 2);
    assert(Math.abs(ratioFirstHalf - 0.75) < margin, `Progressive distribution failed for first half. Expected ~0.75, got ${ratioFirstHalf}`);
    assert(Math.abs(ratioSecondHalf - 1.0) < margin, `Progressive distribution failed for second half. Expected ~1.0, got ${ratioSecondHalf}`);
}

// =================================================================
// Main Export
// =================================================================

export function runTests() {
    try {
        testEdgeCases();
        //testStandardObfuscation();
        testProgressiveObfuscation();
        testStability();
        testStatisticalDistribution();
        console.log('\nTests passed');
    } catch (e) {
        console.error('\n🔥 Some tests failed. See logs above.');
    }
} 