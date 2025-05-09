import { SkillsData } from '../lib/definitions/SkillDefinition';

const skills: SkillsData = {
    // --- PHYSIQUE ---
    melee_combat: {
      displayName: "Melee Combat",
      description: "Fighting hand-to-hand with weapons",
      attribute: "physique",
      governedBy: ["strength", "agility"],
      assistedBy: ["constitution", "senses"],
      specializations: {
        one_handed_blades: {
          displayName: "One-Handed Blades",
          description: "Swords, Daggers, Scimitars",
        },
        one_handed_impact: {
          displayName: "One-Handed Impact",
          description: "Maces, Hammers, Axes",
        },
        two_handed_weapons: {
          displayName: "Two-Handed Weapons",
          description: "Greatswords, Greataxes, Mauls",
        },
        polearms: {
          displayName: "Polearms",
          description: "Spears, Halberds, Glaives",
        },
        flails_and_chains: {
          displayName: "Flails & Chains",
          description: "Weapons requiring specific momentum control",
        },
      },
    },
    ranged_combat: {
      displayName: "Ranged Combat",
      description: "Fighting from a distance with projectile weapons",
      attribute: "physique",
      governedBy: ["agility", "senses"],
      assistedBy: ["strength", "constitution"],
      specializations: {
        archery: {
          displayName: "Archery",
          description: "Longbows, Shortbows",
        },
        crossbows: {
          displayName: "Crossbows",
          description: "Light, Heavy, Repeating",
        },
        throwing_weapons: {
          displayName: "Throwing Weapons",
          description: "Daggers, Axes, Javelins, Slings",
        },
        siege_weaponry: {
          displayName: "Siege Weaponry",
          description: "Ballistae, Catapults (basic aiming/firing)",
        },
      },
    },
    unarmed_combat: {
      displayName: "Unarmed Combat",
      description: "Fighting without weapons",
      attribute: "physique",
      governedBy: ["strength", "agility"],
      assistedBy: ["constitution", "senses"],
      specializations: {
        striking: {
          displayName: "Striking",
          description: "Punches, Kicks, Elbows, Knees",
        },
        grappling: {
          displayName: "Grappling",
          description: "Holds, Throws, Joint Locks, Pins",
        },
        improvised_weaponry: {
          displayName: "Improvised Weaponry",
          description: "Using chairs, bottles, tools effectively in a fight",
        },
      },
    },
    defense: {
      displayName: "Defense",
      description: "Actively avoiding or mitigating harm",
      attribute: "physique",
      governedBy: ["agility", "senses"],
      assistedBy: ["constitution", "strength"],
      specializations: {
        dodging: {
          displayName: "Dodging",
          description: "Evading attacks through movement and positioning",
        },
        parrying: {
          displayName: "Parrying",
          description: "Deflecting blows with a weapon or item",
        },
        shields: {
          displayName: "Shields",
          description: "Effectively blocking, bashing, and covering with shields",
        },
        armor: {
          displayName: "Armor",
          description: "Effectively wearing and maneuvering in protective gear",
        }
      },
    },
    athletics: {
      displayName: "Athletics",
      description: "General physical movement and capability",
      attribute: "physique",
      governedBy: ["agility", "strength"],
      assistedBy: ["constitution"],
      specializations: {
        running: {
          displayName: "Running",
          description: "Speed and short-burst endurance",
        },
        climbing: {
          displayName: "Climbing",
          description: "Scaling walls, cliffs, trees; rappelling techniques, effective use of grappling hooks",
        },
        swimming: {
          displayName: "Swimming",
          description: "Effective movement through water, diving, breath control, navigating currents",
        },
        jumping: {
          displayName: "Jumping",
          description: "Leaping gaps or over obstacles",
        },
      },
    },
    acrobatics: {
      displayName: "Acrobatics",
      description: "Feats of balance, coordination, and flexibility",
      attribute: "physique",
      governedBy: ["agility"],
      assistedBy: ["senses", "constitution"],
      specializations: {
        balance: {
          displayName: "Balance",
          description: "Walking tightropes, navigating narrow ledges",
        },
        tumbling: {
          displayName: "Tumbling",
          description: "Rolling, controlled falls, diving through obstacles",
        },
        escapology: {
          displayName: "Escapology",
          description: "Slipping bonds, contorting through small spaces",
        },
        parkour: {
          displayName: "Parkour",
          description: "Swift city traversal, rooftop navigation",
        },
      },
    },
    hardiness: {
      displayName: "Hardiness",
      description: "Physical resilience and endurance",
      attribute: "physique",
      governedBy: ["constitution", "resilience"],
      assistedBy: ["willpower"],
      specializations: {
        pain_tolerance: {
          displayName: "Pain Tolerance",
          description: "Resisting effects of wounds, torture, or strain",
        },
        stamina: {
          displayName: "Stamina",
          description: "Resisting fatigue from prolonged exertion (marching, labor)",
        },
        acclimatization: {
          displayName: "Acclimatization",
          description: "Thrive in heat, cold and harsh weather",
        },
        immunity: {
          displayName: "Immunity",
          description: "Natural fortitude against toxins and sickness",
        },
      },
    },
    stealth: {
      displayName: "Stealth",
      description: "Moving and hiding without being detected",
      attribute: "physique",
      governedBy: ["agility", "senses"],
      assistedBy: ["willpower", "composure"],
      specializations: {
        sneaking: {
          displayName: "Sneaking",
          description: "Moving silently across various surfaces",
        },
        hiding: {
          displayName: "Hiding",
          description: "Utilizing shadows, cover, and stillness effectively",
        },
        camouflage: {
          displayName: "Camouflage",
          description: "Blending into specific environments (urban, forest, snow)",
        },
      },
    },
    legerdemain: {
      displayName: "Legerdemain",
      description: "Manual dexterity for subtle manipulation",
      attribute: "physique",
      governedBy: ["agility", "senses"],
      assistedBy: ["ingenuity", "composure"],
      specializations: {
        sleight_of_hand: {
          displayName: "Sleight of Hand",
          description: "Pickpocketing, planting items, palming objects, cheating",
        },
        lockpicking: {
          displayName: "Lockpicking",
          description: "Bypassing mechanical locks and simple mechanisms",
        },
        trap_handling: {
          displayName: "Trap Handling",
          description: "Identifying, disarming, and setting simple physical traps",
        },
      },
    },
    perception: {
      displayName: "Perception",
      description: "Using senses to gather information",
      attribute: "physique",
      governedBy: ["senses"],
      assistedBy: ["wisdom", "willpower"],
      specializations: {
        eagle_eye: {
          displayName: "Eagle Eye",
          description: "Spotting details at distance, noticing slight movements",
        },
        bat_ear: {
          displayName: "Bat's Ear",
          description: "Detecting faint sounds, eavesdropping, identifying sounds",
        },
        wolf_nose: {
          displayName: "Wolf's Nose",
          description: "Identifying scents, tracking by smell",
        },
        serpent_skin: {
          displayName: "Serpent's Skin",
          description: "Reading surfaces through touch, detecting temperature changes and vibrations",
        },
        synesthesia: {
          displayName: "Synesthesia",
          description: "Experiencing blended senses, revealing truths through unconventional sensory input",
        },
      },
    },
    riding: {
      displayName: "Riding",
      description: "Skillfully controlling mounts for travel and combat maneuvering",
      attribute: "physique",
      governedBy: ["agility", "empathy"],
      assistedBy: ["strength", "constitution", "authority"],
      specializations: {
        equine_mounts: {
          displayName: "Equine Mounts",
          description: "Mastery of riding horses, zebras, unicorns, and similar quadrupeds",
        },
        avian_mounts: {
          displayName: "Avian Mounts",
          description: "Handling the complexities of flight and control aboard griffins, rocs, phoenixes",
        },
        exotic_mounts: {
          displayName: "Exotic Mounts",
          description: "Adapting riding techniques for wolves, lizards, boars, manticores, or even dragons",
        },
        mounted_combat: {
          displayName: "Mounted Combat",
          description: "Fighting effectively while mounted",
        },
      },
    },
    labor: {
      displayName: "Labor",
      description: "Performing strenuous physical work",
      attribute: "physique",
      governedBy: ["strength", "constitution"],
      assistedBy: ["willpower"],
      specializations: {
        mining: {
          displayName: "Mining",
          description: "Extracting ore and stone",
        },
        woodcutting: {
          displayName: "Woodcutting",
          description: "Felling trees and processing wood",
        },
        farming: {
          displayName: "Farming",
          description: "Ploughing, planting, harvesting crops",
        },
        construction: {
          displayName: "Construction",
          description: "Heavy lifting, digging foundations, basic building tasks",
        },
        hauling: {
          displayName: "Hauling",
          description: "Moving heavy loads over distances",
        },
      },
    },
    artisanry: {
      displayName: "Artisanry",
      description: "Creating practical goods and structures",
      attribute: "physique",
      governedBy: ["agility", "strength"],
      assistedBy: ["knowledge", "ingenuity"],
      specializations: {
        smithing: {
          displayName: "Smithing",
          description: "Working metal: forging, tempering, repair",
        },
        woodworking: {
          displayName: "Woodworking",
          description: "Carpentry, carving, fletching, bowyery",
        },
        leatherworking: {
          displayName: "Leatherworking",
          description: "Preparing hides, crafting leather goods",
        },
        tailoring: {
          displayName: "Tailoring",
          description: "Creating clothing, banners, sails",
        },
        masonry: {
          displayName: "Masonry",
          description: "Working with stone for building or sculpting",
        },
      },
    },
    // --- SPIRIT ---
    life_magic: {
      displayName: "Life Magic",
      description: "Harnessing positive energy to heal, protect, and bless",
      attribute: "spirit",
      governedBy: ["attunement", "weaving"],
      assistedBy: ["empathy", "resilience", "channeling"],
      specializations: {
        restoration: {
          displayName: "Restoration",
          description: "Healing wounds, curing diseases and poisons",
        },
        protection: {
          displayName: "Protection",
          description: "Creating wards and shields against harm",
        },
        blessings: {
          displayName: "Blessings",
          description: "Imbuing allies with strength, speed, or fortitude",
        },
        spirit_bonding: {
          displayName: "Spirit Bonding",
          description: "Establishing and maintaining the empathetic link with a dedicated magical familiar creature",
        },
        anti_undead: {
          displayName: "Anti-Undead",
          description: "Channeling energy harmful to undead creatures",
        },
      },
    },
    nature_magic: {
      displayName: "Nature Magic",
      description: "Drawing power from the natural world",
      attribute: "spirit",
      governedBy: ["attunement", "weaving", "channeling"],
      assistedBy: ["wisdom", "empathy", "authority"],
      specializations: {
        verdant_call: {
          displayName: "Verdant Call",
          description: "Influencing plant growth, entangling foes",
        },
        beast_tongue: {
          displayName: "Beast Tongue",
          description: "Summoning, communicating with, or calming beasts",
        },
        sky_dance: {
          displayName: "Sky dance",
          description: "Foreseeing weather and guiding wind, fog, and rain",
        },
        terramancy: {
          displayName: "Terramancy",
          description: "Shaping earth and stone for shelter or obstacles, leveraging ley lines",
        },
        bloom: {
          displayName: "Bloom",
          description: "Fostering natural revitalization, enhancing vigor",
        },
      },
    },
    chaos_magic: {
      displayName: "Chaos Magic",
      description: "Tapping into entropic forces, destruction, and fire",
      attribute: "spirit",
      governedBy: ["attunement", "channeling"],
      assistedBy: ["resilience", "willpower"],
      specializations: {
        unraveling: {
          displayName: "Unraveling",
          description: "Unleashing bolts of raw energy, causing decay or explosions",
        },
        twisting_fate: {
          displayName: "Twisting Fate",
          description: "Influencing chance, causing misfires or critical successes",
        },
        infernal_summoning: {
          displayName: "Infernal Summoning",
          description: "Calling forth imps, demons, or other chaotic beings",
        },
      },
    },
    death_magic: {
      displayName: "Death Magic",
      description: "Mastery over negative energy, undeath, and decay",
      attribute: "spirit",
      governedBy: ["attunement", "channeling", "authority"],
      assistedBy: ["willpower", "knowledge"],
      specializations: {
        necromancy: {
          displayName: "Necromancy",
          description: "Animating corpses and skeletons, controlling undead",
        },
        afflictions: {
          displayName: "Afflictions",
          description: "Spreading disease and decay, that wither body and spirit",
        },
        spectral_mastery: {
          displayName: "Spectral Mastery",
          description: "Communicating with, binding, or banishing ghosts and spirits",
        },
        shadowmancy: {
          displayName: "Shadowmancy",
          description: "Conjuring darkness, inciting terror, siphoning light",
        },
      },
      
    },
    order_magic: {
      displayName: "Order Magic",
      description: "Utilizing structured patterns for enhancement, illusion, and control",
      attribute: "spirit",
      governedBy: ["willpower", "weaving"],
      assistedBy: ["resilience", "channeling"],
      specializations: {
        augmentation: {
          displayName: "Augmentation",
          description: "Improving attributes or granting temporary abilities",
        },
        illusions: {
          displayName: "Illusions",
          description: "Creating phantasms, disguising appearances, masking sounds",
        },
        mentalism: {
          displayName: "Mentalism",
          description: "Telepathy, suggestion, controlling minds",
        },
        spatial_warping: {
          displayName: "Spatial Warping",
          description: "Teleportation, creating dimensional pockets, astral projections",
        },
        abjuration: {
          displayName: "Abjuration",
          description: "Dispelling magic, creating barriers against magic",
        },
      },
    },
    elemental_magic: {
      displayName: "Elemental Magic",
      description: "Direct command over Air, Earth, Fire, and Water",
      attribute: "spirit",
      governedBy: ["attunement", "channeling"],
      assistedBy: ["resilience", "knowledge"],
      specializations: {
        aeromancy: {
          displayName: "Aeromancy",
          description: "Controlling winds, conjuring lightning, flight",
        },
        geomancy: {
          displayName: "Geomancy",
          description: "Shaping earth and stone, causing tremors, earth armor",
        },
        hydromancy: {
          displayName: "Hydromancy",
          description: "Manipulating water and ice, creating fog",
        },
        pyromancy: {
          displayName: "Pyromancy",
          description: "Raw fire control, distinct from Chaos's destructive focus",
        },
        harmony: {
          displayName: "Harmony",
          description: "Balancing and combining elementals into a unified whole",
        },
        elemental_summoning: {
          displayName: "Elemental Summoning",
          description: "Calling forth Air, Earth, Fire, or Water elementals",
        },
      },
    },
    magical_lore: {
      displayName: "Magical Lore",
      description: "Theoretical knowledge of magical principles and history",
      attribute: "spirit", // Primarily Mind-driven, but core to Spirit theme
      governedBy: ["knowledge"],
      assistedBy: ["attunement", "resilience"],
      specializations: {
        arcane_sight: {
          displayName: "Arcane Sight",
          description: "Recognizing spells being cast or their lingering effects",
        },
        arcane_principles: {
          displayName: "Arcane Principles",
          description: "Understanding fundamental laws and interactions of magic",
        },
        arcane_history: {
          displayName: "Arcane History",
          description: "Knowledge of traditions, artifacts, historical wizards",
        },
        magical_item_analysis: {
          displayName: "Magical Item Analysis",
          description: "Discerning properties and function of enchanted objects",
        },
        monster_lore: {
          displayName: "Monster Lore",
          description: "Knowledge of magical beasts, elementals, undead, abominations etc",
        },
        cosmology: {
          displayName: "Cosmology",
          description: "Understanding other dimensions and planes, interdimensional travel",
        },
        runes: {
          displayName: "Runes",
          description: "Deciphering magical scripts, symbols, and glyphs",
        },
      },
    },
    divination: {
      displayName: "Divination",
      description: "Perceiving things beyond the normal senses",
      attribute: "spirit",
      governedBy: ["attunement", "weaving"],
      assistedBy: ["wisdom", "resilience", "channeling"],
      specializations: {
        precognition: {
          displayName: "Precognition",
          description: "Receiving glimpses of potential futures or past events",
        },
        retrocognition: {
          displayName: "Retrocognition",
          description: "Sensing the history of an object through touch",
        },
        clairvoyance: {
          displayName: "Clairvoyance",
          description: "Perceiving events or sounds remotely",
        },
        psychometry: {
          displayName: "Psychometry",
          description: "Perceiving the magical or emotional state of beings/places",
        },
      },
    },
    alchemy: {
      displayName: "Alchemy",
      description: "Transmuting substances and brewing potent concoctions",
      attribute: "spirit", // Blends Mind and Spirit heavily
      governedBy: ["ingenuity", "knowledge"],
      assistedBy: ["attunement", "weaving", "agility", "senses"],
      specializations: {
        potions: {
          displayName: "Potions",
          description: "Creating consumables with magical or curative effects",
        },
        toxicology: {
          displayName: "Toxicology",
          description: "Crafting poisons, acids, and their antidotes",
        },
        mutagenesis: {
          displayName: "Mutagenesis",
          description: "Creating elixirs that induce physical changes (risky)",
        },
        incendiaries: {
          displayName: "Incendiaries",
          description: "Crafting bombs, fire concoctions, corrosive substances",
        },
        transmutation: {
          displayName: "Transmutation",
          description: "Altering the nature of a substance",
        },
      },
    },
    enchanting: {
      displayName: "Enchanting",
      description: "Infusing existing objects or scrolls with magical power",
      attribute: "spirit",
      governedBy: ["weaving", "channeling"],
      assistedBy: ["resilience", "agility"],
      specializations: {
        armament_enchanting: {
          displayName: "Armament Enchanting",
          description: "Adding magical properties to gear",
        },
        imbuing: {
          displayName: "Imbuing",
          description: "Creating magical trinkets (rings, amulets) with effects",
        },
        scribing: {
          displayName: "Scribing",
          description: "Transferring spell energy into readable scrolls",
        },
        implement_crafting: {
          displayName: "Implement Crafting",
          description: "Creating wands, staves, or orbs to channel magic",
        },
        binding: {
          displayName: "Binding",
          description: "The magical step of animating constructs",
        },
      },
    },
  
    // --- MIND ---
    spellcraft: {
      displayName: "Spellcraft",
      description: "Analyzing, modifying, and designing spell formulae and magical effects",
      attribute: "mind",
      governedBy: ["ingenuity", "knowledge"],
      assistedBy: ["weaving", "willpower"],
      specializations: {
        spell_shaping: {
        displayName: "Spell Shaping",
        description: "Modifying the spell's parameters, area of effect, delivery method, and targeting specifications"
        },
        synergistic_casting: {
        displayName: "Synergistic Casting",
        description: "Exploiting interactions between different magical effects"
        },
        counter_spelling: {
        displayName: "Counter-Spelling",
        description: "Techniques to disrupt, negate, or redirect identified incoming spells"
        },
        spell_analysis: {
        displayName: "Spell Analysis",
        description: "Deconstructing observed spells into their function, triggers, components, and potential weaknesses"
        },
      },
    },
    lore: {
      displayName: "Lore",
      description: "General knowledge and academic understanding",
      attribute: "mind",
      governedBy: ["knowledge"],
      assistedBy: ["wisdom"],
      specializations: {
        history: {
          displayName: "History",
          description: "Knowledge of past events, dynasties, wars, fallen empires",
        },
        customs: {
          displayName: "Customs",
          description: "Traditions, laws, social structures",
        },
        geography: {
          displayName: "Geography",
          description: "Regions, terrain, landmarks, settlements; map making/reading",
        },
        mythology: {
          displayName: "Mythology",
          description: "Understanding deities, religious practices, myths, legends",
        },
        bestiary: {
          displayName: "Bestiary",
          description: "Knowledge of animals - their habitats, habits, and weaknesses",
        },
        agriculture: {
          displayName: "Agriculture",
          description: "Identifying plants, farming techniques, crop cycles",
        },
        philosophy: {
          displayName: "Philosophy",
          description: "Schools of thought, logical arguments, academic procedures",
        },
        critique: {
          displayName: "Critique",
          description: "Understanding artistic styles, history, and significance",
        },
      },
    },
    memory: {
      displayName: "Memory",
      description: "The ability to accurately retain, recall, and organize information.",
      attribute: "mind",
      governedBy: ["knowledge", "willpower"],
      assistedBy: ["ingenuity", "senses"],
      specializations: {
        eidetic_ecall: {
        displayName: "Eidetic Recall",
        description: "Accurate recall of visual details and imagery previously observed."
        },
        auditory_memory: {
        displayName: "Auditory Memory",
        description: "Accurate recall of sounds, voices, conversations, and musical patterns."
        },
        sequential_memory: {
        displayName: "Sequential Memory",
        description: "Remembering sequences of events, instructions, and procedures in the correct order"
        },
        associative_memory: {
        displayName: "Associative Memory",
        description: "Linking related pieces of information, facts, or memories, even if disparate"
        },
        mental_mapping: {
        displayName: "Mental Mapping",
        description: "Creating and recalling detailed spatial layouts"
        },
      },
    },
    meditation: {
      displayName: "Meditation",
      description: "Practices for achieving mental clarity, focus, self-control, and heightened awareness",
      attribute: "mind",
      governedBy: ["willpower", "resilience"],
      assistedBy: ["constitution", "attunement"],
      specializations: {
        introspection: {
        displayName: "Introspection",
        description: "Self-awareness; understanding one's own biases, emotional states, and thought processes"
        },
        mana_conservation: {
        displayName: "Mana Conservation",
        description: "Mental techniques and breathing exercises to reduce the expenditure of magical energy."
        },
        occlumency: {
        displayName: "Occlumency",
        description: "Active mental defenses against telepathic intrusion or emotional manipulation"
        },
        oneiromancy: {
        displayName: "Oneiromancy",
        description: "Achieving lucidity within dreams, influencing dream content, and navigating shared dreamscapes"
        },
        emotional_regulation: {
        displayName: "Emotional Regulation",
        description: "Processing feelings while maintaining behavioral control"
        },
      },
    },
    investigation: {
      displayName: "Investigation",
      description: "Gathering clues and uncovering secrets",
      attribute: "mind",
      governedBy: ["ingenuity"],
      assistedBy: ["wisdom", "willpower", "authority"],
      specializations: {
        forensics: {
          displayName: "Forensics",
          description: "Scene examination, Careful collection, Interpreting evidence",
        },
        interviewing: {
          displayName: "Interviewing",
          description: "Extracting information via questioning and observation",
        },
        archive_delving: {
          displayName: "Archive Delving",
          description: "Sifting through archives, libraries, records",
        },
        information_brokering: {
          displayName: "Information Brokering",
          description: "Cultivating informant networks, understanding information flow",
        },
        counter_forgery: {
          displayName: "Counter-forgery",
          description: "Identifying counterfeit documents, coins, or artifacts",
        },
      },
    },
    analysis_and_logic: {
      displayName: "Analysis & Logic",
      description: "Reasoning and problem-solving",
      attribute: "mind",
      governedBy: ["ingenuity", "wisdom"],
      assistedBy: ["willpower"],
      specializations: {
        deductive_reasoning: {
          displayName: "Deductive Reasoning",
          description: "Drawing specific conclusions from general principles",
        },
        inductive_reasoning: {
          displayName: "Inductive Reasoning",
          description: "Forming general theories from specific observations",
        },
        pattern_recognition: {
          displayName: "Pattern Recognition",
          description: "Identifying recurring sequences, codes, behaviors",
        },
        puzzle_solving: {
          displayName: "Puzzle Solving",
          description: "Overcoming logical traps, riddles, complex mechanisms",
        },
        cryptography: {
          displayName: "Cryptography",
          description: "Deciphering codes, ciphers, hidden messages",
        },
      },
    },
    strategy_and_tactics: {
      displayName: "Strategy & Tactics",
      description: "Planning and directing coordinated efforts",
      attribute: "mind",
      governedBy: ["wisdom", "ingenuity"],
      assistedBy: ["willpower", "authority"],
      specializations: {
        battlefield_tactics: {
          displayName: "Battlefield Tactics",
          description: "Maneuvering forces, exploiting terrain, countering moves",
        },
        logistics: {
          displayName: "Logistics",
          description: "Managing supply lines, resource allocation, movement",
        },
        siegecraft: {
          displayName: "Siegecraft",
          description: "Planning assault or defense of fortified positions",
        },
        management: {
          displayName: "Management",
          description: "Structuring groups, delegating tasks, ensuring efficiency",
        },
        risk_assessment: {
          displayName: "Risk Assessment",
          description: "Evaluating dangers and benefits of courses of action",
        },
      },
    },
    medicine: {
      displayName: "Medicine",
      description: "Non-magical healing and biological knowledge",
      attribute: "mind",
      governedBy: ["knowledge", "ingenuity"],
      assistedBy: ["wisdom", "agility"],
      specializations: {
        first_aid: {
          displayName: "First Aid",
          description: "Immediate treatment of wounds, stabilization",
        },
        surgery: {
          displayName: "Surgery",
          description: "Performing invasive procedures to repair damage",
        },
        diagnostics: {
          displayName: "Diagnostics",
          description: "Identifying illnesses, poisons, deficiencies",
        },
        pharmacology: {
          displayName: "Pharmacology",
          description: "Understanding medicinal herbs, minerals, compounds",
        },
        physiology: {
          displayName: "Physiology",
          description: "Knowledge of how bodies function",
        },
      },
    },
    artistry: {
      displayName: "Artistry",
      description: "Creating works of aesthetic value through fine manual skill and creative vision",
      attribute: "mind",
      governedBy: ["agility", "senses"],
      assistedBy: ["ingenuity", "composure"],
      specializations: {
        lapidary_arts: {
          displayName: "Lapidary Arts",
          description: "Creating fine jewelry, cutting and setting gemstones",
        },
        calligraphy: {
          displayName: "Calligraphy",
          description: "Producing aesthetically pleasing lettering for documents, scrolls, or inscriptions",
        },
        painting: {
          displayName: "Painting",
          description: "Creating visual art on surfaces using pigments; mastering composition and color theory",
        },
        sculpture: {
          displayName: "Sculpture",
          description: "Creating three-dimensional art by shaping materials like stone, wood, clay, or metal",
        },
      },
    },
    engineering: {
      displayName: "Engineering",
      description: "Design and construction of complex systems",
      attribute: "mind",
      governedBy: ["ingenuity", "knowledge"],
      assistedBy: ["wisdom"],
      specializations: {
        architecture: {
          displayName: "Architecture",
          description: "Designing buildings and structures for stability",
        },
        clockwork: {
          displayName: "Clockwork",
          description: "Creating gears, clockwork, complex traps",
        },
        civil_engineering: {
          displayName: "Civil Engineering",
          description: "Designing bridges, roads, irrigation",
        },
        hydraulics: {
          displayName: "Hydraulics",
          description: "Using water to power mechanisms, designing waterways",
        },
      },
    },
    pedagogy: {
      displayName: "Pedagogy",
      description: "Teaching and imparting knowledge effectively",
      attribute: "mind",
      governedBy: ["knowledge", "empathy"],
      assistedBy: ["charisma"],
      specializations: {
        training: {
          displayName: "Training",
          description: "Teaching practical abilities",
        },
        tutoring: {
          displayName: "Tutoring",
          description: "Explaining complex theories, history, lore",
        },
        mentorship: {
          displayName: "Mentorship",
          description: "Guiding long-term development of an individual",
        },
        curriculum_design: {
          displayName: "Curriculum Design",
          description: "Structuring lessons or training programs",
        },
      },
    },
    linguistics: {
      displayName: "Linguistics",
      description: "Understanding and using languages",
      attribute: "mind",
      governedBy: ["knowledge", "ingenuity"],
      assistedBy: ["Willpower"],
      specializations: {
        polyglot: {
          displayName: "Polyglot",
          description: "Proficiency in multiple languages",
        },
        translation: {
          displayName: "Translation",
          description: "Accurately converting spoken or written language",
        },
        ancient_languages: {
          displayName: "Ancient Languages",
          description: "Focus on dead or rare tongues",
        },
        grammar: {
          displayName: "Grammar",
          description: "Understanding principles of language",
        },
        dialects: {
          displayName: "Dialects",
          description: "Understanding regional variations, slang, common speech",
        },
      },
    },
    navigation: {
      displayName: "Navigation",
      description: "Finding one's way and planning routes",
      attribute: "mind",
      governedBy: ["wisdom", "senses"],
      assistedBy: ["knowledge"],
      specializations: {
        cartography: {
          displayName: "Cartography",
          description: "Interpreting and creating maps and charts",
        },
        star_guiding: {
          displayName: "Star Guiding",
          description: "Using stars, sun, and moon for direction",
        },
        pathfinding: {
          displayName: "Pathfinding",
          description: "Using terrain, wind, animal behavior to find the way",
        },
        route_planning: {
          displayName: "Route Planning",
          description: "Calculating travel times, identifying hazards, calculating provisions",
        },
      },
    },
    obfuscation: {
      displayName: "Obfuscation",
      description: "Actively concealing information, actions, or identities",
      attribute: "mind",
      governedBy: ["composure", "empathy"],
      assistedBy: ["ingenuity"],
      specializations: {
        forgery: {
          displayName: "Forgery",
          description: "Creating convincing fake documents, items, or signatures",
        },
        misdirection: {
          displayName: "Misdirection",
          description: "Diverting attention from the truth or key actions",
        },
        scene_scrubbing: {
          displayName: "Scene Scrubbing",
          description: "Removing traces of presence or activity from a location",
        },
        cover_stories: {
          displayName: "Cover Stories",
          description: "Constructing believable accounts of whereabouts",
        },
      },
    },
    provisions: {
      displayName: "Provisions",
      description: "Preparing and managing food and drink",
      attribute: "mind",
      governedBy: ["knowledge", "senses"],
      assistedBy: ["empathy"],
      specializations: {
        butchery: {
          displayName: "Butchery",
          description: "Dressing carcasses and preparing cuts of meat",
        },
        dairying: {
          displayName: "Dairying",
          description: "Producing cheese, butter, yogurt, and other dairy products",
        },
        cooking: {
          displayName: "Cooking",
          description: "Preparing well-rounded meals for sustenance and morale",
        },
        baking_pastry: {
          displayName: "Baking & Pastry",
          description: "Preparing breads, pies, pastries, and other baked goods",
        },
        fermentation_distillation: {
          displayName: "Fermentation & Distillation",
          description: "Creating beers, wines, meads, and stronger spirits",
        },
        preservation: {
          displayName: "Preservation",
          description: "Salting, smoking, pickling, drying foods for storage",
        },
        refined_palate: {
          displayName: "Refined Palate",
          description: "Identifying ingredients, judging the quality of food and drink",
        }
        
      },
    },
    survival: {
      displayName: "Survival",
      description: "Enduring and navigating natural environments",
      attribute: "mind",
      governedBy: ["wisdom", "constitution"],
      assistedBy: ["knowledge", "senses"],
      specializations: {
        shelter_craft: {
          displayName: "Shelter Craft",
          description: "Building temporary protection from the elements",
        },
        fire_starting: {
          displayName: "Fire Starting",
          description: "Creating fire reliably in various conditions",
        },
        foraging: {
          displayName: "Foraging",
          description: "Finding edible plants/fungi",
        },
        hunting: {
          displayName: "Hunting",
          description: "Tracking and catching game",
        },
        water_procurement: {
          displayName: "Water Procurement",
          description: "Finding and purifying drinkable water",
        },
        hazard_recognition: {
          displayName: "Hazard Recognition",
          description: "Identifying dangerous plants, animals, terrain, weather signs",
        },
      },
    },
  
    // --- HUMANE ---
    persuasion: {
      displayName: "Persuasion",
      description: "Influencing through reason, charm, or appeal",
      attribute: "social",
      governedBy: ["charisma", "empathy"],
      assistedBy: ["wisdom"],
      specializations: {
        bargaining: {
          displayName: "Bargaining",
          description: "Haggling over prices, terms, or favors",
        },
        oratory: {
          displayName: "Oratory",
          description: "Public speaking designed to sway crowds or individuals",
        },
        witty_repartee: {
          displayName: "Witty Repartee",
          description: "Using quick wit and charm to gain temporary advantage",
        },
        formal_debate: {
            displayName: "Formal Debate",
            description: "Engaging in structured arguments",
          },
          seduction: {
            displayName: "Seduction",
            description: "Using charm, allure, and understanding of desire to influence someone romantically or gain favor",
          },
          conflict_resolution: {
            displayName: "Conflict Resolution",
            description: "Mediating disputes between parties, facilitating negotiation",
          },
      },
    },
    deception: {
      displayName: "Deception",
      description: "Misleading others and maintaining falsehoods",
      attribute: "social",
      governedBy: ["composure", "ingenuity"],
      assistedBy: ["charisma", "empathy"],
      specializations: {
        bluffing: {
          displayName: "Bluffing",
          description: "Presenting a false front of strength, knowledge, or intent",
        },
        lying: {
          displayName: "Lying",
          description: "Crafting believable falsehoods",
        },
        disguise: {
          displayName: "Disguise",
          description: "Altering appearance effectively to mislead or impersonate",
        },
        impersonation: {
          displayName: "Impersonation",
          description: "Mimicking speech, mannerisms, and behavior",
        }
      },
    },
    intimidation: {
      displayName: "Intimidation",
      description: "Influencing through fear, presence, or threats",
      attribute: "social",
      governedBy: ["charisma", "composure"],
      assistedBy: ["strength", "willpower"],
      specializations: {
        coercion: {
          displayName: "Coercion",
          description: "Using threats of harm or consequence",
        },
        presence: {
          displayName: "Presence",
          description: "Projecting an aura of danger or authority",
        },
        interrogation: {
          displayName: "Interrogation",
          description: "Extracting information or compliance through pain",
        },
        extortion_blackmail: {
          displayName: "Extortion & Blackmail",
          description: "Leveraging secrets, threats, or vulnerabilities to coerce compliance or payment",
        },
      },
    },
    leadership: {
      displayName: "Leadership",
      description: "Inspiring, directing, and organizing groups",
      attribute: "social",
      governedBy: ["authority", "charisma"],
      assistedBy: ["willpower", "wisdom"],
      specializations: {
        motivation: {
          displayName: "Motivation",
          description: "Rallying allies, boosting morale, giving rousing speeches",
        },
        command: {
          displayName: "Command",
          description: "Giving clear orders in stressful situations",
        },
        delegation: {
          displayName: "Delegation",
          description: "Assigning tasks effectively based on ability",
        },
        team_building: {
          displayName: "Team Building",
          description: "Fostering cooperation and loyalty within a group",
        },
        discipline: {
          displayName: "Discipline",
          description: "Enforcing rules and order",
        },
        recruitment: {
          displayName: "Recruitment",
          description: "Identifying suitable candidates, and persuading individuals to join a group or cause",
        },
      },
    },
    insight: {
      displayName: "Insight",
      description: "Understanding people and social dynamics",
      attribute: "social",
      governedBy: ["empathy", "wisdom"],
      assistedBy: ["senses", "composure"],
      specializations: {
        reading_emotions: {
          displayName: "Reading Emotions",
          description: "Discerning true feelings beneath a facade",
        },
        detecting_lies: {
          displayName: "Detecting Lies",
          description: "Identifying deception through verbal/non-verbal cues",
        },
        motive_analysis: {
          displayName: "Motive Analysis",
          description: "Understanding WHY someone acts the way they do",
        },
        social_prediction: {
          displayName: "Social Prediction",
          description: "Anticipating reactions in social encounters",
        },
        profiling: {
          displayName: "Profiling",
          description: "Building a mental picture of someone based on observation",
        },
        group_dynamics: {
          displayName: "Group Dynamics",
          description: "Understanding group behavior, informal hierarchies, mob mentality and team cohesion",
        },
      },
    },
    etiquette: {
      displayName: "Etiquette",
      description: "Navigating formal social structures",
      attribute: "social",
      governedBy: ["knowledge", "composure"],
      assistedBy: ["authority"],
      specializations: {
        noble_courts: {
          displayName: "Noble Courts",
          description: "Navigating high society, formal occasions, precedence",
        },
        mages_guild_protocols: {
          displayName: "Mages Guild Protocols",
          description: "Hierarchies, debate forms, arcane greetings",
        },
        workshop_lingo: {
          displayName: "Workshop Lingo",
          description: "Technical jargon, project proposals, innovation respect",
        },
        merchant_guild_practices: {
          displayName: "Merchant Guild Practices",
          description: "Negotiation styles, contract norms, trade routes",
        },
        guard_regime: {
          displayName: "Guard Regime",
          description: "Legal procedures, reporting structures, addressing officials",
        },
        underworld_codes: {
          displayName: "Underworld Codes",
          description: "Thieves' cant, gang signs, territory respect",
        },
        temple_rites_observances: {
          displayName: "Temple Rites & Observances",
          description: "Addressing clergy, sacred space conduct, ritual participation",
        },
      },
    },
    performance: {
      displayName: "Performance",
      description: "Engaging or influencing through artistic expression",
      attribute: "social",
      governedBy: ["charisma", "agility"],
      assistedBy: ["composure", "empathy"],
      specializations: {
        acting: {
          displayName: "Acting",
          description: "Assuming roles, portraying emotions convincingly",
        },
        musical_instruments: {
          displayName: "Musical Instruments",
          description: "Proficiency with a variety of instruments",
        },
        singing: {
          displayName: "Singing",
          description: "Vocal performance",
        },
        storytelling: {
          displayName: "Storytelling",
          description: "Captivating an audience with narratives",
        },
        dancing: {
          displayName: "Dancing",
          description: "Expressive or ritualistic movement",
        },
        comedy: {
          displayName: "Comedy",
          description: "Using wit, timing, and delivery to entertain and amuse an audience",
        },
      },
    },
    streetwise: {
      displayName: "Streetwise",
      description: "Navigating informal and underground social networks",
      attribute: "social",
      governedBy: ["empathy", "wisdom"],
      assistedBy: ["composure", "charisma"],
      specializations: {
        gathering_rumors: {
          displayName: "Gathering Rumors",
          description: "Tapping into the local gossip network",
        },
        underworld_navigation: {
          displayName: "Underworld Navigation",
          description: "Knowing contacts, safe houses, black markets",
        },
        urban_survival: {
          displayName: "Urban Survival",
          description: "Finding necessities, avoiding trouble in rough areas",
        },
        gang_affiliations: {
          displayName: "Gang Affiliations",
          description: "Understanding local power structures among criminals",
        },
        gambling: {
          displayName: "Gambling",
          description: "Playing games of chance, reading opponents",
        },
      },
    },
    commerce_and_trade: {
      displayName: "Commerce & Trade",
      description: "Managing economic interactions",
      attribute: "social",
      governedBy: ["ingenuity", "wisdom"],
      assistedBy: ["composure", "authority"],
      specializations: {
        bartering: {
          displayName: "Bartering",
          description: "Exchanging goods/services without currency",
        },
        appraisal: {
          displayName: "Appraisal",
          description: "Accurately judging the value of items",
        },
        salesmanship: {
          displayName: "Salesmanship",
          description: "Effectively presenting goods or services, closing deals",
        },
        bookkeeping: {
          displayName: "Bookkeeping",
          description: "Managing ledgers, tracking income and expenses, handling loans and currency exchange",
        },
        customs_tariffs: {
          displayName: "Customs & Tariffs",
          description: "Navigating legal trade barriers, taxes, and regulations",
        },
        smuggling_routes: {
          displayName: "Smuggling Routes",
          description: "Knowledge of illicit trade paths and methods",
        },
        financial_acumen: {
          displayName: "Financial Acumen",
          description: "Predicting supply and demand, price fluctuations, economic opportunities and threats",
        },
      },
    },
    hospitality: {
      displayName: "Hospitality",
      description: "Providing comfort, service, and managing social events",
      attribute: "social",
      governedBy: ["empathy", "charisma"],
      assistedBy: ["composure", "knowledge"],
      specializations: {
        patron_care: {
          displayName: "Patron Care",
          description: "Making visitors feel welcome, anticipating needs",
        },
        amenities_and_luxuries: {
          displayName: "Amenities & Luxuries",
          description: "Knowledge of fine food, wine, bedding to please guests",
        },
        event_orchestration: {
          displayName: "Event Orchestration",
          description: "Organizing feasts, gatherings, ceremonies",
        },
        staff_direction: {
          displayName: "Staff Direction",
          description: "Organizing workers efficiently for maximum guest satisfaction",
        }
      },
    },
    statecraft: {
    displayName: "Statecraft",
      description: "Manipulating political systems, managing institutions, and wielding influence on a grand scale",
      attribute: "social",
      governedBy: ["authority", "wisdom"],
      assistedBy: ["knowledge", "composure", "charisma"],
      specializations: {
        bureaucracy: {
          displayName: "Bureaucracy",
          description: "Navigating red tape, understanding legal frameworks, exploiting loopholes",
        },
        diplomacy: {
          displayName: "Diplomacy",
          description: "High-stakes negotiation between factions, treaty formulation",
        },
        intrigue: {
          displayName: "Intrigue",
          description: "Spreading influence subtly, manipulating factions against each other, political maneuvering",
        },
        reputation_management: {
          displayName: "Reputation Management",
          description: "Building and protecting the public image of an individual or organization",
        },
        faction_alliances: {
          displayName: "Faction Alliances",
          description: "Building and maintaining relationships between different power groups",
        },
        propaganda: { 
            displayName: "Propaganda",
            description: "Actively shaping public sentiment, managing information flow, and cultivating narratives",
          },
      },
    },
    beast_mastery: {
      displayName: "Beast Mastery",
      description: "Controlling, caring for, and utilizing various creatures",
      attribute: "social",
      governedBy: ["empathy", "authority"],
      assistedBy: ["strength", "knowledge"],
      specializations: {
        animal_companionship: {
          displayName: "Animal Companionship",
          description: "Developing a bond with a specific animal partner; training communication, and cooperation",
        },
        wild_taming: {
          displayName: "Wild Taming",
          description: "Domesticate, calm, or gain the trust of a wild creature",
        },
        teamster: {
          displayName: "Teamster",
          description: "Managing draft animals pulling carts, wagons, or carriages; harnessing; load balancing",
        },
        breeding: {
          displayName: "Breeding",
          description: "Selecting stock, tracking lineages, refining breeds for desired traits",
        },
        animal_husbandry: {
          displayName: "Animal Husbandry",
          description: "Raising, feeding, housing, ensuring the health of captive animals; harvesting their products",
        },
      },
    },
  };

export default skills;