// Define a generic type for formula functions used by FormulaStat
export type StatFormula = (argument: number) => number;

/**
 * Manages connections between stats.
 * Stores references to all connectable stats and the established links.
 */
export class Connections {
    /** Maps stat names to the actual Stat object. */
    public connectablesByName: Map<string, Stat> = new Map<string, Stat>();
    /** Maps the name of the source stat to an array of its outgoing connections. */
    public establishedConnections: Map<string, Array<Connection>> = new Map<string, Array<Connection>>();
}

/**
 * Represents a link from one stat to another, specifying how changes propagate.
 */
export class Connection {
    /** The name of the target stat. */
    public target: string;
    /** The type of connection, determining how the target stat is affected. */
    public type: ConnectionType;

    constructor(target: string, type: ConnectionType) {
        this.target = target;
        this.type = type;
    }
}

/**
 * Defines the types of connections between stats.
 */
export enum ConnectionType {
    /** Add the source value to the target's additive component (Parameter). */
    ADD = 1,
    /** Multiply the target's multiplicative component by the source value (Parameter). */
    MULTY = 2,
    /** Subtract the source value from the target's additive component (Parameter). */
    SUB = 3,
    /** Use the source value as the input argument for the target's formula (FormulaStat). */
    FORMULA = 4,
}

/**
 * Base interface for all stats.
 */
export interface Stat {
    /** Unique identifier for the stat. */
    name: string;
    /** The current calculated value of the stat. */
    value: number;
    /** Optional flag indicating if the stat's value is set directly. */
    readonly independent?: boolean;
}

/**
 * A derived stat calculated based on additive and multiplicative inputs from other stats.
 * value = add * multiCache
 */
export class Parameter implements Stat {
    public name: string;
    /** The sum of all ADD/SUB connection inputs. */
    public add: number = 0;
    /** Array storing the names of stats connected via MULTY. */
    public multi: Array<string> = [];
    /** Cached product of the values of all MULTY-connected stats. */
    public multiCache: number = 1;
    /** The final calculated value (add * multiCache). */
    public value: number = 0;

    constructor(name: string) {
        this.name = name;
    }
}

/**
 * A base stat whose value is set directly (independent of other stats calculation-wise,
 * though other stats can depend on it).
 */
export class IndependentStat implements Stat {
    public name: string;
    public value: number = 0;
    public readonly independent: boolean = true;

    constructor(name: string, initialValue: number = 0) {
        this.name = name;
        this.value = initialValue;
    }
}

/**
 * A derived stat whose value is calculated using a specific formula and an input argument.
 * The argument usually comes from another stat via a FORMULA connection.
 */
export class FormulaStat implements Stat {
    public name: string;
    public value: number = 0;
    /** The input value for the formula. */
    public argument: number = 0;
    /** The function used to calculate the value from the argument. */
    public formula: StatFormula;

    constructor(name: string, formula: StatFormula) {
        this.name = name;
        this.formula = formula;
    }
} 