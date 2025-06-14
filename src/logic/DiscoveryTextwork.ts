import { DiscoveryAction } from '../types/discoveryTypes';
import { DiscoveryLib } from './lib/DiscoveryLib';
import { GameState } from './GameState';

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
        // For Step 1: Only implement direct name search for single words
        // Keyword search will be added in Step 3
        return performDirectNameSearch(cleanedInput, discoveryLib, gameState);
    } else if (wordCount === 2) {
        // Two words: only perform direct name search
        return performDirectNameSearch(cleanedInput, discoveryLib, gameState);
    } else if (wordCount === 3) {
        // Three words: only perform direct name search
        return performDirectNameSearch(cleanedInput, discoveryLib, gameState);
    } else {
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
function performDirectNameSearch(
    cleanedInput: string,
    discoveryLib: DiscoveryLib,
    gameState: GameState
): DiscoveryAction[] {
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
 * Cleans the input string by normalizing whitespace and converting to lowercase
 */
function cleanInput(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' '); // Normalize multiple spaces to single space
} 