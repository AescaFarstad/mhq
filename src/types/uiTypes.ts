// Define shared interfaces for UI data structures

/**
 * Basic character information used in lists.
 */
export interface SimpleCharacterInfo {
  id: string;
  name: string;
  level: number;
  upkeep: number;
}

/**
 * Structure for a single attribute display.
 */
export interface AttributeUIInfo {
  key: string;
  displayName: string;
  value: number;
  description?: string;
}

/**
 * Structure for a category of attributes, including nested attributes.
 */
export interface AttributeCategoryUIInfo {
  key: string;
  displayName: string;
  value: number;
  description?: string;
  attributes: AttributeUIInfo[]; // Nested attributes
}

/**
 * Detailed character information for the selected character.
 */
export interface SelectedCharacterInfo extends SimpleCharacterInfo {
  bio: string;
  attributes: AttributeCategoryUIInfo[];
  skills: SkillUIInfo[];
}

/**
 * Structure for a specialization of a skill in the UI.
 */
export interface SkillSpecializationUIInfo {
  id: string;
  displayName: string;
  description: string;
  level: number;
  proficiency: number;
}

/**
 * Structure for a single skill in the UI.
 */
export interface SkillUIInfo {
  id: string;
  displayName: string;
  description: string;
  attribute: string;
  governedBy: string[];
  assistedBy: string[];
  specializations: SkillSpecializationUIInfo[];
  level: number;
  proficiency: number;
}

/**
 * Structure for a category of skills in the UI.
 * A category corresponds to a primary attribute (physique, spirit, mind, social)
 */
export interface SkillCategoryUIInfo {
  attribute: string;  // Primary attribute key (physique, spirit, mind, social)
  displayName: string; // Display name of the primary attribute
  skills: SkillUIInfo[]; // Skills belonging to this attribute category
}

/**
 * Interface for debug stat information displayed in the DebugView.
 */
export interface DebugStatInfo {
    value: number;
    params?: Record<string, number>; // Optional parameters (e.g., add, multiCache for Parameter, argument for FormulaStat)
}
