import { CharacterDefinition } from "../characters/CharacterDefinition";

export class CharacterLib {
    private characters: Map<string, CharacterDefinition> = new Map();
    public isLoaded: boolean = false;

    /**
     * Loads character definitions from raw JSON data.
     * @param jsonData The raw JSON object, expected to be a dictionary where keys are character IDs.
     */
    public loadCharacters(jsonData: any): void {
        this.characters.clear();
        for (const id in jsonData) {
            if (Object.prototype.hasOwnProperty.call(jsonData, id)) {
                const data = jsonData[id];
                // Basic validation (add more robust validation as needed)
                if (typeof data.name === 'string' && 
                    typeof data.initialLevel === 'number' && 
                    typeof data.baseUpkeep === 'number' &&
                    typeof data.initialAttributes === 'object' && // Add check for initialAttributes
                    data.initialAttributes !== null) { 
                    const charDef: CharacterDefinition = {
                        id: id,
                        name: data.name,
                        initialLevel: data.initialLevel,
                        baseUpkeep: data.baseUpkeep,
                        bio: data.bio || '',
                        initialAttributes: data.initialAttributes // Load initialAttributes
                    };
                    this.characters.set(id, charDef);
                    console.log(`Loaded character def: ${charDef.name} (ID: ${id}) with attributes.`);
                } else {
                    console.warn(`Invalid data format for character ID "${id}". Skipping. Check for name, initialLevel, baseUpkeep, and initialAttributes (as object).`);
                }
            }
        }
        this.isLoaded = true;
        console.log(`CharacterLib loaded ${this.characters.size} character definitions.`);
    }

    /**
     * Gets a character definition by its ID.
     * @param id The character ID.
     * @returns The CharacterDefinition or undefined if not found.
     */
    public getCharacter(id: string): CharacterDefinition | undefined {
        return this.characters.get(id);
    }

    /**
     * Gets all loaded character definitions.
     * @returns An iterable iterator of CharacterDefinition values.
     */
    public values(): IterableIterator<CharacterDefinition> {
        return this.characters.values();
    }
} 