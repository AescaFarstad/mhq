import { AttributeDefinitions } from '../lib/definitions/AttributeDefinition';

const attributes: AttributeDefinitions = {
  physique: {
    displayName: "Physique",
    description: "Concerns the capabilities of the body.",
    attributes: {
      strength: {
        displayName: "Strength",
        description: "Physical power, lifting capacity, and melee impact."
      },
      agility: {
        displayName: "Agility",
        description: "Speed, reaction time, coordination, and fine motor skills."
      },
      constitution: {
        displayName: "Constitution",
        description: "Health; resilience to damage, illness or toxins."
      },
      senses: {
        displayName: "Senses",
        description: "Awareness; effectiveness of sight, hearing, smell and touch."
      }
    }
  },
  spirit: {
    displayName: "Spirit",
    description: "Relates to magical aptitude.",
    attributes: {
      attunement: {
        displayName: "Attunement",
        description: "Connect with and draw upon various magical sources."
      },
      channeling: {
        displayName: "Channeling",
        description: "The raw amount of magical energy that can be harnessed and directed."
      },
      weaving: {
        displayName: "Weaving",
        description: "Precision and finesse in shaping magical energies."
      },
      resilience: {
        displayName: "Resilience",
        description: "Fortitude against magical influence and stress."
      }
    }
  },
  mind: {
    displayName: "Mind",
    description: "Encompasses intellectual and cognitive faculties.",
    attributes: {
      knowledge: {
        displayName: "Knowledge",
        description: "Accumulated learning, facts, and general erudition."
      },
      wisdom: {
        displayName: "Wisdom",
        description: "Sound judgment, foresight, and intuition."
      },
      ingenuity: {
        displayName: "Ingenuity",
        description: "Creativity, problem-solving, and logical reasoning."
      },
      willpower: {
        displayName: "Willpower",
        description: "Ability to maintain attention, multitask, and persevere through challenges."
      }
    }
  },
  social: {
    displayName: "Social",
    description: "Concerns interactions with people and animals.",
    attributes: {
      composure: {
        displayName: "Composure",
        description: "Conceal true feelings, and maintain a facade."
      },
      charisma: {
        displayName: "Charisma",
        description: "Innate personal magnetism and influence."
      },
      empathy: {
        displayName: "Empathy",
        description: "Understand and share the feelings or perspectives of others."
      },
      authority: {
        displayName: "Authority",
        description: "Inspire, direct, organize, and gain authority within groups."
      }
    }
  }
};

export default attributes; 