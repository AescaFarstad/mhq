export class SlowTick {
    private readonly modulus: number;
    private readonly targetTickInModulus: number;

    /**
     * Creates an instance of SlowTick.
     * @param minInterval The duration of a single game tick in milliseconds (or any consistent unit).
     * @param desiredInterval The desired average interval for this SlowTick to trigger, in the same units as minInterval.
     * @param key A string used to deterministically derive the random offset for the tick check.
     */
    constructor(minInterval: number, desiredInterval: number, key: string) {
        if (minInterval <= 0) {
            console.error("SlowTick: minInterval must be positive.");
            this.modulus = 1; // Default to a safe modulus
        } else {
            this.modulus = Math.max(1, Math.floor(desiredInterval / minInterval));
        }

        const FNV_PRIME_32 = 16777619;
        const FNV_OFFSET_BASIS_32 = 2166136261;
        let hash = FNV_OFFSET_BASIS_32;

        if (key.length === 0) {
            console.warn("SlowTick: Empty key provided, using default hash basis which may lead to less unique tick offsets.");
            // Hash will remain FNV_OFFSET_BASIS_32
        } else {
            for (let i = 0; i < key.length; i++) {
                hash ^= key.charCodeAt(i);
                // Multiply by FNV prime and ensure it's a 32-bit integer
                hash = (hash * FNV_PRIME_32) | 0;
            }
        }

        const preliminaryTarget = Math.abs(hash) % this.modulus;

        if (this.modulus > 1 && preliminaryTarget === 0) {
            this.targetTickInModulus = 1; // Ensure non-zero if modulus allows for it
        } else {
            this.targetTickInModulus = preliminaryTarget; // Will be 0 if modulus is 1
        }
    }

    /**
     * Checks if the SlowTick should trigger at the current game tick.
     * It will never trigger if currentTick is 0.
     * Otherwise, it triggers if (currentTick % X) == uniqueRandomTickValueBelowX,
     * where X is (desiredInterval / minInterval) and uniqueRandomTickValueBelowX is derived from the key.
     *
     * @param currentTick The current game tick count. Must be a non-negative integer.
     * @returns True if the SlowTick should trigger, false otherwise.
     */
    public check(currentTick: number): boolean {
        return currentTick % this.modulus === this.targetTickInModulus;
    }
} 