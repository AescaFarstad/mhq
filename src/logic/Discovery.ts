import { GameState } from './GameState';
import { DiscoveryAction, DiscoverableItem, DiscoveryAttempt } from '../types/discoveryTypes';
import { analyzeInput } from './DiscoveryTextwork';
import { wordify } from '../utils/stringUtils';
import { C } from './lib/C';
import { Stats } from './core/Stats';
import { Character } from './Character';
import type { EventDispatcherParameter } from './core/Stat';

/**
 * Stateless module containing the core discovery logic.
 * This module acts upon GameState but holds no internal state.
 */

/**
 * Static function for handling inspiration level-up events.
 * Called when inspiration crosses the inspirationMax threshold.
 * Accounts for the possibility that the event might be triggered unnecessarily.
 */
export function handleInspirationLevelUp(_stat: EventDispatcherParameter, gameState: GameState): void {
    // Check if inspiration is actually >= inspirationMax before processing
    // This handles cases where the event might be queued but conditions change before processing
    while (gameState.inspiration.value >= gameState.inspirationMax.value) {
        Stats.modifyStat(gameState.inspiration, -gameState.inspirationMax.value, gameState.connections);
        Stats.modifyStat(gameState.inspirationLevel, 1, gameState.connections);
        Stats.modifyStat(gameState.inspirationCharges, 1, gameState.connections);
    }
}

/**
 * Calculates XP reward for a discovery chain using triangular numbers.
 * Chain of 1: 0 XP, Chain of 2: 1 XP, Chain of 3: 3 XP, Chain of 4: 6 XP, etc.
 */
function calculateChainXp(chainLength: number): number {
    if (chainLength < 2) return 0;
    return (chainLength - 1) * chainLength / 2;
}

/**
 * Determines if a discovery action represents a successful discovery.
 * Used for filtering and counting successful discoveries.
 */
export function isSuccessfulDiscoveryAction(action: DiscoveryAction): boolean {
    return action.type === 'DIRECT_DISCOVERY' || 
           action.type === 'BRAINSTORM_DISCOVERY' ||
           action.type === 'ADD_ACTIVE_KEYWORD' ||
           action.type === 'ADD_DISCARDED_KEYWORD';
}

function awardXpToProtagonist(gameState: GameState, xpAmount: number): void {
    if (xpAmount <= 0) return;
    
    const protagonist = Character.getProtagonistCharacter(gameState);
    if (!protagonist) {
        console.warn('awardXpToProtagonist: No protagonist character found');
        return;
    }
    
    Stats.modifyStat(protagonist.xp, xpAmount, gameState.connections);
}

/**
 * Calculates XP amount for discovering an item based on its type and discovery method.
 * @param item - The discoverable item
 * @param method - How the item was discovered ('direct', 'brainstorm', 'event')
 * @returns The XP amount to award, or 0 if no XP should be awarded
 */
