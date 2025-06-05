import { random } from './mathUtils';

// Perlin noise implementation
class PerlinNoise {
    private permutation: number[];
    private p: number[];

    constructor(seed?: number) {
        // Initialize permutation table
        this.permutation = [];
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }

        // Shuffle the permutation table (using seed if provided)
        if (seed !== undefined) {
            // Simple seeded shuffle
            let rng = seed;
            for (let i = 255; i > 0; i--) {
                rng = (rng * 1664525 + 1013904223) & 0xFFFFFFFF;
                const j = Math.floor((rng / 0xFFFFFFFF) * (i + 1));
                [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
            }
        } else {
            // Random shuffle
            for (let i = 255; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
            }
        }

        // Duplicate the permutation table
        this.p = new Array(512);
        for (let i = 0; i < 512; i++) {
            this.p[i] = this.permutation[i & 255];
        }
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number = 0, z: number = 0): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    /**
     * Generate 1D Perlin noise value.
     * @param x The x coordinate.
     * @returns A noise value between -1 and 1.
     */
    noise1D(x: number): number {
        const X = Math.floor(x) & 255;
        x -= Math.floor(x);
        const u = this.fade(x);
        return this.lerp(u, this.grad(this.p[X], x), this.grad(this.p[X + 1], x - 1));
    }

    /**
     * Generate 2D Perlin noise value.
     * @param x The x coordinate.
     * @param y The y coordinate.
     * @returns A noise value between -1 and 1.
     */
    noise2D(x: number, y: number): number {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const A = this.p[X] + Y;
        const AA = this.p[A];
        const AB = this.p[A + 1];
        const B = this.p[X + 1] + Y;
        const BA = this.p[B];
        const BB = this.p[B + 1];

        return this.lerp(v,
            this.lerp(u, this.grad(this.p[AA], x, y), this.grad(this.p[BA], x - 1, y)),
            this.lerp(u, this.grad(this.p[AB], x, y - 1), this.grad(this.p[BB], x - 1, y - 1))
        );
    }

    /**
     * Generate 3D Perlin noise value.
     * @param x The x coordinate.
     * @param y The y coordinate.
     * @param z The z coordinate.
     * @returns A noise value between -1 and 1.
     */
    noise3D(x: number, y: number, z: number): number {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        const A = this.p[X] + Y;
        const AA = this.p[A] + Z;
        const AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y;
        const BA = this.p[B] + Z;
        const BB = this.p[B + 1] + Z;

        return this.lerp(w,
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
                this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))
            ),
            this.lerp(v,
                this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
            )
        );
    }
}

// Global Perlin noise instance
let globalPerlinNoise: PerlinNoise | null = null;

/**
 * Initialize or reinitialize the global Perlin noise generator with an optional seed.
 * @param seed Optional seed for reproducible noise. If not provided, uses random initialization.
 */
export function initPerlinNoise(seed?: number): void {
    globalPerlinNoise = new PerlinNoise(seed);
}

/**
 * Generate 1D Perlin noise value using the global noise generator.
 * Initializes the generator if it hasn't been initialized yet.
 * @param x The x coordinate.
 * @returns A noise value between -1 and 1.
 */
export function perlinNoise1D(x: number): number {
    if (!globalPerlinNoise) {
        initPerlinNoise();
    }
    return globalPerlinNoise!.noise1D(x);
}

/**
 * Generate 2D Perlin noise value using the global noise generator.
 * Initializes the generator if it hasn't been initialized yet.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @returns A noise value between -1 and 1.
 */
export function perlinNoise2D(x: number, y: number): number {
    if (!globalPerlinNoise) {
        initPerlinNoise();
    }
    return globalPerlinNoise!.noise2D(x, y);
}

/**
 * Generate 3D Perlin noise value using the global noise generator.
 * Initializes the generator if it hasn't been initialized yet.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @param z The z coordinate.
 * @returns A noise value between -1 and 1.
 */
export function perlinNoise3D(x: number, y: number, z: number): number {
    if (!globalPerlinNoise) {
        initPerlinNoise();
    }
    return globalPerlinNoise!.noise3D(x, y, z);
}

/**
 * Generate octave noise by combining multiple frequencies of Perlin noise.
 * @param x The x coordinate.
 * @param y The y coordinate (optional, for 1D noise set to 0).
 * @param z The z coordinate (optional, for 1D/2D noise set to 0).
 * @param octaves Number of octaves (layers) to combine.
 * @param persistence How much each octave contributes relative to the previous (typically 0.5).
 * @param scale The scale/frequency of the base noise.
 * @returns A noise value.
 */
export function octaveNoise(x: number, y: number = 0, z: number = 0, octaves: number = 4, persistence: number = 0.5, scale: number = 1): number {
    let value = 0;
    let amplitude = 1;
    let frequency = scale;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        if (z !== 0) {
            value += perlinNoise3D(x * frequency, y * frequency, z * frequency) * amplitude;
        } else if (y !== 0) {
            value += perlinNoise2D(x * frequency, y * frequency) * amplitude;
        } else {
            value += perlinNoise1D(x * frequency) * amplitude;
        }
        
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }

    return value / maxValue;
}

// Export the PerlinNoise class for direct use if needed
export { PerlinNoise }; 