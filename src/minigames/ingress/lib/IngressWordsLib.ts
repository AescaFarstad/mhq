import type { WordDefinition } from './definitions/WordDefinition';
import { ingressWordDefinitions } from '../data/ingressWords';
import { wordify } from '../../../utils/stringUtils';

export class IngressWordsLib {
    private words: Map<string, WordDefinition> = new Map();
    private _usefulWordsCount = 0;

    constructor() {
        this.loadWords();
    }

    private loadWords(): void {
        const pointValues: Record<string, number> = {
            trivial: 1,
            minor: 2,
            major: 3,
            cheat: 100
        };

        // Process useful words
        if (ingressWordDefinitions.useful) {
            for (const [subcategory, words] of Object.entries(ingressWordDefinitions.useful)) {
                const points = pointValues[subcategory] || 1;
                words.forEach((word: string) => {
                    const wordDefinition: WordDefinition = {
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
            ingressWordDefinitions.offensive.forEach((word: string) => {
                const wordDefinition: WordDefinition = {
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

    public getWord(id: string): WordDefinition | undefined {
        return this.words.get(id.toLowerCase());
    }

    public getWordByName(name: string): WordDefinition | undefined {
        return IngressWordsLib.findWordInMap(name, this.words);
    }

    public static findWordInMap(name: string, wordsMap: Map<string, WordDefinition>): WordDefinition | undefined {
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

    public getAllWords(): MapIterator<WordDefinition> {
        return this.words.values();
    }

    public getUsefulWordsCount(): number {
        return this._usefulWordsCount;
    }
} 