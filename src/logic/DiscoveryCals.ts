import type { GameState } from './GameState';

/**
 * Discovery calculation utilities for keyword selection and skill discovery analysis.
 * These functions are designed to be modular and accept parameters for flexibility.
 */

/**
 * Calculate discovery index for a skill based on discovered items and keyword counts
 * @param skillId - The skill ID to calculate for
 * @param gameState - The game state
 * @returns The calculated discovery index
 */
export function calculateSkillDiscoveryIndex(
  skillId: string, 
  gameState: GameState
): number {
  const DISCOVERED_WEIGHT = 5;
  const KEYWORD_WEIGHT = 1;
  let index = 0;
  
  // Main skill contribution
  if (gameState.isDiscovered(skillId)) {
    index += DISCOVERED_WEIGHT;
  } else {
    // Count active keywords for this skill
    for (const [, relatedItemIds] of gameState.activeKeywords) {
      if (relatedItemIds.includes(skillId)) {
        index += KEYWORD_WEIGHT;
      }
    }
  }
  
  // Specializations contribution
  const skillDef = gameState.lib.skills.getSkill(skillId);
  if (skillDef) {
    for (const specId of skillDef.specializations) {
      if (gameState.isDiscovered(specId)) {
        index += DISCOVERED_WEIGHT;
      } else {
        // Count active keywords for this specialization
        for (const [, relatedItemIds] of gameState.activeKeywords) {
          if (relatedItemIds.includes(specId)) {
            index += KEYWORD_WEIGHT;
          }
        }
      }
    }
  }
  
  return index;
}

/**
 * Get unmentioned keywords that are not active, discarded, or in crystal ball
 * Uses the keyword lookup from DiscoveryLib for optimized performance
 * @param gameState - The game state
 * @returns Set of unmentioned keywords
 */
export function getUnmentionedKeywords(gameState: GameState): Set<string> {
  // Get all keywords from the optimized keyword lookup
  const keywordLookup = gameState.lib.discovery.getKeywordLookup();
  const unmentionedKeywords = new Set<string>();
  
  // Convert crystal ball words to Set for fast lookup
  const crystalBallSet = new Set(gameState.crystalBallWords);
  
  // Filter out unavailable keywords directly into the result set
  for (const keyword of keywordLookup.keys()) {
    if (!gameState.activeKeywords.has(keyword) &&
      !gameState.discardedKeywords.has(keyword) &&
      !crystalBallSet.has(keyword)) {
      unmentionedKeywords.add(keyword);
    }
  }
  
  return unmentionedKeywords;
}

/**
 * Get keywords from the least discovered skills that the player has encountered
 * Distributes keywords evenly across the rarest skills to avoid clustering
 * Only considers undiscovered skills/specializations for keyword selection
 * @param gameState - The game state
 * @param targetCount - Number of keywords to return
 * @returns Array of keywords from rarest skills
 */
export function getRarestKeywords(
  gameState: GameState, 
  targetCount: number
): string[] {
  // Get all encountered but not fully discovered skills with their discovery indices
  const skillData: { skillId: string; discoveryIndex: number }[] = [];
  
  const allSkills = gameState.lib.skills.getAllSkills();
  for (const skillId of Object.keys(allSkills)) {
    if (gameState.isEncountered(skillId) && !gameState.isDiscovered(skillId)) {
      const discoveryIndex = calculateSkillDiscoveryIndex(skillId, gameState);
      skillData.push({ skillId, discoveryIndex });
    }
  }
  
  // Sort by discovery index (lowest first = rarest)
  skillData.sort((a, b) => a.discoveryIndex - b.discoveryIndex);
  
  // Only process the X rarest skills to avoid unnecessary work
  const maxSkillsToProcess = Math.min(skillData.length, targetCount + 1);
  const rarestSkills = skillData.slice(0, maxSkillsToProcess);
  
  // Get the fast lookup set for unmentioned keywords
  const unmentionedKeywords = getUnmentionedKeywords(gameState);
  
  // Build keyword pools for the rarest skills only (excluding discovered skills/specs)
  const skillKeywordPools = new Map<string, string[]>();
  
  for (const { skillId } of rarestSkills) {
    const keywordPool: string[] = [];
    
    // Get keywords for the main skill (only if not discovered)
    if (!gameState.isDiscovered(skillId)) {
      const skillItem = gameState.lib.discovery.getById(skillId);
      if (skillItem && skillItem.keywords) {
        for (const keywordArray of skillItem.keywords) {
          for (const keyword of keywordArray) {
            if (unmentionedKeywords.has(keyword)) {
              keywordPool.push(keyword);
            }
          }
        }
      }
    }
    
    // Get keywords for undiscovered specializations only
    const skillDef = gameState.lib.skills.getSkill(skillId);
    if (skillDef) {
      for (const specId of skillDef.specializations) {
        if (!gameState.isDiscovered(specId)) {
          const specItem = gameState.lib.discovery.getById(specId);
          if (specItem && specItem.keywords) {
            for (const keywordArray of specItem.keywords) {
              for (const keyword of keywordArray) {
                if (unmentionedKeywords.has(keyword)) {
                  keywordPool.push(keyword);
                }
              }
            }
          }
        }
      }
    }
    
    // Remove duplicates and store the pool
    const uniqueKeywords = [...new Set(keywordPool)];
    if (uniqueKeywords.length > 0) {
      skillKeywordPools.set(skillId, uniqueKeywords);
    }
  }
  
  // Distribute keywords evenly across skills in rounds
  const selectedKeywords: string[] = [];
  const usedKeywords = new Set<string>();
  
  while (selectedKeywords.length < targetCount && skillKeywordPools.size > 0) {
    let addedThisRound = false;
    
    // Go through each skill and try to pick one keyword
    for (const [skillId, keywordPool] of skillKeywordPools) {
      if (selectedKeywords.length >= targetCount) break;
      
      // Filter out already used keywords
      const availableFromThisSkill = keywordPool.filter(keyword => !usedKeywords.has(keyword));
      
      if (availableFromThisSkill.length > 0) {
        // Pick a random keyword from this skill's available pool
        const randomIndex = Math.floor(Math.random() * availableFromThisSkill.length);
        const selectedKeyword = availableFromThisSkill[randomIndex];
        
        selectedKeywords.push(selectedKeyword);
        usedKeywords.add(selectedKeyword);
        addedThisRound = true;
      } else {
        // This skill has no more available keywords, remove it
        skillKeywordPools.delete(skillId);
      }
    }
    
    // If we couldn't add any keywords this round, we're done
    if (!addedThisRound) {
      break;
    }
  }
  
  return selectedKeywords;
}

