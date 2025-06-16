export class CharacterLib {
    characters = new Map();
    isLoaded = false;
    /**
     * Loads and appends character definitions from TypeScript data.
     * Can be called multiple times to load from different sources.
     * @param characterData The character data with proper typing
     * @param sourceName Optional name of the source for logging purposes
     */
    loadCharacters(characterData, sourceName) {
        let count = 0;
        for (const id in characterData) {
            if (Object.prototype.hasOwnProperty.call(characterData, id)) {
                const data = characterData[id];
                const charDef = {
                    id: id,
                    name: data.name,
                    gender: data.gender,
                    initialLevel: data.initialLevel,
                    baseUpkeep: data.baseUpkeep,
                    bio: data.bio || '',
                    fullImage: data.fullImage,
                    location: data.location,
                    portraitImage: data.portraitImage,
                    initialAttributes: data.initialAttributes,
                    initialSkills: data.initialSkills || {},
                    triggerOnCreated: data.triggerOnCreated,
                    keywords: data.keywords,
                };
                if (this.characters.has(id)) {
                    console.warn(`CharacterLib: Duplicate character ID "${id}" found. Overwriting with data from ${sourceName || 'current source'}.`);
                }
                this.characters.set(id, charDef);
                count++;
            }
        }
        this.isLoaded = true; //This may be problematic as there are multiple sources. TODO: Fix this.
    }
    /**
     * Gets a character definition by its ID.
     * @param id The character ID.
     * @returns The CharacterDefinition or undefined if not found.
     */
    getCharacter(id) {
        return this.characters.get(id);
    }
    /**
     * Gets all loaded character definitions.
     * @returns An iterable iterator of CharacterDefinition values.
     */
    values() {
        return this.characters.values();
    }
}
