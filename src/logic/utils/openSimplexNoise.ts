// OpenSimplex noise implementation
// Adapted from the C reference implementation to TypeScript

// Constants
const PSIZE = 2048;
const PMASK = 2047;
const N2 = 0.05481866495625118;
const N3 = 0.2781926117527186;
const N4 = 0.11127401889945551;

// Gradient structures
interface Grad2 {
    dx: number;
    dy: number;
}

interface Grad3 {
    dx: number;
    dy: number;
    dz: number;
}

interface Grad4 {
    dx: number;
    dy: number;
    dz: number;
    dw: number;
}

// Lattice point structures
interface LatticePoint2D {
    xsv: number;
    ysv: number;
    dx: number;
    dy: number;
}

interface LatticePoint3D {
    dxr: number;
    dyr: number;
    dzr: number;
    xrv: number;
    yrv: number;
    zrv: number;
    nextOnFailure: LatticePoint3D | null;
    nextOnSuccess: LatticePoint3D | null;
}



// Utility functions
function fastFloor(x: number): number {
    const xi = Math.floor(x);
    return x < xi ? xi - 1 : xi;
}

// Gradient constants
function createGradients2D(): Grad2[] {
    const gradients: Grad2[] = [];
    const grad2 = [
        5, 2, 2, 5,
        -5, 2, -2, 5,
        5, -2, 2, -5,
        -5, -2, -2, -5,
    ];
    
    for (let i = 0; i < grad2.length; i += 2) {
        gradients.push({
            dx: grad2[i] * N2,
            dy: grad2[i + 1] * N2
        });
    }
    return gradients;
}

function createGradients3D(): Grad3[] {
    const gradients: Grad3[] = [];
    const grad3 = [
        -11, 4, 4, -4, 11, 4, -4, 4, 11,
        11, 4, 4, 4, 11, 4, 4, 4, 11,
        -11, -4, 4, -4, -11, 4, -4, -4, 11,
        11, -4, 4, 4, -11, 4, 4, -4, 11,
        -11, 4, -4, -4, 11, -4, -4, 4, -11,
        11, 4, -4, 4, 11, -4, 4, 4, -11,
        -11, -4, -4, -4, -11, -4, -4, -4, -11,
        11, -4, -4, 4, -11, -4, 4, -4, -11,
    ];
    
    for (let i = 0; i < grad3.length; i += 3) {
        gradients.push({
            dx: grad3[i] * N3,
            dy: grad3[i + 1] * N3,
            dz: grad3[i + 2] * N3
        });
    }
    return gradients;
}

function createGradients4D(): Grad4[] {
    const gradients: Grad4[] = [];
    const grad4 = [
        3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3,
        -3, 1, 1, 1, -1, 3, 1, 1, -1, 1, 3, 1, -1, 1, 1, 3,
        3, -1, 1, 1, 1, -3, 1, 1, 1, -1, 3, 1, 1, -1, 1, 3,
        -3, -1, 1, 1, -1, -3, 1, 1, -1, -1, 3, 1, -1, -1, 1, 3,
        3, 1, -1, 1, 1, 3, -1, 1, 1, 1, -3, 1, 1, 1, -1, 3,
        -3, 1, -1, 1, -1, 3, -1, 1, -1, 1, -3, 1, -1, 1, -1, 3,
        3, -1, -1, 1, 1, -3, -1, 1, 1, -1, -3, 1, 1, -1, -1, 3,
        -3, -1, -1, 1, -1, -3, -1, 1, -1, -1, -3, 1, -1, -1, -1, 3,
        3, 1, 1, -1, 1, 3, 1, -1, 1, 1, 3, -1, 1, 1, 1, -3,
        -3, 1, 1, -1, -1, 3, 1, -1, -1, 1, 3, -1, -1, 1, 1, -3,
        3, -1, 1, -1, 1, -3, 1, -1, 1, -1, 3, -1, 1, -1, 1, -3,
        -3, -1, 1, -1, -1, -3, 1, -1, -1, -1, 3, -1, -1, -1, 1, -3,
        3, 1, -1, -1, 1, 3, -1, -1, 1, 1, -3, -1, 1, 1, -1, -3,
        -3, 1, -1, -1, -1, 3, -1, -1, -1, 1, -3, -1, -1, 1, -1, -3,
        3, -1, -1, -1, 1, -3, -1, -1, 1, -1, -3, -1, 1, -1, -1, -3,
        -3, -1, -1, -1, -1, -3, -1, -1, -1, -1, -3, -1, -1, -1, -1, -3,
    ];
    
    for (let i = 0; i < grad4.length; i += 4) {
        gradients.push({
            dx: grad4[i] * N4,
            dy: grad4[i + 1] * N4,
            dz: grad4[i + 2] * N4,
            dw: grad4[i + 3] * N4
        });
    }
    return gradients;
}

