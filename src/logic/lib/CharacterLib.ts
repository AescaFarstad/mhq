import { CharacterDefinition } from "./definitions/CharacterDefinition";

// Define a type for character data that matches our TypeScript file
type CharacterData = Record<string, Omit<CharacterDefinition, 'id'>>;

export class CharacterLib {
    private characters: Map<string, CharacterDefinition> = new Map();
    public isLoaded: boolean = false;

    /**
     * Loads character definitions from TypeScript data
     * @param characterData The character data with proper typing
     */
    public loadCharacters(characterData: CharacterData): void {
        this.characters.clear();
        for (const id in characterData) {
            if (Object.prototype.hasOwnProperty.call(characterData, id)) {
                const data = characterData[id];
                // We no longer need extensive validation as TypeScript ensures correct types
                const charDef: CharacterDefinition = {
                    id: id,
                    name: data.name,
                    initialLevel: data.initialLevel,
                    baseUpkeep: data.baseUpkeep,
                    bio: data.bio || '',
                    initialAttributes: data.initialAttributes,
                    initialSkills: data.initialSkills || {},
                    triggerOnCreated: data.triggerOnCreated
                };
                this.characters.set(id, charDef);
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