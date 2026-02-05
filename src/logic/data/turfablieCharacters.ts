import { CharacterDefinition } from '../lib/definitions/CharacterDefinition';

type CharacterData = Record<string, Omit<CharacterDefinition, 'id'>>;

const charactersData: CharacterData = {
  "ingress_turfablie_scholarly_investigator": {
    name: "Theronin",
    epithets:["The Temporally Confused", "The Man Outside of When"],
    archetype:"The Living Library",
    quote:"I want the world to make sense, even if I don't.",
    gender: "male",
    fullImage: "ingress_char (16)",
    location: "turfablie",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Master diviner Theronin is permanently temporally confused. He speaks of ancient mages as if they'll arrive tomorrow, and greets visitors as old friends, wishing them to be born soon. However knowledgeable he is, it takes not less than a dedicated committee of researchers to extract useful knowledge from a heated debate that his future wiser self would inescapably start each time he found his previous self loitering. Also, sorry for that last sentence.",
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
    epithets:["The Paper Crown Queen", "The Smiling Serpent"],
    archetype:"The Social Engineer",
    quote:"I will turn it around, you'll see.",
    gender: "female",
    fullImage: "ingress_char",
    location: "turfablie",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Forging smiles rather than documents, Elariette schemed her way to 'temporary custodianship' of a failing Mages Guild, relying on Merchant Plaza's elite to build the web of proxy signatures. They took the guild's treasure, and it is little consolation that her authority is no longer temporary. Although... should she just roll with being a guild headmaster? Would it be too late to switch careers at 20?",
    keywords: ["ledger", "seal", "charm", "scroll", "paper", "book", "ink", "ring", "room", "deal", "note", "mark", "code", "key", "name", "token", "vow", "link", "word", "script", "vault", "sigil", "grace", "smile", "tongue", "voice", "whisper", "promise", "contract", "signature", "quill", "parchment", "wax", "ribbon", "coin", "debt", "credit", "receipt", "invoice", "letter", "mirror", "mask", "veil", "shadow", "echo", "glamour", "facade", "lip", "tooth", "eye", "face", "cheek", "tear", "laugh", "jest", "wit", "pact", "oath", "bond", "pledge", "accord", "treaty", "terms", "clause", "deed", "title", "certificate", "license", "permit", "favor", "secret", "rumor", "gossip", "truth", "lie", "tale", "story", "web", "thread", "knot", "pearl", "jewel", "gold", "silver", "copper", "purse", "pouch", "box", "chest", "coffer", "treasury", "vault", "safe", "lock", "latch", "hinge", "door", "window", "curtain", "drape", "silk", "velvet", "satin", "lace", "perfume", "scent", "powder", "rouge", "paint", "brush", "glass", "crystal", "prism", "candle", "flame", "smoke", "ash", "ember", "glow", "shine", "gleam", "shimmer", "sparkle", "glitter", "beam", "ray", "halo", "aura", "lesson", "draft", "calendar", "primer", "mistake", "page", "question", "hope", "dust", "error", "effort", "plan", "scheme", "youth", "doubt", "worry", "panic", "pretense", "bluff", "guess", "wish", "dream", "age"],
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
    epithets:["The Gearmancer", "The Vindicated Engineer"],
    archetype:"The Master of the Machine",
    quote:"If it stalls, I'll kick it.\nIf it screeches, I'll oil it.\nIf it kills, I've warned you.",
    gender: "male",
    fullImage: "ingress_char (17)",
    location: "turfablie",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Kolodin was a reputed expert on thaumaturgical engineering—the craze that proved a dead end but birthed a few magic-clockwork hybrid buildings, including a Mages Guild in Turfablie. He warned the occupants of the danger of living inside what was essentially a gear box of unfathomable purpose. After cleaning the premises of crushed bones, minced meat, and torn apparel, he stayed to learn what the building was originally built to calculate.",
    keywords: ["cog", "gear", "spring", "mechanism", "clockwork", "brass", "copper", "oil", "grease", "calculation", "equation", "formula", "theorem", "blueprint", "schematic", "diagram", "engineering", "thaumaturgy", "hybrid", "fusion", "merger", "bone", "meat", "blood", "warning", "danger", "crusher", "grinder", "tooth", "wheel", "axle", "bearing", "mainspring", "escapement", "pendulum", "oscillator", "regulator", "governor", "cam", "lever", "pulley", "ratchet", "pawl", "shaft", "spindle", "bobbin", "wire", "conduit", "channel", "pipe", "valve", "gauge", "meter", "indicator", "readout", "display", "crystal", "lens", "prism", "focus", "alignment", "calibration", "precision", "tolerance", "error", "deviation", "output", "input", "process", "cycle", "rotation", "revolution", "period", "frequency", "resonance", "harmonics", "vibration", "pulse", "tick", "tock", "chime", "bell", "hammer", "striker", "weight", "chain", "cable", "tension", "torque", "pressure", "steam", "vapor", "heat", "friction", "wear", "maintenance", "repair", "tool", "wrench", "screwdriver", "file", "lathe", "press", "forge", "anvil", "workshop"],
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
      artisanry: {
        level: 1,
        specializations: {
          smithing: 1
        }
      },
      spellcraft: {
        level: 1,
        specializations: {}
      },
      performance: {
        level: 1,
        specializations: {
          storytelling: 1
        }
      }
    }
  },

  "ingress_turfablie_wilderness_savant": {
    name: "Borie",
    epithets:["Of the Brambles", "The Moss Mother"],
    archetype:"The Nature Warden",
    quote:"Nature isn't gentle. It's patient.",
    gender: "female",
    fullImage: "ingress_char (7)",
    location: "turfablie",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Borie guided folk through wild mountain paths, brewed altitude tonics and scouted potential avalanches. During a particularly harsh season she took refuge in a crumbling Mages Guild, unleashing ice-citic lichen to patch the cracks. At first with the mages' grateful approval, and then contrary to their ever desperate objections, she greened all but the smoothest surfaces. If you enter, beware, the moss has ears.",
    keywords: ["moss", "vine", "root", "bark", "leaf", "thorn", "mushroom", "fungus", "lichen", "spore", "herb", "flower", "seed", "pollen", "sap", "cave", "stone", "path", "trail", "mountain", "peak", "valley", "avalanche", "snow", "boulder", "cliff", "gorge", "guide", "scout", "ranger", "hermit", "wildling", "tonic", "brew", "potion", "remedy", "salve", "tincture", "extract", "essence", "mixture", "medicine", "eagle", "wolf", "bear", "goat", "hawk", "owl", "rat", "beetle", "spider", "growth", "overgrowth", "wilderness", "nature", "forest", "grove", "thicket", "undergrowth", "canopy", "hollow", "den", "burrow", "nest", "refuge", "sanctuary", "chamber", "guild", "tower", "ruin", "library", "ear", "whisper", "warning", "sign", "omen", "season", "storm", "blizzard", "frost", "thaw", "mist", "fog", "dew", "rain", "wind", "scholar", "mage", "book", "spell", "knowledge", "wisdom", "instinct", "survival", "resilience", "patience", "solitude", "communion", "balance", "cycle", "decay", "renewal", "transformation"],
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
    name: "Erasmus",
    epithets:["The Shadow-Counter", "The Keeper of the Dark"],
    archetype:"The Occult Security Expert",
    quote:"Somehow, I just don't wanna stay and wait for a wonder.",
    gender: "male",
    fullImage: "ingress_char (15)",
    location: "turfablie",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Erasmus was once hired to penetration-test a mages guild. He broke into a room unknown even to the headmaster, and inadvertently stirred the arcane sediment that had accumulated there over the years. Naturally, this awakened several ancient horrors. Erasmus had a habit of matching shadows to their light sources, so when an extra one crept in during his debrief, he correctly identified the safest corner and repositioned his shadow there. While the mages chose poorly.",
    keywords: ["shadow", "lock", "key", "darkness", "vault", "trap", "sediment", "residue", "penumbra", "audit", "test", "breach", "count", "number", "light", "source", "room", "basement", "guild", "sanctum", "ward", "seal", "dust", "echo", "footstep", "silence", "corner", "threshold", "doorway", "keyhole", "tumbler", "pick", "tool", "pouch", "cloak", "hood", "glove", "boot", "leather", "oil", "wire", "probe", "mirror", "candle", "lamp", "flame", "flicker", "void", "gap", "absence", "presence", "visitor", "intruder", "warning", "habit", "routine", "pattern", "anomaly", "discrepancy", "mismatch", "extra", "surplus", "thickness", "density", "creep", "crawl", "hunger", "teeth", "maw", "consumption", "victim", "choice", "mistake", "caution", "vigilance", "observation", "notation", "tally", "ledger", "record", "ink", "page", "memory", "whisper", "rustle", "draft", "chill", "dread", "instinct", "reflex", "escape", "route", "exit", "entrance", "passage", "corridor", "alcove", "niche", "cobweb", "neglect", "abandonment", "emptiness", "solitude"],
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
          bat_ear: 1
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
    epithets:["The Legion's Last", "She Who Dines with Ghosts"],
    archetype:"The Haunted Survivor",
    quote:"I carry the past into the future.",
    gender: "female",
    fullImage: "ingress_char (14)",
    location: "turfablie",
    initialLevel: 1,
    baseUpkeep: 0.0,
    bio: "Astrid found the Guild whilst tracking her unit's missing death-pendants. The living avoid the guild's 'haunted' halls, but Astrid discovered she could spar there with heroes dead before her birth, train under legendary marshals, and drink with ghost comrades. The building's botched temporal experiments created a haven for warriors unstuck from time. And for the sole survivor of her unit—a place where she's never alone.",
    keywords: ["pendant", "ghost", "warrior", "spirit", "marshal", "hero", "comrade", "unit", "survivor", "shield", "armor", "sword", "greatsword", "plate", "mail", "leather", "strap", "buckle", "gauntlet", "helm", "scar", "wound", "bandage", "salve", "medal", "insignia", "banner", "standard", "memory", "echo", "phantom", "specter", "shade", "wraith", "veteran", "soldier", "captain", "sergeant", "recruit", "drill", "formation", "march", "salute", "vigil", "ceremony", "burial", "pyre", "ash", "bone", "tomb", "memorial", "epitaph", "honor", "duty", "oath", "vow", "loyalty", "sacrifice", "courage", "discipline", "stance", "guard", "parry", "strike", "thrust", "cleave", "endurance", "stamina", "breath", "muscle", "sinew", "blood", "sweat", "tears", "grief", "loss", "remembrance", "temporal", "rift", "tear", "portal", "timeline", "epoch", "era", "past", "present", "eternity", "drink", "ale", "mead", "toast", "brotherhood", "sisterhood", "kinship", "belonging", "home", "hearth", "warmth", "cold", "isolation", "loneliness", "connection", "training", "practice", "lesson", "wisdom"],
    initialAttributes: {
      physique: 2, strength: 4, agility: 3, constitution: 4, senses: 3,
      spirit: 2, attunement: 2, channeling: 2, weaving: 2, resilience: 3,
      mind: 2, knowledge: 2, wisdom: 2, ingenuity: 1, willpower: 4,
      social: 2, composure: 2, charisma: 2, empathy: 2, authority: 3
    },
    initialSkills: {
      death_magic: {
        level: 1,
        specializations: {
          spectral_mastery: 2
        }
      },
      order_magic: {
        level: 1,
        specializations: {
          abjuration: 1
        }
      },
      defense: {
        level: 3,
        specializations: {
          shields: 2,
          armor: 1,
          parrying: 1
        }
      },
      melee_combat: {
        level: 3,
        specializations: {
          two_handed_weapons: 2
        }
      },
      athletics: {
        level: 2
      },
      hardiness: {
        level: 2,
        specializations: {
          pain_tolerance: 1,
          stamina: 2,
          acclimatization: 1
        }
      },
      medicine: {
        level: 1,
        specializations: {
          first_aid: 1
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