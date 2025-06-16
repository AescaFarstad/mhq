const charactersData = {
    "ingress_sequoiter_mentalist_orator": {
        name: "Apenherz",
        gender: "male",
        fullImage: "ingress_char (4)",
        location: "sequoiter",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Apenherz's minor mental nudges convinced another guild to swap premises sight-unseen. They discovered too late their 'prestigious merchant quarter tower' was actually a condemned grain silo. His gift for making people see what they wanted to see had finally netted him a legitimate guild charter—even if some walls were falling apart.",
        keywords: ["charm", "trick", "mind", "spell", "word", "cloak", "gold", "voice", "deal", "mask", "luck", "wit", "smile", "illusion", "coin", "rune", "tongue", "sway", "glamour", "vow", "smoke", "echo", "flare", "whim", "urge", "charter", "silver"],
        initialAttributes: {
            physique: 2, strength: 2, agility: 3, constitution: 2, senses: 2,
            spirit: 2, attunement: 2, channeling: 2, weaving: 4, resilience: 2,
            mind: 2, knowledge: 2, wisdom: 2, ingenuity: 3, willpower: 2,
            social: 2, composure: 4, charisma: 4, empathy: 3, leadership: 2
        },
        initialSkills: {
            order_magic: {
                level: 3,
                specializations: { mentalism: 4, illusions: 1 }
            },
            persuasion: {
                level: 4,
                specializations: { oratory: 4, bargaining: 2 }
            },
            deception: {
                level: 2,
                specializations: { bluffing: 3 }
            },
            streetwise: {
                level: 2,
                specializations: { gathering_rumors: 2 }
            },
            melee_combat: {
                level: 1,
                specializations: { one_handed_blades: 1 }
            }
        }
    },
    "ingress_sequoiter_life_pharmacist": {
        name: "Siliana",
        gender: "female",
        fullImage: "ingress_char (3)",
        location: "sequoiter",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Siliana started out as an expedition medic. The northland taught her potent remedies, but the cost of learning came due in blood and memories best left frozen. Now she is the sole ray of light in the otherwise dark abandoned guild hall, turning this ruin into a makeshift sanctuary.",
        keywords: ["life", "herb", "light", "blood", "snow", "ice", "wound", "heal", "cure", "balm", "salve", "elixir", "potion", "vial", "flask", "root", "leaf", "bloom", "flower", "aura", "grace", "faith", "hope", "prayer", "spirit", "pulse", "breath", "medic", "doctor", "nurse", "remedy", "medicine", "tincture", "mix", "brew", "frost", "winter", "north", "memory", "trauma", "loss", "grief", "death", "sanctuary", "refuge", "haven", "shelter", "glow", "warmth", "miracle", "blessing", "touch", "care", "bandage", "stitch", "plant", "bottle", "formula"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 2, constitution: 3, senses: 3,
            spirit: 2, attunement: 4, channeling: 3, weaving: 2, resilience: 3,
            mind: 2, knowledge: 3, wisdom: 4, ingenuity: 2, willpower: 2,
            social: 2, composure: 2, charisma: 2, empathy: 4, leadership: 1
        },
        initialSkills: {
            life_magic: {
                level: 4,
                specializations: { restoration: 4, blessings: 2 }
            },
            medicine: {
                level: 3,
                specializations: { pharmacology: 4, first_aid: 2 }
            },
            survival: {
                level: 2,
                specializations: { foraging: 3 }
            },
            provisions: {
                level: 1,
                specializations: { cooking: 1 }
            },
            defense: {
                level: 1,
                specializations: { dodging: 1 }
            }
        }
    },
    "ingress_sequoiter_spectral_investigator": {
        name: "Andraticus",
        gender: "male",
        fullImage: "ingress_char (5)",
        location: "sequoiter",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Andraticus was once a city archivist, his quiet obsession with Sequoiter's countless missing persons leading him to the forbidden arts of death magic. He established his 'guild' in a forgotten records hall as a grim sanctuary for communing with the lost, a pursuit that naturally discouraged any living company.",
        keywords: ["ghost", "soul", "death", "spirit", "bone", "shade", "crypt", "mist", "void", "curse", "grave", "dust", "decay", "lantern", "cloak", "skull", "dark", "spell", "ash", "whisper", "rift", "tomb", "rot", "echo", "chill"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 2, constitution: 1, senses: 3,
            spirit: 2, attunement: 4, channeling: 3, weaving: 3, resilience: 3,
            mind: 2, knowledge: 4, wisdom: 3, ingenuity: 2, willpower: 4,
            social: 2, composure: 3, charisma: 1, empathy: 2, leadership: 1
        },
        initialSkills: {
            death_magic: {
                level: 3,
                specializations: { spectral_mastery: 4 }
            },
            investigation: {
                level: 4,
                specializations: { archive_delving: 4, forensics: 2 }
            },
            magical_lore: {
                level: 2,
                specializations: { arcane_history: 3 }
            },
            lore: {
                level: 2,
                specializations: { history: 2 }
            },
            meditation: {
                level: 1,
                specializations: { introspection: 1 }
            }
        }
    },
    "ingress_sequoiter_sky_pathfinder": {
        name: "Sayriga",
        gender: "female",
        fullImage: "ingress_char (2)",
        location: "sequoiter",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "Sayriga grew up navigating the treacherous northern wilderness, as her natural affinity for the sky and weather patterns manifested. She claimed an abandoned ruin as her 'guild' headquarters to offer her unique guiding services. Although not strictly a mages guild today, the premises have all necessary facilities, albeit in a state of disrepair.",
        keywords: ["wind", "sky", "storm", "snow", "cloud", "air", "bird", "frost", "mist", "ice", "light", "wing", "gust", "path", "peak", "glow", "guide", "flare", "drift", "ray", "north", "aura", "spark", "staff", "call", "weather"],
        initialAttributes: {
            physique: 2, strength: 2, agility: 4, constitution: 3, senses: 4,
            spirit: 2, attunement: 3, channeling: 2, weaving: 2, resilience: 3,
            mind: 2, knowledge: 1, wisdom: 3, ingenuity: 2, willpower: 3,
            social: 2, composure: 3, charisma: 2, empathy: 2, leadership: 2
        },
        initialSkills: {
            nature_magic: {
                level: 3,
                specializations: { sky_dance: 4 }
            },
            navigation: {
                level: 4,
                specializations: { pathfinding: 4, star_guiding: 2 }
            },
            survival: {
                level: 2,
                specializations: { shelter_craft: 2, foraging: 2 }
            },
            perception: {
                level: 2,
                specializations: { eagle_eye: 2 }
            },
            etiquette: {
                level: 1,
                specializations: { mages_guild_protocols: 1 }
            }
        }
    },
    "ingress_sequoiter_rune_enchanter": {
        name: "Astartia",
        gender: "female",
        fullImage: "ingress_char (1)",
        location: "sequoiter",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "A dedicated scholar consumed by the study of ancient runes, Astartia used her enchanting skills to craft scrolls to fund her research into Sequoiter's frozen history. One of her findings was the ruins of an old mages guild, which she promptly claimed as her base of operations. Initially far from the city, the recent rapid expansion now fully encompasses it.",
        keywords: ["rune", "scroll", "ink", "spell", "book", "glyph", "charm", "dust", "paper", "mind", "frost", "word", "echo", "map", "lore", "mark", "light", "sigil", "code", "focus", "page", "seal", "ice", "quill", "vault"],
        initialAttributes: {
            physique: 2, strength: 1, agility: 2, constitution: 2, senses: 3,
            spirit: 2, attunement: 3, channeling: 3, weaving: 4, resilience: 3,
            mind: 2, knowledge: 4, wisdom: 4, ingenuity: 3, willpower: 4,
            social: 2, composure: 2, charisma: 1, empathy: 1, leadership: 1
        },
        initialSkills: {
            enchanting: {
                level: 3,
                specializations: { scribing: 4, imbuing: 1 }
            },
            magical_lore: {
                level: 4,
                specializations: { runes: 4, arcane_principles: 2 }
            },
            linguistics: {
                level: 2,
                specializations: { ancient_languages: 3 }
            },
            alchemy: {
                level: 1,
                specializations: { potions: 2 }
            },
            memory: {
                level: 1,
                specializations: { eidetic_recall: 1 }
            }
        }
    },
    "ingress_sequoiter_clockwork_geomancer": {
        name: "Borin",
        gender: "male",
        fullImage: "ingress_char (6)",
        location: "sequoiter",
        initialLevel: 1,
        baseUpkeep: 0.0,
        bio: "A master smith and tinkerer by trade, Borin found his knack for geomancy unexpectedly useful in reinforcing his workshop against Sequoiter's harsh elements. After a rival's 'accidental' magical mishap cleared out the competition and any apprentices, his sturdy workshop became the last 'guild' on the far bank of Frosteritz River standing by sheer resilience.",
        keywords: ["stone", "forge", "metal", "fire", "hammer", "anvil", "rock", "ice", "armor", "gem", "smoke", "steam", "heat", "earth", "steel", "gear", "flame", "coal", "spark", "wall", "shield", "grit", "iron", "dust", "ore"],
        initialAttributes: {
            physique: 3, strength: 4, agility: 2, constitution: 4, senses: 2,
            spirit: 2, attunement: 2, channeling: 3, weaving: 2, resilience: 3,
            mind: 2, knowledge: 3, wisdom: 2, ingenuity: 4, willpower: 3,
            social: 2, composure: 2, charisma: 1, empathy: 1, leadership: 2
        },
        initialSkills: {
            elemental_magic: {
                level: 3,
                specializations: { geomancy: 4 }
            },
            engineering: {
                level: 4,
                specializations: { clockwork: 4, hydraulics: 2 }
            },
            artisanry: {
                level: 2,
                specializations: { smithing: 3 }
            },
            labor: {
                level: 2,
                specializations: { construction: 2 }
            },
            provisions: {
                level: 1,
                specializations: { baking_and_pastry: 1 }
            }
        }
    }
};
export default charactersData;
