// Define shared interfaces for UI data structures
import type { IndependentStat, FormulaStat } from '../logic/core/Stat';
import type { AttributeDefinition, AttributeCategoryDefinition } from '../logic/lib/definitions/AttributeDefinition';
import type { Skill, SkillSpecialization } from '../logic/lib/definitions/SkillDefinition';

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
  stat: IndependentStat;
  definition: AttributeDefinition;
}

/**
 * Structure for a category of attributes, including nested attributes.
 */
export interface AttributeCategoryUIInfo {
  key: string;
  stat: IndependentStat;
  definition: AttributeCategoryDefinition;
  attributes: AttributeUIInfo[]; // Nested attributes
}

/**
 * Detailed character information for the selected character.
 */
export interface SelectedCharacterInfo extends SimpleCharacterInfo {
  bio: string;
  attributes: AttributeCategoryUIInfo[];
  skills: SkillUIInfo[];
  attributePoints: number;
  skillPoints: number;
  specPoints: number;
  xp: {
    current: number;
    progress: number;
    nextLevelDelta: number;
  };
}

/**
 * Structure for a specialization of a skill in the UI.
 */
export interface SkillSpecializationUIInfo {
  id: string;
  stat: IndependentStat;
  proficiencyStat: FormulaStat;
  definition: SkillSpecialization;
}

/**
 * Structure for a single skill in the UI.
 */
export interface SkillUIInfo {
  id: string;
  stat: IndependentStat;
  proficiencyStat: FormulaStat;
  definition: Skill;
  specializations: SkillSpecializationUIInfo[];
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
