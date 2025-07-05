import { CharacterDefinition } from '../lib/definitions/CharacterDefinition';

type CharacterData = Record<string, Omit<CharacterDefinition, 'id'>>;

const charactersData: CharacterData = {
    "ingress_aeiga_reika_secret_seer": {
        name: "Seraphina",
        gender: "female",
        fullImage: "ingress_char (10)",
        location: "aeiga_reika",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Seraphina once brokered secrets for Aeiga-Reika's powerful—a key player in the false sulfur conspiracy. But a sensitive soul can only shake hands with murderers for so long. The coins, a thousand times touched, burned through her with the pain they witnessed. These days her Crystalline Parlor is closed. She reads the future still, but tells no one.",
        keywords: ["crystal", "sphere", "orb", "vision", "future", "prophecy", "sight", "seer", "oracle", "divination", "psychometry", "touch", "memory", "secret", "whisper", "truth", "revelation", "parlor", "broker", "information", "conspiracy", "sulfur", "coin", "burn", "pain", "essence", "soul", "sensitive", "hand", "palm", "eye", "veil", "mirror", "fate", "fortune", "read", "glimpse", "echo", "imprint", "residue", "aura", "gift", "talent", "knowledge", "mystery", "shadow", "past", "tomorrow", "dream", "trance", "ritual", "candle", "incense", "cards", "tea", "leaves", "signs", "omens", "portent", "scrying", "gaze", "third", "hidden", "unseen", "beyond", "within"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 4, constitution: 2, senses: 4,
            spirit: 2, attunement: 3, channeling: 2, weaving: 3, resilience: 2,
            mind: 2, knowledge: 3, wisdom: 3, ingenuity: 3, willpower: 2,
            social: 2, composure: 4, charisma: 2, empathy: 3, leadership: 1
        },
        initialSkills: {
            divination: {
                level: 3,
                specializations: {
                    psychometry: 3
                }
            },
            investigation: {
                level: 3,
                specializations: {
                    archive_delving: 2,
                    information_brokering: 2
                }
            },
            stealth: {
                level: 3,
                specializations: {
                    hiding: 2,
                    sneaking: 2
                }
            },
            perception: {
                level: 2,
                specializations: {
                    eagle_eye: 1
                }
            },
            insight: {
                level: 2,
                specializations: {
                    detecting_lies: 1
                }
            },
            etiquette: {
                level: 1,
                specializations: {
                    noble_courts: 1
                }
            },
            legerdemain: {
                level: 1,
                specializations: {
                    lockpicking: 1
                }
            }
        }
    },
    "ingress_aeiga_reika_nature_healer": {
        name: "Gulder",
        gender: "male",
        fullImage: "ingress_char (11)",
        location: "aeiga_reika",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "When the Coroner Pine escaped the guild's laboratory, only Gulder dared to approach. Rather than eradicate the plant, he protects it from the waves of Silica-Maw larvae the city council has been sending in ever since. Gulder magic accelerates their lifecycle and the majority turns into butterflies just before reaching the target.",
        keywords: ["water", "bucket", "splash", "leaf", "green", "bloom", "root", "herb", "soil", "moss", "growth", "plant", "seed", "life", "stream", "fountain", "flow", "wave", "dew", "branch", "flora", "pulse", "drop", "light", "path", "vine", "sprout", "petal", "stem", "bud", "flower", "grass", "tree", "fern", "algae", "lichen", "fungus", "mushroom", "spore", "pollen", "nectar", "sap", "bark", "thorn", "berry", "fruit", "nut", "garden", "grove", "meadow", "spring", "pool", "pond", "rain", "mist", "fog", "spray", "cure", "balm", "tonic", "potion", "salve", "tea", "brew", "extract", "essence", "oil", "nature", "verdant", "foliage", "canopy", "undergrowth", "thicket", "hedge", "ivy", "weed", "irrigation", "oasis", "puddle", "droplet", "moisture", "humidity", "compost", "mulch", "fertilizer", "larvae", "butterfly", "coroner", "pine"],
        initialAttributes: {
            physique: 2, strength: 2, agility: 2, constitution: 3, senses: 3,
            spirit: 2, attunement: 5, channeling: 2, weaving: 3, resilience: 3,
            mind: 2, knowledge: 4, wisdom: 3, ingenuity: 2, willpower: 2,
            social: 2, composure: 3, charisma: 1, empathy: 3, leadership: 1
        },
        initialSkills: {
            nature_magic: {
                level: 3,
                specializations: {
                    verdant_call: 3,
                    bloom: 2
                }
            },
            medicine: {
                level: 3,
                specializations: {
                    pharmacology: 2,
                    first_aid: 1
                }
            },
            hardiness: {
                level: 2,
                specializations: {
                    acclimatization: 2
                }
            },
            lore: {
                level: 2,
                specializations: {
                    agriculture: 2,
                    bestiary: 1
                }
            },
            elemental_magic: {
                level: 1,
                specializations: {
                    hydromancy: 1
                }
            },
            performance: {
                level: 1,
                specializations: {
                    singing: 1
                }
            },
            magical_lore: {
                level: 1,
                specializations: {
                    arcane_principles: 1
                }
            }
        }
    },
    "ingress_aeiga_reika_chaos_artificer": {
        name: "Lyra",
        gender: "female",
        fullImage: "ingress_char (12)",
        location: "aeiga_reika",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Lyra worked at Assembly Hall since she was ten. They were happy to have someone who could climb inside the titan's hand to fine-tune the digits. But things came apart more often than they'd come together as Lyra's true passion was dismantling complex apparatus. When the Highlander Mages Collective fled from Aeiga-Reika due to labor riots, Lyra undid their locks and turned their office into automaton graveyard.",
        keywords: ["chaos", "entropy", "fragment", "scrap", "ruin", "piece", "spring", "cog", "gear", "wire", "bolt", "rivet", "brass", "copper", "rust", "oil", "grease", "digit", "finger", "hand", "joint", "hinge", "lock", "key", "puzzle", "mechanism", "automaton", "golem", "titan", "wreckage", "debris", "shard", "component", "circuit", "valve", "piston", "lever", "switch", "tool", "wrench", "screwdriver", "pliers", "workshop", "bench", "blueprint", "schematic", "void", "unmaking", "dissolution", "decay", "breakdown", "dismantling", "deconstruction", "undoing", "unraveling", "assembly", "factory", "foundry", "warehouse", "office", "sanctum", "graveyard", "heap", "pile", "collection", "marvel", "wonder", "apparatus", "device", "contraption", "machine", "engine", "motor", "bearing", "axle", "wheel", "chain", "pulley", "cable", "scaffold", "framework", "skeleton", "shell", "housing", "panel", "plate", "mesh", "grid", "lattice", "maze", "labyrinth", "tangle", "knot", "mess", "jumble", "clutter", "disorder", "havoc", "mayhem", "anarchy", "lair", "tinkerer", "clockwork", "clock"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 4, constitution: 2, senses: 3,
            spirit: 2, attunement: 3, channeling: 4, weaving: 4, resilience: 1,
            mind: 2, knowledge: 3, wisdom: 1, ingenuity: 4, willpower: 3,
            social: 2, composure: 1, charisma: 2, empathy: 2, leadership: 1
        },
        initialSkills: {
            chaos_magic: {
                level: 3,
                specializations: {
                    twisting_fate: 3
                }
            },
            engineering: {
                level: 3,
                specializations: {
                    clockwork: 3
                }
            },
            magical_lore: {
                level: 2,
                specializations: {
                    magical_item_analysis: 2
                }
            },
            legerdemain: {
                level: 2,
                specializations: {
                    sleight_of_hand: 1,
                    trap_handling: 2
                }
            },
            stealth: {
                level: 1,
                specializations: {
                    sneaking: 1
                }
            },
            artisanry: {
                level: 1,
                specializations: {
                    sculpture: 1
                }
            },
            alchemy: {
                level: 2,
                specializations: {
                    incendiaries: 2
                }
            }
        }
    },
    "ingress_aeiga_reika_geomancer_engineer": {
        name: "Vane",
        gender: "male",
        fullImage: "ingress_char (13)",
        location: "aeiga_reika",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Vane once navigated Aeiga-Reika's hazardous steam tunnels, keeping the city's metal heart beating. When a tremor revealed the forgotten Mages Guild, its sturdy, defensible structure seemed a far better claim than his squalid bunk in the Soot Warrens. He's been alone, tinkering ever since.",
        keywords: ["steam", "gear", "pipe", "spark", "metal", "heat", "flame", "gauge", "tool", "grit", "glow", "wrench", "bolt", "lamp", "oil", "ring", "wire", "smoke", "coal", "mask", "glint", "fire", "shaft", "core", "flux"],
        initialAttributes: {
            physique: 3, strength: 3, agility: 3, constitution: 4, senses: 3,
            spirit: 2, attunement: 3, channeling: 1, weaving: 2, resilience: 3,
            mind: 2, knowledge: 3, wisdom: 2, ingenuity: 4, willpower: 3,
            social: 2, composure: 1, charisma: 1, empathy: 1, leadership: 2
        },
        initialSkills: {
            elemental_magic: {
                level: 2,
                specializations: {
                    geomancy: 2
                }
            },
            engineering: {
                level: 3,
                specializations: {
                    hydraulics: 2,
                    clockwork: 1
                }
            },
            labor: {
                level: 2,
                specializations: {
                    construction: 2,
                    hauling: 1
                }
            },
            survival: {
                level: 3,
                specializations: {
                    urban_survival: 2,
                    hazard_recognition: 2
                }
            },
            stealth: {
                level: 1,
                specializations: {
                    sneaking: 1
                }
            },
            ranged_combat: {
                level: 1,
                specializations: {
                    throwing_weapons: 1
                }
            },
            perception: {
                level: 2,
                specializations: {
                    serpent_s_skin: 1
                }
            }
        }
    },
    "ingress_aeiga_reika_grim_fighter": {
        name: "Marcaedro",
        gender: "male",
        fullImage: "ingress_char (9)",
        location: "aeiga_reika",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Marcaedro 'Grim' survived Aeiga-Reika's illegal golem fighting pits through shadow magic and brutal combat skills, known for dismantling constructs with hammer and fist. When a destroyed warehouse revealed a forgotten guild hall behind it, he claimed the defensible structure as his base. His fearsome reputation in the underworld ensures no one challenges his squatter's claim.",
        keywords: ["fist", "rage", "shock", "blood", "spark", "scar", "grit", "fury", "iron", "lash", "wrath", "fire", "gloom", "dark", "shadow", "vault", "chain", "core", "burst", "curse", "mark", "pain", "clash", "pulse", "glare", "squat", "golem", "pit"],
        initialAttributes: {
            physique: 2, strength: 4, agility: 3, constitution: 4, senses: 2,
            spirit: 2, attunement: 2, channeling: 3, weaving: 1, resilience: 4,
            mind: 2, knowledge: 1, wisdom: 2, ingenuity: 1, willpower: 4,
            social: 2, composure: 3, charisma: 1, empathy: 1, leadership: 3
        },
        initialSkills: {
            death_magic: {
                level: 2,
                specializations: {
                    shadowmancy: 2
                }
            },
            melee_combat: {
                level: 3,
                specializations: {
                    one_handed_impact: 3
                }
            },
            unarmed_combat: {
                level: 3,
                specializations: {
                    striking: 2,
                    grappling: 1
                }
            },
            defense: {
                level: 2,
                specializations: {
                    dodging: 2
                }
            },
            intimidation: {
                level: 2,
                specializations: {
                    presence: 1,
                    coercion: 1
                }
            },
            streetwise: {
                level: 1,
                specializations: {
                    underworld_navigation: 1
                }
            },
            provisions: {
                level: 1,
                specializations: {
                    butchery: 1
                }
            }
        }
    },
    "ingress_aeiga_reika_life_artisan": {
        name: "Meadowlight",
        gender: "female",
        fullImage: "ingress_char (8)",
        location: "aeiga_reika",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Few artists are as valued by industry as Meadowlight. Though her copper flowers bleeding oily chemicals unnerve before they enchant, what she is undoubtedly great at is turning mounds of pollution into harmless installations. Soot turns pretty as a crystal. Resin foam is best when spun into a wreath (mind the rusty spikes). Miraculously, her art weighs far less than the waste that arrives at her workshop daily.",
        keywords: ["waste", "pollution", "toxin", "soot", "rust", "oil", "chemical", "resin", "foam", "slag", "sludge", "runoff", "emission", "fume", "vapor", "crystal", "flower", "wreath", "sculpture", "installation", "art", "beauty", "transformation", "transmutation", "alchemy", "copper", "metal", "brass", "iron", "oxide", "patina", "corrosion", "industry", "factory", "foundry", "workshop", "studio", "gallery", "exhibition", "artist", "creator", "alchemist", "bloom", "petal", "thorn", "spike", "spiral", "lattice", "matrix", "structure", "form", "shape", "pattern", "design", "aesthetic", "vision", "imagination", "hybrid", "fusion", "amalgam", "compound", "solution", "precipitate", "catalyst", "reaction", "process", "weight", "mass", "void", "mystery", "paradox", "impossibility", "miracle", "wonder", "marvel", "phenomenon", "metamorphosis", "conversion", "refinement", "purification", "neutralization", "harmony", "balance", "duality", "contrast", "juxtaposition", "effluent", "residue", "byproduct", "contaminant", "pollutant", "installation", "masterpiece", "creation", "artifact", "piece", "display", "arrangement", "collection", "assemblage"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 4, constitution: 2, senses: 2,
            spirit: 2, attunement: 4, channeling: 2, weaving: 4, resilience: 2,
            mind: 2, knowledge: 2, wisdom: 3, ingenuity: 3, willpower: 2,
            social: 2, composure: 2, charisma: 4, empathy: 3, leadership: 2
        },
        initialSkills: {
            alchemy: {
                level: 3,
                specializations: {
                    transmutation: 3
                }
            },
            artistry: {
                level: 2,
                specializations: {
                    sculpture: 1
                }
            },
            chaos_magic: {
                level: 1,
                specializations: {
                    unraveling: 2
                }
            },
            order_magic: {
                level: 4,
                specializations: {
                    augmentation: 2
                }
            },
            magical_lore: {
                level: 2,
                specializations: {
                    magical_item_analysis: 1,
                    arcane_principles: 1
                }
            },
            perception: {
                level: 1,
                specializations: {
                    synesthesia: 3
                }
            },
            meditation: {
                level: 1,
                specializations: {
                    mana_conservation: 1
                }
            }
        }
    }
};

export default charactersData; 