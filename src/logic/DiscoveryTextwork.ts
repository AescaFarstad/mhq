import { DiscoveryAction } from '../types/discoveryTypes';
import { DiscoveryLib } from './lib/DiscoveryLib';
import { GameState } from './GameState';
import { wordify } from '../utils/stringUtils';

/**
 * Stateless module for analyzing player input and returning discovery actions.
 * For Step 1, this only implements direct name search logic.
 */

/**
 * Analyzes player input and returns an array of discovery actions.
 * 
 * @param input - The raw input string from the player
 * @param discoveryLib - The discovery library for lookups
 * @param gameState - The game state to check discovery status
 * @returns Array of discovery actions to be processed
 */
export function analyzeInput(
    input: string,
    discoveryLib: DiscoveryLib,
    gameState: GameState
): DiscoveryAction[] {
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
        const keywordResults = performKeywordSearch(cleanedInput, discoveryLib, gameState);
        
        // Combine results - direct discoveries should come first, then keywords
        const combinedResults: DiscoveryAction[] = [];
        
        // Add direct discovery if it's a new discovery
        if (directResults.length > 0 && directResults[0].type === 'DIRECT_DISCOVERY') {
            combinedResults.push(...directResults);
        }
        
        // Add keyword results if found
        if (keywordResults.length > 0 && 
            ['ADD_ACTIVE_KEYWORD', 'ADD_DISCARDED_KEYWORD', 'KEYWORD_ALREADY_ACTIVE', 'KEYWORD_ALREADY_DISCARDED'].includes(keywordResults[0].type)) {
            combinedResults.push(...keywordResults);
        }
        
        // If we have combined results, return them
        if (combinedResults.length > 0) {
            return combinedResults;
        }
        
        // Otherwise, return the most informative result
        if (directResults.length > 0) {
            return directResults;
        }
        
        return keywordResults.length > 0 ? keywordResults : [{ type: 'NO_MATCH', input: cleanedInput }];
    } else if (wordCount === 2 || wordCount === 3) {
        // Two or three words: perform direct name search AND keyword search for each word
        const combinedResults: DiscoveryAction[] = [];
        
        // First, try direct name search on the full phrase
        const directResults = performDirectNameSearch(cleanedInput, discoveryLib, gameState);
        
        // Add direct discovery if it's a new discovery
        if (directResults.length > 0 && directResults[0].type === 'DIRECT_DISCOVERY') {
            combinedResults.push(...directResults);
        }
        
        // ALWAYS continue processing individual words, even if direct search succeeded
        // Then, try both direct name search AND keyword search on each individual word
        for (const word of words) {
            // Try direct name search on this word (with wordify applied to this single word)
            const wordDirectResults = performDirectNameSearch(word, discoveryLib, gameState);
            
            // Add direct discovery if it's a new discovery
            if (wordDirectResults.length > 0 && wordDirectResults[0].type === 'DIRECT_DISCOVERY') {
                combinedResults.push(...wordDirectResults);
            }
            
            // Try keyword search on this word (with wordify applied to this single word)
            const keywordResults = performKeywordSearch(word, discoveryLib, gameState);
            
            // Add keyword results if found
            if (keywordResults.length > 0 && 
                ['ADD_ACTIVE_KEYWORD', 'ADD_DISCARDED_KEYWORD', 'KEYWORD_ALREADY_ACTIVE', 'KEYWORD_ALREADY_DISCARDED'].includes(keywordResults[0].type)) {
                combinedResults.push(...keywordResults);
            }
        }
        
        // If we have combined results, return them
        if (combinedResults.length > 0) {
            return combinedResults;
        }
        
        // Otherwise, return the most informative result from direct search
        if (directResults.length > 0) {
            return directResults;
        }
        
        return [{ type: 'NO_MATCH', input: cleanedInput }];
    } else {
        // More than 3 words: too many words error
        return [{ 
            type: 'TOO_MANY_WORDS', 
            input, 
            wordCount: wordCount
        }];
    }
}

/**
 * Performs direct name search against discoverable items
 */
