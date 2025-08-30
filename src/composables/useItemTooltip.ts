import { ref, inject, nextTick } from 'vue';
import type { GameState } from '../logic/GameState';
import { obfuscateString } from '../utils/stringUtils';

// No interface needed now - just pass obfuscation percentage directly

export function useItemTooltip() {
  const gameState = inject<GameState>('gameState');

  // Tooltip state
  const tooltipVisible = ref(false);
  const tooltipX = ref(0);
  const tooltipY = ref(0);
  const tooltipContent = ref('');
  const tooltipItemId = ref('');
  const tooltipItemName = ref('');
  const tooltipImageType = ref('');
  const tooltipDescriptionOnly = ref('');
  const tooltipKeywords = ref<string[]>([]);



  const getItemDescription = (itemId: string, itemType: string, obfuscationPercentage?: number): string => {
  if (!gameState) return '';
  
  try {
    let description = '';
    
    if (itemType === 'skill') {
    const skill = gameState.lib.skills.getSkill(itemId);
    description = skill?.description || '';
    } else if (itemType === 'skill_specialization') {
    const spec = gameState.lib.skills.getSpecialization(itemId);
    description = spec?.description || '';
    } else if (itemType === 'building') {
    const building = gameState.lib.buildings.getBuilding(itemId);
    description = building?.description || '';
    } else if (itemType === 'attribute_category') {
    // For attribute categories, get the category description
    const categoryDef = gameState.lib.attributes.getCategoryDefinition(itemId);
    description = categoryDef?.description || '';
    } else if (itemType === 'attribute') {
    // For individual attributes, we need to find which category it belongs to
    // The itemId might come as "category.attribute" (e.g., "social.empathy")
    // so we need to extract just the attribute name
    const attributeName = itemId.includes('.') ? itemId.split('.').pop() : itemId;
    
    const attributeDefinitions = gameState.lib.attributes.getAttributeDefinitions();
    
    for (const [, categoryDef] of Object.entries(attributeDefinitions)) {
      if (attributeName && categoryDef.attributes[attributeName]) {
      description = categoryDef.attributes[attributeName].description || '';
      break;
      }
    }
    }
    
    // Apply obfuscation if percentage provided
    if (obfuscationPercentage !== undefined && obfuscationPercentage > 0 && description) {
    return obfuscateString(description, obfuscationPercentage, 0, true); // Always use symbols
    }
    
    return description;
  } catch (error) {
    console.warn(`Failed to get description for ${itemType} ${itemId}:`, error);
  }
  
  return '';
  };

  const getItemName = (itemId: string, itemType: string, obfuscationPercentage?: number): string => {
  if (!gameState) return itemId;
  
  try {
    let name = '';
    
    if (itemType === 'skill') {
    const skill = gameState.lib.skills.getSkill(itemId);
    name = skill?.displayName || itemId;
    } else if (itemType === 'skill_specialization') {
    const spec = gameState.lib.skills.getSpecialization(itemId);
    name = spec?.displayName || itemId;
    } else if (itemType === 'building') {
    const building = gameState.lib.buildings.getBuilding(itemId);
    name = building?.name || itemId;
    } else if (itemType === 'attribute_category') {
    const categoryDef = gameState.lib.attributes.getCategoryDefinition(itemId);
    name = categoryDef?.displayName || itemId;
    } else if (itemType === 'attribute') {
    // Extract attribute name from dotted ID (e.g., "social.empathy" -> "empathy")
    const attributeName = itemId.includes('.') ? itemId.split('.').pop() : itemId;
    const attributeDefinitions = gameState.lib.attributes.getAttributeDefinitions();
    for (const [, categoryDef] of Object.entries(attributeDefinitions)) {
      if (attributeName && categoryDef.attributes[attributeName]) {
      name = categoryDef.attributes[attributeName].displayName || itemId;
      break;
      }
    }
    if (!name) name = itemId;
    }
    
    // Apply obfuscation if percentage provided
    if (obfuscationPercentage !== undefined && obfuscationPercentage > 0 && name) {
    return obfuscateString(name, obfuscationPercentage, 0, true); // Always use symbols
    }
    
    return name;
  } catch (error) {
    console.warn(`Failed to get name for ${itemType} ${itemId}:`, error);
  }
  
  return itemId;
  };

  const showItemTooltip = (
  event: MouseEvent, 
  itemId: string, 
  itemType: string, 
  containerRef?: HTMLElement,
  analysisLog?: any[], // Optional analysis log to search for keywords
  obfuscationPercentage?: number
  ) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const containerRect = containerRef?.getBoundingClientRect();
  
  // Different positioning for different tooltip types
  let yOffset;
  if (itemType === 'skill' || itemType === 'skill_specialization') {
    // For skills/specs with images, position higher to accommodate larger tooltip
    yOffset = -120;
  } else {
    // For attributes/categories/buildings with description only, position closer to text
    yOffset = -60;
  }
  
  if (containerRect) {
    // Use container-based positioning (for DiscoveryLog)
    tooltipX.value = containerRect.left;
    tooltipY.value = rect.top + yOffset;
  } else {
    // Use element-based positioning (for SkillBrowser and others)
    tooltipX.value = rect.left;
    tooltipY.value = rect.top + yOffset;
  }
  
  // Get description and name (with obfuscation if needed)
  const description = getItemDescription(itemId, itemType, obfuscationPercentage);
  const itemName = getItemName(itemId, itemType, obfuscationPercentage);
  
  // Set tooltip info for reference
  // Use "unknown" for image ID if obfuscation is applied
  const imageItemId = (obfuscationPercentage !== undefined && obfuscationPercentage > 0) ? 'unknown' : itemId;
  tooltipItemId.value = imageItemId;
  tooltipItemName.value = itemName;
  tooltipImageType.value = itemType;
  tooltipDescriptionOnly.value = description;
  
  // Reset keywords
  tooltipKeywords.value = [];
  
  // Find keywords for skill/specialization discoveries
  if ((itemType === 'skill' || itemType === 'skill_specialization') && analysisLog) {
    for (const attempt of analysisLog.slice(-10)) {
    for (const action of attempt.actions) {
      if ((action.type === 'DIRECT_DISCOVERY' || action.type === 'BRAINSTORM_DISCOVERY') && 
        action.item.id === itemId && action.type === 'BRAINSTORM_DISCOVERY') {
      const leadingKeywords = action.leadingKeywords || [];
      if (leadingKeywords.length > 0) {
        tooltipKeywords.value = leadingKeywords;
        break;
      }
      }
    }
    if (tooltipKeywords.value.length > 0) break;
    }
  }
  
  // Set content for non-skill items (attributes, categories, buildings)
  if (itemType !== 'skill' && itemType !== 'skill_specialization') {
    tooltipContent.value = description;
  } else {
    tooltipContent.value = 'skill'; // Just a flag to show the tooltip
  }
  
  if (description || itemName) {
    tooltipVisible.value = true;
  }
  };

  const hideTooltip = () => {
  tooltipVisible.value = false;
  };

  const setupItemNameHoverListeners = (analysisLog?: any[]) => {
  // Remove existing listeners to avoid duplicates
  const existingElements = document.querySelectorAll('.hoverable-item-name');
  existingElements.forEach(el => {
    el.removeEventListener('mouseenter', handleItemHover);
    el.removeEventListener('mouseleave', hideTooltip);
  });

  // Add listeners to current item names
  nextTick(() => {
    const itemNameElements = document.querySelectorAll('.hoverable-item-name');
    itemNameElements.forEach(el => {
    el.addEventListener('mouseenter', (event) => handleItemHover(event, analysisLog));
    el.addEventListener('mouseleave', hideTooltip);
    });
  });
  };

  const handleItemHover = (event: Event, analysisLog?: any[]) => {
  const target = event.target as HTMLElement;
  const itemId = target.getAttribute('data-item-id');
  const itemType = target.getAttribute('data-item-type');
  
  if (itemId && itemType) {
    showItemTooltip(event as MouseEvent, itemId, itemType, undefined, analysisLog);
  }
  };

  return {
  // State
  tooltipVisible,
  tooltipX,
  tooltipY,
  tooltipContent,
  tooltipItemId,
  tooltipItemName,
  tooltipImageType,
  tooltipDescriptionOnly,
  tooltipKeywords,
  
  // Methods
  showItemTooltip,
  hideTooltip,
  setupItemNameHoverListeners,
  getItemDescription,
  getItemName
  };
} 