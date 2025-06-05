import { advanceSeed, seedToRandom } from '../logic/utils/mathUtils';

const MYSTERIOUS_CHARS: string[] = [
    'Ձ', 'Ճ', 'Յ', 'Շ', 'Վ', 'Ֆ', 'Ր', 'Ջ', 'Հ', 'ຢ', 'Ն', 'ລ', 'ກ', 'ຊ', 'ы', 'ю', 'ч', 'з', 'ь', '☋', '☡', 'ɻ', 'ɷ', 'ɕ', 'ɗ', 'ⵛ', 'ʋ', 'ɲ', 'ɦ', 'ⵓ', 'ଌ', 'ଓ', 'ઇ', 'ມ', 'Թ', 'Ո'
];

/**
 * Transforms a string into a gibberish string of the same length, deterministically.
 * The first symbol is '¿', the last is '?'. Middle symbols are chosen
 * from a predefined list of "mysterious" characters based on the original character's code,
 * the string's length, and its first/last characters, with the pattern shifting.
 * Spaces in the middle of the string are preserved.
 * Characters are selectively obfuscated based on the obfuscationPercentage parameter.
 * @param text The input string.
 * @param obfuscationPercentage The percentage of characters to obfuscate (0-1, default 1 for 100%).
 * @returns The obfuscated string.
 */
export function obfuscateString(text: string, obfuscationPercentage: number = 1): string {
    if (!text) {
        return "";
    }

    const len = text.length;

    if (len === 0) {
        return "";
    }
    if (len === 1) {
        // For single character, apply obfuscation based on percentage
        const charThreshold = 0.5; // Fixed threshold for single chars
        return obfuscationPercentage > charThreshold ? "¿" : text;
    }

    let result = "";

    const firstCharCode = text.charCodeAt(0) || 1;
    const lastCharCode = text.charCodeAt(len - 1) || 1;
    
    // Two independent seeds
    let thresholdSeed = (firstCharCode * 31 + lastCharCode * 17 + len * 7) & 0xFFFFFFFF;
    let obfuscationSeed = (firstCharCode * 41 + lastCharCode * 23 + len * 11) & 0xFFFFFFFF;

    for (let i = 0; i < len; i++) {
        const originalChar = text[i];
        
        // Always preserve spaces
        if (originalChar === ' ') {
            result += ' ';
            // Advance both seeds even for spaces to keep them independent
            thresholdSeed = advanceSeed(thresholdSeed);
            obfuscationSeed = advanceSeed(obfuscationSeed);
            continue;
        }

        // Always generate threshold for this character position
        thresholdSeed = advanceSeed(thresholdSeed, i * 37);
        const threshold = seedToRandom(thresholdSeed);

        // Always advance obfuscation seed and pre-generate obfuscation character
        const originalCharCode: number = text.charCodeAt(i) || 1;
        obfuscationSeed = advanceSeed(obfuscationSeed, originalCharCode);
        
        let obfuscatedChar: string;
        if (i === 0) {
            obfuscatedChar = "¿";
        } else if (i === len - 1) {
            obfuscatedChar = "?";
        } else {
            const charIndex = (obfuscationSeed & 0x7FFFFFFF) % MYSTERIOUS_CHARS.length;
            obfuscatedChar = MYSTERIOUS_CHARS[charIndex];
        }

        // Decide whether to use original or obfuscated character
        const shouldObfuscate = obfuscationPercentage > threshold;
        result += shouldObfuscate ? obfuscatedChar : originalChar;
    }
    
    return result;
}

export function wordify(inputText: string): string[] {
    const text = inputText.trim(); // Trim the whole input first
    if (!text) {
        return [];
    }

    const firstSpaceIndex = text.indexOf(' ');
    const firstWord = (firstSpaceIndex === -1) ? text : text.substring(0, firstSpaceIndex);

    // firstWord is guaranteed to be non-empty here because text is non-empty and trimmed.
    
    const results = new Set<string>();
    results.add(firstWord);

    const tryAdd = (candidate: string) => {
        // Ensure candidate is not empty, not same as firstWord, and is strictly shorter
        if (candidate && candidate.length > 0 && candidate.length < firstWord.length) {
            results.add(candidate);
        }
    };

    // Suffix stripping rules, applied to the original firstWord

    // Rule: 'es' removal (check before 's')
    if (firstWord.length > 2 && firstWord.endsWith('es')) {
        tryAdd(firstWord.slice(0, -2));
    }
    // Rule: 's' removal
    else if (firstWord.length > 1 && firstWord.endsWith('s')) {
        tryAdd(firstWord.slice(0, -1));
    }

    // Rule: 'ing' removal
    if (firstWord.length > 3 && firstWord.endsWith('ing')) {
        const stem = firstWord.slice(0, -3); 
        tryAdd(stem);
        // Attempt to restore 'e' if applicable, e.g., hoping -> hope, typing -> type
        const stemWithE = stem + 'e';
        if (stem.length > 0 && stemWithE.length < firstWord.length) { 
            tryAdd(stemWithE);
        }
    }

    // Rule: 'ment' removal
    if (firstWord.length > 4 && firstWord.endsWith('ment')) {
        tryAdd(firstWord.slice(0, -4));
    }

    // Rule: 'ness' removal
    if (firstWord.length > 4 && firstWord.endsWith('ness')) {
        tryAdd(firstWord.slice(0, -4));
    }

    // Rule: 'ly' removal
    if (firstWord.length > 2 && firstWord.endsWith('ly')) {
        tryAdd(firstWord.slice(0, -2));
    }

    // Rule: 'er' removal (e.g., faster -> fast, teacher -> teach)
    if (firstWord.length > 2 && firstWord.endsWith('er')) {
        tryAdd(firstWord.slice(0, -2));
    }

    // Rule: 'est' removal (e.g., fastest -> fast)
    if (firstWord.length > 3 && firstWord.endsWith('est')) {
        tryAdd(firstWord.slice(0, -3));
    }

    // Rule: 'ed' removal
    if (firstWord.length > 2 && firstWord.endsWith('ed')) {
        const stem = firstWord.slice(0, -2); 
        tryAdd(stem);
        // Attempt to restore 'e' if applicable, e.g., loved -> love, hoped -> hope
        const stemWithE = stem + 'e';
        if (stem.length > 0 && stemWithE.length < firstWord.length) { 
            tryAdd(stemWithE);
        }
    }

    // Rule: 'ion' removal and variations (e.g. connection -> connect; communication -> communicat, communicate)
    if (firstWord.length > 3 && firstWord.endsWith('ion')) {
        const stem = firstWord.slice(0, -3); 
        tryAdd(stem);
        // Try '...ion' -> '...ate', '...ite', etc. by adding 'e' to stem
        const stemWithE = stem + 'e';
        if (stem.length > 0 && stemWithE.length < firstWord.length) {
            tryAdd(stemWithE);
        }
    }
    
    // Rule: 'al' removal (e.g. national -> nation, optional -> option)
    if (firstWord.length > 2 && firstWord.endsWith('al')) {
        tryAdd(firstWord.slice(0, -2));
    }

    // Rule: 'ize'/'ise' removal (e.g. organize -> organ, realise -> real)
    if (firstWord.length > 3 && firstWord.endsWith('ize')) {
        tryAdd(firstWord.slice(0, -3));
    }
    if (firstWord.length > 3 && firstWord.endsWith('ise')) { 
        tryAdd(firstWord.slice(0, -3));
    }

    return Array.from(results);
} 