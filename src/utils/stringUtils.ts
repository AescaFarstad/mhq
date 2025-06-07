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
 * @param progressivity A value from 0 to 1 that controls how much character position influences obfuscation. A value of 0 results in uniform obfuscation. A value of 0.5 mimics the old 'progressive' behavior. At 1, obfuscation is almost entirely dependent on position (more likely at the end).
 * @returns The obfuscated string.
 */
export function obfuscateString(text: string, obfuscationPercentage: number = 1, progressivity: number = 0): string {
    if (!text) {
        return "";
    }

    if (obfuscationPercentage === 0) {
        return text;
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

    // Note on stability: The algorithm is designed to be stable. This means
    // that if a character is revealed at a certain obfuscationPercentage, it remains
    // revealed for any lower percentage. To achieve this, the seeds for both threshold
    // and character selection must be advanced predictably on every character,
    // regardless of whether the character is ultimately obfuscated or not.
    // The only exception is the shortcut for obfuscationPercentage = 0.
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
        let shouldObfuscate: boolean;
        if (progressivity > 0 && len > 1) {
            const progress = i / (len - 1);
            // The original implementation made characters at the start *more* likely
            // to be obfuscated. This is reversed now. The threshold is higher at
            // the start (less obfuscation) and lower at the end (more obfuscation).
            const progressionFactor = 1 - progress; // Varies from 1 at start to 0 at end
            const progressiveThreshold = (1 - progressivity) * threshold + progressivity * progressionFactor;
            shouldObfuscate = obfuscationPercentage > progressiveThreshold;
        } else {
            shouldObfuscate = obfuscationPercentage > threshold;
        }
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


export function areOneEditAway(s1: string, s2: string): boolean {
    const len1 = s1.length;
    const len2 = s2.length;
  
    if (Math.abs(len1 - len2) > 1) {
      return false;
    }
  
    if (len1 === len2) {
      let diffCount = 0;
      for (let i = 0; i < len1; i++) {
        if (s1[i] !== s2[i]) {
          diffCount++;
        }
        if (diffCount > 1) {
          return false;
        }
      }
      return true;
    }
  
    // Ensure s1 is the shorter string
    const short = len1 < len2 ? s1 : s2;
    const long = len1 < len2 ? s2 : s1;
  
    let i = 0, j = 0;
    let foundDifference = false;
  
    while (i < short.length && j < long.length) {
      if (short[i] !== long[j]) {
        if (foundDifference) {
          return false; // Second difference
        }
        foundDifference = true;
        j++; // Skip character in the longer string
      } else {
        i++;
        j++;
      }
    }
    return true;
  }