import { ingressWordDefinitions } from '../data/ingressWords';
import { wordify } from '../../../utils/stringUtils';
export class IngressWordsLib {
    words = new Map();
    _usefulWordsCount = 0;
    constructor() {
        this.loadWords();
    }
    loadWords() {
        const pointValues = {
            trivial: 1,
            minor: 2,
            major: 3,
            cheat: 100
        };
        // Process useful words
        if (ingressWordDefinitions.useful) {
            for (const [subcategory, words] of Object.entries(ingressWordDefinitions.useful)) {
                const points = pointValues[subcategory] || 1;
                words.forEach((word) => {
                    const wordDefinition = {
                        id: word.toLowerCase(),
                        name: word,
                        type: 'useful',
                        points: points
                    };
                    this.words.set(word.toLowerCase(), wordDefinition);
                });
            }
        }
        // Process offensive words (default to 0 points)
        if (ingressWordDefinitions.offensive) {
            ingressWordDefinitions.offensive.forEach((word) => {
                const wordDefinition = {
                    id: word.toLowerCase(),
                    name: word,
                    type: 'offensive',
                    points: 0
                };
                this.words.set(word.toLowerCase(), wordDefinition);
            });
        }
        this._usefulWordsCount = [...this.words.values()].filter(w => w.type === 'useful').length;
    }
    getWord(id) {
        return this.words.get(id.toLowerCase());
    }
    getWordByName(name) {
        return IngressWordsLib.findWordInMap(name, this.words);
    }
    static findWordInMap(name, wordsMap) {
        const lowerCaseName = name.toLowerCase();
        const potentialWords = wordify(lowerCaseName); // wordify returns the original word as part of the array
        for (const wordForm of potentialWords) {
            const definition = wordsMap.get(wordForm); // wordify results are already lowercase
            if (definition) {
                return definition;
            }
        }
        return undefined;
    }
    getAllWords() {
        return this.words.values();
    }
    getUsefulWordsCount() {
        return this._usefulWordsCount;
    }
}
