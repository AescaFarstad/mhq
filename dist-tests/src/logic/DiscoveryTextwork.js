/**
 * Stateless module for analyzing player input and returning discovery actions.
 * For Step 1, this only implements direct name search logic.
 */
/**
 * Analyzes player input and returns an array of discovery actions.
 * For Step 1: Only implements direct name search logic.
 *
 * @param input - The raw input string from the player
 * @param discoveryLib - The discovery library for lookups
 * @param gameState - The game state to check discovery status
 * @returns Array of discovery actions to be processed
 */
export function analyzeInput(input, discoveryLib, gameState) {
    // Clean the input string
    const cleanedInput = cleanInput(input);
    if (!cleanedInput) {
        return [{ type: 'INVALID_INPUT', input, reason: 'Empty input after cleaning' }];
    }
    // Count words in the cleaned input
    const words = cleanedInput.split(/\s+/);
    const wordCount = words.length;
    // Handle based on word count
    if (wordCount === 1) {
        // Single word: perform both direct name search and keyword search
        const directResults = performDirectNameSearch(cleanedInput, discoveryLib, gameState);
        // If direct search succeeded, return it (direct discovery takes precedence)
        if (directResults.length > 0 && directResults[0].type === 'DIRECT_DISCOVERY') {
            return directResults;
        }
        // If direct search failed or returned already discovered, try keyword search
        const keywordResults = performKeywordSearch(cleanedInput, discoveryLib, gameState);
        // Return keyword results if found, otherwise return the direct results (which could be NO_MATCH)
        return keywordResults.length > 0 ? keywordResults : directResults;
    }
    else if (wordCount === 2) {
        // Two words: only perform direct name search
        return performDirectNameSearch(cleanedInput, discoveryLib, gameState);
    }
    else if (wordCount === 3) {
        // Three words: only perform direct name search
        return performDirectNameSearch(cleanedInput, discoveryLib, gameState);
    }
    else {
        // More than 3 words: invalid input
        return [{
                type: 'INVALID_INPUT',
                input,
                reason: `Input has ${wordCount} words, maximum is 3`
            }];
    }
}
/**
 * Performs direct name search against discoverable items
 */
function performDirectNameSearch(cleanedInput, discoveryLib, gameState) {
    // Try to find an exact match by searchable name
    const item = discoveryLib.getBySearchableName(cleanedInput);
    if (!item) {
        return [{ type: 'NO_MATCH', input: cleanedInput }];
    }
    // Check if the item is already discovered
    if (gameState.isDiscovered(item.id)) {
        return [{
                type: 'ALREADY_DISCOVERED',
                item: item
            }];
    }
    // Found a new item to discover
    return [{
            type: 'DIRECT_DISCOVERY',
            item: item
        }];
}
/**
 * Performs keyword search against discoverable items
 */
function performKeywordSearch(cleanedInput, discoveryLib, gameState) {
    // Get items that have this keyword
    const relatedItemIds = discoveryLib.getItemIdsByKeyword(cleanedInput);
    if (relatedItemIds.length === 0) {
        return []; // No keyword match found
    }
    // Filter out already discovered items
    const undiscoveredItemIds = relatedItemIds.filter(itemId => !gameState.isDiscovered(itemId));
    // Check if this keyword is already in active or discarded state
    const isActive = gameState.activeKeywords.has(cleanedInput);
    const isDiscarded = gameState.discardedKeywords.has(cleanedInput);
    if (isActive) {
        return [{ type: 'KEYWORD_ALREADY_ACTIVE', keyword: cleanedInput }];
    }
    if (isDiscarded) {
        return [{ type: 'KEYWORD_ALREADY_DISCARDED', keyword: cleanedInput }];
    }
    // If no undiscovered items relate to this keyword, add it to discarded
    if (undiscoveredItemIds.length === 0) {
        return [{ type: 'ADD_DISCARDED_KEYWORD', keyword: cleanedInput }];
    }
    // Add keyword to active keywords
    return [{
            type: 'ADD_ACTIVE_KEYWORD',
            keyword: cleanedInput,
            relatedItemIds: undiscoveredItemIds
        }];
}
/**
 * Cleans the input string by normalizing whitespace and converting to lowercase
 * Applies the same transformations as DiscoveryLib.createSearchableName for consistency
 */
function cleanInput(input) {
    return input
        .trim()
        .replace(/ and /g, ' ') // Replace ' and ' with single space
        .replace(/&/g, '') // Remove ampersands 
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim()
        .toLowerCase();
}
