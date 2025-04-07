export interface AttributeDefinition {
  displayName: string;
  description: string;
}

export interface AttributeCategoryDefinition {
  displayName: string;
  description: string;
  attributes: Record<string, AttributeDefinition>;
}

export type AttributeDefinitions = Record<string, AttributeCategoryDefinition>; 