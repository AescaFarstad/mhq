import type { BuildingDefinition } from '../lib/definitions/BuildingDefinition';

export const buildingDefinitions: Record<string, Omit<BuildingDefinition, 'id'>> = {
    library: {
        name: "Library",
        description: "A place to learn new skills and abilities.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.03,
        xpMult: 2,
    },
    dining_hall: {
        name: "Dining Hall",
        description: "A place to eat and socialize.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.05,
        xpMult: 0.5,
    },
    workshop: {
        name: "Workshop",
        description: "A place to craft and upgrade items.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.1,
    },
    alchemists_lab: {
        name: "Alchemist's Lab",
        description: "Brew potent potions and transmute materials.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.12,

        xpMult: 1.5,
    },
    dormitories: {
        name: "Dormitories",
        description: "Comfortable living quarters for guild members.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.06,
    },
    training_grounds: {
        name: "Training Grounds",
        description: "Hone combat skills and magical prowess.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.07,
    },
    scrying_chamber: {
        name: "Scrying Chamber",
        description: "Peer into the unseen and gather intelligence.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.02,
    },
    herb_garden: {
        name: "Herb Garden",
        description: "Cultivate rare herbs for potions and rituals.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.04,
    },
    scriptorium: {
        name: "Scriptorium",
        description: "Copy ancient scrolls and inscribe new magical texts.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.08,
    },
    infirmary: {
        name: "Infirmary",
        description: "A place to mend wounds and cure ailments.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.06,
    },
    meditation_chamber: {
        name: "Meditation Chamber",
        description: "A serene space for focus, mana regeneration, and contemplation.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.01,

        xpMult: 2,
    },
    storage_vault: {
        name: "Storage Vault",
        description: "Securely stores guild resources, treasures, and artifacts.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.05,
    },
    kitchen: {
        name: "Kitchen",
        description: "Where meals for the guild are prepared.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.09,

        xpMult: 0.75,
    },
    stable: {
        name: "Stable",
        description: "Housing for mounts and other mundane or magical creatures.",
        cost: {
            gold: 10
        },
        clutterPerSecond: 0.08,
    }
};