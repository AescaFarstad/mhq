/**
 * Manages connections between stats.
 * Stores references to all connectable stats and the established links.
 */
export class Connections {
    /** Maps stat names to the actual Stat object. */
    connectablesByName = new Map();
    /** Maps the name of the source stat to an array of its outgoing connections. */
    establishedConnections = new Map();
}
/**
 * Represents a link from one stat to another, specifying how changes propagate.
 */
export class Connection {
    /** The name of the target stat. */
    target;
    /** The type of connection, determining how the target stat is affected. */
    type;
    /** The name of the input on the target FormulaParameter, if type is NAMED_INPUT. */
    inputName;
    constructor(target, type, inputName) {
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
export var ConnectionType;
(function (ConnectionType) {
    ConnectionType[ConnectionType["ADD"] = 1] = "ADD";
    ConnectionType[ConnectionType["SUB"] = 2] = "SUB";
    ConnectionType[ConnectionType["MULTY"] = 3] = "MULTY";
    ConnectionType[ConnectionType["DIV"] = 4] = "DIV";
    ConnectionType[ConnectionType["FORMULA"] = 5] = "FORMULA";
    ConnectionType[ConnectionType["NAMED_INPUT"] = 6] = "NAMED_INPUT";
    ConnectionType[ConnectionType["GATE_THRESHOLD"] = 7] = "GATE_THRESHOLD";
    ConnectionType[ConnectionType["GATE_VALUE"] = 8] = "GATE_VALUE";
})(ConnectionType || (ConnectionType = {}));
/**
 * A derived stat calculated based on additive and multiplicative inputs from other stats.
 * value = add * multiCache
 */
export class Parameter {
    name;
    /** The sum of all ADD/SUB connection inputs. */
    add = 0;
    /** Array storing the names of stats connected via MULTY. */
    multi = [];
    /** Array storing the names of stats connected via DIV. */
    divSources = [];
    /** Cached product of the values of all MULTY-connected stats and reciprocals of DIV-connected stats. */
    multiCache = 1;
    /** The final calculated value (add * multiCache). */
    value = 0;
    constructor(name) {
        this.name = name;
    }
}
/**
 * A base stat whose value is set directly (independent of other stats calculation-wise,
 * though other stats can depend on it).
 */
export class IndependentStat {
    name;
    value = 0;
    independent = true;
    constructor(name, initialValue = 0) {
        this.name = name;
        this['value'] = initialValue;
    }
}
/**
 * A derived stat whose value is calculated using a specific formula and an input argument.
 * The argument usually comes from another stat via a FORMULA connection.
 */
export class FormulaStat {
    name;
    value = 0;
    /** The input value for the formula. */
    argument = 0;
    /** The function used to calculate the value from the argument. */
    formula;
    constructor(name, formula) {
        this.name = name;
        this.formula = formula;
        // Initial calculation requires argument to be set by a connection
        this['value'] = this.formula(this.argument);
    }
}
/**
 * A derived stat whose value is calculated using a custom formula and a set of named inputs.
 * Each named input is typically supplied by another stat via a NAMED_INPUT connection.
 */
export class FormulaParameter {
    name;
    value = 0;
    /** Stores the current values of named inputs. Key is inputName, value is the input's current value. */
    inputs = {};
    /** The custom function used to calculate the value from the inputs. */
    formula;
    constructor(name, formula, initialInputs) {
        this.name = name;
        this.formula = formula;
        if (initialInputs) {
            this.inputs = { ...initialInputs };
        }
        // Initial calculation
        this['value'] = this.formula(this.inputs);
    }
}
/**
 * A gated stat that only updates its value when (baseValue + inputValue) crosses a threshold.
 * Useful for optimizing calculations that should only trigger on specific conditions.
 */
export class GateParameter {
    name;
    value = 0;
    /** The base value added to input value before threshold comparison. */
    baseValue;
    /** True for >= threshold, false for <= threshold. */
    isAboveThreshold;
    /** The current threshold value. */
    threshold = 0;
    /** The current input value. */
    inputValue = 0;
    constructor(name, baseValue, isAboveThreshold) {
        this.name = name;
        this.baseValue = baseValue;
        this.isAboveThreshold = isAboveThreshold;
        // Initialize with base value
        this['value'] = baseValue;
    }
}
