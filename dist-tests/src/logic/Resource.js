import { Stats } from './core/Stats';
import { RESOURCE_STAT_PREFIX } from './core/statPrefixes';
/**
 * Represents a game resource with current value, income rate, and maximum capacity.
 * Uses the stat system internally.
 */
export class Resource {
    /** The base name of the resource (e.g., "gold"). */
    name;
    /** IndependentStat representing the current amount of the resource. */
    current;
    /** Parameter representing the income per second. */
    income;
    /** Parameter representing the maximum storage capacity. */
    max;
    /**
     * Creates a new Resource instance and its associated stats.
     *
     * @param name The base name for the resource.
     * @param initialValue The starting amount of the resource.
     * @param initialMax The initial maximum capacity.
     * @param connections The Connections manager instance.
     */
    constructor(name, initialValue, initialMax, connections) {
        this.name = name;
        const currentStatName = `${RESOURCE_STAT_PREFIX}${name}_current`;
        const incomeStatName = `${RESOURCE_STAT_PREFIX}${name}_income`;
        const maxStatName = `${RESOURCE_STAT_PREFIX}${name}_max`;
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
    update(deltaTime, connections) {
        const incomeValue = this.income.value;
        const maxValue = this.max.value;
        const currentValue = this.current.value;
        if (incomeValue === 0)
            return; // No change if no income
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
 * Module for managing all resources in the game state.
 */
/**
 * Adds a new resource to be managed.
 *
 * @param resources The Map containing all resources.
 * @param name Base name of the resource.
 * @param initialValue Starting amount.
 * @param initialMax Initial capacity.
 * @param connections The Connections manager instance.
 * @returns The newly created Resource object.
 */
export function addResource(resources, name, initialValue, initialMax, connections) {
    if (resources.has(name)) {
        console.warn(`Resource "${name}" already exists.`);
        return resources.get(name);
    }
    const resource = new Resource(name, initialValue, initialMax, connections);
    resources.set(name, resource);
    return resource;
}
/**
 * Retrieves a resource by name.
 *
 * @param resources The Map containing all resources.
 * @param name The name of the resource.
 * @returns The Resource object or undefined if not found.
 */
export function getResource(resources, name) {
    return resources.get(name);
}
/**
 * Gets the map of all managed resources.
 * Useful for iterating over all resources in the UI.
 *
 * @param resources The Map containing all resources.
 * @returns A Map containing all resources, keyed by name.
 */
export function getAllResources(resources) {
    return resources;
}
/**
 * Updates all managed resources based on elapsed time.
 *
 * @param resources The Map containing all resources.
 * @param deltaTime Time elapsed since the last update, in seconds.
 * @param connections The Connections manager instance.
 */
export function updateAllResources(resources, deltaTime, connections) {
    resources.forEach(resource => {
        resource.update(deltaTime, connections);
    });
}
