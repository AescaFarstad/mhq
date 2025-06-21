import { GameState } from './GameState';
import { DiscoveryAction, DiscoverableItem } from '../types/discoveryTypes';
import { analyzeInput } from './DiscoveryTextwork';
import { wordify } from '../utils/stringUtils';

/**
 * Stateless module containing the core discovery logic.
 * This module acts upon GameState but holds no internal state.
 */

/**
 * Processes a discovery attempt from player input.
 * This is the main entry point called by InputProcessor.
 * 
 * @param input - The player's input string
 * @param gameState - The game state to modify
 */
export function processDiscoveryAttempt(input: string, gameState: GameState): void {
    // Remove the word and its variations from crystal ball if they exist there
    const inputTrimmed = input.trim();
    if (inputTrimmed) {
        const wordVariations = wordify(inputTrimmed.toLowerCase());
        // Also check the original input for exact matches
        const allVariationsToCheck = [inputTrimmed, inputTrimmed.toLowerCase(), ...wordVariations];
        
        for (const variation of allVariationsToCheck) {
            const wordIndex = gameState.crystalBallWords.indexOf(variation);
            if (wordIndex > -1) {
                gameState.crystalBallWords.splice(wordIndex, 1);
            }
        }
    }
    
    // Analyze the input to get discovery actions
    const actions = analyzeInput(input, gameState.lib.discovery, gameState);
    
    // Don't add to log yet - we want to collect all actions from this attempt first
    
    // Process each action and collect any brainstorm actions that result
    const allActionsFromAttempt: DiscoveryAction[] = [...actions];
    
    for (const action of actions) {
        const brainstormActions = processDiscoveryAction(action, gameState);
        allActionsFromAttempt.push(...brainstormActions);
    }
    
    // Add all actions from this attempt as a single log entry
    if (allActionsFromAttempt.length > 0) {
        gameState.discoveryAnalysisLog.push(allActionsFromAttempt);
    }
    
    // Keep analysis log limited to 10 entries (do this at the end after all processing)
    const MAX_LOG_ENTRIES = 10;
    if (gameState.discoveryAnalysisLog.length > MAX_LOG_ENTRIES) {
        gameState.discoveryAnalysisLog = gameState.discoveryAnalysisLog.slice(-MAX_LOG_ENTRIES);
    }
}

/**
 * Processes a single discovery action.
 * 
 * @param action - The discovery action to process
 * @param gameState - The game state to modify
 * @returns Array of brainstorm actions that resulted from this action
 */
function processDiscoveryAction(action: DiscoveryAction, gameState: GameState): DiscoveryAction[] {
    const brainstormActions: DiscoveryAction[] = [];
    
    switch (action.type) {
        case 'DIRECT_DISCOVERY':
            discoverItem(action.item.id, 'direct', gameState, action.item);
            break;
            
        case 'ADD_ACTIVE_KEYWORD':
            // Add keyword to active keywords map
            gameState.activeKeywords.set(action.keyword, action.relatedItemIds);
            
            // Mark all items with this keyword as encountered
            for (const itemId of action.relatedItemIds) {
                gameState.markAsEncountered(itemId);
            }
            
            // Check for brainstorm discovery after the keyword is properly added
            const brainstormActionsFromKeyword = checkForBrainstormDiscovery(gameState);
            brainstormActions.push(...brainstormActionsFromKeyword);
            break;
            
        case 'ADD_DISCARDED_KEYWORD':
            // Add keyword to discarded keywords set
            gameState.discardedKeywords.add(action.keyword);
            break;
            
        default:
            // No log entries for failed attempts - they're not user successes
            break;
    }
    
    return brainstormActions;
}

/**
 * The single, centralized function for discovering an item.
 * Any system (events, direct input, etc.) that needs to discover something must call this function.
 * 
 * @param itemId - The ID of the item to discover
 * @param method - How the item was discovered ('direct', 'brainstorm', 'event')
 * @param gameState - The game state to modify
 * @param item - The discoverable item object (optional, for additional context)
 */
export function discoverItem(
    itemId: string,
    _method: 'direct' | 'brainstorm' | 'event',
    gameState: GameState,
    _item?: DiscoverableItem
): void {
    // Check if already discovered
    if (gameState.discoveredItems.has(itemId)) {
        return;
    }
    
    // Mark as discovered - this is the centralized place for this logic
    gameState.discoveredItems.add(itemId);
    
    // Mark as encountered since discovered items are always encountered
    gameState.markAsEncountered(itemId);
    
    // Note: Log entries are no longer managed here - they are handled by checkForBrainstormDiscovery
    // for brainstorm discoveries, and by processDiscoveryAttempt for direct discoveries
    
    // Update keyword states - check if any active keywords should be moved to discarded
    updateKeywordStates(gameState);
}

/**
 * Updates keyword states after an item is discovered.
 * Moves keywords from active to discarded if they no longer relate to any undiscovered items.
 */
function updateKeywordStates(gameState: GameState): void {
    const keywordsToDiscard: string[] = [];
    
    // Check each active keyword
    for (const [keyword, relatedItemIds] of gameState.activeKeywords) {
        // Filter to only undiscovered items
        const undiscoveredItemIds = relatedItemIds.filter(itemId => !gameState.isDiscovered(itemId));
        
        if (undiscoveredItemIds.length === 0) {
            // No more undiscovered items for this keyword, move it to discarded
            keywordsToDiscard.push(keyword);
        } else {
            // Update the active keyword with the filtered list
            gameState.activeKeywords.set(keyword, undiscoveredItemIds);
        }
    }
    
    // Move keywords to discarded
    for (const keyword of keywordsToDiscard) {
        gameState.activeKeywords.delete(keyword);
        gameState.discardedKeywords.add(keyword);
    }
}

