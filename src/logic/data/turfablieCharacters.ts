import { CharacterDefinition } from '../lib/definitions/CharacterDefinition';

type CharacterData = Record<string, Omit<CharacterDefinition, 'id'>>;

const charactersData: CharacterData = {
    "ingress_turfablie_scholarly_investigator": {
        name: "Theronin",
        gender: "male",
        fullImage: "ingress_char (16)",
        location: "turfablie",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Master diviner Theronin is permanently temporally confused. He speaks of ancient mages as if they'll arrive tomorrow, and greets visitors as old friends, wishes them to be born soon. However knowledgeable he is, it takes, perhaps, a dedicated researcher to extract useful knowledge from a conversation with him.",
        keywords: ["book", "scroll", "archive", "lore", "history", "prophecy", "vision", "memory", "echo", "time", "past", "future", "oracle", "seer", "sage", "dream", "fate", "thread", "mirror", "clock", "day", "year", "age", "era", "cycle", "loop", "paradox", "riddle", "truth", "date", "order", "sequence", "pattern", "code", "sign", "omen", "portent", "glimpse", "moment", "instant", "eternity", "confusion", "tangle", "knot", "maze", "puzzle", "answer", "question", "secret", "key", "door", "path", "way", "guide", "map", "chart", "calendar", "diary", "record", "note", "glyph", "rune", "symbol", "mark", "trace", "clue", "hint", "wisdom", "knowledge", "mind", "thought", "plan", "scheme", "plot", "story", "tale", "legend", "myth", "fact", "fiction", "research"],
        initialAttributes: {
            physique: 2, strength: 2, agility: 1, constitution: 2, senses: 4,
            spirit: 2, attunement: 3, channeling: 2, weaving: 2, resilience: 2,
            mind: 2, knowledge: 4, wisdom: 3, ingenuity: 3, willpower: 4,
            social: 2, composure: 3, charisma: 2, empathy: 2, authority: 2
        },
        initialSkills: {
            divination: {
                level: 3,
                specializations: {
                    retrocognition: 2,
                    psychometry: 1
                }
            },
            magical_lore: {
                level: 4,
                specializations: {
                    arcane_history: 2,
                    runes: 2
                }
            },
            investigation: {
                level: 3,
                specializations: {
                    archive_delving: 2,
                    counter_forgery: 1
                }
            },
            analysis_logic: {
                level: 2,
                specializations: {
                    deductive_reasoning: 2
                }
            },
            memory: {
                level: 2,
                specializations: {
                    eidetic_recall: 1
                }
            },
            artistry: {
                level: 1,
                specializations: {
                    calligraphy: 1
                }
            }
        }
    },
    "ingress_turfablie_silver_tongue": {
        name: "Elariette",
        gender: "female",
        fullImage: "ingress_char",
        location: "turfablie",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Forging smiles rather than documents, Elariette conspired her way to 'temporary custodianship' of the failing Mages Guild, relying on Merchant Plaza's elite to build the web of proxy signatures. They took the guild's treasure, and it is little consolation that her authority is no longer borrowed.",
        keywords: ["ledger", "seal", "charm", "scroll", "paper", "book", "ink", "ring", "room", "deal", "note", "mark", "code", "key", "name", "token", "vow", "link", "word", "script", "vault", "sigil", "grace", "smile", "tongue", "voice", "whisper", "promise", "contract", "signature", "quill", "parchment", "wax", "ribbon", "coin", "debt", "credit", "receipt", "invoice", "letter", "mirror", "mask", "veil", "shadow", "echo", "glamour", "facade", "lip", "tooth", "eye", "face", "cheek", "tear", "laugh", "jest", "wit", "pact", "oath", "bond", "pledge", "accord", "treaty", "terms", "clause", "deed", "title", "certificate", "license", "permit", "favor", "secret", "rumor", "gossip", "truth", "lie", "tale", "story", "web", "thread", "knot", "pearl", "jewel", "gold", "silver", "copper", "purse", "pouch", "box", "chest", "coffer", "treasury", "vault", "safe", "lock", "latch", "hinge", "door", "window", "curtain", "drape", "silk", "velvet", "satin", "lace", "perfume", "scent", "powder", "rouge", "paint", "brush", "glass", "crystal", "prism", "candle", "flame", "smoke", "ash", "ember", "glow", "shine", "gleam", "shimmer", "sparkle", "glitter", "beam", "ray", "halo", "aura"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 2, constitution: 2, senses: 2,
            spirit: 2, attunement: 2, channeling: 2, weaving: 3, resilience: 2,
            mind: 2, knowledge: 3, wisdom: 3, ingenuity: 2, willpower: 3,
            social: 2, composure: 3, charisma: 4, empathy: 4, authority: 3
        },
        initialSkills: {
            order_magic: {
                level: 2,
                specializations: {
                    illusions: 1,
                    mentalism: 1
                }
            },
            magical_lore: {
                level: 1,
                specializations: {
                    arcane_history: 1
                }
            },
            deception: {
                level: 1,
                specializations: {
                    bluffing: 1,
                    lying: 1,
                    impersonation: 1
                }
            },
            persuasion: {
                level: 4,
                specializations: {
                    bargaining: 2,
                    oratory: 2
                }
            },
            etiquette: {
                level: 3,
                specializations: {
                    merchant_guild_practices: 2,
                    mages_guild_protocols: 1
                }
            },
            lore: {
                level: 1,
                specializations: {
                    customs: 1
                }
            },
            navigation: {
                level: 1,
                specializations: {
                    cartography: 1
                }
            }
        }
    },
    "ingress_turfablie_arcane_engineer": {
        name: "Kolodin",
        gender: "male",
        fullImage: "ingress_char (17)",
        location: "turfablie",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Kolodin, a former Artificer's Quarter tinkerer obsessed with merging magic and mechanics, was last seen passionately explaining a complex arcane conduit diagram to a departing council that never returned. He simply continued his work in the echoing halls, the de facto 'master' by virtue of being the only one still trying to make the old machinery whir.",
        keywords: ["gear", "steam", "spark", "cog", "metal", "gauge", "circuit", "glass", "wire", "map", "glow", "flame", "oil", "tool", "light", "pipe", "coil", "bolt", "plan", "clock", "node", "draft", "arc", "ring", "flux"],
        initialAttributes: {
            physique: 2, strength: 2, agility: 3, constitution: 2, senses: 2,
            spirit: 2, attunement: 3, channeling: 2, weaving: 3, resilience: 2,
            mind: 2, knowledge: 4, wisdom: 2, ingenuity: 4, willpower: 3,
            social: 2, composure: 2, charisma: 1, empathy: 2, authority: 2
        },
        initialSkills: {
            magical_lore: {
                level: 3,
                specializations: {
                    arcane_principles: 2,
                    magical_item_analysis: 2
                }
            },
            enchanting: {
                level: 3,
                specializations: {
                    implement_crafting: 2,
                    armament_enchanting: 2
                }
            },
            engineering: {
                level: 4,
                specializations: {
                    clockwork: 3
                }
            },
            artisanry: { // Less primary, more of a background
                level: 1,
                specializations: {
                    smithing: 1
                }
            },
            spellcraft: {
                level: 1,
                specializations: {}
            },
            performance: { // "Useless" skill reflecting his awkward explanations
                level: 1,
                specializations: {
                    storytelling: 1
                }
            }
        }
    },

    "ingress_turfablie_wilderness_savant": {
        name: "Borie",
        gender: "female",
        fullImage: "ingress_char (7)",
        location: "turfablie",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Borie, who once guided folk through wild mountain paths and understood the language of herbs, sought refuge in the crumbling Mages Guild during a particularly harsh season. The few remaining mages, unnerved by her untamed magic and quiet communion with the overgrowth, eventually drifted off, leaving her the sole keeper of its wild-growing heart.",
        keywords: ["root", "vine", "moss", "herb", "leaf", "wild", "bark", "staff", "mud", "seed", "bud", "path", "branch", "glade", "shade", "dew", "fern", "thorn", "grove", "soil", "fog", "flora", "sap", "pulse", "wood"],
        initialAttributes: {
            physique: 2, strength: 3, agility: 3, constitution: 4, senses: 4,
            spirit: 2, attunement: 3, channeling: 3, weaving: 2, resilience: 2,
            mind: 2, knowledge: 2, wisdom: 3, ingenuity: 2, willpower: 2,
            social: 2, composure: 1, charisma: 2, empathy: 3, authority: 2
        },
        initialSkills: {
            nature_magic: {
                level: 3,
                specializations: {
                    verdant_call: 2,
                    beast_tongue: 1,
                    bloom: 1
                }
            },
            alchemy: {
                level: 3,
                specializations: {
                    potions: 2,
                    toxicology: 1
                }
            },
            survival: {
                level: 4,
                specializations: {
                    foraging: 2,
                    shelter_craft: 1,
                    water_procurement: 1
                }
            },
            navigation: {
                level: 2,
                specializations: {
                    pathfinding: 2
                }
            },
            lore: {
                level: 1,
                specializations: {
                    agriculture: 1
                }
            },
            artisanry: {
                level: 1,
                specializations: {
                    woodworking: 1
                }
            }
        }
    },

    "ingress_turfablie_shadow_operative": {
        name: "Salezo",
        gender: "male",
        fullImage: "ingress_char (15)",
        location: "turfablie",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Salezo, familiar with Turfblie's Undergalleries and the art of quiet entry, had been using the increasingly abandoned Mages Guild as a discreet haven. When its last official occupant vanished without a trace, Salezo found his unofficial residency had, by default, become an empty lordship.",
        keywords: ["cloak", "shadow", "coin", "key", "lock", "smoke", "step", "trap", "ring", "blade", "mark", "whisper", "vault", "grip", "mask", "dark", "echo", "gold", "move", "chain", "watch", "glint", "path", "flare", "creed"],
        initialAttributes: {
            physique: 2, strength: 2, agility: 4, constitution: 3, senses: 4,
            spirit: 2, attunement: 1, channeling: 2, weaving: 3, resilience: 2,
            mind: 2, knowledge: 2, wisdom: 2, ingenuity: 3, willpower: 3,
            social: 2, composure: 3, charisma: 2, empathy: 2, authority: 2
        },
        initialSkills: {
            death_magic: {
                level: 2,
                specializations: {
                    shadowmancy: 2
                }
            },
            order_magic: {
                level: 1,
                specializations: {
                    illusions: 1
                }
            },
            stealth: {
                level: 4,
                specializations: {
                    sneaking: 2,
                    hiding: 2
                }
            },
            legerdemain: {
                level: 4,
                specializations: {
                    lockpicking: 2,
                    sleight_of_hand: 1,
                    trap_handling: 1
                }
            },
            perception: {
                level: 2,
                specializations: {
                    eagle_eye: 1,
                    bats_ear: 1
                }
            },
            streetwise: {
                level: 1,
                specializations: {
                    gambling: 1
                }
            }
        }
    },

    "ingress_turfablie_stalwart_guardian": {
        name: "Astrid",
        gender: "female",
        fullImage: "ingress_char (14)",
        location: "turfablie",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Formerly of the Highland Guard, Astrid was assigned to protect the Mages Guild eons ago, a duty she upheld even as its influence waned and its members departed one by one. Her unwavering vigil in the face of its decay left her the last soul within its walls, a sentinel guarding nothing but memories and dust.",
        keywords: ["guard", "sword", "shield", "oath", "steel", "honor", "coin", "watch", "post", "armor", "badge", "grit", "duty", "vigil", "scar", "rank", "gold", "line", "edge", "wall", "grasp", "blade", "sigil", "grace", "rule"],
        initialAttributes: {
            physique: 2, strength: 4, agility: 3, constitution: 4, senses: 3,
            spirit: 2, attunement: 2, channeling: 2, weaving: 2, resilience: 3,
            mind: 2, knowledge: 2, wisdom: 2, ingenuity: 1, willpower: 4,
            social: 2, composure: 2, charisma: 2, empathy: 2, authority: 3
        },
        initialSkills: {
            life_magic: {
                level: 3,
                specializations: {
                    protection: 2,
                    restoration: 1
                }
            },
            order_magic: {
                level: 1,
                specializations: {
                    abjuration: 1
                }
            },
            defense: {
                level: 4,
                specializations: {
                    shields: 2,
                    armor: 1,
                    parrying: 1
                }
            },
            melee_combat: {
                level: 3,
                specializations: {
                    one_handed_blades: 2
                }
            },
            hardiness: {
                level: 2,
                specializations: {
                    pain_tolerance: 1,
                    stamina: 1
                }
            },
            medicine: {
                level: 1,
                specializations: {
                    first_aid: 2
                }
            },
            artisanry: {
                level: 1,
                specializations: {
                    leatherworking: 1
                }
            }
        }
    }
};

export default charactersData; 