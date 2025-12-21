import { CharacterDefinition } from '../lib/definitions/CharacterDefinition';

type CharacterData = Record<string, Omit<CharacterDefinition, 'id'>>;

const charactersData: CharacterData = {
  "ingress_sequoiter_mentalist_orator": {
    name: "Apenherz",
    epithets:["The Sly", "The Legitimate Thief"],
    archetype:"Silver-Tongued Devil",
    quote:"The best deals are made with egos.",
    gender: "male",
    fullImage: "ingress_char (4)",
    location: "sequoiter",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Apenherz once organized a 'guild optimization exchange' during the Annual Mages Summit. His mental nudges and people's tendency to see what they wanted to see allowed him to strike magically binding deals. He secured a legitimate guild charter while the other party still searches for their 'riverside tower' of negative height (a turnip cellar, in other words). Now, how's that for a pumpkin carriage?",
    keywords: ["charter", "deal", "summit", "exchange", "contract", "seal", "clause", "parchment", "ink", "signature", "nudge", "suggestion", "whisper", "thought", "mind", "perception", "illusion", "glamour", "tongue", "word", "phrase", "promise", "vow", "oath", "binding", "tower", "cellar", "height", "depth", "riverside", "property", "deed", "title", "negotiation", "bargain", "trade", "swap", "optimization", "value", "worth", "assessment", "pitch", "proposal", "presentation", "summit", "conference", "gathering", "meeting", "delegation", "representative", "voice", "tone", "inflection", "smile", "gesture", "handshake", "wink", "flourish", "cape", "scroll", "quill", "ledger", "calculation", "scheme", "ploy", "gambit", "trick", "ruse", "angle", "spin", "interpretation", "loophole", "technicality", "detail", "fine-print", "semantics", "rhetoric", "persuasion", "influence", "sway", "conviction", "belief", "assumption", "expectation", "desire", "want", "wish", "dream", "vision", "mirage", "shimmer", "veil", "facade", "veneer", "polish", "shine", "brass", "gold", "silver", "coin", "fee", "commission", "profit", "gain", "advantage", "leverage", "position", "authority", "sly", "wit"],
    initialAttributes: {
      physique: 2, strength: 2, agility: 3, constitution: 2, senses: 2,
      spirit: 2, attunement: 2, channeling: 2, weaving: 4, resilience: 2,
      mind: 2, knowledge: 2, wisdom: 2, ingenuity: 3, willpower: 2,
      social: 2, composure: 4, charisma: 4, empathy: 3, leadership: 2
    },
    initialSkills: {
      order_magic: {
        level: 2,
        specializations: { mentalism: 2, illusions: 1 }
      },
      persuasion: {
        level: 4,
        specializations: { oratory: 3, bargaining: 2 }
      },
      deception: {
        level: 2,
        specializations: { bluffing: 3 }
      },
      streetwise: {
        level: 1,
        specializations: { gathering_rumors: 1 }
      },
      enchanting: {
        level: 1,
        specializations: { scribing: 1 }
      },
      insight: {
        level: 3,
        specializations: { motive_analysis: 2, profiling: 1 }
      },
      etiquette: {
        level: 1,
        specializations: { mages_guild_protocols: 1, merchant_guild_practices: 1 }
      }
    }
  },
  "ingress_sequoiter_life_pharmacist": {
    name: "Siliana",
    epithets:["The Thaw", "The Solitary Ray of Light"],
    archetype:"The Frontier Medic",
    quote:"Some wounds you stitch with silence.",
    gender: "female",
    fullImage: "ingress_char (3)",
    location: "sequoiter",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Siliana started out as an expedition medic, but was soon got captured by a tribal cohort. Being a slave doctor, you don't get to choose how to mis-treat your patients. Nor can you look away from agonizing deaths. These memories are better left frozen, but the experience was invaluable for when Siliana escaped. Now she is converting an abandoned guild hall into a makeshift sanctuary where she can practice healing on her own terms.",
    keywords: ["medic", "healer", "doctor", "slave", "captive", "prisoner", "witness", "memory", "trauma", "escape", "freedom", "sanctuary", "refuge", "clinic", "infirmary", "herb", "remedy", "medicine", "cure", "balm", "salve", "poultice", "tincture", "elixir", "brew", "dose", "treatment", "surgery", "wound", "scar", "pain", "agony", "death", "corpse", "blood", "bandage", "needle", "thread", "knife", "scalpel", "forceps", "tourniquet", "splint", "frost", "ice", "snow", "north", "cold", "freeze", "tribe", "cohort", "raider", "captor", "master", "chain", "bond", "shackle", "tent", "camp", "wilderness", "expedition", "journey", "capture", "torment", "cruelty", "suffering", "patient", "victim", "survivor", "light", "warmth", "glow", "blessing", "prayer", "hope", "mercy", "kindness", "care", "touch", "hands", "gift", "skill", "knowledge", "practice", "experience", "lesson", "teaching", "altar", "shrine", "chapel", "hearth", "bed", "cot", "blanket", "bowl", "mortar", "pestle", "vial", "bottle", "jar", "pouch", "bag", "shelf", "supply", "stock", "conversion", "renewal", "redemption", "health"],
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
      },
      labor: {
        level: 2
      }
    }
  },
  "ingress_sequoiter_spectral_investigator": {
    name: "Andraticus",
    epithets:["The Final Questioner", "He Who Reads the End of the Story"],
    archetype:"The Necrotic Detective",
    quote:"It's not so much asking the question, it's daring to hear the answer!",
    gender: "male",
    fullImage: "ingress_char (5)",
    location: "sequoiter",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "As keeper of Sequoiter's expedition records, Andraticus watched with mounting obsession as the missing persons ledgers filled. Enabled by the insurance houses and unopposed by the overwhelmed officials, he relocated to the Corpse Vault. There the deceased await spring burial, outnumbering him a hundredfold - precisely how he prefers it. For he has questions.",
    keywords: ["ghost", "soul", "death", "spirit", "bone", "shade", "crypt", "mist", "void", "curse", "grave", "dust", "decay", "lantern", "cloak", "skull", "dark", "spell", "ash", "whisper", "rift", "tomb", "rot", "echo", "chill", "vault", "corpse", "ledger", "record", "question", "winter", "frost", "ice", "shadow", "specter", "phantom", "wraith", "shroud", "morgue", "coffin", "burial", "thaw", "cold", "archive", "scroll", "ink", "parchment", "candle", "key", "lock", "chain", "number", "name", "date", "seal", "wax", "coin", "payment", "debt", "claim", "proof", "witness", "testimony", "truth", "lie", "secret", "silence", "answer", "mystery", "vanishing", "absence", "loss", "memory", "rune", "sigil", "ward", "barrier", "threshold", "door", "passage", "veil", "border", "realm", "eternity", "oblivion", "abyss", "hollow", "emptiness", "sorrow", "grief", "mourning", "ritual", "ceremony", "incense", "salt", "circle", "pentacle", "dagger", "chalice", "mirror", "crystal", "fog", "breath", "heartbeat", "stillness", "midnight", "moon", "star", "omen", "portent", "fate", "destiny"],
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
      survival: {
        level: 1,
        specializations: { hazard_recognition: 2 }
      },
      provisions: {
        level: 1,
        specializations: { preservation: 1 }
      },
      lore: {
        level: 2,
        specializations: { history: 1 }
      },
      meditation: {
        level: 1,
        specializations: { introspection: 1 }
      }
    }
  },
  "ingress_sequoiter_sky_pathfinder": {
    name: "Sayriga",
    epithets:["Of the Skies", "The Castle Shepherd"],
    archetype:"The Wilderness Shaman",
    quote:"With the sun behind your back, the quarry won't see you coming.",
    gender: "female",
    fullImage: "ingress_char (2)",
    location: "sequoiter",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "The sun would always shine if Sayriga guided travelers through Sequoiter's taiga. In its blinding glare, they'd often see an intrusive mirage—an old castle with smoking chimneys gazing from the horizon's edge, and retreating further if approached. Eventually, Sayriga got tired of the pesky phantasm, and circled around it, forcing it to back off straight into Sequoiter, where her accomplices were waiting. Turns out it was a portable Mages Guild that had run off. It is now tamed and tethered.",
    keywords: ["wind", "sky", "storm", "snow", "cloud", "air", "frost", "mist", "ice", "gust", "gale", "blizzard", "hail", "aurora", "rainbow", "lightning", "thunder", "fog", "vapor", "breeze", "cyclone", "tempest", "light", "glow", "glare", "ray", "spark", "shimmer", "gleam", "flash", "radiance", "brilliance", "shine", "flare", "beacon", "prism", "spectrum", "reflection", "mirage", "illusion", "phantom", "path", "trail", "track", "compass", "route", "horizon", "direction", "landmark", "marker", "sign", "trace", "footprint", "scent", "clue", "bearing", "course", "taiga", "tundra", "peak", "glacier", "permafrost", "pine", "spruce", "moss", "lichen", "wolf", "elk", "bear", "raven", "eagle", "owl", "lynx", "spell", "ward", "rune", "sigil", "charm", "hex", "aura", "essence", "spirit", "wisp", "omen", "portent", "vision", "dream", "trance", "ritual", "castle", "tower", "chimney", "smoke", "wall", "gate", "door", "window", "roof", "foundation", "cornerstone", "archway", "hall", "chamber", "sanctum", "staff", "rope", "tether", "chain", "snare", "trap", "net", "lasso", "hook", "anchor", "stake", "pole", "lens", "crystal", "lantern", "map", "hunt", "chase", "pursuit", "ambush", "circle", "drift", "wander", "prowl", "stalk", "lure", "corner", "capture", "tame"],
    initialAttributes: {
      physique: 2, strength: 2, agility: 4, constitution: 3, senses: 4,
      spirit: 2, attunement: 3, channeling: 2, weaving: 2, resilience: 3,
      mind: 2, knowledge: 1, wisdom: 3, ingenuity: 2, willpower: 3,
      social: 2, composure: 3, charisma: 2, empathy: 2, leadership: 2
    },
    initialSkills: {
      nature_magic: {
        level: 2,
        specializations: { sky_dance: 4, beast_tongue: 1 }
      },
      navigation: {
        level: 4,
        specializations: { pathfinding: 3, star_guiding: 2 }
      },
      perception: {
        level: 1,
        specializations: { eagle_eye: 2 }
      },
      beast_mastery: {
        level: 1,
        specializations: { wild_taming: 1 }
      },
      survival: {
        level: 2,
        specializations: { hazard_recognition: 2, foraging: 1 }
      },
      hardiness: {
        level: 1,
        specializations: { acclimatization: 1 }
      },
      etiquette: {
        level: 1,
        specializations: { mages_guild_protocols: 1 }
      }
    }
  },
  "ingress_sequoiter_rune_enchanter": {
    name: "Astartia",
    epithets:["The Mammoth's Heir", "The Rune-Scribe"],
    archetype:"The Vengeful Prodigy",
    quote:"I should have become a lawyer.",
    gender: "female",
    fullImage: "ingress_char (1)",
    location: "sequoiter",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Astartia dreaded mundane work. When she learned of the 'Mammoth Prize'—a fortune promised to whoever breaks the runic lock on the eponymous Mages Guild—she moved to Sequoiter and consumed herself with this ancient puzzle. When she triumphed many years later, she forwent the prize because they refused to adjust it for inflation. She remains the only person who knows how to enter, and the lock grows harder by the day...",
    keywords: ["rune", "scroll", "ink", "glyph", "cipher", "lock", "key", "ward", "seal", "sigil", "script", "symbol", "mark", "inscription", "text", "tome", "codex", "manuscript", "parchment", "vellum", "quill", "stylus", "chisel", "tablet", "stone", "frost", "ice", "permafrost", "puzzle", "riddle", "pattern", "sequence", "formula", "equation", "solution", "prize", "vault", "door", "threshold", "barrier", "mechanism", "tumblers", "passage", "sanctum", "library", "archive", "repository", "study", "desk", "candle", "lamp", "lens", "magnifier", "dust", "web", "shadow", "silence", "solitude", "echo", "whisper", "secret", "mystery", "code", "language", "alphabet", "lexicon", "dictionary", "translation", "meaning", "truth", "deception", "forgery", "original", "copy", "palimpsest", "fragment", "shard", "piece", "whole", "obsession", "focus", "concentration", "memory", "knowledge", "wisdom", "spite", "revenge", "denial", "refusal", "isolation", "hermitage", "sanctuary", "refuge", "fortress", "bastion", "tower", "wall", "protection", "defense", "challenge", "defiance", "fields", "medal", "perelman"],
    initialAttributes: {
      physique: 2, strength: 1, agility: 2, constitution: 1, senses: 3,
      spirit: 2, attunement: 3, channeling: 2, weaving: 4, resilience: 3,
      mind: 2, knowledge: 4, wisdom: 2, ingenuity: 4, willpower: 4,
      social: 2, composure: 2, charisma: 1, empathy: 1, leadership: 1
    },
    initialSkills: {
      enchanting: {
        level: 3,
        specializations: { scribing: 4, imbuing: 2 }
      },
      magical_lore: {
        level: 4,
        specializations: { runes: 4, arcane_principles: 2 }
      },
      linguistics: {
        level: 2,
        specializations: { ancient_languages: 3, cryptography: 2 }
      },
      analysis_and_logic: {
        level: 3,
        specializations: { pattern_recognition: 3, puzzle_solving: 4 }
      },
      memory: {
        level: 1,
        specializations: { eidetic_recall: 1 }
      }
    }
  },
  "ingress_sequoiter_clockwork_geomancer": {
    name: "Borin",
    epithets:["The Hearth-Keeper", "Borin Bake-Bang"],
    archetype:"The Gentle Giant",
    quote:"A brick and a loaf—a trick in the stove.",
    gender: "male",
    fullImage: "ingress_char (6)",
    location: "sequoiter",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Borin wears a blacksmith's apron and a chef's white hat. His oven harbors primordial flames, and never cools. Clients abound, but people dread entering his workshop due to feral stalagmites. He retreats to Frosteritz River to play pebbles whenever visitors arrive. He pens tales of the 'Lightning Rune'—children etch this symbol on his door, though he cannot fathom why.",
    keywords: ["stone", "forge", "metal", "fire", "hammer", "anvil", "rock", "ice", "armor", "gem", "smoke", "steam", "heat", "earth", "steel", "gear", "flame", "coal", "spark", "wall", "shield", "grit", "iron", "dust", "ore", "stalactite", "stalagmite", "crystal", "toque", "apron", "bread", "flour", "dough", "oven", "kiln", "furnace", "ember", "ash", "soot", "bellows", "tongs", "quench", "ingot", "slag", "flux", "crucible", "mold", "chisel", "granite", "basalt", "obsidian", "magma", "crust", "mineral", "vein", "quarry", "boulder", "pebble", "river", "frost", "permafrost", "glacier", "workshop", "foundry", "bakery", "hearth", "chimney", "spike", "shard", "fracture", "fault", "tremor", "rune", "symbol", "door", "threshold", "visitor", "solitude", "tale", "story", "lightning", "copper", "bronze", "tin", "lead", "silver", "gold", "alloy", "temper", "fold", "weld", "rivet", "nail", "hinge", "latch", "chain", "ring", "plate", "scale", "helm", "gauntlet", "boot", "brace", "strut", "beam", "pillar", "arch"],

    initialAttributes: {
      physique: 3, strength: 3, agility: 2, constitution: 3, senses: 2,
      spirit: 2, attunement: 2, channeling: 4, weaving: 2, resilience: 3,
      mind: 2, knowledge: 3, wisdom: 2, ingenuity: 4, willpower: 3,
      social: 2, composure: 2, charisma: 1, empathy: 3, leadership: 1
    },
    initialSkills: {
      elemental_magic: {
        level: 3,
        specializations: {
          geomancy: 3,
          pyromancy: 2
        }
      },
      artisanry: {
        level: 4,
        specializations: { 
          smithing: 5,
          masonry: 1
        }
      },
      provisions: {
        level: 3,
        specializations: { 
          baking_and_pastry: 3,
          cooking: 1
        }
      },
      magical_lore: {
        level: 1,
        specializations: { 
          arcane_principles: 1,
          runes: 1
        }
      },
      performance: {
        level: 1,
        specializations: { 
          storytelling: 1
        }
      }
    }
  }
};

export default charactersData; 