/**
 * Get keywords that relate to the most undiscovered items
 * Uses keyword lookup for fast estimation and maintains top-K results to avoid sorting
 * @param gameState - The game state
 * @param targetCount - Number of keywords to return
 * @returns Array of keywords with highest undiscovered item counts
 */
export function getJuicyKeywords(gameState: GameState, targetCount: number): string[] {
  const availableKeywords = getUnmentionedKeywords(gameState);
  const keywordLookup = gameState.lib.discovery.getKeywordLookup();
  
  // Maintain top-K results without full sorting
  const topResults: { keyword: string; undiscoveredCount: number }[] = [];
  let minTopCount = 0; // Minimum count in our top results
  
  for (const keyword of availableKeywords) {
    // Fast estimation: get all related items from keyword lookup
    const relatedItemIds = keywordLookup.get(keyword)!;
    
    // Early exit if this keyword can't possibly be in top-K
    if (topResults.length >= targetCount && relatedItemIds.length <= minTopCount) {
      continue; // Skip expensive counting - this can't beat our worst top result
    }
    
    // Count actual undiscovered items (only when we might need it)
    const undiscoveredCount = relatedItemIds.filter(itemId => !gameState.isDiscovered(itemId)).length;
    
    // Early exit if count is still too low
    if (topResults.length >= targetCount && undiscoveredCount <= minTopCount) {
      continue;
    }
    
    // Add to top results
    topResults.push({ keyword, undiscoveredCount });
    
    // Maintain top-K by removing worst if we exceed targetCount
    if (topResults.length > targetCount) {
      // Find and remove the minimum
      let minIndex = 0;
      let minCount = topResults[0].undiscoveredCount;
      for (let i = 1; i < topResults.length; i++) {
        if (topResults[i].undiscoveredCount < minCount) {
          minCount = topResults[i].undiscoveredCount;
          minIndex = i;
        }
      }
      topResults.splice(minIndex, 1);
    }
    
    // Update minimum threshold for early exits
    if (topResults.length >= targetCount) {
      minTopCount = Math.min(...topResults.map(r => r.undiscoveredCount));
    }
  }
  
  // Sort only the small top-K results and return keywords
  topResults.sort((a, b) => b.undiscoveredCount - a.undiscoveredCount);
  return topResults.map(r => r.keyword);
}

/**
 * Get random keywords from available pool
 * @param gameState - The game state
 * @param targetCount - Number of keywords to return
 * @returns Array of randomly selected keywords
 */
export function getRandomKeywords(gameState: GameState, targetCount: number): string[] {
  const availableKeywords = getUnmentionedKeywords(gameState);
  
  const keywordArray = Array.from(availableKeywords);
  if (targetCount >= availableKeywords.size) {
    return keywordArray;
  }
  
  // Optimized partial shuffle - only shuffle what we need
  for (let i = 0; i < targetCount && i < keywordArray.length - 1; i++) {
    const j = i + Math.floor(Math.random() * (keywordArray.length - i));
    [keywordArray[i], keywordArray[j]] = [keywordArray[j], keywordArray[i]];
  }
  
  return keywordArray.slice(0, targetCount);
}