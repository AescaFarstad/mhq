/**
 * Represents a discoverable item in the game (skill, building, attribute, etc.)
 */
export interface DiscoverableItem {
  /** Unique identifier for the item */
  id: string;
  /** Type of the discoverable item */
  type: 'skill' | 'skill_specialization' | 'building' | 'attribute' | 'attribute_category' | 'resource' | 'tab' | 'ui_state';
  /** Original item data reference */
  originalItem: any;
  /** Searchable name - cleaned version for matching (calculated from displayName) */
  searchableName: string;
  /** Keywords associated with this item (for keyword-based discovery) */
  keywords?: string[][];
}



/**
 * Actions that can result from analyzing player input
 */
export type DiscoveryAction = 
  | { type: 'DIRECT_DISCOVERY'; item: DiscoverableItem; xpAwarded?: number }
  | { type: 'BRAINSTORM_DISCOVERY'; item: DiscoverableItem; xpAwarded?: number; leadingKeywords?: string[] }
  | { type: 'ADD_ACTIVE_KEYWORD'; keyword: string; relatedItemIds: string[] }
  | { type: 'ADD_DISCARDED_KEYWORD'; keyword: string }
  | { type: 'NO_MATCH'; input: string }
  | { type: 'INVALID_INPUT'; input: string; reason: string }
  | { type: 'TOO_MANY_WORDS'; input: string; wordCount: number }
  | { type: 'ALREADY_DISCOVERED'; item: DiscoverableItem }
  | { type: 'KEYWORD_ALREADY_ACTIVE'; keyword: string }
  | { type: 'KEYWORD_ALREADY_DISCARDED'; keyword: string }
  | { type: 'CHAIN_XP_REWARD'; chainLength: number; xpAwarded: number };

export interface DiscoveryAttempt {
  tick: number;
  actions: DiscoveryAction[];
}

 