import { AttributeDefinitions } from './AttributeDefinition';

export interface SkillSpecialization {
  displayName: string;
  description: string;
  keywords?: string[][];
}

export interface Skill {
  displayName: string;
  description: string;
  attribute: string; // Key of a primary attribute (physique, spirit, mind, social)
  governedBy: string[]; // Keys of secondary attributes (strength, agility, etc.)
  assistedBy: string[]; // Keys of secondary attributes
  keywords?: string[][];
  specializations: Record<string, SkillSpecialization>;
}

export type SkillsData = Record<string, Skill>; 