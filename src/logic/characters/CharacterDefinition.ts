/**
 * Defines the static data structure for a character loaded from JSON.
 */
export interface CharacterDefinition {
    id: string;          // Unique identifier
    name: string;        // Display name
    initialLevel: number; // Starting level (will become an IndependentStat)
    baseUpkeep: number;  // Base gold upkeep (will become an IndependentStat)
    // Add other static properties like class, etc. later
    bio: string; // Bio text

    // Initial attribute values for this character type (flat structure)
    initialAttributes: Record<string, number>; // Changed to flat structure
}

// The Character class will now represent the instance with dynamic stats.
// Remove the commented-out CharacterInstance example 