import { IndependentStat, Parameter, Connections } from './Stat';
import { Stats } from './Stats';

/**
 * Represents a game resource with current value, income rate, and maximum capacity.
 * Uses the stat system internally.
 */
export class Resource {
    /** The base name of the resource (e.g., "gold"). */
    public name: string;
    /** IndependentStat representing the current amount of the resource. */
    public current: IndependentStat;
    /** Parameter representing the income per second. */
    public income: Parameter;
    /** Parameter representing the maximum storage capacity. */
    public max: Parameter;

    /** Prefix used for internal stat names to avoid collisions. */
    private static readonly STAT_PREFIX = "res_";

    /**
     * Creates a new Resource instance and its associated stats.
     *
     * @param name The base name for the resource.
     * @param initialValue The starting amount of the resource.
     * @param initialMax The initial maximum capacity.
     * @param connections The Connections manager instance.
     */
    constructor(name: string, initialValue: number, initialMax: number, connections: Connections) {
        this.name = name;

        const currentStatName = `${Resource.STAT_PREFIX}${name}_current`;
        const incomeStatName = `${Resource.STAT_PREFIX}${name}_income`;
        const maxStatName = `${Resource.STAT_PREFIX}${name}_max`;

        this.current = Stats.createStat(currentStatName, initialValue, connections);
        this.income = Stats.createParameter(incomeStatName, connections);
        this.max = Stats.createParameter(maxStatName, connections);

        // Initialize max capacity
        Stats.modifyParameterADD(this.max, initialMax, connections);
    }

    /**
     * Updates the current amount of the resource based on income and elapsed time.
     *
     * @param deltaTime Time elapsed since the last update, in seconds.
     * @param connections The Connections manager instance.
     */
    public update(deltaTime: number, connections: Connections): void {
        const incomeValue = this.income.value;
        const maxValue = this.max.value;
        const currentValue = this.current.value;

        if (incomeValue === 0) return; // No change if no income

        let gained = incomeValue * deltaTime;
        let newValue = currentValue + gained;

        // Clamp to max capacity
        if (newValue > maxValue) {
            newValue = maxValue;
        }
        // Prevent going below zero (though income usually handles this)
        if (newValue < 0) {
            newValue = 0;
        }

        // Only update if the value actually changed significantly
        if (Math.abs(newValue - currentValue) > 1e-6) {
            Stats.setIndependentStat(this.current, newValue, connections);
        }
    }
}

/**
 * Manages all resources in the game state.
 */
export class ResourceManager {
    private resources: Map<string, Resource> = new Map<string, Resource>();
    private connections: Connections;

    constructor(connections: Connections) {
        this.connections = connections;
    }

    /**
     * Adds a new resource to be managed.
     *
     * @param name Base name of the resource.
     * @param initialValue Starting amount.
     * @param initialMax Initial capacity.
     * @returns The newly created Resource object.
     */
    public addResource(name: string, initialValue: number, initialMax: number): Resource {
        if (this.resources.has(name)) {
            console.warn(`Resource "${name}" already exists.`);
            return this.resources.get(name)!;
        }
        const resource = new Resource(name, initialValue, initialMax, this.connections);
        this.resources.set(name, resource);
        return resource;
    }

    /**
     * Retrieves a resource by name.
     *
     * @param name The name of the resource.
     * @returns The Resource object or undefined if not found.
     */
    public getResource(name: string): Resource | undefined {
        return this.resources.get(name);
    }

    /**
     * Gets the map of all managed resources.
     * Useful for iterating over all resources in the UI.
     *
     * @returns A Map containing all resources, keyed by name.
     */
    public getAllResources(): Map<string, Resource> {
        return this.resources;
    }

    /**
     * Updates all managed resources based on elapsed time.
     *
     * @param deltaTime Time elapsed since the last update, in seconds.
     */
    public updateAll(deltaTime: number): void {
        this.resources.forEach(resource => {
            resource.update(deltaTime, this.connections);
        });
    }
} 