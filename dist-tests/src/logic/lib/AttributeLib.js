import attributes from "../data/attributes"; // Import TypeScript file instead of JSON
export class AttributeLib {
    attributes = {};
    constructor() {
        this.loadAttributes();
    }
    loadAttributes() {
        // No type assertion needed as the TypeScript file is already properly typed
        this.attributes = attributes;
    }
    getAttributeDefinitions() {
        return this.attributes;
    }
    getAttributeDefinition(categoryKey, attributeKey) {
        return this.attributes[categoryKey]?.attributes[attributeKey];
    }
    getCategoryDefinition(categoryKey) {
        return this.attributes[categoryKey];
    }
}