function calculateDiscoveryXp(item: DiscoverableItem, method: 'direct' | 'brainstorm' | 'event'): number {
    // No XP for event discoveries (bulk discoveries from debug commands, etc.)
    if (method === 'event') return 0;
    
    if (method === 'brainstorm') {
        switch (item.type) {
            case 'skill_specialization':
                return C.DISCOVERY_XP_BRAINSTORM_SPECIALIZATION;
            case 'skill':
                return C.DISCOVERY_XP_BRAINSTORM_SKILL;
            // Brainstorming only applies to skills and specializations currently
            default:
                return 0;
        }
    } else if (method === 'direct') {
        switch (item.type) {
            case 'skill_specialization':
                return C.DISCOVERY_XP_DIRECT_SPECIALIZATION;
            case 'skill':
                return C.DISCOVERY_XP_DIRECT_SKILL;
            case 'attribute':
                return C.DISCOVERY_XP_DIRECT_ATTRIBUTE;
            case 'attribute_category':
                return C.DISCOVERY_XP_DIRECT_ATTRIBUTE_CATEGORY;
            case 'building':
                return C.DISCOVERY_XP_DIRECT_BUILDING;
            default:
                return 0;
        }
    }
    
    return 0;
}

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
    
    // Simple queue-based processing: just strings to analyze
    const analysisQueue: string[] = [inputTrimmed];
    const processedInputs = new Set<string>();
    const allActions: DiscoveryAction[] = [];
    
    // Process all inputs in queue until none remain
    while (analysisQueue.length > 0) {
        const currentInput = analysisQueue.shift()!;
        
        // Skip if already processed this exact input
        if (processedInputs.has(currentInput)) {
            continue;
        }
        processedInputs.add(currentInput);
        
        // Analyze input to get potential actions
        const actions = analyzeInput(currentInput, gameState.lib.discovery, gameState);
        
        // Process each action immediately, checking current game state
        for (const action of actions) {
            const processedActions = processActionImmediate(action, gameState, analysisQueue);
            allActions.push(...processedActions);
        }
    }
    
    // Filter actions - remove errors if there are successes
    const filteredActions = filterDiscoveryActions(allActions);
    
    // Calculate and award individual discovery XP, and add XP info to actions
    for (const action of filteredActions) {
        if (action.type === 'DIRECT_DISCOVERY') {
            const xpAmount = calculateDiscoveryXp(action.item, 'direct');
            if (xpAmount > 0) {
                awardXpToProtagonist(gameState, xpAmount);
                action.xpAwarded = xpAmount;
            }
        } else if (action.type === 'BRAINSTORM_DISCOVERY') {
            const xpAmount = calculateDiscoveryXp(action.item, 'brainstorm');
            if (xpAmount > 0) {
                awardXpToProtagonist(gameState, xpAmount);
                action.xpAwarded = xpAmount;
            }
        }
    }
    
    // Calculate and award chain XP if there are multiple successful discoveries
    const discoveryCount = filteredActions.filter(isSuccessfulDiscoveryAction).length;
    
    if (discoveryCount >= 2) {
        const chainXp = calculateChainXp(discoveryCount);
        awardXpToProtagonist(gameState, chainXp);
        
        // Add chain XP action to the filtered actions
        filteredActions.push({
            type: 'CHAIN_XP_REWARD',
            chainLength: discoveryCount,
            xpAwarded: chainXp
        });
    }
    
    // Add filtered actions as a single log entry with the current tick
    if (filteredActions.length > 0) {
        const discoveryAttempt: DiscoveryAttempt = {
            tick: gameState.tick,
            actions: filteredActions
        };
        gameState.discoveryAnalysisLog.push(discoveryAttempt);
    }
    
    // Keep analysis log limited to 10 entries
    const MAX_LOG_ENTRIES = 10;
    if (gameState.discoveryAnalysisLog.length > MAX_LOG_ENTRIES) {
        gameState.discoveryAnalysisLog = gameState.discoveryAnalysisLog.slice(-MAX_LOG_ENTRIES);
    }
}

/**
 * Processes a single discovery action immediately, checking current game state.
 * Returns the actual actions that occurred and adds cascading inputs to the queue.
 */