function performDirectNameSearch(
    cleanedInput: string,
    discoveryLib: DiscoveryLib,
    gameState: GameState
): DiscoveryAction[] {
    const results: DiscoveryAction[] = [];
    
    // First, try the exact cleaned input
    const exactItem = discoveryLib.getBySearchableName(cleanedInput);
    
    if (exactItem) {
        if (gameState.isDiscovered(exactItem.id)) {
            return [{ type: 'ALREADY_DISCOVERED', item: exactItem }];
        } else {
            return [{ type: 'DIRECT_DISCOVERY', item: exactItem }];
        }
    }
    
    // Then try word variations (only for single words)
    const wordVariations = wordify(cleanedInput);
    let originalWordAlreadyDiscovered = false;
    
    // Try all word variations and collect successful discoveries
    for (const variation of wordVariations) {
        // Skip if this variation is the same as the exact input we already tried
        if (variation === cleanedInput) {
            continue;
        }
        
        const item = discoveryLib.getBySearchableName(variation);
        
        if (item) {
            if (gameState.isDiscovered(item.id)) {
                // Track if the original word was already discovered
                if (variation === cleanedInput) {
                    originalWordAlreadyDiscovered = true;
                }
                // Don't add already discovered items to results
            } else {
                // Found a new item to discover
                results.push({ 
                    type: 'DIRECT_DISCOVERY', 
                    item: item
                });
            }
        }
    }
    
    // If we found successful discoveries, return them
    if (results.length > 0) {
        return results;
    }
    
    // No successful discoveries - report appropriate failure
    if (originalWordAlreadyDiscovered) {
        // The original word matched an already discovered item
        const originalItem = discoveryLib.getBySearchableName(cleanedInput);
        return [{ 
            type: 'ALREADY_DISCOVERED', 
            item: originalItem!
        }];
    }
    
    return [{ type: 'NO_MATCH', input: cleanedInput }];
}

/**
 * Performs keyword search against discoverable items
 */
function performKeywordSearch(
    cleanedInput: string,
    discoveryLib: DiscoveryLib,
    gameState: GameState
): DiscoveryAction[] {
    const allRelatedItemIds = new Set<string>();
    const matchedKeywords = new Set<string>();
    const wordVariations = wordify(cleanedInput);
    
    // Collect all related items from all word variations
    for (const variation of wordVariations) {
        const relatedItemIds = discoveryLib.getItemIdsByKeyword(variation);
        if (relatedItemIds.length > 0) {
            matchedKeywords.add(variation);
            relatedItemIds.forEach(id => allRelatedItemIds.add(id));
        }
    }
    
    if (allRelatedItemIds.size === 0) {
        return []; // No keyword match found for any variation
    }
    
    // Process each matched keyword and separate successes from errors
    const successfulActions: DiscoveryAction[] = [];
    const errorActions: DiscoveryAction[] = [];
    
    for (const keyword of matchedKeywords) {
        const relatedItemIds = discoveryLib.getItemIdsByKeyword(keyword);
        const undiscoveredItemIds = relatedItemIds.filter(itemId => !gameState.isDiscovered(itemId));
        
        // Check if this keyword is already in active or discarded state
        const isActive = gameState.activeKeywords.has(keyword);
        const isDiscarded = gameState.discardedKeywords.has(keyword);
        
        if (isActive) {
            errorActions.push({ type: 'KEYWORD_ALREADY_ACTIVE', keyword: keyword });
        } else if (isDiscarded) {
            errorActions.push({ type: 'KEYWORD_ALREADY_DISCARDED', keyword: keyword });
        } else if (undiscoveredItemIds.length === 0) {
            // If no undiscovered items relate to this keyword, add it to discarded
            successfulActions.push({ type: 'ADD_DISCARDED_KEYWORD', keyword: keyword });
        } else {
            // Add keyword to active keywords
            successfulActions.push({ 
                type: 'ADD_ACTIVE_KEYWORD', 
                keyword: keyword, 
                relatedItemIds: undiscoveredItemIds 
            });
        }
    }
    
    // Return successful actions if any exist, otherwise return error actions
    return successfulActions.length > 0 ? successfulActions : errorActions;
}

/**
 * Cleans the input string by normalizing whitespace and converting to lowercase
 * Uses the shared cleaning function from DiscoveryLib for consistency
 */
function cleanInput(input: string): string {
    return DiscoveryLib.getSearchableName(input);
} 