/**
 * Checks if any undiscovered items have accumulated enough keywords for brainstorm discovery.
 * Returns all brainstorm discovery actions instead of adding them to the log.
 */
function checkForBrainstormDiscovery(gameState: GameState): DiscoveryAction[] {
    const threshold = gameState.discoveryThreshold.value;
    const discoveredItems: Array<{ itemId: string; item: DiscoverableItem; leadingKeywords: string[] }> = [];
    let foundDiscovery = false;
    
    do {
        foundDiscovery = false;
        const itemKeywordCounts = new Map<string, string[]>();
        
        // Count keywords for each undiscovered item
        for (const [keyword, relatedItemIds] of gameState.activeKeywords) {
            for (const itemId of relatedItemIds) {
                if (!gameState.isDiscovered(itemId)) {
                    if (!itemKeywordCounts.has(itemId)) {
                        itemKeywordCounts.set(itemId, []);
                    }
                    itemKeywordCounts.get(itemId)!.push(keyword);
                }
            }
        }
        
        // Check each item against threshold
        for (const [itemId, keywords] of itemKeywordCounts) {
            if (keywords.length >= threshold) {
                // Get the item for display purposes
                const item = gameState.lib.discovery.getById(itemId);
                if (item) {
                    // Capture the leading keywords BEFORE calling discoverItem
                    // because discoverItem will update keyword states and potentially remove them
                    const leadingKeywords = [...keywords];
                    discoveredItems.push({ itemId, item, leadingKeywords });
                    discoverItem(itemId, 'brainstorm', gameState, item);
                    foundDiscovery = true;
                    break; // Exit the loop to recheck from the beginning
                }
            }
        }
    } while (foundDiscovery); // Keep checking until no new discoveries are made
    
    // Return brainstorm discovery actions with the keywords that led to discovery
    const brainstormActions: DiscoveryAction[] = [];
    for (const { item, leadingKeywords } of discoveredItems) {
        const brainstormAction: DiscoveryAction & { isBrainstorm?: boolean; leadingKeywords?: string[] } = {
            type: 'DIRECT_DISCOVERY',
            item: item,
            isBrainstorm: true,
            leadingKeywords: leadingKeywords
        };
        brainstormActions.push(brainstormAction);
    }
    
    return brainstormActions;
}



// === Bulk Discovery Functions ===
// These functions are moved here from effects.ts and use the discovery lib to filter by type

export function discoverAllBuildings(gameState: GameState): void {
    const discoveryLib = gameState.lib.discovery;
    for (const [itemId, item] of discoveryLib.getAllItems()) {
        if (item.type === 'building') {
            discoverItem(itemId, 'event', gameState);
        }
    }
}

export function discoverAllSkills(gameState: GameState): void {
    const discoveryLib = gameState.lib.discovery;
    for (const [itemId, item] of discoveryLib.getAllItems()) {
        if (item.type === 'skill' || item.type === 'skill_specialization') {
            discoverItem(itemId, 'event', gameState);
        }
    }
    // Also discover attributes since skills reference them
    discoverAllAttributes(gameState);
}

export function discoverAllAttributes(gameState: GameState): void {
    const discoveryLib = gameState.lib.discovery;
    for (const [itemId, item] of discoveryLib.getAllItems()) {
        if (item.type === 'attribute' || item.type === 'attribute_category') {
            discoverItem(itemId, 'event', gameState);
        }
    }
}

export function discoverAllResources(gameState: GameState): void {
    const discoveryLib = gameState.lib.discovery;
    for (const [itemId, item] of discoveryLib.getAllItems()) {
        if (item.type === 'resource') {
            discoverItem(itemId, 'event', gameState);
        }
    }
}

export function discoverAllTabs(gameState: GameState): void {
    const discoveryLib = gameState.lib.discovery;
    for (const [itemId, item] of discoveryLib.getAllItems()) {
        if (item.type === 'tab') {
            discoverItem(itemId, 'event', gameState);
        }
    }
}

export function discoverAll(gameState: GameState): void {
    // Use the individual discovery functions for consistency
    discoverAllBuildings(gameState);
    discoverAllSkills(gameState);
    discoverAllAttributes(gameState);
    discoverAllResources(gameState);
    discoverAllTabs(gameState);
}

/**
 * Counts how many active keywords are associated with a specific item
 * @param itemId - The ID of the item to check
 * @param gameState - The game state to check
 * @returns The number of active keywords that relate to this item
 */
export function countActiveKeywordsForItem(itemId: string, gameState: GameState): number {
    let count = 0;
    for (const [, relatedItemIds] of gameState.activeKeywords) {
        if (relatedItemIds.includes(itemId)) {
            count++;
        }
    }
    return count;
}

/**
 * Marks all items that have active keywords as encountered
 * @param gameState - The game state to update
 */
export function markActiveKeywordItemsAsEncountered(gameState: GameState): void {
    for (const [, relatedItemIds] of gameState.activeKeywords) {
        for (const itemId of relatedItemIds) {
            gameState.markAsEncountered(itemId);
        }
    }
}

/**
 * Marks all existing discovered items as encountered
 * This should be called during game initialization to ensure consistency
 * @param gameState - The game state to update
 */
export function markExistingDiscoveredItemsAsEncountered(gameState: GameState): void {
    for (const itemId of gameState.discoveredItems) {
        gameState.markAsEncountered(itemId);
    }
} 