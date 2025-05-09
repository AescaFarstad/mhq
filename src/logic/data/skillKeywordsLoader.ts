import { parseKeywordsFromString } from '../utils/keywordParser';

// Import the raw string content of the keyword files using Vite's ?raw feature
import physiqueKeywordsRaw from './physique?raw';
import spiritKeywordsRaw from './spirit?raw';
import mindKeywordsRaw from './mind?raw';
import socialKeywordsRaw from './social?raw';

/**
 * Parses all keyword files and merges them into a single map.
 *
 * @returns A Map where keys are skill/specialization display names 
 *          and values are arrays of keyword arrays (string[][]).
 */
function loadAndMergeKeywords(): Map<string, string[][]> {
    const allKeywords = new Map<string, string[][]>();

    const keywordSources = [
        physiqueKeywordsRaw,
        spiritKeywordsRaw,
        mindKeywordsRaw,
        socialKeywordsRaw,
    ];

    for (const rawContent of keywordSources) {
        if (rawContent && rawContent.trim().length > 0) {
            const parsedMap = parseKeywordsFromString(rawContent);
            for (const [key, value] of parsedMap.entries()) {
                // Basic merge: If a key already exists, log a warning or decide on a strategy.
                // For now, we'll just overwrite, assuming display names are unique across files.
                // A more robust solution might merge the arrays if needed.
                if (allKeywords.has(key)) {
                    console.warn(`Duplicate display name found in keyword files: "${key}". Overwriting previous entry.`);
                }
                allKeywords.set(key, value);
            }
        }
    }

    return allKeywords;
}

// Load and parse the keywords immediately when this module is imported.
const mergedKeywordsMap = loadAndMergeKeywords();

/**
 * A map containing all parsed keywords from the physique, spirit, mind, and social data files.
 * Keys are skill/specialization display names.
 * Values are arrays of keyword arrays (string[][]).
 */
export const AllKeywords: ReadonlyMap<string, string[][]> = mergedKeywordsMap; 