function createLatticePoint2D(xsv: number, ysv: number): LatticePoint2D {
    const ssv = (xsv + ysv) * -0.211324865405187;
    return {
        xsv,
        ysv,
        dx: -xsv - ssv,
        dy: -ysv - ssv
    };
}

function createLatticePoint3D(xrv: number, yrv: number, zrv: number, lattice: number): LatticePoint3D {
    return {
        dxr: -xrv + lattice * 0.5,
        dyr: -yrv + lattice * 0.5,
        dzr: -zrv + lattice * 0.5,
        xrv: xrv + lattice * 1024,
        yrv: yrv + lattice * 1024,
        zrv: zrv + lattice * 1024,
        nextOnFailure: null,
        nextOnSuccess: null
    };
}



// Create lookup tables
function createLookup2D(): LatticePoint2D[][] {
    const lookup: LatticePoint2D[][] = [];
    
    for (let i = 0; i < 8; i++) {
        let i1: number, j1: number, i2: number, j2: number;
        
        if ((i & 1) === 0) {
            if ((i & 2) === 0) {
                i1 = -1; j1 = 0;
            } else {
                i1 = 1; j1 = 0;
            }
            if ((i & 4) === 0) {
                i2 = 0; j2 = -1;
            } else {
                i2 = 0; j2 = 1;
            }
        } else {
            if ((i & 2) !== 0) {
                i1 = 2; j1 = 1;
            } else {
                i1 = 0; j1 = 1;
            }
            if ((i & 4) !== 0) {
                i2 = 1; j2 = 2;
            } else {
                i2 = 1; j2 = 0;
            }
        }
        
        lookup[i] = [
            createLatticePoint2D(0, 0),
            createLatticePoint2D(1, 1),
            createLatticePoint2D(i1, j1),
            createLatticePoint2D(i2, j2)
        ];
    }
    
    return lookup;
}

