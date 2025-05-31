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
    /** The name of the input on the target FormulaParameter, if type is NAMED_INPUT. */
    public inputName?: string;

    constructor(target: string, type: ConnectionType, inputName?: string) {
        this.target = target;
        this.type = type;
        if (type === ConnectionType.NAMED_INPUT && !inputName) {
            throw new Error("inputName is required for NAMED_INPUT connection type.");
        }
        this.inputName = inputName;
    }
}

/**
 * Defines the types of connections between stats.
 */
export enum ConnectionType {
    ADD = 1,
    SUB = 2,
    MULTY = 3,
    DIV = 4,
    FORMULA = 5,
    NAMED_INPUT = 6,
}

/**
 * Base interface for all stats.
 */
export interface Stat {
    /** Unique identifier for the stat. */
    name: string;
    /** The current calculated value of the stat. */
    readonly value: number;
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
    /** Array storing the names of stats connected via DIV. */
    public divSources: Array<string> = [];
    /** Cached product of the values of all MULTY-connected stats and reciprocals of DIV-connected stats. */
    public multiCache: number = 1;
    /** The final calculated value (add * multiCache). */
    public readonly value: number = 0;

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
    public readonly value: number = 0;
    public readonly independent: boolean = true;

    constructor(name: string, initialValue: number = 0) {
        this.name = name;
        (this as { -readonly [K in keyof this]: this[K] })['value'] = initialValue;
    }
}

/**
 * A derived stat whose value is calculated using a specific formula and an input argument.
 * The argument usually comes from another stat via a FORMULA connection.
 */
export class FormulaStat implements Stat {
    public name: string;
    public readonly value: number = 0;
    /** The input value for the formula. */
    public argument: number = 0;
    /** The function used to calculate the value from the argument. */
    public formula: StatFormula;

    constructor(name: string, formula: StatFormula) {
        this.name = name;
        this.formula = formula;
        // Initial calculation requires argument to be set by a connection
        (this as { -readonly [K in keyof this]: this[K] })['value'] = this.formula(this.argument);
    }
}

/**
 * Type for the formula function of a FormulaParameter.
 */
export type FormulaParameterFormula = (inputs: Record<string, number>) => number;

/**
 * A derived stat whose value is calculated using a custom formula and a set of named inputs.
 * Each named input is typically supplied by another stat via a NAMED_INPUT connection.
 */
export class FormulaParameter implements Stat {
    public name: string;
    public readonly value: number = 0;
    /** Stores the current values of named inputs. Key is inputName, value is the input's current value. */
    public inputs: Record<string, number> = {};
    /** The custom function used to calculate the value from the inputs. */
    public formula: FormulaParameterFormula;

    constructor(name: string, formula: FormulaParameterFormula, initialInputs?: Record<string, number>) {
        this.name = name;
        this.formula = formula;
        if (initialInputs) {
            this.inputs = { ...initialInputs };
        }
        // Initial calculation
        (this as { -readonly [K in keyof this]: this[K] })['value'] = this.formula(this.inputs);
    }
} 