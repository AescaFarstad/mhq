export function getCharacterKeywordsMap(gameState) {
    const keywordMap = new Map();
    const locationCharacters = Array.from(gameState.lib.characters.values()).filter((c) => c.location === gameState.locationId);
    for (const charDef of locationCharacters) {
        const keywords = [...(charDef.keywords || []), charDef.name];
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase();
            if (!keywordMap.has(lowerKeyword)) {
                keywordMap.set(lowerKeyword, []);
            }
            keywordMap.get(lowerKeyword).push(charDef.id);
        }
    }
    return keywordMap;
}
export function getCombinedWordsMap(ingressWordsLib, gameState) {
    const baseWords = new Map();
    for (const wordDef of ingressWordsLib.getAllWords()) {
        baseWords.set(wordDef.id, wordDef);
    }
    const combinedWords = new Map(baseWords);
    const locationCharacters = Array.from(gameState.lib.characters.values()).filter((c) => c.location === gameState.locationId);
    // Add character-specific words
    for (const charDef of locationCharacters) {
        const keywords = [...(charDef.keywords || []), charDef.name];
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase();
            // Add only if not already present in the base lib.
            if (!baseWords.has(lowerKeyword)) {
                combinedWords.set(lowerKeyword, {
                    id: lowerKeyword,
                    name: keyword,
                    type: 'useful',
                    points: 1,
                });
            }
        }
    }
    return combinedWords;
}
export function getUsefulWordsCountFromMap(wordsMap) {
    let usefulWordsCount = 0;
    for (const word of wordsMap.values()) {
        if (word.type === 'useful') {
            usefulWordsCount++;
        }
    }
    return usefulWordsCount;
}