function createLookup3D(): LatticePoint3D[] {
    const lookup: LatticePoint3D[] = [];
    
    for (let i = 0; i < 8; i++) {
        const i1 = (i >> 0) & 1;
        const j1 = (i >> 1) & 1;
        const k1 = (i >> 2) & 1;
        const i2 = i1 ^ 1;
        const j2 = j1 ^ 1;
        const k2 = k1 ^ 1;

        // The two points within this octant, one from each cubic half-lattice
        const c0 = createLatticePoint3D(i1, j1, k1, 0);
        const c1 = createLatticePoint3D(i1 + i2, j1 + j2, k1 + k2, 1);

        // Create the chain of lattice points
        const c2 = createLatticePoint3D(i1 ^ 1, j1, k1, 0);
        const c3 = createLatticePoint3D(i1, j1 ^ 1, k1 ^ 1, 0);
        const c4 = createLatticePoint3D(i1 + (i2 ^ 1), j1 + j2, k1 + k2, 1);
        const c5 = createLatticePoint3D(i1 + i2, j1 + (j2 ^ 1), k1 + (k2 ^ 1), 1);
        const c6 = createLatticePoint3D(i1, j1 ^ 1, k1, 0);
        const c7 = createLatticePoint3D(i1 ^ 1, j1, k1 ^ 1, 0);
        const c8 = createLatticePoint3D(i1 + i2, j1 + (j2 ^ 1), k1 + k2, 1);
        const c9 = createLatticePoint3D(i1 + (i2 ^ 1), j1 + j2, k1 + (k2 ^ 1), 1);
        const cA = createLatticePoint3D(i1, j1, k1 ^ 1, 0);
        const cB = createLatticePoint3D(i1 ^ 1, j1 ^ 1, k1, 0);
        const cC = createLatticePoint3D(i1 + i2, j1 + j2, k1 + (k2 ^ 1), 1);
        const cD = createLatticePoint3D(i1 + (i2 ^ 1), j1 + (j2 ^ 1), k1 + k2, 1);

        // Build the traversal chain
        c0.nextOnFailure = c0.nextOnSuccess = c1;
        c1.nextOnFailure = c1.nextOnSuccess = c2;
        c2.nextOnFailure = c3;
        c2.nextOnSuccess = c5;
        c3.nextOnFailure = c4;
        c3.nextOnSuccess = c4;
        c4.nextOnFailure = c5;
        c4.nextOnSuccess = c6;
        c5.nextOnFailure = c5.nextOnSuccess = c6;
        c6.nextOnFailure = c7;
        c6.nextOnSuccess = c9;
        c7.nextOnFailure = c8;
        c7.nextOnSuccess = c8;
        c8.nextOnFailure = c9;
        c8.nextOnSuccess = cA;
        c9.nextOnFailure = c9.nextOnSuccess = cA;
        cA.nextOnFailure = cB;
        cA.nextOnSuccess = cD;
        cB.nextOnFailure = cC;
        cB.nextOnSuccess = cC;
        cC.nextOnFailure = cD;
        cC.nextOnSuccess = null;
        cD.nextOnFailure = cD.nextOnSuccess = null;

        lookup[i] = c0;
    }
    
    return lookup;
}



class OpenSimplexNoise {
    private perm: number[];
    private permGrad2: Grad2[];
    private permGrad3: Grad3[];
    private permGrad4: Grad4[];
    private gradients2D: Grad2[];
    private gradients3D: Grad3[];
    private gradients4D: Grad4[];
    private lookup2D: LatticePoint2D[][];
    private lookup3D: LatticePoint3D[];
    constructor(seed: number = 0) {
        // Initialize gradients
        this.gradients2D = createGradients2D();
        this.gradients3D = createGradients3D();
        this.gradients4D = createGradients4D();
        
        // Initialize lookup tables
        this.lookup2D = createLookup2D();
        this.lookup3D = createLookup3D();
        
        // Initialize permutation arrays
        this.perm = new Array(PSIZE);
        this.permGrad2 = new Array(PSIZE);
        this.permGrad3 = new Array(PSIZE);
        this.permGrad4 = new Array(PSIZE);
        
        // Create source array
        const source = new Array(PSIZE);
        for (let i = 0; i < PSIZE; i++) {
            source[i] = i;
        }
        
        // Shuffle using seed
        let seedValue = seed;
        for (let i = PSIZE - 1; i >= 0; i--) {
            seedValue = seedValue * 6364136223846793005 + 1442695040888963407;
            // JavaScript bitwise operations work on 32-bit signed integers
            seedValue = seedValue & 0xFFFFFFFF;
            let r = Math.abs((seedValue + 31) % (i + 1));
            
            this.perm[i] = source[r];
            this.permGrad2[i] = this.gradients2D[this.perm[i] & (this.gradients2D.length - 1)];
            this.permGrad3[i] = this.gradients3D[this.perm[i] & (this.gradients3D.length - 1)];
            this.permGrad4[i] = this.gradients4D[this.perm[i] & (this.gradients4D.length - 1)];
            
            source[r] = source[i];
        }
    }

