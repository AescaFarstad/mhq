import type { AttributeDefinitions, AttributeDefinition, AttributeCategoryDefinition } from "../attributes/AttributeDefinition";
import attributesData from "../data/attributes.json"; // Direct import for Vite

export class AttributeLib {
  private attributes: AttributeDefinitions = {};

  constructor() {
    this.loadAttributes();
  }

  private loadAttributes(): void {
    // Type assertion: Assume the JSON structure matches AttributeDefinitions
    this.attributes = attributesData as AttributeDefinitions;
    console.log("Attribute definitions loaded:", this.attributes);
  }

  public getAttributeDefinitions(): AttributeDefinitions {
    return this.attributes;
  }

  public getAttributeDefinition(
    categoryKey: string,
    attributeKey: string
  ): AttributeDefinition | undefined {
    return this.attributes[categoryKey]?.attributes[attributeKey];
  }

  public getCategoryDefinition(
    categoryKey: string
  ): AttributeCategoryDefinition | undefined {
    return this.attributes[categoryKey];
  }
}

// Optional: Export a singleton instance if preferred
// export const attributeLibInstance = new AttributeLib(); 