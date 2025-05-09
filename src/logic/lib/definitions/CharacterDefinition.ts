/**
 * Defines the static data structure for a character loaded from JSON.
 */
export interface CharacterDefinition {
    id: string;          // Unique identifier
    name: string;        // Display name
    initialLevel: number; // Starting level (will become an IndependentStat)
    baseUpkeep: number;  // Base gold upkeep (will become an IndependentStat)
    bio: string; // Bio text

    // Initial attribute values for this character type (flat structure)
    initialAttributes: Record<string, number>; // Changed to flat structure
    
    // Initial skills with nested specializations
    initialSkills?: Record<string, CharacterSkill>;

    triggerOnCreated?: string[]; // Optional array of event IDs
}

/**
 * Represents a character's skill with level and specializations
 */
export interface CharacterSkill {
    level: number;
    specializations?: Record<string, number>; // specialization ID to level mapping
}

// The Character class will now represent the instance with dynamic stats.
// Remove the commented-out CharacterInstance example 