    private noise2Base(xs: number, ys: number): number {
        let value = 0;

        // Get base points and offsets
        const xsb = fastFloor(xs);
        const ysb = fastFloor(ys);
        const xsi = xs - xsb;
        const ysi = ys - ysb;

        // Index to point list
        const a = Math.floor(xsi + ysi);
        const index = (a << 2) |
            (Math.floor(xsi - ysi / 2 + 1 - a / 2.0)) << 3 |
            (Math.floor(ysi - xsi / 2 + 1 - a / 2.0)) << 4;

        const ssi = (xsi + ysi) * -0.211324865405187;
        const xi = xsi + ssi;
        const yi = ysi + ssi;

        // Point contributions
        const points = this.lookup2D[index & 7]; // Ensure index is within bounds
        for (let i = 0; i < points.length; i++) {
            const c = points[i];
            const dx = xi + c.dx;
            const dy = yi + c.dy;
            let attn = 2.0 / 3.0 - dx * dx - dy * dy;
            
            if (attn <= 0) continue;

            const pxm = (xsb + c.xsv) & PMASK;
            const pym = (ysb + c.ysv) & PMASK;
            const grad = this.permGrad2[this.perm[pxm] ^ pym];
            const extrapolation = grad.dx * dx + grad.dy * dy;

            attn *= attn;
            value += attn * attn * extrapolation;
        }

        return value;
    }

    private noise3BCC(xr: number, yr: number, zr: number): number {
        // Get base and offsets inside cube of first lattice
        const xrb = fastFloor(xr);
        const yrb = fastFloor(yr);
        const zrb = fastFloor(zr);
        const xri = xr - xrb;
        const yri = yr - yrb;
        const zri = zr - zrb;

        // Identify which octant of the cube we're in
        const xht = Math.floor(xri + 0.5);
        const yht = Math.floor(yri + 0.5);
        const zht = Math.floor(zri + 0.5);
        const index = (xht << 0) | (yht << 1) | (zht << 2);

        // Point contributions
        let value = 0;
        let c: LatticePoint3D | null = this.lookup3D[index];
        
        while (c !== null) {
            const dxr = xri + c.dxr;
            const dyr = yri + c.dyr;
            const dzr = zri + c.dzr;
            let attn = 0.75 - dxr * dxr - dyr * dyr - dzr * dzr;
            
            if (attn < 0) {
                c = c.nextOnFailure;
            } else {
                const pxm = (xrb + c.xrv) & PMASK;
                const pym = (yrb + c.yrv) & PMASK;
                const pzm = (zrb + c.zrv) & PMASK;
                const grad = this.permGrad3[this.perm[this.perm[pxm] ^ pym] ^ pzm];
                const extrapolation = grad.dx * dxr + grad.dy * dyr + grad.dz * dzr;

                attn *= attn;
                value += attn * attn * extrapolation;
                c = c.nextOnSuccess;
            }
        }
        
        return value;
    }

    /**
     * 2D SuperSimplex noise, standard lattice orientation.
     */
    noise2D(x: number, y: number): number {
        // Get points for A2* lattice
        const s = 0.366025403784439 * (x + y);
        const xs = x + s;
        const ys = y + s;
        return this.noise2Base(xs, ys);
    }

    /**
     * 2D SuperSimplex noise, with Y pointing down the main diagonal.
     * Might be better for a 2D sandbox style game, where Y is vertical.
     */
    noise2DXBeforeY(x: number, y: number): number {
        // Skew transform and rotation baked into one
        const xx = x * 0.7071067811865476;
        const yy = y * 1.224744871380249;
        return this.noise2Base(yy + xx, yy - xx);
    }