function processActionImmediate(
    action: DiscoveryAction, 
    gameState: GameState, 
    analysisQueue: string[]
): DiscoveryAction[] {
    const results: DiscoveryAction[] = [];
    
    switch (action.type) {
        case 'DIRECT_DISCOVERY':
            // Check if item is already discovered at processing time
            if (gameState.isDiscovered(action.item.id)) {
                results.push({ type: 'ALREADY_DISCOVERED', item: action.item });
            } else {
                // Discover the item (XP will be calculated and awarded in processDiscoveryAttempt)
                discoverItem(action.item.id, 'direct', gameState, action.item);
                results.push(action); // The original action succeeded
                
                // Add cascading analysis for the discovered item's name
                if (action.item.searchableName && !analysisQueue.includes(action.item.searchableName)) {
                    analysisQueue.push(action.item.searchableName);
                }
                
                // Check for brainstorm discoveries and add to queue
                const brainstormActions = checkForBrainstormDiscovery(gameState);
                for (const brainstormAction of brainstormActions) {
                    if (brainstormAction.type === 'BRAINSTORM_DISCOVERY') {
                        results.push(brainstormAction);
                        
                        // Add brainstorm item's name for cascading analysis
                        if (brainstormAction.item.searchableName && !analysisQueue.includes(brainstormAction.item.searchableName)) {
                            analysisQueue.push(brainstormAction.item.searchableName);
                        }
                    }
                }
            }
            break;
            
        case 'ADD_ACTIVE_KEYWORD':
            // Check keyword state at processing time
            if (gameState.activeKeywords.has(action.keyword)) {
                results.push({ type: 'KEYWORD_ALREADY_ACTIVE', keyword: action.keyword });
            } else if (gameState.discardedKeywords.has(action.keyword)) {
                results.push({ type: 'KEYWORD_ALREADY_DISCARDED', keyword: action.keyword });
            } else {
                // Filter to currently undiscovered items
                const undiscoveredItemIds = action.relatedItemIds.filter(itemId => 
                    !gameState.isDiscovered(itemId)
                );
                
                if (undiscoveredItemIds.length === 0) {
                    // All related items are discovered, add to discarded
                    gameState.discardedKeywords.add(action.keyword);
                    
                    // Grant inspiration for discovering a keyword (even if discarded)
                    gameState.addInspiration(1);
                    
                    results.push({ type: 'ADD_DISCARDED_KEYWORD', keyword: action.keyword });
                } else {
                    // Add to active keywords with current undiscovered items
                    gameState.activeKeywords.set(action.keyword, undiscoveredItemIds);
                    
                    // Mark all items as encountered
                    for (const itemId of undiscoveredItemIds) {
                        gameState.markAsEncountered(itemId);
                    }
                    
                    // Grant inspiration for discovering a keyword
                    gameState.addInspiration(1);
                    
                    results.push({ 
                        type: 'ADD_ACTIVE_KEYWORD', 
                        keyword: action.keyword, 
                        relatedItemIds: undiscoveredItemIds 
                    });
                    
                    // Check for keywords overflow discovery
                    if (gameState.activeKeywords.size >= C.KEYWORDS_HEADER_HIDE_THRESHOLD) {
                        const overflowItem = gameState.lib.discovery.getById(C.DISCOVERY_KEYWORDS_OVERFLOW);
                        if (overflowItem && !gameState.isDiscovered(overflowItem.id)) {
                            discoverItem(overflowItem.id, 'event', gameState);
                            // Special action for keywords overflow with XP
                            const overflowAction: DiscoveryAction = {
                                type: 'DIRECT_DISCOVERY',
                                item: overflowItem,
                                xpAwarded: C.DISCOVERY_XP_KEYWORDS_OVERFLOW
                            };
                            results.push(overflowAction);
                            // Award XP immediately for this special discovery
                            awardXpToProtagonist(gameState, C.DISCOVERY_XP_KEYWORDS_OVERFLOW);
                        }
                    }
                    
                    // Check for brainstorm discoveries after keyword addition
                    const brainstormActions = checkForBrainstormDiscovery(gameState);
                    for (const brainstormAction of brainstormActions) {
                        if (brainstormAction.type === 'BRAINSTORM_DISCOVERY') {
                            results.push(brainstormAction);
                            
                            // Add brainstorm item's name for cascading analysis
                            if (brainstormAction.item.searchableName && !analysisQueue.includes(brainstormAction.item.searchableName)) {
                                analysisQueue.push(brainstormAction.item.searchableName);
                            }
                        }
                    }
                }
            }
            break;
            
        default:
            // For all other action types (errors, info), just pass through
            results.push(action);
            break;
    }
    
    return results;
}

/**
 * Filters discovery actions to remove error actions if there are any successes.
 * This ensures that if any part of a discovery chain succeeds, we don't show
 * error messages for other parts that failed.
 * 
 * @param actions - All actions from the discovery attempt
 * @returns Filtered actions with errors removed if there were successes
 */
function filterDiscoveryActions(actions: DiscoveryAction[]): DiscoveryAction[] {
    // Check if there are any successful actions
    const hasSuccess = actions.some(isSuccessfulDiscoveryAction);
    
    if (hasSuccess) {
        // Filter out error/informational actions if there were successes
        return actions.filter(action => 
            action.type !== 'NO_MATCH' && 
            action.type !== 'INVALID_INPUT' &&
            action.type !== 'ALREADY_DISCOVERED' &&
            action.type !== 'KEYWORD_ALREADY_ACTIVE' &&
            action.type !== 'KEYWORD_ALREADY_DISCARDED'
        );
    }
    
    // If no successes, keep all actions to show what went wrong
    return actions;
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
    if (gameState.discoveredItems.has(itemId)) {
        return;
    }
    
    gameState.discoveredItems.add(itemId);
    
    // Mark as encountered since discovered items are always encountered
    gameState.markAsEncountered(itemId);
    
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
        // Note: No inspiration granted here as keywords were already discovered when initially added to active
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
        const brainstormAction: DiscoveryAction = {
            type: 'BRAINSTORM_DISCOVERY',
            item: item,
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