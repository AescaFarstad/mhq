import { GameState } from './GameState';
import { DiscoveryAction, DiscoverableItem, DiscoveryEvent } from '../types/discoveryTypes';
import { analyzeInput } from './DiscoveryTextwork';

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
    
    // Analyze the input to get discovery actions
    const actions = analyzeInput(input, gameState.lib.discovery, gameState);
    
    // Process each action
    for (const action of actions) {
        processDiscoveryAction(action, gameState);
    }
}

/**
 * Processes a single discovery action.
 * 
 * @param action - The discovery action to process
 * @param gameState - The game state to modify
 */
function processDiscoveryAction(action: DiscoveryAction, gameState: GameState): void {
    switch (action.type) {
        case 'DIRECT_DISCOVERY':
            discoverItem(action.item.id, 'direct', gameState, action.item);
            break;
            
        case 'ADD_ACTIVE_KEYWORD':
            // For Step 2, we only implement direct discovery
            // Keyword logic will be implemented in Step 3
            break;
            
        default:
            // No log entries for failed attempts - they're not user successes
            break;
    }
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
    method: 'direct' | 'brainstorm' | 'event',
    gameState: GameState,
    item?: DiscoverableItem
): void {
    // Check if already discovered
    if (gameState.discoveredItems.has(itemId)) {
        return;
    }
    
    // Mark as discovered - this is the centralized place for this logic
    gameState.discoveredItems.add(itemId);
    
    // Only create log entries for user submissions (direct discovery)
    if (method === 'direct') {
        const itemName = item ? getItemDisplayName(item) : itemId;
        addDiscoveryLogEntry(gameState, {
            type: 'direct_discovery',
            details: {
                itemId,
                itemName,
                itemType: item?.type
            }
        });
    }
    
    // TODO: Update keyword states (for Step 3)
    // This would involve checking if any active keywords should be moved to discarded
}

/**
 * Adds an entry to the discovery log
 */
function addDiscoveryLogEntry(gameState: GameState, event: DiscoveryEvent): void {
    gameState.discoveryLog.push(event);
    
    // Keep log size manageable
    const MAX_LOG_ENTRIES = 100;
    if (gameState.discoveryLog.length > MAX_LOG_ENTRIES) {
        gameState.discoveryLog = gameState.discoveryLog.slice(-MAX_LOG_ENTRIES);
    }
}

/**
 * Gets the display name for a discoverable item
 */
function getItemDisplayName(item: DiscoverableItem): string {
    if (item.originalItem.displayName) {
        return item.originalItem.displayName;
    }
    if (item.originalItem.name) {
        return item.originalItem.name;
    }
    return item.id;
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