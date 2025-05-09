import type { AttributeDefinitions, AttributeDefinition, AttributeCategoryDefinition } from "./definitions/AttributeDefinition";
import attributes from "../data/attributes"; // Import TypeScript file instead of JSON

export class AttributeLib {
  private attributes: AttributeDefinitions = {};

  constructor() {
    this.loadAttributes();
  }

  private loadAttributes(): void {
    // No type assertion needed as the TypeScript file is already properly typed
    this.attributes = attributes;
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