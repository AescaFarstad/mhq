import { CharacterDefinition } from '../lib/definitions/CharacterDefinition';

// Type defining the structure of our characters data file
type CharacterData = Record<string, Omit<CharacterDefinition, 'id'>>;

const characters: CharacterData = {
    "you_char": {
        name: "You",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "This is you — the master of this place. You work for free. But on the bright side, you work for no one!",
        initialAttributes: {
            physique: 4,
            strength: 5,
            agility: 5,
            constitution: 5,
            senses: 5,
            spirit: 2,
            attunement: 2,
            channeling: 2,
            weaving: 2,
            resilience: 2,
            mind: 4,
            knowledge: 4,
            wisdom: 4,
            ingenuity: 4,
            willpower: 4,
            social: 3,
            composure: 3,
            charisma: 3,
            empathy: 3,
            leadership: 3
        },
        initialSkills: {
            // Physique skills
            melee_combat: {
                level: 2,
                specializations: {
                    one_handed_blades: 3
                }
            },
            ranged_combat: {
                level: 1,
                specializations: {
                    throwing_weapons: 2
                }
            },
            
            // Mind skills
            engineering: {
                level: 3,
                specializations: {
                    clockwork: 4
                }
            },
            meditation: {
                level: 2,
                specializations: {
                    introspection: 3
                }
            },
            memory: {
                level: 2,
                specializations: {
                    mental_mapping: 2
                }
            },
            
            // Social skills
            performance: {
                level: 2,
                specializations: {
                    storytelling: 3
                }
            }
        }
    },
    "nadia_char": {
        name: "Nadia",
        initialLevel: 1,
        baseUpkeep: 1.0,
        bio: "A basic worker, good for simple tasks.",
        triggerOnCreated: ["giveAllSkillsAndSpecs"],
        initialAttributes: {
            physique: 2,
            strength: 3,
            agility: 2,
            constitution: 3,
            senses: 2,
            spirit: 1,
            attunement: 1,
            channeling: 1,
            weaving: 1,
            resilience: 1,
            mind: 2,
            knowledge: 1,
            wisdom: 1,
            ingenuity: 2,
            willpower: 2,
            social: 2,
            composure: 2,
            charisma: 1,
            empathy: 1,
            leadership: 1
        },
        initialSkills: { }
    }
};

export default characters; 