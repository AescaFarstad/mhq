/**
 * Represents a generic item loaded from a library definition (e.g., JSON).
 * Specific game entities (buildings, techs, events) can extend or implement this.
 */
export interface LibItem {
    /** Unique identifier for this library item. */
    id: string;
    /** Optional display name. */
    name?: string;
    /** Optional description. */
    description?: string;

    // Add other common properties if needed
} 