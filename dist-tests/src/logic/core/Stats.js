import { Connection, Connections, ConnectionType, FormulaStat, IndependentStat, Parameter, FormulaParameter, GateParameter } from './Stat';
/**
 * Namespace containing utility functions for creating, connecting,
 * and modifying stats within a Connections manager.
 */
export var Stats;
(function (Stats) {
    /**
     * Creates a new Parameter stat and registers it.
     * @param name Unique name for the stat.
     * @param connections The Connections manager instance.
     * @returns The newly created Parameter.
     */
    function createParameter(name, connections) {
        const result = new Parameter(name);
        console.assert(!connections.connectablesByName.has(name), `Stat already exists: ${name}`);
        connections.connectablesByName.set(name, result);
        // Initial value is 0 (add=0 * multiCache=1)
        return result;
    }
    Stats.createParameter = createParameter;
    /**
     * Creates a new IndependentStat and registers it.
     * @param name Unique name for the stat.
     * @param initialValue The starting value for the stat.
     * @param connections The Connections manager instance.
     * @returns The newly created IndependentStat.
     */
    function createStat(name, initialValue, connections) {
        const result = new IndependentStat(name, initialValue);
        console.assert(!connections.connectablesByName.has(name), `Stat already exists: ${name}`);
        connections.connectablesByName.set(name, result);
        return result;
    }
    Stats.createStat = createStat;
    /**
     * Creates a new FormulaStat and registers it.
     * @param name Unique name for the stat.
     * @param formula The calculation function.
     * @param connections The Connections manager instance.
     * @returns The newly created FormulaStat.
     */
    function createFormulaStat(name, formula, connections) {
        const result = new FormulaStat(name, formula);
        console.assert(!connections.connectablesByName.has(name), `Stat already exists: ${name}`);
        connections.connectablesByName.set(name, result);
        // Initial value needs calculation based on initial argument, which depends on connection
        // We can trigger an initial calculation after connection if needed.
        return result;
    }
    Stats.createFormulaStat = createFormulaStat;
    /**
     * Creates a new FormulaParameter stat and registers it.
     * @param name Unique name for the stat.
     * @param formula The calculation function for the FormulaParameter.
     * @param connections The Connections manager instance.
     * @param initialInputs Optional initial values for the named inputs.
     * @returns The newly created FormulaParameter.
     */
    function createFormulaParameter(name, formula, connections, initialInputs) {
        const result = new FormulaParameter(name, formula, initialInputs);
        console.assert(!connections.connectablesByName.has(name), `Stat already exists: ${name}`);
        connections.connectablesByName.set(name, result);
        return result;
    }
    Stats.createFormulaParameter = createFormulaParameter;
    /**
     * Creates a new GateParameter stat and registers it.
     * @param name Unique name for the stat.
     * @param baseValue The base value added to input value before threshold comparison.
     * @param isAboveThreshold True for >= threshold, false for <= threshold.
     * @param connections The Connections manager instance.
     * @returns The newly created GateParameter.
     */
    function createGateParameter(name, baseValue, isAboveThreshold, connections) {
        const result = new GateParameter(name, baseValue, isAboveThreshold);
        console.assert(!connections.connectablesByName.has(name), `Stat already exists: ${name}`);
        connections.connectablesByName.set(name, result);
        return result;
    }
    Stats.createGateParameter = createGateParameter;
    /**
     * Establishes a connection between two stats by their names.
     * @param fromName Name of the source stat.
     * @param toName Name of the target stat.
     * @param type Type of the connection.
     * @param connections The Connections manager instance.
     * @param inputName For NAMED_INPUT, the name of the input on the target FormulaParameter.
     */
    function connectStr(fromName, toName, type, connections, inputName) {
        const fromStat = connections.connectablesByName.get(fromName);
        const toStat = connections.connectablesByName.get(toName);
        if (!fromStat) {
            console.error(`Connection source doesn't exist: ${fromName}`);
            return;
        }
        if (!toStat) {
            console.error(`Connection target doesn't exist: ${toName}`);
            return;
        }
        if (toStat.independent) {
            console.error(`Cannot connect to an IndependentStat: ${toName}`);
            return;
        }
        if (type === ConnectionType.NAMED_INPUT && !inputName) {
            console.error(`inputName is required for NAMED_INPUT connection type when calling connectStr for ${toName}.`);
            return;
        }
        if (!connections.establishedConnections.has(fromName)) {
            connections.establishedConnections.set(fromName, []);
        }
        // Check if this exact connection already exists to prevent duplicates
        const existingConnections = connections.establishedConnections.get(fromName);
        const connectionExists = existingConnections.some(conn => conn.target === toName &&
            conn.type === type &&
            conn.inputName === inputName);
        if (connectionExists) {
            console.warn(`Connection already exists: ${fromName} -> ${toName} (type: ${type})`);
            return; // Don't create duplicate connection
        }
        const connection = new Connection(toName, type, inputName); // Pass inputName here
        connections.establishedConnections.get(fromName).push(connection);
        if (type === ConnectionType.MULTY) {
            if (!(toStat instanceof Parameter)) {
                console.error(`MULTY connection target ${toName} is not a Parameter.`);
                return;
            }
            // Check if this connection already exists to prevent duplicates
            if (!toStat.multi.includes(fromName)) {
                toStat.multi.push(fromName);
                updateMultiCache(toStat, connections);
            }
        }
        else if (type === ConnectionType.NAMED_INPUT) {
            if (!(toStat instanceof FormulaParameter)) {
                console.error(`NAMED_INPUT connection target ${toName} is not a FormulaParameter.`);
                return;
            }
            if (!inputName) { // Should be caught by earlier check, but good for safety
                console.error(`inputName is crucial for NAMED_INPUT connection to ${toName} but was not provided.`);
                return;
            }
            // Removed: (toStat as FormulaParameter).inputConnections.set(inputName, fromName);
            // Set initial input value and recalculate
            toStat.inputs[inputName] = fromStat.value;
            recalculateFormulaParameterValue(toStat, connections);
            // No immediate call to applyConnection here as FormulaParameter recalc handles propagation
            return; // Return to avoid double application via generic applyConnection call below
        }
        // New: Handle DIV connection
        else if (type === ConnectionType.DIV) {
            if (!(toStat instanceof Parameter)) {
                console.error(`DIV connection target ${toName} is not a Parameter.`);
                return;
            }
            // Check if this connection already exists to prevent duplicates
            if (!toStat.divSources.includes(fromName)) {
                toStat.divSources.push(fromName);
                updateMultiCache(toStat, connections);
            }
        }
        // Apply the initial value immediately for other connection types
        // For NAMED_INPUT, this is handled during its specific setup block
        applyConnection(connection, 0, fromStat.value, connections);
    }
    Stats.connectStr = connectStr;
    /**
     * Establishes a connection between two stat objects.
     * @param from Source Stat object.
     * @param to Target Parameter, FormulaStat, FormulaParameter, or GateParameter object.
     * @param type Type of the connection.
     * @param connections The Connections manager instance.
     * @param inputName For NAMED_INPUT, the name of the input on the target FormulaParameter.
     */
    function connectStat(from, to, type, connections, inputName) {
        console.assert(!to.independent, `Cannot connect to an IndependentStat: ${to.name}`);
        if (type === ConnectionType.NAMED_INPUT) {
            if (!(to instanceof FormulaParameter)) {
                console.error(`Target for NAMED_INPUT connection must be a FormulaParameter. Target: ${to.name}`);
                return;
            }
            if (!inputName) {
                console.error(`inputName is required for NAMED_INPUT connection type to ${to.name}.`);
                return;
            }
        }
        if (type === ConnectionType.GATE_THRESHOLD || type === ConnectionType.GATE_VALUE) {
            if (!(to instanceof GateParameter)) {
                console.error(`Target for GATE_THRESHOLD/GATE_VALUE connection must be a GateParameter. Target: ${to.name}`);
                return;
            }
        }
        connectStr(from.name, to.name, type, connections, inputName);
    }
    Stats.connectStat = connectStat;
    /**
     * Sets the value of a stat and propagates changes.
     * Internal function, prefer modifyStat or modifyParameterADD externally.
     * @param stat The stat to update.
     * @param newValue The new value.
     * @param connections The Connections manager instance.
     */
    function setStat(stat, newValue, connections) {
        if (stat.value === newValue) {
            return;
        }
        const oldValue = stat.value;
        // Use type assertion to modify readonly property
        stat.value = newValue;
        applyConnections(stat, oldValue, newValue, connections);
    }
    /**
     * Modifies the value of an IndependentStat by a delta.
     * @param stat The IndependentStat to modify.
     * @param delta The change in value.
     * @param connections The Connections manager instance.
     */
    function modifyStat(stat, delta, connections) {
        setStat(stat, stat.value + delta, connections);
    }
    Stats.modifyStat = modifyStat;
    /**
     * Sets the value of an IndependentStat directly.
     * @param stat The IndependentStat to set.
     * @param newValue The new value.
     * @param connections The Connections manager instance.
     */
    function setIndependentStat(stat, newValue, connections) {
        setStat(stat, newValue, connections);
    }
    Stats.setIndependentStat = setIndependentStat;
    /**
     * Modifies the additive component of a Parameter stat.
     * @param parameter The Parameter to modify.
     * @param delta The change in the additive component.
     * @param connections The Connections manager instance.
     */
    function modifyParameterADD(parameter, delta, connections) {
        if (delta === 0)
            return;
        parameter.add += delta;
        // Recalculate the parameter's final value
        recalculateParameterValue(parameter, connections);
    }
    Stats.modifyParameterADD = modifyParameterADD;
    /**
     * Recalculates the multiCache for a Parameter based on its current MULTY connections.
     * @param parameter The Parameter to update.
     * @param connections The Connections manager instance.
     */
    function updateMultiCache(parameter, connections) {
        parameter.multiCache = 1;
        parameter.multi.forEach(sourceName => {
            const sourceStat = connections.connectablesByName.get(sourceName);
            if (sourceStat) {
                parameter.multiCache *= sourceStat.value;
            }
        });
        parameter.divSources.forEach(sourceName => {
            const sourceStat = connections.connectablesByName.get(sourceName);
            if (sourceStat) {
                const divisor = sourceStat.value === 0 ? 1 : sourceStat.value;
                parameter.multiCache /= divisor;
            }
        });
    }
    /**
     * Recalculates the final value of a Parameter (add * multiCache) and propagates changes.
     * @param parameter The Parameter to recalculate.
     * @param connections The Connections manager instance.
     */
    function recalculateParameterValue(parameter, connections) {
        const newValue = parameter.add * parameter.multiCache;
        setStat(parameter, newValue, connections);
    }
    /**
     * Recalculates the value of a FormulaStat based on its current argument and propagates changes.
     * @param stat The FormulaStat to recalculate.
     * @param connections The Connections manager instance.
     */
    function recalculateFormulaStatValue(stat, connections) {
        const newValue = stat.formula(stat.argument);
        setStat(stat, newValue, connections);
    }
    /**
     * Recalculates the value of a FormulaParameter based on its current inputs and propagates changes.
     * @param stat The FormulaParameter to recalculate.
     * @param connections The Connections manager instance.
     */
    function recalculateFormulaParameterValue(stat, connections) {
        const newValue = stat.formula(stat.inputs);
        setStat(stat, newValue, connections);
    }
    /**
     * Recalculates the value of a GateParameter and propagates changes if the value changed.
     * @param stat The GateParameter to recalculate.
     * @param connections The Connections manager instance.
     */
    function recalculateGateParameterValue(stat, connections) {
        const combinedValue = stat.baseValue + stat.inputValue;
        if (stat.isAboveThreshold === (combinedValue >= stat.threshold))
            setStat(stat, stat.inputValue, connections);
    }
    /**
     * Applies all outgoing connections from a changed stat.
     * @param fromStat The stat whose value changed.
     * @param oldValue The previous value.
     * @param newValue The new value.
     * @param connections The Connections manager instance.
     */
    function applyConnections(fromStat, oldValue, newValue, connections) {
        const connectionsArray = connections.establishedConnections.get(fromStat.name);
        if (connectionsArray) {
            for (const connection of connectionsArray) {
                applyConnection(connection, oldValue, newValue, connections);
            }
        }
    }
    /**
     * Applies a single connection, updating the target stat based on the source change.
     * @param connection The connection details.
     * @param oldValue Previous value of the source stat.
     * @param newValue New value of the source stat.
     * @param connections The Connections manager instance.
     */
    function applyConnection(connection, oldValue, newValue, connections) {
        const targetStat = connections.connectablesByName.get(connection.target);
        if (!targetStat || targetStat.independent)
            return;
        // Type assertion needed as independent stats are filtered out
        const pStat = targetStat;
        switch (connection.type) {
            case ConnectionType.ADD:
                pStat.add += newValue - oldValue;
                recalculateParameterValue(pStat, connections);
                break;
            case ConnectionType.SUB:
                pStat.add -= newValue - oldValue;
                recalculateParameterValue(pStat, connections);
                break;
            case ConnectionType.MULTY:
                // The change in one MULTY source requires recalculating the entire cache
                updateMultiCache(pStat, connections);
                recalculateParameterValue(pStat, connections);
                break;
            case ConnectionType.DIV:
                // The change in one DIV source requires recalculating the entire cache
                updateMultiCache(pStat, connections);
                recalculateParameterValue(pStat, connections);
                break;
            case ConnectionType.FORMULA:
                pStat.argument = newValue;
                recalculateFormulaStatValue(pStat, connections);
                break;
            case ConnectionType.NAMED_INPUT:
                pStat.inputs[connection.inputName] = newValue;
                recalculateFormulaParameterValue(pStat, connections);
                break;
            case ConnectionType.GATE_THRESHOLD:
                pStat.threshold = newValue;
                recalculateGateParameterValue(pStat, connections);
                break;
            case ConnectionType.GATE_VALUE:
                pStat.inputValue = newValue;
                recalculateGateParameterValue(pStat, connections);
                break;
        }
    }
    /**
     * Retrieves a stat by its name.
     * @param name The name of the stat.
     * @param connections The Connections manager instance.
     * @returns The Stat object or undefined if not found.
     */
    function getStat(name, connections) {
        return connections.connectablesByName.get(name);
    }
    Stats.getStat = getStat;
    /**
    * Retrieves a stat by its name, asserting that it exists.
    * @param name The name of the stat.
    * @param connections The Connections manager instance.
    * @returns The Stat object.
    * @throws If the stat is not found.
    */
    function getStatAsserted(name, connections) {
        const stat = connections.connectablesByName.get(name);
        if (!stat) {
            throw new Error(`Stat not found: ${name}`);
        }
        return stat;
    }
    Stats.getStatAsserted = getStatAsserted;
    /**
     * Clones a Stat object.
     * This is a helper function for cloneConnections.
     * @param stat The Stat object to clone.
     * @returns A new, cloned Stat object.
     * @throws If the stat type is unknown.
     */
    function cloneStat(stat) {
        if (stat instanceof IndependentStat) {
            const newIndependentStat = new IndependentStat(stat.name, 0);
            newIndependentStat['value'] = stat.value;
            return newIndependentStat;
        }
        else if (stat instanceof Parameter) {
            const newParameter = new Parameter(stat.name);
            newParameter.add = stat.add;
            newParameter.multi = [...stat.multi];
            newParameter.divSources = [...stat.divSources];
            newParameter.multiCache = stat.multiCache;
            newParameter['value'] = stat.value;
            return newParameter;
        }
        else if (stat instanceof FormulaStat) {
            const newFormulaStat = new FormulaStat(stat.name, stat.formula);
            newFormulaStat.argument = stat.argument;
            newFormulaStat['value'] = stat.value;
            return newFormulaStat;
        }
        else if (stat instanceof FormulaParameter) {
            const newFormulaParameter = new FormulaParameter(stat.name, stat.formula, { ...stat.inputs });
            newFormulaParameter['value'] = stat.value;
            return newFormulaParameter;
        }
        else if (stat instanceof GateParameter) {
            const newGateParameter = new GateParameter(stat.name, stat.baseValue, stat.isAboveThreshold);
            newGateParameter.threshold = stat.threshold;
            newGateParameter.inputValue = stat.inputValue;
            newGateParameter['value'] = stat.value;
            return newGateParameter;
        }
        throw new Error(`Unknown stat type for cloning: ${stat.name} of type ${stat.constructor.name}`);
    }
    /**
     * Creates a deep clone of a Connections object.
     * The cloned Connections object is completely independent of the original.
     * @param connections The Connections object to clone.
     * @returns A new, deep-cloned Connections object.
     */
    function cloneConnections(connections) {
        const newConnections = new Connections();
        // Clone all connectable stats
        connections.connectablesByName.forEach((stat, name) => {
            newConnections.connectablesByName.set(name, cloneStat(stat));
        });
        // Clone all established connections
        connections.establishedConnections.forEach((conns, sourceName) => {
            const newConns = conns.map(conn => new Connection(conn.target, conn.type, conn.inputName));
            newConnections.establishedConnections.set(sourceName, newConns);
        });
        return newConnections;
    }
    Stats.cloneConnections = cloneConnections;
})(Stats || (Stats = {})); // namespace Stats 