    /**
     * 3D Re-oriented 8-point BCC noise, classic orientation
     */
    noise3D(x: number, y: number, z: number): number {
        // Re-orient the cubic lattices via rotation
        const r = (2.0 / 3.0) * (x + y + z);
        const xr = r - x;
        const yr = r - y;
        const zr = r - z;
        return this.noise3BCC(xr, yr, zr);
    }

    /**
     * 3D Re-oriented 8-point BCC noise, with better visual isotropy in (X, Y).
     * Recommended for 3D terrain and time-varied animations.
     */
    noise3DXYBeforeZ(x: number, y: number, z: number): number {
        // Re-orient the cubic lattices without skewing
        const xy = x + y;
        const s2 = xy * -0.211324865405187;
        const zz = z * 0.577350269189626;
        const xr = x + s2 - zz;
        const yr = y + s2 - zz;
        const zr = xy * 0.577350269189626 + zz;
        return this.noise3BCC(xr, yr, zr);
    }

    /**
     * 3D Re-oriented 8-point BCC noise, with better visual isotropy in (X, Z).
     */
    noise3DXZBeforeY(x: number, y: number, z: number): number {
        // Re-orient the cubic lattices without skewing
        const xz = x + z;
        const s2 = xz * -0.211324865405187;
        const yy = y * 0.577350269189626;
        const xr = x + s2 - yy;
        const zr = z + s2 - yy;
        const yr = xz * 0.577350269189626 + yy;
        return this.noise3BCC(xr, yr, zr);
    }
}

// Global OpenSimplex noise instance
let globalOpenSimplexNoise: OpenSimplexNoise | null = null;

/**
 * Initialize or reinitialize the global OpenSimplex noise generator with a seed.
 * @param seed Seed for reproducible noise.
 */
export function initOpenSimplexNoise(seed: number = 0): void {
    globalOpenSimplexNoise = new OpenSimplexNoise(seed);
}

/**
 * Generate 2D OpenSimplex noise value using the global noise generator.
 * Initializes the generator if it hasn't been initialized yet.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @returns A noise value between approximately -1 and 1.
 */
export function openSimplexNoise2D(x: number, y: number): number {
    if (!globalOpenSimplexNoise) {
        initOpenSimplexNoise();
    }
    return globalOpenSimplexNoise!.noise2D(x, y);
}

/**
 * Generate 3D OpenSimplex noise value using the global noise generator.
 * Initializes the generator if it hasn't been initialized yet.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @param z The z coordinate.
 * @returns A noise value between approximately -1 and 1.
 */
export function openSimplexNoise3D(x: number, y: number, z: number): number {
    if (!globalOpenSimplexNoise) {
        initOpenSimplexNoise();
    }
    return globalOpenSimplexNoise!.noise3D(x, y, z);
}

/**
 * Generate octave OpenSimplex noise by combining multiple frequencies.
 * @param x The x coordinate.
 * @param y The y coordinate (optional, for 1D noise set to 0).
 * @param z The z coordinate (optional, for 1D/2D noise set to 0).
 * @param octaves Number of octaves (layers) to combine.
 * @param persistence How much each octave contributes relative to the previous (typically 0.5).
 * @param scale The scale/frequency of the base noise.
 * @returns A noise value.
 */
export function octaveOpenSimplexNoise(
    x: number, 
    y: number = 0, 
    z: number = 0, 
    octaves: number = 4, 
    persistence: number = 0.5, 
    scale: number = 1
): number {
    let value = 0;
    let amplitude = 1;
    let frequency = scale;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        if (z !== 0) {
            value += openSimplexNoise3D(x * frequency, y * frequency, z * frequency) * amplitude;
        } else {
            value += openSimplexNoise2D(x * frequency, y * frequency) * amplitude;
        }
        
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }

    return value / maxValue;
}

// Export the OpenSimplexNoise class for direct use if needed
export { OpenSimplexNoise }; 