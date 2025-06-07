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
        bio: "Lyra was a promising, if volatile, apprentice in the Titan Assembly Hall, until her 'unauthorized experiments' became too disruptive. Finding the old guild hall was a stroke of luck, a private workshop far from prying eyes and stifling rules. She's been happily dismantling and 'improving' things in solitude.",
        keywords: ["spark", "gear", "glow", "tool", "flame", "metal", "goggles", "smoke", "glint", "bolt", "wire", "steam", "coil", "glass", "blast", "wrench", "orb", "fuse", "pulse", "fire", "craft", "brass", "lamp", "flare", "core"],
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
        bio: "Meadowlight came to Aeiga-Reika believing even industrial waste could bloom, her transmutation magic turning soot into prismatic crystals and rust into copper flowers. The crumbling guild hall became her canvas for strange beauty. She works alone, slowly transforming decay into art that both disturbs and enchants.",
        keywords: ["bloom", "crystal", "rust", "soot", "flower", "dust", "glow", "light", "stone", "petal", "metal", "aura", "spark", "charm", "copper", "grace", "pulse", "veil", "shard", "stem", "flare", "change", "path", "moss", "hue"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 4, constitution: 2, senses: 2,
            spirit: 2, attunement: 4, channeling: 2, weaving: 4, resilience: 2,
            mind: 2, knowledge: 2, wisdom: 3, ingenuity: 3, willpower: 2,
            social: 2, composure: 2, charisma: 4, empathy: 3, leadership: 2
        },
        initialSkills: {
            life_magic: {
                level: 3,
                specializations: {
                    blessings: 3
                }
            },
            artisanry: {
                level: 3,
                specializations: {
                    woodworking: 2,
                    tailoring: 2
                }
            },
            enchanting: {
                level: 2,
                specializations: {
                    imbuing: 2
                }
            },
            persuasion: {
                level: 2,
                specializations: {
                    oratory: 1,
                    conflict_resolution: 1
                }
            },
            commerce_trade: {
                level: 1,
                specializations: {
                    appraisal: 1
                }
            },
            riding: {
                level: 1,
                specializations: {
                    equine_mounts: 1
                }
            },
            performance: {
                level: 2,
                specializations: {
                    storytelling: 1
                }
            }
        }
    }
};

export default charactersData; 