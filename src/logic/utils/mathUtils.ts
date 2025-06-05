/**
 * Advances a seed using Linear Congruential Generator and returns the new seed.
 * @param seed The current seed value
 * @param entropy Optional additional entropy to mix in
 * @returns The new seed value
 */
export function advanceSeed(seed: number, entropy: number = 0): number {
    return (seed * 1664525 + 1013904223 + entropy) & 0xFFFFFFFF;
}

/**
 * Converts a seed value to a random number between 0 and 1.
 * @param seed The seed value
 * @returns A number between 0 and 1
 */
export function seedToRandom(seed: number): number {
    return (seed & 0x7FFFFFFF) / 0x7FFFFFFF;
}

/**
 * Generates a seeded random number and advances the seed.
 * @param seed The current seed (will be modified)
 * @param entropy Optional additional entropy
 * @returns Object with the random number and new seed
 */
export function seededRandom(seed: number, entropy: number = 0): { value: number; newSeed: number } {
    const newSeed = advanceSeed(seed, entropy);
    return { 
        value: seedToRandom(newSeed), 
        newSeed 
    };
}

/**
 * Given an array of weights, returns a randomly chosen index based on those weights.
 * @param weights An array of numbers representing the weight of each index.
 * @returns The randomly chosen index, or -1 if the weights array is empty or all weights are zero.
 */
export function getWeightedRandomIndex(weights: number[]): number {
    if (!weights || weights.length === 0) {
        return -1;
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    if (totalWeight <= 0) {
        // If all weights are zero or negative, return a random index with uniform probability,
        // or handle as an error case. For now, returning a random valid index.
        // Alternatively, could return -1 to indicate an issue or a truly random unweighted pick.
        // For now, to avoid issues with empty steps, let's pick uniformly if totalWeight is 0.
        // console.warn("getWeightedRandomIndex: Total weight is zero or negative. Picking uniformly.");
        return Math.floor(Math.random() * weights.length);
    }

    let randomValue = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
        if (randomValue < weights[i]) {
            return i;
        }
        randomValue -= weights[i];
    }

    // Should not be reached if totalWeight > 0
    return weights.length - 1; 
} 