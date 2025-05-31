// import { AttributeDefinitions } from './AttributeDefinition';

export interface SkillSpecialization {
  type: 'specialization';
  id: string; // Globally unique ID
  parentId: string; // ID of the parent skill
  displayName: string;
  description: string;
  keywords?: string[][];
}

export interface Skill {
  type: 'skill';
  id: string; // Globally unique ID
  displayName: string;
  description: string;
  attribute: string; // Key of a primary attribute (physique, spirit, mind, social)
  governedBy: string[]; // Keys of secondary attributes (strength, agility, etc.)
  assistedBy: string[]; // Keys of secondary attributes
  keywords?: string[][];
  specializations: string[]; // IDs of child specializations
}

export type SkillItem = Skill | SkillSpecialization;

export type SkillsData = Record<string, SkillItem>; 

// Raw definitions for pre-transformation data structure in skills.ts
export interface RawSkillSpecializationDefinition {
  displayName: string;
  description: string;
  keywords?: string[][];
}

export interface RawSkillDefinition {
  displayName: string;
  description: string;
  attribute: string;
  governedBy: string[];
  assistedBy: string[];
  keywords?: string[][];
  specializations: Record<string, RawSkillSpecializationDefinition>;
}

export type RawSkillsData = Record<string, RawSkillDefinition>; 