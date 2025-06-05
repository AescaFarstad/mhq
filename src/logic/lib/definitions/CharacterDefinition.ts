/**
 * Defines the static data structure for a character loaded from JSON.
 */
export interface CharacterDefinition {
    id: string;
    name: string;
    gender: string;
    initialLevel: number;
    baseUpkeep: number;
    bio: string;
    fullImage: string;
    location: string;
    portraitImage?: string; // Optional portrait image

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