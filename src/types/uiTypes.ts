/* eslint-disable @typescript-eslint/no-unused-vars */
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
  value: number | string; // Adjust type as needed based on actual data
  description?: string;
}

/**
 * Structure for a category of attributes, including nested attributes.
 */
export interface AttributeCategoryUIInfo {
  key: string;
  displayName: string;
  value: number | string; // Adjust type as needed based on actual data
  description?: string;
  attributes: AttributeUIInfo[]; // Nested attributes
}

/**
 * Structure for the detailed character information passed to CharacterDetails.
 */
export interface SelectedCharacterInfo {
  id: string;
  name: string;
  level: number;
  upkeep: number;
  bio?: string;
  attributes: AttributeCategoryUIInfo[]; // Hierarchical attribute structure
}
