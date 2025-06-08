import type { GameState } from '../../../logic/GameState';
import type { CharacterDefinition } from '../../../logic/lib/definitions/CharacterDefinition';
import type { IngressWordsLib } from '../lib/IngressWordsLib';
import type { WordDefinition } from '../lib/definitions/WordDefinition';

export function getCharacterKeywordsMap(gameState: GameState): Map<string, string[]> {
    const keywordMap = new Map<string, string[]>();
    const locationCharacters = Array.from(gameState.lib.characters.values()).filter(
        (c: CharacterDefinition) => c.location === gameState.locationId,
    );

    for (const charDef of locationCharacters) {
        const keywords = [...(charDef.keywords || []), charDef.name];
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase();
            if (!keywordMap.has(lowerKeyword)) {
                keywordMap.set(lowerKeyword, []);
            }
            keywordMap.get(lowerKeyword)!.push(charDef.id);
        }
    }
    return keywordMap;
}

export function getCombinedWordsMap(ingressWordsLib: IngressWordsLib, gameState: GameState): Map<string, WordDefinition> {
    const baseWords = new Map<string, WordDefinition>();
    for (const wordDef of ingressWordsLib.getAllWords()) {
        baseWords.set(wordDef.id, wordDef);
    }

    const combinedWords = new Map<string, WordDefinition>(baseWords);

    const locationCharacters = Array.from(gameState.lib.characters.values()).filter(
        (c: CharacterDefinition) => c.location === gameState.locationId,
    );

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

export function getUsefulWordsCountFromMap(wordsMap: Map<string, WordDefinition>): number {
    let usefulWordsCount = 0;
    for (const word of wordsMap.values()) {
        if (word.type === 'useful') {
            usefulWordsCount++;
        }
    }
    return usefulWordsCount;
} 