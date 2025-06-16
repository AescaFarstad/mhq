export const taskDefinitions = {
    declutter: {
        effortMin: 100,
        effortMax: 2000,
        reward: {
            clutterPerEffort: -0.01,
        },
        names: {
            byBuilding: {
                library: [
                    {
                        name: "Reshelve arcane tomes",
                        skills: ["magical_lore", "athletics", "memory"],
                        intermediates: [
                            "Reaching for high-placed books using an enchanted stepladder",
                            "Finding the correct section using the celestial library index",
                            "Checking the tome's astral resonance for proper placement",
                            "Sorting by the Old Tongue's alphabetical order",
                            "Carefully clearing magically charged dust from covers",
                            "Recalling the exact forgotten shelf for {_OPTION1}",
                            "Disarming a minor {_OPTION2} ward on a restricted section book"
                        ],
                        _OPTION1: [
                            "'Chronicles of the Unseen University'",
                            "'Planar Cartography: A Beginner's Folly'",
                            "'Golemetry Vol. IV: Advanced Servitude'",
                            "'Minor Hexes and Their Hilarious Consequences'",
                            "'The Art of Pyromantic Baking'"
                        ],
                        _OPTION2: [
                            "stasis-lock",
                            "gravity-shift",
                            "alarm-shriek",
                            "temporary blindness",
                            "finger-trap"
                        ]
                    },
                    {
                        name: "Sort misplaced scrolls",
                        skills: ["runes", "legerdemain", "memory"],
                        intermediates: [
                            "Gathering scrolls from beneath dusty busts and forgotten lecterns",
                            "Identifying scroll scripts by their magical aura and ink type",
                            "Deciphering faded or intentionally obscured runic markers",
                            "Cross-referencing scroll serial numbers with the Master Scroll Registry",
                            "Handling brittle, ancient parchment with magically enhanced dexterity",
                            "Remembering the preferred containment cylinder for {_OPTION1} scrolls",
                            "Carefully unrolling a scroll that faintly hums with {_OPTION2} energy"
                        ],
                        _OPTION1: [
                            "'Titan-Forged Prophecy'",
                            "elemental summoning",
                            "'Celestial Navigation Chart'",
                            "'Shadow Weaving Primer'",
                            "illusory script practice"
                        ],
                        _OPTION2: [
                            "temporal distortion",
                            "arcane feedback",
                            "whispering secrets",
                            "protective glyphs",
                            "phantom script"
                        ]
                    },
                    {
                        name: "Dust ancient grimoires",
                        skills: ["labor", "magical_lore", "hardiness"],
                        intermediates: [
                            "Donning a filtration mask enchanted against arcane motes",
                            "Gently brushing centuries of magically-infused dust from leather bindings",
                            "Carefully turning brittle, age-yellowed pages whispering forgotten words",
                            "Recognizing the unique binding sigil of a grimoire from {_OPTION1}",
                            "Resisting the soporific enchantments woven into the dust of a {_OPTION2}-authored tome",
                            "Ensuring the structural integrity of delicate magical diagrams during cleaning"
                        ],
                        _OPTION1: [
                            "The Alahan School of Illusion",
                            "The Bracada Academy of Sorcery",
                            "The Nighon Necromantic Institute",
                            "The Deyjan Heretical Archives",
                            "The Erathian Celestial College"
                        ],
                        _OPTION2: [
                            "Archmage Eldrin the Sleepy",
                            "The Sandman's Apprentice",
                            "Professor Somnus",
                            "Lady Lethe of the Library",
                            "The Whisperwind Scribe"
                        ]
                    },
                    {
                        name: "Organize research notes",
                        skills: ["magical_lore", "memory", "analysis_and_logic"],
                        intermediates: [
                            "Sifting through stacks of hastily scribbled arcane theories and experimental results",
                            "Recalling the context of cryptic annotations and half-finished diagrams",
                            "Applying logical frameworks to categorize disparate magical concepts",
                            "Identifying subtle connections between a failed potion recipe and a successful warding spell",
                            "Cross-referencing findings with established principles of {_OPTION1}",
                            "Debating the ethical implications of a recently rediscovered {_OPTION2} ritual fragment"
                        ],
                        _OPTION1: [
                            "sympathetic magic",
                            "aetheric dynamics",
                            "runic grammatology",
                            "planar resonance",
                            "golem consciousness studies"
                        ],
                        _OPTION2: [
                            "soul transference",
                            "mana siphoning",
                            "familiar augmentation",
                            "temporal stutter",
                            "forbidden knowledge retrieval"
                        ]
                    },
                    {
                        name: "Archive forgotten lore",
                        skills: ["magical_lore", "history", "memory", "archive_delving"],
                        intermediates: [
                            "Navigating the shifting corridors of the sub-archives using a dowsing rod",
                            "Recalling historical events to date unlabelled manuscripts",
                            "Sifting through millennia of tax records, royal decrees, and wizard duels",
                            "Identifying texts penned during the tumultuous {_OPTION1} era",
                            "Carefully handling artifacts that whisper tales of {_OPTION2} civilizations",
                            "Connecting fragmented prophecies to recent celestial alignments"
                        ],
                        _OPTION1: [
                            "The Age of Silence",
                            "The War of the Elements",
                            "The Titan Uprising",
                            "The Founding of the Magic Guilds",
                            "The Great Spell Plague"
                        ],
                        _OPTION2: [
                            "Ancient Kreegan",
                            "Lost Elven Kingdoms",
                            "Primordial Genie Empires",
                            "Forgotten Human Tribes",
                            "The Precursors"
                        ]
                    },
                    {
                        name: "Clear reading nooks",
                        skills: ["labor", "hospitality"],
                        intermediates: [
                            "Gathering abandoned teacups, half-eaten mana biscuits, and discarded quills",
                            "Plumping enchanted cushions that gently massage the sitter",
                            "Adjusting everburning candles for optimal reading luminosity",
                            "Dispelling lingering {_OPTION1} auras from previous occupants",
                            "Restocking complimentary {_OPTION2} parchment and self-inking quills"
                        ],
                        _OPTION1: [
                            "concentration",
                            "minor frustration",
                            "intellectual excitement",
                            "sleepiness",
                            "arcane static"
                        ],
                        _OPTION2: [
                            "sound-dampening",
                            "thought-focusing",
                            "anti-distraction",
                            "page-turning",
                            "comfort-enhancing"
                        ]
                    },
                    {
                        name: "Mend damaged bindings",
                        skills: ["leatherworking", "scribing"],
                        intermediates: [
                            "Selecting the appropriate grade of cured {_OPTION1} hide for repairs",
                            "Carefully stitching torn spines with silver thread and griffin sinew",
                            "Applying restorative alchemical solutions to brittle cover boards",
                            "Retooling faded gold leaf on intricate cover sigils",
                            "Replacing worn clasps made of {_OPTION2}",
                            "Meticulously matching the original scribe's calligraphic style for title restoration"
                        ],
                        _OPTION1: [
                            "Basilisk",
                            "Dragon Whelp",
                            "Gorgon",
                            "Manticore",
                            "Cockatrice"
                        ],
                        _OPTION2: [
                            "Moonstone",
                            "obsidian",
                            "enchanted brass",
                            "Dwarven Steel",
                            "Petrified Shadowwood"
                        ]
                    },
                    {
                        name: "Catalog new acquisitions",
                        skills: ["magical_lore", "memory", "bookkeeping", "appraisal"],
                        intermediates: [
                            "Examining newly arrived tomes, scrolls, and minor magical curios",
                            "Appraising the arcane significance and potential dangers of each item",
                            "Assigning a unique chronomantic identification sigil",
                            "Entering acquisition details into the Grand Library Ledger of Holdings",
                            "Recalling similar items from the {_OPTION1} collection to avoid duplicates",
                            "Noting any unusual {_OPTION2} enchantments or curses on an item before shelving"
                        ],
                        _OPTION1: [
                            "Solmyr's Personal Stash",
                            "The Astral Repository",
                            "Xeron's Banned Books",
                            "Archibald's Oddities",
                            "The Von Kessel Collection"
                        ],
                        _OPTION2: [
                            "knowledge-stealing",
                            "truth-compelling",
                            "memory-enhancing",
                            "curiosity-piquing",
                            "warded against specific lineages"
                        ]
                    },
                    {
                        name: "Silence whispering pages",
                        skills: ["order_magic", "magical_lore", "meditation"],
                        intermediates: [
                            "Meditating to attune to the library's ambient thought-forms and echoes",
                            "Identifying the specific tomes resonating with disruptive psychic energy",
                            "Channeling calming Order magic to dampen errant magical vocalizations",
                            "Applying temporary silencing sigils to particularly chatty grimoires",
                            "Distinguishing between benign {_OPTION1} echoes and potentially sanity-eroding {_OPTION2} murmurs",
                            "Negotiating a quietude pact with a minor book elemental"
                        ],
                        _OPTION1: [
                            "scholarly debates",
                            "recitations of ancient poetry",
                            "forgotten spell incantations",
                            "historical anecdotes",
                            "philosophical musings"
                        ],
                        _OPTION2: [
                            "madness-inducing riddles",
                            "fear-mongering prophecies",
                            "soul-trapping verses",
                            "secret-revealing gossip",
                            "sanity-draining paradoxes"
                        ]
                    },
                    {
                        name: "Banish errant bookmites",
                        skills: ["nature_magic", "alchemy", "monster_lore"],
                        intermediates: [
                            "Identifying the specific species of bookmite: the common Page-Nibbler or the rarer Glyph-Eater",
                            "Brewing a non-damaging alchemical repellent using silverfish scales and moonpetal extract",
                            "Applying gentle Nature Magic to encourage the mites to vacate the premises peacefully",
                            "Consulting 'Monstrous Vermin and How to Annoy Them' for weaknesses of the {_OPTION1} variant",
                            "Setting miniature, magically baited traps using crystallized {_OPTION2}",
                            "Ensuring no valuable spell components are mistaken for mite food"
                        ],
                        _OPTION1: [
                            "ink-sucking",
                            "parchment-devouring",
                            "binding-burrowing",
                            "rune-corrupting",
                            "story-stealing"
                        ],
                        _OPTION2: [
                            "mana dust",
                            "powdered griffin feather",
                            "essence of boredom",
                            "dried nightshade berries",
                            "sweetened papyrus shreds"
                        ]
                    },
                    {
                        name: "Decipher cryptic marginalia",
                        skills: ["magical_lore", "cryptography", "linguistics"],
                        intermediates: [
                            "Examining faint, spidery scribbles in the margins of ancient texts",
                            "Applying advanced runic analysis to unknown symbols and glyphs",
                            "Using cryptographic techniques to break complex substitution ciphers",
                            "Consulting linguistic archives for archaic dialects and dead magical languages",
                            "Uncovering a hidden commentary from {_OPTION1}, a famously eccentric archmage",
                            "Realizing the marginalia forms a fragmented map to a hidden {_OPTION2}"
                        ],
                        _OPTION1: [
                            "Archmage Horatio the Obfuscator",
                            "Loremaster Elara Meadowlight",
                            "The Mad Prophet of the Peaks",
                            "Grand Vizier Al'Zahid",
                            "Scribe Thoth-Amon"
                        ],
                        _OPTION2: [
                            "spell component cache",
                            "forgotten laboratory",
                            "secret passage",
                            "powerful artifact",
                            "lost incantation"
                        ]
                    },
                    {
                        name: "Restore faded ink on scrolls",
                        skills: ["scribing", "alchemy", "calligraphy"],
                        intermediates: [
                            "Concocting an alchemical ink-revivifying solution using squid ink and powdered moonstone",
                            "Carefully applying the solution with a fine griffin-feather brush to faded script",
                            "Matching the original calligraphic style, whether {_OPTION1} or {_OPTION2}",
                            "Using artistic skill to meticulously recreate missing portions of intricate diagrams",
                            "Testing the solution on a sample of similarly aged, non-magical parchment",
                            "Ensuring the restored ink is magically inert and won't unexpectedly trigger latent spells"
                        ],
                        _OPTION1: [
                            "Elegant Elven Script",
                            "Blocky Dwarven Runes",
                            "Flowing Celestial Glyphs",
                            "Angular Draconic Sigils",
                            "Archaic Human Cursive"
                        ],
                        _OPTION2: [
                            "Ornate Kreegan Glyphs",
                            "Delicate Fairy Script",
                            "Practical Gnomish Print",
                            "Mysterious Titan Symbols",
                            "Common Trade Tongue"
                        ]
                    },
                    {
                        name: "Update celestial charts",
                        skills: ["divination", "cartography", "magical_lore"],
                        intermediates: [
                            "Consulting the Grand Orrery of Bracada, noting planetary alignments",
                            "Using divination spells like 'Star Gaze' to observe distant astral bodies and phenomena",
                            "Mapping newly identified comets, nebulae, and rogue planetoids",
                            "Cross-referencing observations with ancient prophecies tied to celestial events like {_OPTION1}",
                            "Noting the erratic trajectory of the wandering star known as {_OPTION2}",
                            "Calculating the magical influence of the newly charted 'Serpent's Coil' nebula"
                        ],
                        _OPTION1: [
                            "'The Convergence of Moons'",
                            "'The Comet of Shifting Fates'",
                            "'The Dragon Star's Return'",
                            "'The Weeping Constellation'",
                            "'The Titan's Slumber'"
                        ],
                        _OPTION2: [
                            "The Harbinger",
                            "The Guide",
                            "The Wanderer's Hope",
                            "The Doom Spark",
                            "The Eye of the Void"
                        ]
                    },
                    {
                        name: "Cross-reference prophetic texts",
                        skills: ["divination", "magical_lore", "memory", "pattern_recognition"],
                        intermediates: [
                            "Gathering scrolls, tablets, and dream journals from various seers and oracles",
                            "Recalling key phrases and symbolic imagery from hundreds of disparate prophecies",
                            "Identifying recurring themes, such as 'the fall of the {_OPTION1}' or 'the rise of the {_OPTION2}'",
                            "Using divinatory tools like scrying bowls and tarot decks to clarify ambiguous verses",
                            "Finding alarming correlations between the prophecies of the Blind Seers of Deyja and recent elemental disturbances",
                            "Debating the multiple possible interpretations of the 'Twin-Tailed Comet' prophecy"
                        ],
                        _OPTION1: [
                            "Ivory Towers",
                            "Golden Age",
                            "Silent Kings",
                            "Old Gods",
                            "Ancient Order"
                        ],
                        _OPTION2: [
                            "Shadowed Hero",
                            "Fifth Element",
                            "forgotten magic",
                            "New Pantheon",
                            "Crimson Banner"
                        ]
                    },
                    {
                        name: "Verify artifact authenticity",
                        skills: ["magical_item_analysis", "counter_forgery", "history"],
                        intermediates: [
                            "Examining an artifact for anachronistic tool marks or material composition",
                            "Casting 'Analyze Dweomer' to scrutinize its magical signature, age, and aura",
                            "Checking for inconsistencies with historical records of similar {_OPTION1} artifacts",
                            "Detecting subtle signs of magical illusion or mundane forgery, like artificially aged patina",
                            "Comparing its craftsmanship to known works of the legendary Artificer {_OPTION2}",
                            "Uncovering evidence that it's a clever replica enchanted with a 'false history' glamour"
                        ],
                        _OPTION1: [
                            "Titan-Era",
                            "Elven Old Kingdom",
                            "Dwarven Deep-Forge",
                            "Ancient Necropolis",
                            "Celestial Vault"
                        ],
                        _OPTION2: [
                            "Galen the Golemancer",
                            "Lyra Starsinger",
                            "Borin Stonebeard",
                            "Archlich Mortis",
                            "Seraphina the Bright"
                        ]
                    }
                ],
                dining_hall: [
                    {
                        name: "Clear feasting tables",
                        skills: ["labor", "hospitality", "athletics"],
                        intermediates: [
                            "Lifting heavy silver platters laden with leftover roasted griffin",
                            "Efficiently stacking enchanted, self-warming plates and goblets",
                            "Maintaining a polite smile while dodging hurried apprentices with armfuls of tankards",
                            "Nimbly navigating around spilled potions and dropped spell components",
                            "Carefully handling delicate {_OPTION1} crystal glassware, rumored to shatter at harsh words",
                            "Ensuring no enchanted {_OPTION2} cutlery is accidentally discarded with the bone pile"
                        ],
                        _OPTION1: [
                            "Elven Star-Crystal",
                            "Dwarven Geode-Cut",
                            "Naga Sea-Glass",
                            "Celestial Ice",
                            "Gnomish Self-Polishing"
                        ],
                        _OPTION2: [
                            "poison-detecting forks",
                            "flavor-enhancing spoons",
                            "never-dulling knives",
                            "temperature-regulating ladles",
                            "self-sorting sporks"
                        ]
                    },
                    {
                        name: "Scrub away spilled potions",
                        skills: ["labor", "alchemy", "hardiness"],
                        intermediates: [
                            "Identifying the nature of the spilled potion by its color, viscosity, and lingering magical scent",
                            "Applying an alchemical neutralizer paste to prevent floorboard corrosion or unexpected transmutations",
                            "Vigorously scrubbing stubborn, magically adhesive stains left by a Potion of {_OPTION1}",
                            "Enduring the noxious fumes from a bubbling puddle of a failed {_OPTION2} experiment",
                            "Carefully cleaning up shimmering residue from a spilled Elixir of Vigor that makes the cleaning rags twitch"
                        ],
                        _OPTION1: [
                            "giant strength",
                            "invisibility",
                            "stickiness",
                            "giggling fits",
                            "minor polymorph"
                        ],
                        _OPTION2: [
                            "universal solvent",
                            "'Love Potion #8.5'",
                            "youth restoration draught",
                            "instant darkness powder",
                            "anti-gravity brew"
                        ]
                    },
                    {
                        name: "Polish tarnished goblets",
                        skills: ["labor", "artisanry"],
                        intermediates: [
                            "Selecting the correct alchemical polish for mithril, silver, or gold-plated goblets",
                            "Gently buffing away tarnish accumulated from magical residues and potent dwarven ales",
                            "Applying minor smithing techniques to smooth out dents from overly enthusiastic toasts",
                            "Admiring the restored gleam on a finely crafted {_OPTION1} ceremonial chalice",
                            "Carefully handling a set of goblets rumored to have been used by {_OPTION2} and still faintly humming"
                        ],
                        _OPTION1: [
                            "Titanium-Alloyed",
                            "Adamantine-Inlaid",
                            "Orichalcum-Chased",
                            "Moon Silver",
                            "Dragonscale Embossed"
                        ],
                        _OPTION2: [
                            "King Roland Ironfist",
                            "Queen Catherine Gryphonheart",
                            "Archmage Tarnum",
                            "Sandro the Necromancer",
                            "Lord Haart"
                        ]
                    },
                    {
                        name: "Restock pantry supplies",
                        skills: ["labor", "provisions", "bookkeeping", "logistics"],
                        intermediates: [
                            "Checking pantry inventory levels against the enchanted 'Never-Empty Larder' ledger",
                            "Hauling heavy crates of sun-dried Hydra jerky and barrels of Dwarven ale",
                            "Organizing supplies using the 'First In, First Out, Unless Magically Preserved' system",
                            "Updating stock quantities in the Guild's meticulous provisioning scrolls",
                            "Noticing a critical shortage of {_OPTION1}, essential for the Archmage's favorite tea",
                            "Arranging for an expedited shipment of {_OPTION2} from the halfling trading caravans"
                        ],
                        _OPTION1: [
                            "dragon peppers",
                            "Moon Sugar crystals",
                            "phoenix ash flakes",
                            "shadow truffles",
                            "star anise pods"
                        ],
                        _OPTION2: [
                            "griffin eggs",
                            "spiced wyvern sausages",
                            "'Beholder Eye Caviar'",
                            "mandrake root",
                            "Sunstone Flour"
                        ]
                    },
                    {
                        name: "Sweep up crumbs and ectoplasm",
                        skills: ["spectral_mastery"],
                        intermediates: [
                            "Sweeping stone floors with a broom made of enchanted basilisk whiskers",
                            "Carefully collecting residual ectoplasmic slime from recent ghostly visitations or failed summoning attempts",
                            "Applying minor binding charms to contain wisps of sentient dust motes",
                            "Disposing of crumbs from the notoriously messy {_OPTION1} pastries",
                            "Neutralizing a patch of particularly stubborn, shimmering {_OPTION2} residue that giggles when disturbed"
                        ],
                        _OPTION1: [
                            "Goblin Rock Cakes",
                            "Orcish Meat Pies",
                            "Halfling Honey Buns",
                            "Wizard's Mana Muffins",
                            "Elf-Leaf Crackers"
                        ],
                        _OPTION2: [
                            "poltergeist goo",
                            "failed illusion slime",
                            "elemental seepage",
                            "astral jelly",
                            "emotional residue"
                        ]
                    },
                    {
                        name: "Wash mountains of dishes",
                        skills: ["labor", "stamina", "provisions"],
                        intermediates: [
                            "Scrubbing endlessly at food-caked plates, cauldron-sized pots, and tankards sticky with potent brews",
                            "Enduring the monotonous rhythm, occasionally broken by a dish attempting to float away",
                            "Ensuring all kitchenware is hygienically cleansed with magically heated water",
                            "Carefully washing the Head Sorceress's personal {_OPTION1} scrying bowl used as a soup tureen",
                            "Discovering a runic inscription at the bottom of a {_OPTION2} platter that translates to 'Wash Me Properly Or Suffer Mild Indigestion'"
                        ],
                        _OPTION1: [
                            "obsidian",
                            "jadeite",
                            "Silvered Moonstone",
                            "enchanted clay",
                            "self-cleaning"
                        ],
                        _OPTION2: [
                            "Dwarven Feasting",
                            "Elven Ceremonial",
                            "Orcish War-Table",
                            "Gnomish Trick",
                            "Titan-Sized"
                        ]
                    },
                    {
                        name: "Organize cutlery and plates",
                        skills: ["labor", "provisions", "memory", "hospitality"],
                        intermediates: [
                            "Sorting the myriad types of forks, knives, spoons, and sporks",
                            "Stacking plates by material: ceramic, pewter, silver, and the occasionally vibrating obsidian",
                            "Recalling the designated, magically warded drawers and cabinets for each item set",
                            "Ensuring easy access for the often-flustered kitchen servitors and apprentices",
                            "Polishing the ceremonial {_OPTION1} cutlery set, reserved for visiting dignitaries",
                            "Placing the {_OPTION2} plates, known for their delicate enchantments, into their silk-lined, stasis-field storage box"
                        ],
                        _OPTION1: [
                            "Dragonbone-Handled",
                            "Mithril-Filigreed",
                            "Star Metal",
                            "Elven Ancestral Silver",
                            "Titan-Forged Gold"
                        ],
                        _OPTION2: [
                            "scrying",
                            "self-repairing",
                            "warded against poison",
                            "history-recording",
                            "mood-enhancing"
                        ]
                    },
                    {
                        name: "Dispose of leftover rations",
                        skills: ["labor", "provisions"],
                        intermediates: [
                            "Sorting edible scraps from truly inedible magical byproducts and failed experiments",
                            "Transporting organic waste to the magically accelerated compost heap guarded by a grumpy earth elemental",
                            "Applying minor preservation spells to salvageable foodstuffs for the less discerning guild members",
                            "Feeding leftover roasted {_OPTION1} bones to the kennel master's hell hounds",
                            "Using spoiled {_OPTION2} potions to fertilize the carnivorous plant garden"
                        ],
                        _OPTION1: [
                            "Minotaur",
                            "Cockatrice",
                            "Wyvern",
                            "Gargoyle",
                            "Basilisk"
                        ],
                        _OPTION2: [
                            "growth",
                            "healing",
                            "fertility",
                            "herbalism",
                            "mana regeneration"
                        ]
                    },
                    {
                        name: "Ventilate lingering food odors",
                        skills: ["aeromancy", "engineering"],
                        intermediates: [
                            "Manually cranking open the magically sealed ventilation shafts in the high ceiling",
                            "Casting 'Gust of Wind' and 'Air Bubble' spells to create specific air currents towards exhaust ports",
                            "Checking and cleaning the elemental-bound air filtration runes that trap grease and magical fumes",
                            "Dispelling the particularly potent and lingering aroma of last night's {_OPTION1} stew",
                            "Adjusting the arcane-powered directional fans to counteract the smell of burnt {_OPTION2} from a kitchen mishap"
                        ],
                        _OPTION1: [
                            "'Kreegan Hell-Pepper Surprise'",
                            "'Dwarven Garlic Kraken Surprise'",
                            "'Ogre Onion and Bog Fungus Surprise'",
                            "'Goblin Mystery Meat Goulash'",
                            "'Naga Spicy Eel Surprise'"
                        ],
                        _OPTION2: [
                            "'Potion of Invisibility'",
                            "'Pixie Pie'",
                            "scorched dragonfruit tarts",
                            "experimental mana cookies",
                            "alchemical cheese"
                        ]
                    },
                    {
                        name: "Reset table settings",
                        skills: ["hospitality", "etiquette", "memory"],
                        intermediates: [
                            "Spreading freshly laundered tablecloths imbued with anti-stain enchantments",
                            "Arranging cutlery according to the complex Tower Dining Etiquette, Section IV, Subsection B",
                            "Recalling the preferred seating arrangements and dietary restrictions for senior mages and their familiars",
                            "Folding napkins into impressive {_OPTION1} shapes that occasionally animate",
                            "Ensuring each place setting has a chilled goblet of magically purified {_OPTION2} water, sometimes flavored with illusionary fruit"
                        ],
                        _OPTION1: [
                            "Origami Dragons",
                            "Folded Phoenixes",
                            "Miniature Golems",
                            "Wizard Hat Creases",
                            "Abstract Runic Symbols"
                        ],
                        _OPTION2: [
                            "spring",
                            "mountain glacier melt",
                            "rain harvested from storm clouds",
                            "elemental-infused",
                            "blessed fountain"
                        ]
                    },
                    {
                        name: "Brew restorative teas",
                        skills: ["pharmacology", "alchemy", "life_magic", "nature_magic"],
                        intermediates: [
                            "Selecting specific herbs like Sunpetal, Moonleaf, and powdered Griffin Claw for their magical properties",
                            "Grinding ingredients with an enchanted silver mortar and pestle that hums softly",
                            "Infusing the brew with gentle Life Magic to enhance its healing and calming effects",
                            "Consulting ancient pharmacological scrolls for precise brewing times and temperatures",
                            "Brewing a large batch of {_OPTION1} tea, known for enhancing mental acuity before exams",
                            "Preparing a special {_OPTION2} infusion for the Head Librarian, who suffers from chronic paper-induced stress"
                        ],
                        _OPTION1: [
                            "'Mind-Focus Mint'",
                            "'Sage's Serenity Brew'",
                            "'Scholar's Spark Leaf'",
                            "'Memory Moss Medley'",
                            "'Clarity Comfrey Concoction'"
                        ],
                        _OPTION2: [
                            "'Sunpetal Salve Tea'",
                            "'Moonpetal Panacea Brew'",
                            "'Lifebloom Essence Infusion'",
                            "'Spiritmender Tincture Tea'",
                            "'Vitality Vine Elixir'"
                        ]
                    },
                    {
                        name: "Prepare enchanted appetizers",
                        skills: ["refined_palate", "cooking", "enchanting"],
                        intermediates: [
                            "Selecting exotic and magically reactive ingredients like shimmercap mushrooms and sun-ripened mana berries",
                            "Imbuing foodstuffs with minor beneficial enchantments such as 'Enhanced Flavor' or 'Temporary Wit'",
                            "Balancing complex flavors to satisfy the discerning palates of archmages and visiting efreeti",
                            "Artistically arranging appetizers on platters that may levitate or display minor illusions",
                            "Creating shimmering {_OPTION1} canapés that change color based on the diner's mood",
                            "Garnishing the {_OPTION2} puffs with edible glitter that whispers compliments to the eater"
                        ],
                        _OPTION1: [
                            "levitating cheese cubes",
                            "color-changing fruit skewers",
                            "truth-serum olives",
                            "luck-infusing mini-quiches",
                            "comprehend languages crackers"
                        ],
                        _OPTION2: [
                            "Mana-Infused Gougères",
                            "Dragonfruit and Feta Bites",
                            "Phoenix Egg Tartlets",
                            "Glowshroom Pâté",
                            "Crystalized Honey Dewdrops"
                        ]
                    },
                    {
                        name: "Chill beverages with ice magic",
                        skills: ["hydromancy", "hospitality"],
                        intermediates: [
                            "Focusing hydromantic energy to precisely lower the temperature of various beverages",
                            "Shaping conjured ice into decorative forms like miniature ice elementals or frozen runes for drink pitchers",
                            "Ensuring beverages are chilled to perfection without accidentally flash-freezing the entire punch bowl",
                            "Chilling the visiting Dwarven Thane's notoriously strong {_OPTION1} ale to his exact specifications",
                            "Creating elaborate ice sculptures of {_OPTION2} to adorn the dessert table, which sometimes melt into tiny water weirds"
                        ],
                        _OPTION1: [
                            "'Firebrandy Ale'",
                            "'Cave Bear Stout'",
                            "'Mithril Mead'",
                            "'Magma Rock Lager'",
                            "'Deep Iron Porter'"
                        ],
                        _OPTION2: [
                            "Ice Griffins",
                            "Frozen Phoenixes",
                            "Crystalline Golems",
                            "Glacial Serpents",
                            "Frosty Fairies"
                        ]
                    },
                    {
                        name: "Ensure proper dining etiquette",
                        skills: ["leadership", "insight", "mages_guild_protocols"],
                        intermediates: [
                            "Subtly observing diners for breaches in the Tower's extensive Code of Conduct",
                            "Discreetly correcting misbehaving apprentices attempting to levitate peas into each other's mouths",
                            "Intervening with tact when arcane debates at the table threaten to escalate into actual spell-slinging",
                            "Recalling the specific dining customs and forbidden topics for visiting {_OPTION1} ambassadors",
                            "Quietly reminding a junior mage that practicing {_OPTION2} spells on the table settings is frowned upon, especially if it animates the cutlery"
                        ],
                        _OPTION1: [
                            "Elven Loremaster from Eeofol",
                            "Dwarven Runelord from Stonehelm",
                            "Naga Sorceress from the Shifting Isles",
                            "Efreeti Sultan from the Plane of Fire",
                            "Titan Emissary from the Cloud Cities"
                        ],
                        _OPTION2: [
                            "transmutation",
                            "minor illusion",
                            "pyromancy",
                            "telekinesis",
                            "chronomancy"
                        ]
                    },
                    {
                        name: "Cleanse haunted serving platters",
                        skills: ["life_magic", "abjuration", "spectral_mastery"],
                        intermediates: [
                            "Identifying the nature of the spectral entities clinging to platters – usually disgruntled former kitchen staff or food critics",
                            "Applying gentle Death Magic persuasions to encourage lingering spirits to move on to the Great Buffet Beyond",
                            "Using Life Magic to purify residual negative energy and phantom food stains",
                            "Casting minor Abjuration wards, like 'Banish Bored Ghost', to prevent re-haunting",
                            "Attempting to communicate with a stubborn spirit of a former {_OPTION1} chef who insists his recipes are still being butchered",
                            "Carefully scrubbing away a particularly tenacious {_OPTION2} residue that moans dramatically when touched with soap"
                        ],
                        _OPTION1: [
                            "halfling pastry",
                            "orcish barbecue",
                            "gnomish experimental",
                            "elven vegetarian",
                            "dwarven ale-brewing"
                        ],
                        _OPTION2: [
                            "ectoplasmic grease",
                            "soul-stain soufflé",
                            "spectral gravy remnants",
                            "phantom food particles",
                            "weeping shadow sauce"
                        ]
                    }
                ],
                workshop: [
                    {
                        name: "Sort crafting components",
                        skills: ["artisanry", "legerdemain", "memory", "magical_item_analysis"],
                        intermediates: [
                            "Sifting through a pile of {_OPTION0} cogs",
                            "Separating shimmering {_OPTION1} scales from dull iron ingots",
                            "Remembering the precise storage rune for {_OPTION2} crystals",
                            "Checking component integrity using a {_OPTION3} monocle",
                            "Placing volatile {_OPTION4} essences into stasis jars",
                            "Wondering if this {_OPTION5} piece is for a golem or a siege weapon"
                        ],
                        _OPTION0: ["brass", "clockwork", "mithril", "obsidian"],
                        _OPTION1: ["dragon", "griffin", "basilisk", "wyvern"],
                        _OPTION2: ["mana", "fire", "ice", "shadow"],
                        _OPTION3: ["magnifying", "analytical", "divination", "truth-seeing"],
                        _OPTION4: ["elemental", "chaotic", "astral", "necrotic"],
                        _OPTION5: ["curved", "spiked", "glowing", "humming"]
                    },
                    {
                        name: "Clear jammed workbenches",
                        skills: ["clockwork", "smithing"],
                        intermediates: [
                            "Wrestling with a stuck {_OPTION0} lever",
                            "Dislodging a bent {_OPTION1} gear",
                            "Applying {_OPTION2} lubricant to grinding mechanisms",
                            "Carefully extracting a half-finished {_OPTION3} automaton arm",
                            "Hammering a warped {_OPTION4} metal plate back into shape",
                            "Muttering about apprentices leaving {_OPTION5} projects unfinished"
                        ],
                        _OPTION0: ["hydraulic", "ratcheting", "counter-weighted", "arcane-powered"],
                        _OPTION1: ["chrono-", "perpetual motion", "steam-driven", "harmonic"],
                        _OPTION2: ["troll fat", "refined quicksilver", "ectoplasmic slime", "dragon's tear oil"],
                        _OPTION3: ["guardian", "scout", "artisan", "battle"],
                        _OPTION4: ["titanium", "adamantine", "steel", "bronze"],
                        _OPTION5: ["self-winding", "ever-glowing", "sound-dampening", "anti-gravity"]
                    },
                    {
                        name: "Sharpen and store tools",
                        skills: ["smithing", "woodworking", "labor"],
                        intermediates: [
                            "Grinding a {_OPTION0} chisel on a whetstone",
                            "Applying {_OPTION1} oil to prevent rust on saw blades",
                            "Hanging hammers and mallets on the {_OPTION2} rack",
                            "Testing the edge of a newly sharpened {_OPTION3} plane",
                            "Organizing fine carving tools by {_OPTION4} type",
                            "Ensuring all {_OPTION5} implements are properly sheathed"
                        ],
                        _OPTION0: ["woodworking", "stone-carving", "ice-sculpting", "bone-crafting"],
                        _OPTION1: ["dwarven honing", "elfin preserving", "goblin anti-rust", "orcish sharpening"],
                        _OPTION2: ["magnetic", "pegboard", "shadow-bound", "levitating"],
                        _OPTION3: ["dragonbone", "obsidian", "meteorite steel", "enchanted steel"],
                        _OPTION4: ["gnomish precision", "human utility", "ogre strength", "pixie finesse"],
                        _OPTION5: ["bladed", "pointed", "magically imbued", "self-repairing"]
                    },
                    {
                        name: "Dispose of failed inventions",
                        skills: ["labor", "engineering", "risk_assessment", "alchemy"],
                        intermediates: [
                            "Carefully dismantling a sputtering {_OPTION0} device",
                            "Assessing the instability of a cracked {_OPTION1} orb",
                            "Neutralizing residual magic from a failed {_OPTION2} amulet",
                            "Hauling away the wreckage of an exploded {_OPTION3} clockwork servant",
                            "Consulting the 'Manual of Catastrophic Failures' for proper disposal of {_OPTION4} residue",
                            "Trying not to inhale the fumes from a melted {_OPTION5} prototype"
                        ],
                        _OPTION0: ["self-stirring cauldron", "automated shoe-tyer", "portable black hole generator", "universal translator"],
                        _OPTION1: ["scrying", "weather control", "gravity-defying", "soul-trapping"],
                        _OPTION2: ["invisibility", "flight", "fire-breathing", "teleportation"],
                        _OPTION3: ["tea-serving", "book-fetching", "guard", "dueling"],
                        _OPTION4: ["alchemical", "chronomatic", "dimensional", "ethereal"],
                        _OPTION5: ["self-folding map", "everlasting gobstopper", "portable bridge construct", "dream recorder"]
                    },
                    {
                        name: "Organize blueprints and schematics",
                        skills: ["artisanry", "engineering", "memory", "cartography"],
                        intermediates: [
                            "Unrolling a dusty schematic for a {_OPTION0} golem",
                            "Comparing different versions of the {_OPTION1} siege engine plans",
                            "Filing away diagrams of intricate {_OPTION2} clockwork mechanisms",
                            "Trying to decipher faded annotations on a {_OPTION3} blueprint",
                            "Cross-referencing material requirements for a {_OPTION4} construct",
                            "Pinning the master plan for the new {_OPTION5} observatory wing"
                        ],
                        _OPTION0: ["stone", "iron", "obsidian", "diamond"],
                        _OPTION1: ["ballista", "catapult", "trebuchet", "battering ram"],
                        _OPTION2: ["time-keeping", "navigational", "defensive", "automated"],
                        _OPTION3: ["ancient Titan", "experimental gnomish", "captured enemy", "forgotten Archmage's"],
                        _OPTION4: ["scrying eye", "mechanical bird", "walking tower", "arcane cannon"],
                        _OPTION5: ["astral", "elemental", "chronomancy", "divination"]
                    },
                    {
                        name: "Sweep metal shavings and wood chips",
                        skills: ["labor", "artisanry", "cleaning"],
                        intermediates: [
                            "Gathering glittering {_OPTION0} filings with a stiff broom",
                            "Collecting piles of fragrant {_OPTION1} shavings",
                            "Avoiding a sentient pile of {_OPTION2} dust bunnies",
                            "Emptying the collection bin into the {_OPTION3} recycler",
                            "Finding a lost {_OPTION4} gear amidst the debris",
                            "Wishing for a cleaning {_OPTION5} construct to do this"
                        ],
                        _OPTION0: ["mithril", "adamantine", "copper", "silver"],
                        _OPTION1: ["oak", "pine", "ironwood", "petrified wood"],
                        _OPTION2: ["arcane", "chiming", "chittering", "glowing"],
                        _OPTION3: ["elemental", "magical", "steam-powered", "transmutation"],
                        _OPTION4: ["clockwork", "tiny", "rune-etched", "iridescent"],
                        _OPTION5: ["sweeping", "dust-devouring", "self-polishing", "all-purpose"]
                    },
                    {
                        name: "Recycle scrap materials",
                        skills: ["transmutation", "smithing"],
                        intermediates: [
                            "Melting down bent {_OPTION0} ingots in the forge",
                            "Using transmutation spells to purify mixed {_OPTION1} metals",
                            "Sorting usable {_OPTION2} gears from broken ones",
                            "Breaking down damaged {_OPTION3} constructs for parts",
                            "Rebinding {_OPTION4} elemental essences from discarded items",
                            "Hoping the recycling rune doesn't turn everything into {_OPTION5}"
                        ],
                        _OPTION0: ["iron", "steel", "bronze", "gold"],
                        _OPTION1: ["arcane", "common", "precious", "volatile"],
                        _OPTION2: ["brass", "iron", "clockwork", "miniature"],
                        _OPTION3: ["guardian", "worker", "scout", "experimental"],
                        _OPTION4: ["fire", "water", "air", "earth"],
                        _OPTION5: ["lead", "cheese", "sentient sludge", "butterflies"]
                    },
                    {
                        name: "Restock common reagents",
                        skills: ["artisanry", "alchemy", "bookkeeping", "magical_lore"],
                        intermediates: [
                            "Checking inventory levels of {_OPTION0} dust",
                            "Ordering a new shipment of {_OPTION1} crystals",
                            "Refilling jars of powdered {_OPTION2} horn",
                            "Ensuring there's enough quicksilver for {_OPTION3} enchantments",
                            "Updating the ledger for {_OPTION4} oil purchases",
                            "Polishing the {_OPTION5} containers for the reagents"
                        ],
                        _OPTION0: ["pixie", "dragon scale", "mummy", "star"],
                        _OPTION1: ["mana", "focusing", "amplification", "warding"],
                        _OPTION2: ["unicorn", "dragon", "minotaur", "demon"],
                        _OPTION3: ["weapon", "armor", "tool", "golem"],
                        _OPTION4: ["snake", "elemental", "blessed", "cursed"],
                        _OPTION5: ["glass", "ceramic", "silver", "ebony"]
                    },
                    {
                        name: "Ventilate smithy smoke",
                        skills: ["labor", "aeromancy", "engineering", "pyromancy"],
                        intermediates: [
                            "Opening the large {_OPTION0} chimney flue",
                            "Casting a minor {_OPTION1} whirlwind to clear the air",
                            "Checking the directional {_OPTION2} fans for blockages",
                            "Adjusting the {_OPTION3} bellows to control airflow to the forge",
                            "Making sure the smoke doesn't annoy the {_OPTION4} gargoyles",
                            "Clearing soot from the {_OPTION5} ventilation grates"
                        ],
                        _OPTION0: ["stone", "copper", "iron", "magically enhanced"],
                        _OPTION1: ["zephyr", "gust", "cyclone", "breeze"],
                        _OPTION2: ["extraction", "circulation", "purification", "cooling"],
                        _OPTION3: ["great forge", "smelting", "tempering", "enchanting"],
                        _OPTION4: ["rooftop", "sentinel", "grumpy old", "newly awakened"],
                        _OPTION5: ["ceiling", "wall-mounted", "floor-level", "rune-inscribed"]
                    },
                    {
                        name: "Secure volatile contraptions",
                        skills: ["clockwork", "trap_handling", "risk_assessment"],
                        intermediates: [
                            "Reinforcing the casing of a humming {_OPTION0} device",
                            "Applying dampening runes to a vibrating {_OPTION1} core",
                            "Setting up a stasis field around an unstable {_OPTION2} prototype",
                            "Checking the fail-safes on a potentially explosive {_OPTION3} engine",
                            "Carefully moving a {_OPTION4} ticking construct to the reinforced vault",
                            "Placing 'Do Not Touch Unless You Enjoy {_OPTION5}' signs"
                        ],
                        _OPTION0: ["reality-warping", "time-bending", "soul-powered", "chaos-fueled"],
                        _OPTION1: ["arcane", "elemental", "void", "clockwork"],
                        _OPTION2: ["teleporter", "miniature sun", "anti-magic field generator", "weather machine"],
                        _OPTION3: ["infernal", "astral", "steam-powered doom", "perpetual motion"],
                        _OPTION4: ["menacingly", "erratically", "ominously", "rhythmically"],
                        _OPTION5: ["explosions", "implosions", "paradoxes", "being turned inside out"]
                    },
                    {
                        name: "Calibrate arcane measuring devices",
                        skills: ["enchanting", "magical_item_analysis", "arcane_principles", "engineering"],
                        intermediates: [
                            "Adjusting the lenses of an {_OPTION0} aetheric scanner",
                            "Tuning the resonant frequency of a {_OPTION1} mana-meter",
                            "Cross-referencing readings with a {_OPTION2} master chronometer",
                            "Recalibrating the ley-line {_OPTION3} detector against the Astral Convergence",
                            "Fine-tuning the sensitivity of the {_OPTION4} psychometric calipers",
                            "Ensuring the {_OPTION5} null-field generator is perfectly balanced"
                        ],
                        _OPTION0: ["portable", "benchtop", "long-range", "multi-dimensional"],
                        _OPTION1: ["crystal", "mercurial", "harmonic", "bio-luminescent"],
                        _OPTION2: ["atomic", "celestial", "sand-based", "water-clock"],
                        _OPTION3: ["triangulation", "harmonic", "divinatory", "geodetic"],
                        _OPTION4: ["aura-sensitive", "artifact-analyzing", "soul-weighing", "thought-measuring"],
                        _OPTION5: ["anti-magic", "anti-gravity", "anti-entropy", "anti-noise"]
                    },
                    {
                        name: "Test newly crafted wands",
                        skills: ["implement_crafting", "spellcraft", "magical_item_analysis"],
                        intermediates: [
                            "Channeling a {_OPTION0} spark through a rowan wand",
                            "Checking the focus of a crystal-tipped {_OPTION1} scepter",
                            "Measuring the {_OPTION2} output of an ebony staff",
                            "Ensuring a bone wand doesn't {_OPTION3} unexpectedly",
                            "Comparing the new wand's performance to the 'Standard {_OPTION4} Bolt' test",
                            "Feeling the {_OPTION5} hum of a well-made implement"
                        ],
                        _OPTION0: ["minor healing", "cantrip-level fire", "illusory", "detect magic"],
                        _OPTION1: ["fireball", "ice shard", "lightning bolt", "magic missile"],
                        _OPTION2: ["mana efficiency", "spell power", "range", "casting speed"],
                        _OPTION3: ["backfire", "summon imps", "change color", "sing opera"],
                        _OPTION4: ["Apprentice's", "Adept's", "Master's", "Archmage's"],
                        _OPTION5: ["gentle", "powerful", "barely perceptible", "resonating"]
                    },
                    {
                        name: "Temper enchanted blades",
                        skills: ["smithing", "armament_enchanting", "pyromancy"],
                        intermediates: [
                            "Heating a {_OPTION0} longsword in the dragon's breath forge",
                            "Quenching the glowing blade in {_OPTION1} oil",
                            "Listening for the characteristic {_OPTION2} ring of perfectly tempered metal",
                            "Infusing the steel with {_OPTION3} enchantments during the cooling process",
                            "Checking the blade's edge for {_OPTION4} sharpness and durability",
                            "Admiring the faint {_OPTION5} runes now glowing on the blade"
                        ],
                        _OPTION0: ["mithril", "adamantine", "obsidian", "star-metal"],
                        _OPTION1: ["phoenix tear", "griffin blood", "blessed water", "quicksilver"],
                        _OPTION2: ["celestial", "infernal", "harmonic", "ethereal"],
                        _OPTION3: ["flaming", "frost", "vampiric", "holy"],
                        _OPTION4: ["supernatural", "razor", "unearthly", "adamantine-like"],
                        _OPTION5: ["protective", "destructive", "enhancing", "binding"]
                    },
                    {
                        name: "Repair damaged siege engine parts",
                        skills: ["siege_weaponry", "smithing", "engineering", "woodworking"],
                        intermediates: [
                            "Welding a cracked {_OPTION0} support beam for a catapult",
                            "Replacing frayed {_OPTION1} torsion ropes on a ballista",
                            "Reinforcing the {_OPTION2} arm of a trebuchet",
                            "Patching holes in the {_OPTION3} ammunition hopper",
                            "Checking the alignment of the {_OPTION4} targeting mechanism",
                            "Applying {_OPTION5} grease to the siege engine's moving parts"
                        ],
                        _OPTION0: ["ironwood", "steel", "bronze", "stone"],
                        _OPTION1: ["dragon sinew", "giant hair", "ironwood fiber", "enchanted silk"],
                        _OPTION2: ["throwing", "counterweight", "launching", "main"],
                        _OPTION3: ["stone", "flaming pitch", "plague victim body", "rune-inscribed"],
                        _OPTION4: ["arcane", "optical", "mechanical", "magical"],
                        _OPTION5: ["troll", "ogre", "golem", "dwarven"]
                    },
                    {
                        name: "Assemble golem components",
                        skills: ["binding", "smithing", "magical_lore", "clockwork"],
                        intermediates: [
                            "Attaching a {_OPTION0} arm to a stone torso",
                            "Wiring the {_OPTION1} core into an iron golem's chest cavity",
                            "Etching binding runes onto a {_OPTION2} head",
                            "Calibrating the {_OPTION3} leg actuators for a brass golem",
                            "Consulting ancient texts for the correct {_OPTION4} activation sequence",
                            "Hoping this golem doesn't develop {_OPTION5} sentience and rebel"
                        ],
                        _OPTION0: ["massive stone", "articulated metal", "clockwork", "crystal"],
                        _OPTION1: ["elemental", "arcane", "soulstone", "clockwork heart"],
                        _OPTION2: ["diamond", "obsidian", "clay", "bone"],
                        _OPTION3: ["hydraulic", "steam-powered", "magically driven", "clockwork"],
                        _OPTION4: ["elemental", "arcane", "divine", "forbidden"],
                        _OPTION5: ["unexpected", "problematic", "philosophical", "artistic"]
                    },
                ],
                alchemists_lab: [
                    {
                        name: "Scrub alchemical stains",
                        skills: ["labor", "alchemy", "stamina"],
                        intermediates: [
                            "Applying {_OPTION0} solvent to a bubbling purple stain",
                            "Scraping hardened {_OPTION1} residue from the stone floor",
                            "Wearing protective {_OPTION2} gloves against corrosive spills",
                            "Neutralizing an iridescent shimmer left by a {_OPTION3} potion",
                            "Trying not to identify the stain from the 'Forbidden {_OPTION4} Experiments' chapter",
                            "Wondering if this stain will eventually eat through the {_OPTION5}"
                        ],
                        _OPTION0: ["universal", "dragon's breath", "pixie tear", "concentrated"],
                        _OPTION1: ["mercurial", "sulfurous", "phosphorescent", "crystallized"],
                        _OPTION2: ["wyvern hide", "golem-plated", "enchanted silk", "transmuted rubber"],
                        _OPTION3: ["invisibility", "transmutation", "polymorph", "luck"],
                        _OPTION4: ["Flesh-warping", "Soul-binding", "Reality-bending", "Time-altering"],
                        _OPTION5: ["workbench", "floor", "cauldron", "alchemist"]
                    },
                    {
                        name: "Dispose of volatile concoctions",
                        skills: ["incendiaries", "risk_assessment", "labor"],
                        intermediates: [
                            "Carefully carrying a {_OPTION0} smoking beaker to the disposal unit",
                            "Diluting a highly reactive {_OPTION1} mixture with inert sand",
                            "Pouring a fizzing {_OPTION2} liquid into a lead-lined container",
                            "Consulting the 'Volatile Waste Protocol' for handling {_OPTION3} fluids",
                            "Making sure the {_OPTION4} neutralizing agent is on hand",
                            "Hoping the disposal chute doesn't lead directly to the {_OPTION5} breeding grounds"
                        ],
                        _OPTION0: ["gently", "rapidly", "ominously", "colorfully"],
                        _OPTION1: ["self-igniting", "rapidly expanding", "reality-distorting", "soul-devouring"],
                        _OPTION2: ["acidic", "explosive", "mutagenic", "necrotic"],
                        _OPTION3: ["unstable", "glowing", "whispering", "phase-shifting"],
                        _OPTION4: ["universal", "anti-magic", "elemental dampening", "bio-hazard"],
                        _OPTION5: ["Ooze", "Slime", "Imp", "Gremlin"]
                    },
                    {
                        name: "Organize potion vials by potency",
                        skills: ["potions", "memory", "magical_item_analysis"],
                        intermediates: [
                            "Reading the faint {_OPTION0} aura of a minor healing potion",
                            "Comparing the viscosity of a {_OPTION1} strength elixir to a greater one",
                            "Arranging {_OPTION2} mana potions from weakest to 'might explode' strength",
                            "Checking labels for {_OPTION3} symbols indicating potency levels",
                            "Remembering that the {_OPTION4} potion goes on the 'Extremely Dangerous' shelf",
                            "Sniffing a vial of {_OPTION5} and immediately regretting it"
                        ],
                        _OPTION0: ["healing", "protective", "enhancing", "damaging"],
                        _OPTION1: ["giant's", "ogre's", "troll's", "dragon's"],
                        _OPTION2: ["blue", "sparkling", "effervescent", "glowing"],
                        _OPTION3: ["alchemical", "runic", "astrological", "color-coded"],
                        _OPTION4: ["Polymorph Self (Unstable)", "Instant Death (Probably)", "Wish (Definitely Not)", "Love Potion No. 9¾"],
                        _OPTION5: ["Berserker Rage", "Sleeping Draught of the Unwaking", "Potion of Blinding Speed", "Elixir of Questionable Sanity"]
                    },
                    {
                        name: "Clean beakers and retorts",
                        skills: ["labor", "alchemy", "hospitality"],
                        intermediates: [
                            "Using a {_OPTION0} brush to scrub residue from a tall beaker",
                            "Rinsing a spherical {_OPTION1} retort with purified water",
                            "Polishing a crystal {_OPTION2} flask until it shines",
                            "Ensuring no cross-contamination between {_OPTION3} experiments",
                            "Sterilizing equipment in an {_OPTION4} autoclave",
                            "Wondering if the Head Alchemist will notice the {_OPTION5} retort being used for tea"
                        ],
                        _OPTION0: ["bristle", "enchanted", "self-cleaning", "acid-resistant"],
                        _OPTION1: ["distillation", "reflux", "alembic", "Cucurbit"],
                        _OPTION2: ["Erlenmeyer", "volumetric", "Florence", "graduated"],
                        _OPTION3: ["transmutation", "healing", "poison", "explosive"],
                        _OPTION4: ["magical", "steam-powered", "sonic", "UV light"],
                        _OPTION5: ["rare perfectly balanced", "slightly chipped", "borrowed", "surprisingly clean"]
                    },
                    {
                        name: "Restock common ingredients",
                        skills: ["alchemy", "bookkeeping", "foraging", "pharmacology"],
                        intermediates: [
                            "Counting jars of dried {_OPTION0} root",
                            "Refilling bins of powdered {_OPTION1} claw",
                            "Noting the low supply of {_OPTION2} petals",
                            "Checking the freshness of preserved {_OPTION3} eyes",
                            "Updating the inventory for {_OPTION4} dew",
                            "Making sure the {_OPTION5} spores are kept in a sealed container"
                        ],
                        _OPTION0: ["mandrake", "belladonna", "ginseng", "nightshade"],
                        _OPTION1: ["griffin", "manticore", "basilisk", "harpy"],
                        _OPTION2: ["moonflower", "sunpetal", "dreamfoil", "bloodrose"],
                        _OPTION3: ["newt", "spider", "beholder", "kraken"],
                        _OPTION4: ["morning", "shadow", "celestial", "phoenix"],
                        _OPTION5: ["glowing mushroom", "puffball", "shrieker", "ascomoid"]
                    },
                    {
                        name: "Label unidentified substances",
                        skills: ["toxicology", "magical_item_analysis", "runes"],
                        intermediates: [
                            "Cautiously sniffing a flask containing a {_OPTION0} purple liquid",
                            "Using a 'Detect Poison' spell on a bubbling {_OPTION1} green goo",
                            "Applying a temporary {_OPTION2} rune for 'Potentially Explosive'",
                            "Consulting the 'Compendium of {_OPTION3} Oddities' for a match",
                            "Trying to decipher a faded label that might say '{_OPTION4}' or '{_OPTION5}'",
                            "Marking one vial 'Definitely Not {_OPTION6}'"
                        ],
                        _OPTION0: ["glowing", "viscous", "fuming", "pulsating"],
                        _OPTION1: ["translucent", "opaque", "sparkling", "slimy"],
                        _OPTION2: ["warning", "containment", "identification", "neutralizing"],
                        _OPTION3: ["Alchemical", "Unknown", "Forgotten", "Dangerous"],
                        _OPTION4: ["Dragon's Blood", "Elixir of Life", "Potion of Youth", "Universal Solvent"],
                        _OPTION5: ["Dragon's Snot", "Elixir of Lice", "Potion of Youts", "Universal Insolvency"],
                        _OPTION6: ["Drinkable", "Safe", "Edible", "Good For You"]
                    },
                    {
                        name: "Ventilate noxious fumes",
                        skills: ["labor", "aeromancy", "alchemy", "engineering"],
                        intermediates: [
                            "Opening the {_OPTION0} fume hood vents",
                            "Casting a {_OPTION1} spell to direct fumes outside",
                            "Checking the {_OPTION2} exhaust fan for blockages",
                            "Ensuring the filtration system is trapping {_OPTION3} particles",
                            "Hoping the fumes don't attract any unwanted {_OPTION4} creatures",
                            "Placing a 'Warning: {_OPTION5} Zone' sign near the source"
                        ],
                        _OPTION0: ["alchemical", "reinforced", "self-sealing", "magically-assisted"],
                        _OPTION1: ["Gust of Wind", "Localized Cyclone", "Air Bubble", "Create Draft"],
                        _OPTION2: ["chimney-mounted", "arcane-powered", "bellows-driven", "elemental"],
                        _OPTION3: ["toxic", "corrosive", "mutagenic", "hallucinogenic"],
                        _OPTION4: ["rust monsters", "fume drakes", "air elementals", "curious imps"],
                        _OPTION5: ["Toxic Fume", "Biohazard", "Reality Distortion", "Spontaneous Combustion"]
                    },
                    {
                        name: "Neutralize spilled reagents",
                        skills: ["toxicology", "risk_assessment", "life_magic"],
                        intermediates: [
                            "Sprinkling {_OPTION0} neutralizing powder on a fizzing puddle",
                            "Pouring {_OPTION1} containment solution around a spreading stain",
                            "Using a 'Detoxify' cantrip on a patch of {_OPTION2} slime",
                            "Carefully absorbing a spill of {_OPTION3} acid with enchanted sand",
                            "Checking the 'Emergency Spill Guide' for {_OPTION4} protocol",
                            "Hoping the neutralized substance doesn't become sentient {_OPTION5}"
                        ],
                        _OPTION0: ["silver", "absorbent", "inert", "reactive"],
                        _OPTION1: ["anti-corrosive", "thickening", "solidifying", "vapor-suppressing"],
                        _OPTION2: ["mutagenic", "necrotic", "corrosive", "caustic"],
                        _OPTION3: ["Dragon's Bile", "Black Lotus Extract", "Basilisk Venom", "Manticore Spittle"],
                        _OPTION4: ["Code Purple", "Level 3 Contaminant", "Unknown Volatile", "Class Omega"],
                        _OPTION5: ["and hungry", "and philosophical", "and start a cult", "and demand worker's rights"]
                    },
                    {
                        name: "Catalog experimental residue",
                        skills: ["alchemy", "magical_lore", "memory", "investigation"],
                        intermediates: [
                            "Scraping a sample of shimmering {_OPTION0} dust into a vial",
                            "Labeling a jar of hardened {_OPTION1} crystals 'Experiment 734B - Failure'",
                            "Noting the peculiar {_OPTION2} scent of a leftover viscous liquid",
                            "Cross-referencing the residue with records of {_OPTION3} ingredients used",
                            "Trying to remember if this residue is from the {_OPTION4} or the {_OPTION5} experiment",
                            "Adding a note: 'Residue exhibits minor {_OPTION6} properties. Observe.'"
                        ],
                        _OPTION0: ["rainbow", "obsidian", "moon", "star"],
                        _OPTION1: ["salt-like", "sugar-like", "glass-like", "metallic"],
                        _OPTION2: ["sweet", "acrid", "ozone-like", "otherworldly"],
                        _OPTION3: ["phoenix feather", "manticore spine", "unicorn horn", "troll blood"],
                        _OPTION4: ["Polymorph Potion", "Invisibility Draught", "Transmutation Elixir", "Love Philter"],
                        _OPTION5: ["Exploding Mana Crystal", "Self-Replicating Slime", "Philosopher's Stone Attempt 12", "Imitation Gold"],
                        _OPTION6: ["anti-gravity", "luminescent", "sentient", "corrosive"]
                    },
                    {
                        name: "Polish the grand alembic",
                        skills: ["labor", "artisanry", "alchemy"],
                        intermediates: [
                            "Applying {_OPTION0} polish to the copper still head",
                            "Buffing the {_OPTION1} glass cucurbit to a shine",
                            "Ensuring the {_OPTION2} condenser coils are free of tarnish",
                            "Checking the integrity of the {_OPTION3} seals and joints",
                            "Admiring the reflection in the newly polished {_OPTION4} surface",
                            "Hoping not to awaken the dormant {_OPTION5} spirit bound to it"
                        ],
                        _OPTION0: ["dwarven metal", "elfin glass", "gnomish all-purpose", "alchemist's secret"],
                        _OPTION1: ["reinforced", "crystal", "obsidian", "magically treated"],
                        _OPTION2: ["silver", "mithril", "arcane", "serpentine"],
                        _OPTION3: ["hermetic", "alchemical", "rune-inscribed", "pressure-tight"],
                        _OPTION4: ["gleaming", "mirror-like", "flawless", "ancient"],
                        _OPTION5: ["mercury", "sulfur", "salt", "distillation"]
                    },
                    {
                        name: "Grind rare minerals for elixirs",
                        skills: ["alchemy", "labor", "mining", "geomancy"],
                        intermediates: [
                            "Using a {_OPTION0} mortar and pestle on a chunk of {_OPTION1}",
                            "Carefully crushing {_OPTION2} crystals to a fine powder",
                            "Sifting powdered {_OPTION3} to ensure uniform consistency",
                            "Wearing a mask to avoid inhaling {_OPTION4} dust",
                            "Feeling the faint {_OPTION5} energy emanating from the ground minerals",
                            "Hoping this batch of {_OPTION6} powder is potent enough"
                        ],
                        _OPTION0: ["stone", "iron", "diamond-tipped", "enchanted"],
                        _OPTION1: ["Sunstone", "Moonstone", "Bloodgem", "Star Opal"],
                        _OPTION2: ["quartz", "adamantite", "mithril", "soul"],
                        _OPTION3: ["Dragon's Tooth", "Philosopher's Shard", "Comet Fragment", "Geode Heart"],
                        _OPTION4: ["silicate", "magical", "potentially toxic", "glittering"],
                        _OPTION5: ["geomantic", "elemental", "arcane", "life"],
                        _OPTION6: ["Elixir of Fortitude", "Potion of Insight", "Draught of Invulnerability", "Philter of Luck"]
                    },
                    {
                        name: "Cultivate glowing fungi for mutagens",
                        skills: ["alchemy", "nature_magic", "farming", "mutagenesis"],
                        intermediates: [
                            "Watering the {_OPTION0} mushroom patch with enriched mana-water",
                            "Adjusting the {_OPTION1} light lamps over the lumina-caps",
                            "Harvesting mature {_OPTION2} nightshrouds for their mutagenic spores",
                            "Pruning the less vibrant stalks of {_OPTION3} glowstalks",
                            "Singing a soft {_OPTION4} growth chant to encourage the fungi",
                            "Carefully collecting the iridescent slime from the {_OPTION5} creepers"
                        ],
                        _OPTION0: ["shadow", "cave", "crystal-infused", "ectoplasmic"],
                        _OPTION1: ["UV", "bio-luminescent", "moon", "nether"],
                        _OPTION2: ["pulsating", "shimmering", "whispering", "phase-shifting"],
                        _OPTION3: ["azure", "crimson", "emerald", "violet"],
                        _OPTION4: ["druidic", "alchemical", "elemental", "myconid"],
                        _OPTION5: ["shadow", "mutating", "soul-eating", "mind-altering"]
                    },
                    {
                        name: "Distill potent spirits for transmutation",
                        skills: ["alchemy", "fermentation_distillation", "transmutation"],
                        intermediates: [
                            "Monitoring the temperature of the fermenting {_OPTION0} mash",
                            "Collecting the first drops of {_OPTION1} from the alembic's spout",
                            "Tasting a tiny diluted sample for {_OPTION2} purity and survival",
                            "Filtering the distilled spirit through {_OPTION3} charcoal",
                            "Bottling the 'Spiritus Mundi Attempt {_OPTION4}'",
                            "Labeling the batch: 'For {_OPTION5} use ONLY not for {_OPTION6} consumption!'"
                        ],
                        _OPTION0: ["unicorn tear-infused grape", "mandrake root", "dragon fruit", "stardust-sprinkled grain"],
                        _OPTION1: ["Aqua Vitae", "Prima Materia Condensate", "Azoth", "Philosopher's Dew"],
                        _OPTION2: ["alchemical", "magical", "transmutative", "volatile"],
                        _OPTION3: ["dragonbone", "willow", "purified", "enchanted"],
                        _OPTION4: ["27", "99", "342", "1001"],
                        _OPTION5: ["transmutation", "ritual", "fueling golems", "cleaning stubborn stains"],
                        _OPTION6: ["party", "medicinal", "dwarven drinking contest", "goblin"]
                    },
                    {
                        name: "Contain an escaped homunculus",
                        skills: ["alchemy", "beast_mastery", "trap_handling", "monster_lore"],
                        intermediates: [
                            "Tracking tiny {_OPTION0} footprints across the lab floor",
                            "Setting a {_OPTION1} trap baited with a drop of {_OPTION2}",
                            "Listening for the characteristic {_OPTION3} squeak of the rogue creation",
                            "Cornering the homunculus behind a stack of {_OPTION4} textbooks",
                            "Gently coaxing it into a {_OPTION5} containment jar",
                            "Muttering about the 'Troublesome {_OPTION6} Manual' being too vague"
                        ],
                        _OPTION0: ["glowing", "sticky", "acid-etched", "rapidly fading"],
                        _OPTION1: ["humane", "sticky net", "miniature cage", "sleeping gas"],
                        _OPTION2: ["its favorite nutrient solution", "Philosopher's Stone dust", "a tiny piece of cheese", "condensed moonlight"],
                        _OPTION3: ["high-pitched", "chittering", "philosophical", "insulting"],
                        _OPTION4: ["Forbidden Alchemy", "Advanced Transmutation", "Golem Construction", "Monster Anatomy"],
                        _OPTION5: ["bell", "reinforced", "padded", "rune-scribed"],
                        _OPTION6: ["Homunculi", "Minor Constructs", "Lab Assistants", "Artificial Life"]
                    },
                    {
                        name: "Analyze failed potion batches",
                        skills: ["potions", "toxicology", "deductive_reasoning"],
                        intermediates: [
                            "Examining a {_OPTION0} potion that turned an unfortunate shade of {_OPTION1}",
                            "Using a 'Detect Magic' spell to identify {_OPTION2} energies in the mixture",
                            "Comparing the ingredients list with the {_OPTION3} result",
                            "Theorizing that the {_OPTION4} was added at the wrong lunar phase",
                            "Deducing the failure was due to contaminated {_OPTION5}",
                            "Making a note: 'Do not substitute {_OPTION6} for dragon's tear ever again'"
                        ],
                        _OPTION0: ["healing", "invisibility", "strength", "love"],
                        _OPTION1: ["murky brown", "unsettling green", "violent pink", "non-Euclidean chartreuse"],
                        _OPTION2: ["residual", "chaotic", "unexpected necromantic", "wild magic"],
                        _OPTION3: ["solidified", "explosive", "sentient", "reality-warping"],
                        _OPTION4: ["moonpetal", "sunstone powder", "nightshade berry", "unicorn hair"],
                        _OPTION5: ["griffin feather", "mandrake root", "quicksilver", "goblin spit"],
                        _OPTION6: ["ogre slobber", "pond scum", "glitter", "pixie dust"]
                    }
                ],
                dormitories: [
                    {
                        name: "Tidy apprentice quarters",
                        skills: ["labor", "hospitality", "management"],
                        intermediates: [
                            "Gathering discarded {_OPTION0} scrolls",
                            "Straightening tapestries depicting {_OPTION1}",
                            "Organizing half-finished potions by {_OPTION2}",
                            "Making beds with freshly laundered {_OPTION3} sheets",
                            "Creating a chore rota using {_OPTION4} principles",
                            "Dealing with a stubborn {_OPTION5} stain on the floorboards"
                        ],
                        _OPTION0: ["spell", "research", "failed experiment", "cryptic poetry"],
                        _OPTION1: ["heroic mages", "mythical beasts", "celestial alignments", "scenes from 'The Mages' Lament'"],
                        _OPTION2: ["color", "volatility", "aromatic profile", "school of magic"],
                        _OPTION3: ["moon-cotton", "spider-silk", "enchanted linen", "thermo-regulated"],
                        _OPTION4: ["elemental harmony", "astrological synchronicity", "meritocratic", "random chance"],
                        _OPTION5: ["ectoplasmic", "alchemical", "wine", "unknown magical residue"]
                    },
                    {
                        name: "Collect lost familiars and spellbooks",
                        skills: ["beast_tongue", "spirit_bonding", "magical_lore", "perception"],
                        intermediates: [
                            "Following faint {_OPTION0} trails through the corridors",
                            "Coaxing a nervous {_OPTION1} from behind a bookshelf",
                            "Identifying a spellbook by its unique {_OPTION2} aura",
                            "Whispering calming words to a skittish {_OPTION3}",
                            "Checking the Lost and Found for a particularly noisy {_OPTION4} grimoire",
                            "Using a gentle {_OPTION5} charm to retrieve a book from a gargoyle's perch"
                        ],
                        _OPTION0: ["paw print", "magical shimmer", "dropped feather", "ectoplasmic slime"],
                        _OPTION1: ["pixie", "homunculus", "miniature golem", "disoriented gremlin"],
                        _OPTION2: ["elemental resonance", "arcane signature", "protective warding", "deceptive illusion"],
                        _OPTION3: ["bookwyrm", "shadow pup", "will-o'-the-wisp", "escaped imp"],
                        _OPTION4: ["cursed", "animated", "singing", "prophetic"],
                        _OPTION5: ["telekinesis", "minor levitation", "subtle animation", "friendly poltergeist persuasion"]
                    },
                    {
                        name: "Air out stuffy chambers",
                        skills: ["labor", "aeromancy", "hospitality"],
                        intermediates: [
                            "Unsealing magically warded windows",
                            "Conjuring a {_OPTION0} breeze using basic aeromancy",
                            "Dispelling lingering {_OPTION1} fumes from last night's experiments",
                            "Placing fresh {_OPTION2} sachets in strategic locations",
                            "Using a {_OPTION3} fan to create cross-ventilation",
                            "Checking air purity with a {_OPTION4} crystal sensor"
                        ],
                        _OPTION0: ["spring-scented", "mountain-fresh", "cleansing zephyr", "cyclonic (but gentle)"],
                        _OPTION1: ["alchemical reagent", "failed potion", "burnt incense", "stale magical energy"],
                        _OPTION2: ["lavender and moonpetal", "wind-blossom", "anti-mildew charm", "purifying salt"],
                        _OPTION3: ["large feather", "elemental-powered", "enchanted paper", "hand-cranked bellows"],
                        _OPTION4: ["simple attunement", "complex diagnostic", "golem-held", "self-reporting"]
                    },
                    {
                        name: "Organize personal wards and trinkets",
                        skills: ["magical_lore", "magical_item_analysis", "order_magic", "enchanting"],
                        intermediates: [
                            "Identifying the primary enchantment on each {_OPTION0} amulet",
                            "Sorting trinkets by their {_OPTION1} alignment or school",
                            "Carefully untangling intertwined {_OPTION2} protection charms",
                            "Reinforcing fading {_OPTION3} fields on personal wards",
                            "Placing items in specially prepared {_OPTION4} containers to prevent interference",
                            "Labeling each ward with its activation {_OPTION5} and deactivation phrase"
                        ],
                        _OPTION0: ["good luck", "elemental resistance", "mental focus", "anti-theft"],
                        _OPTION1: ["astral", "elemental", "chronomantic", "source of power"],
                        _OPTION2: ["memory", "dream", "warding", "anti-scrying"],
                        _OPTION3: ["minor abjuration", "apprentice-level shielding", "self-repairing", "deflection"],
                        _OPTION4: ["lead-lined boxes", "velvet-cushioned trays", "rune-etched pouches", "miniature faraday cages"],
                        _OPTION5: ["command word", "somatic gesture", "mental trigger", "specific condition"]
                    },
                    {
                        name: "Sweep under bunks for rogue imps",
                        skills: ["labor", "chaos_magic", "monster_lore"],
                        intermediates: [
                            "Brandishing a specially {_OPTION0} broom",
                            "Luring imps out with a piece of shiny {_OPTION1}",
                            "Reciting a minor {_OPTION2} verse to encourage their departure",
                            "Checking for tiny {_OPTION3} handprints on bedposts",
                            "Setting up a temporary {_OPTION4} containment field",
                            "Carefully escorting a captured imp to the {_OPTION5} chute"
                        ],
                        _OPTION0: ["silver-bristled", "blessed wood", "imp-repelling", "chaos-infused (ironically)"],
                        _OPTION1: ["fool's gold", "crystal shard", "enchanted button", "sugared plum"],
                        _OPTION2: ["banishment", "pacification", "mild irritation", "dimensional nudge"],
                        _OPTION3: ["sooty", "sticky", "glowing green", "mischievous"],
                        _OPTION4: ["sugar-circle", "chaos-dampening", "glitter-based", "sound-wave"],
                        _OPTION5: ["imp relocation", "elemental plane of mischief", "specialized imp daycare", "lower levels"]
                    },
                    {
                        name: "Change bed linens",
                        skills: ["labor", "hospitality", "tailoring"],
                        intermediates: [
                            "Stripping old {_OPTION0} sheets with surprising vigor",
                            "Checking for {_OPTION1} stains or spell scorches",
                            "Folding fresh linens with {_OPTION2} precision taught by house elves",
                            "Applying a light {_OPTION3} charm for sweet dreams",
                            "Plumping pillows filled with {_OPTION4} down",
                            "Tucking in corners using a surprisingly complex {_OPTION5} knot"
                        ],
                        _OPTION0: ["student-grade cotton", "enchanted silk", "self-cleaning (but failing)", "surprisingly coarse"],
                        _OPTION1: ["potion", "ink", "ectoplasmic", "midnight snack related"],
                        _OPTION2: ["obsessive", "military-grade", "magical", "almost artistic"],
                        _OPTION3: ["lavender-scented sleep", "nightmare-warding", "memory-enhancing", "gentle warmth"],
                        _OPTION4: ["griffin", "phoenix (ethically sourced)", "cloud", "enchanted hypoallergenic"],
                        _OPTION5: ["warding", "comfort-maximizing", "anti-wrinkle", "housekeeper's secret"]
                    },
                    {
                        name: "Empty runic waste bins",
                        skills: ["labor", "runes", "magical_lore", "alchemy"],
                        intermediates: [
                            "Donning protective {_OPTION0} gauntlets",
                            "Identifying potentially unstable {_OPTION1} remnants before disposal",
                            "Neutralizing reactive {_OPTION2} dust with a counter-agent spray",
                            "Transporting waste to the {_OPTION3} dissolution chamber",
                            "Sorting salvageable {_OPTION4} chips for reconstitution",
                            "Cleaning the bins with an {_OPTION5} slime"
                        ],
                        _OPTION0: ["dragonhide", "mithril-weave", "lead-lined", "alchemically treated rubber"],
                        _OPTION1: ["cracked rune-stone", "half-etched scroll", "broken warding circle fragment", "alchemical residue"],
                        _OPTION2: ["magical feedback", "elemental instability", "lingering spell energy", "chaotic particulate"],
                        _OPTION3: ["arcane nullification", "alchemical recycling", "elemental vortex", "sub-dimensional"],
                        _OPTION4: ["obsidian", "quartz", "bone", "meteorite iron"],
                        _OPTION5: ["residue-eating", "self-neutralizing", "anti-magic", "blessed cleansing"]
                    },
                    {
                        name: "Dust wardrobes and desks",
                        skills: ["labor", "cleaning"],
                        intermediates: [
                            "Wielding a {_OPTION0} duster like a master duelist",
                            "Carefully moving delicate {_OPTION1} scrying tools",
                            "Reaching high shelves with a {_OPTION2} telescoping rod",
                            "Wiping down surfaces with a cloth infused with {_OPTION3}",
                            "Finding a forgotten {_OPTION4} beneath a stack of textbooks",
                            "Enjoying the subtle gleam of a freshly dusted {_OPTION5} inlay"
                        ],
                        _OPTION0: ["phoenix feather", "enchanted lambswool", "self-agitating", "static-charged goblin hair"],
                        _OPTION1: ["crystal ball", "rune-carved bones", "astrolabe parts", "sentient paperweights"],
                        _OPTION2: ["levitation charm", "trained monkey", "step-ladder of dubious stability", "extendable grabber"],
                        _OPTION3: ["lemon oil and sunshine", "anti-static solution", "minor purification magic", "essence of cleanliness"],
                        _OPTION4: ["quill", "petrified sandwich", "love note from a nymph", "misplaced minor artifact"],
                        _OPTION5: ["mother-of-pearl", "silver", "ebony wood", "glowing runic"]
                    },
                    {
                        name: "Mend torn apprentice robes",
                        skills: ["tailoring", "enchanting", "artisanry"],
                        intermediates: [
                            "Selecting the right color of {_OPTION0} thread from the guild's supply",
                            "Carefully stitching a tear near the {_OPTION1} house emblem",
                            "Reinforcing the seam with a minor {_OPTION2} enchantment for durability",
                            "Patching a hole with fabric from a {_OPTION3} bolt of cloth",
                            "Checking the robe for other areas of {_OPTION4} from dueling practice",
                            "Pressing the mended area with a {_OPTION5} heated smoothing stone"
                        ],
                        _OPTION0: ["spider-silk", "moon-thread", "elementally-infused flax", "color-shifting chameleon"],
                        _OPTION1: ["Gryphon", "Sphinx", "Titan", "Dragon"],
                        _OPTION2: ["self-repairing", "stain-resistance", "enhanced comfort", "minor spell deflection"],
                        _OPTION3: ["donated masterwork", "salvaged battle-robe", "enchanted practice", "rarely used ceremonial"],
                        _OPTION4: ["spell burns", "reagent splashes", "familiar claws", "general academic wear"],
                        _OPTION5: ["magically", "self-", "rune-etched", "geothermal"]
                    },
                    {
                        name: "Declutter bedside altars",
                        skills: ["labor", "meditation", "mythology"],
                        intermediates: [
                            "Gently removing wilted {_OPTION0} offerings to various minor deities",
                            "Polishing tarnished {_OPTION1} symbols with a consecrated cloth",
                            "Realigning {_OPTION2} crystals for optimal energy flow",
                            "Dusting miniature statues of {_OPTION3} and spiritual guides",
                            "Replacing burnt-out {_OPTION4} candles with freshly anointed ones",
                            "Whispering a quiet blessing for the apprentice's {_OPTION5}"
                        ],
                        _OPTION0: ["moonpetal flower", "spirit-呼び herb", "mana-infused fruit", "hand-written prayer scroll"],
                        _OPTION1: ["silver ankh", "bronze dragon claw", "carved bone fetish", "crystal star"],
                        _OPTION2: ["focusing", "warding", "dream-enhancing", "meditation-aiding"],
                        _OPTION3: ["Asisha", "the Great Librarian", "ancestral heroes", "patron elementals"],
                        _OPTION4: ["focus", "meditation", "scented offering", "eternity flame (temporarily extinguished)"],
                        _OPTION5: ["clarity", "protection", "inspiration", "peaceful sleep"]
                    },
                    {
                        name: "Resolve roommate disputes magically",
                        skills: ["mentalism", "conflict_resolution", "order_magic", "insight"],
                        intermediates: [
                            "Casting an {_OPTION0} aura of calm over the arguing apprentices",
                            "Using minor {_OPTION1} to understand each student's core grievance",
                            "Suggesting a {_OPTION2} binding agreement for shared resources",
                            "Mediating a discussion about {_OPTION3} schedules or noisy familiars",
                            "Employing a subtle truth-seeking {_OPTION4} if deceptions are suspected",
                            "Guiding them to a mutually agreeable {_OPTION5} written in vanishing ink"
                        ],
                        _OPTION0: ["soothing blue", "empathy-inducing golden", "logical silver", "pacifying green"],
                        _OPTION1: ["telepathy", "empathy projection", "aura reading", "psychometric resonance"],
                        _OPTION2: ["magically enforced", "spiritually sealed", "rune-marked", "mutually beneficial verbal"],
                        _OPTION3: ["potion brewing", "late-night scrying", "ritual component storage", "conflicting study"],
                        _OPTION4: ["charm", "spell", "mental probe", "honesty-compelling incense"],
                        _OPTION5: ["compromise", "understanding", "temporary truce", "magical contract"]
                    },
                    {
                        name: "Reinforce silencing charms on rooms",
                        skills: ["order_magic", "enchanting", "arcane_principles", "abjuration"],
                        intermediates: [
                            "Inspecting the integrity of existing {_OPTION0} glyphs on doorframes",
                            "Carefully re-inscribing faded {_OPTION1} runes for sound absorption",
                            "Channeling {_OPTION2} energy into the charm's matrix",
                            "Testing the silence with a controlled {_OPTION3} shout or musical note",
                            "Adjusting the {_OPTION4} frequency dampening for optimal quiet",
                            "Applying a {_OPTION5} layer of abjuration to prolong the charm's effect"
                        ],
                        _OPTION0: ["sonic dampening", "privacy enhancing", "anti-eavesdropping", "reverberation nullifying"],
                        _OPTION1: ["containment", "absorption", "deflection", "nullification"],
                        _OPTION2: ["stabilizing order", "focused arcane", "pure abjuration", "environmental"],
                        _OPTION3: ["magical", "amplified", "specific frequency", "apprentice-generated"],
                        _OPTION4: ["acoustic", "magical resonance", "vibrational", "perceptual distortion"],
                        _OPTION5: ["protective", "reinforcing", "self-renewing", "interference-blocking"]
                    },
                    {
                        name: "Cleanse nightmare residue",
                        skills: ["death_magic", "life_magic", "oneiromancy", "psychometry"],
                        intermediates: [
                            "Identifying the nature of the {_OPTION0} clinging to the bedposts",
                            "Using a {_OPTION1} focus to absorb the negative oneiric energy",
                            "Channeling {_OPTION2} light to dispel lingering shadows and fear echoes",
                            "Hanging newly woven dreamcatchers threaded with {_OPTION3} fibers",
                            "Burning purifying {_OPTION4} incense known to ward off night terrors",
                            "Reciting a {_OPTION5} cantrip to seal the room against further intrusion"
                        ],
                        _OPTION0: ["psychic slime", "fear pheromone", "shadow essence", "dream-parasite spoor"],
                        _OPTION1: ["black tourmaline wand", "blessed silver mirror", "spirit-bound salt crystal", "life-infused rowan wood"],
                        _OPTION2: ["pure life-force", "positive emotional", "astral cleansing", "sanctified"],
                        _OPTION3: ["moonbeam-soaked silk", "griffin feather", "powdered unicorn horn", "blessed willow"],
                        _OPTION4: ["sage and lavender", "frankincense and myrrh", "dreamwood chips", "powdered silverbell"],
                        _OPTION5: ["gentle oneiric", "powerful abjuration", "ancient guardian", "lullaby-like"]
                    },
                    {
                        name: "Set up dream study circles",
                        skills: ["oneiromancy", "meditation", "magical_lore", "spatial_warping"],
                        intermediates: [
                            "Marking the perimeter of the circle with {_OPTION0} powder",
                            "Arranging enchanted {_OPTION1} cushions for comfort and focus",
                            "Placing a central {_OPTION2} artifact to anchor the shared dreamscape",
                            "Tuning the ambient {_OPTION3} energies to facilitate lucid dreaming",
                            "Applying minor {_OPTION4} distortions to the room's perceived space",
                            "Brewing a pot of {_OPTION5} tea to enhance dream recall and vividness"
                        ],
                        _OPTION0: ["moonstone dust", "silver sand", "crushed dream אמber", "chalk infused with soporific herbs"],
                        _OPTION1: ["meditation", "self-warming", "spirit-soothing", "posture-correcting"],
                        _OPTION2: ["glowing oneiric crystal", "basin of scrying water", "tapestry of the dreamlands", "synchronized metronomes"],
                        _OPTION3: ["psychic resonance", "lunar vibrations", "subtle hypnotic", "theta-wave inducing"],
                        _OPTION4: ["spatial", "temporal", "perceptual", "reality-thinning"],
                        _OPTION5: ["mugwort and blue lotus", "valerian and chamomile", "calea zacatechichi", "memory-enhancing elixir of 'Morpheus' Kiss'"]
                    },
                    {
                        name: "Polish crystal balls for scrying homework",
                        skills: ["magical_item_analysis", "labor", "clairvoyance"],
                        intermediates: [
                            "Using a specially prepared {_OPTION0} cloth to avoid scratches",
                            "Applying a cleaning solution of {_OPTION1} and thrice-distilled water",
                            "Gently removing psychic {_OPTION2} imprints from previous scrying sessions",
                            "Buffing the surface to a {_OPTION3} sheen, enhancing clarity",
                            "Inspecting for minute {_OPTION4} flaws that could distort visions",
                            "Charging the ball with a minor {_OPTION5} attunement spell for the next user"
                        ],
                        _OPTION0: ["silk blessed by an oracle", "dragon-breath treated chamois", "velvet infused with cleansing herbs", "ectoplasm-absorbing microfiber"],
                        _OPTION1: ["moonflower petal essence", "powdered mother-of-pearl", "dew collected under a full moon", "alchemically purified spirit of wine"],
                        _OPTION2: ["emotional residue", "lingering visual echoes", "astral fingerprints", "stray divinatory feedback"],
                        _OPTION3: ["flawless mirror", "cloudless sky", "perfectly still water", "scry-enhancing"],
                        _OPTION4: ["internal fractures", "surface etches", "magical occlusions", "energy dead-spots"],
                        _OPTION5: ["clarity-boosting", "vision-focusing", "interference-dampening", "user-specific resonance"]
                    },
                ],
                training_grounds: [
                    {
                        name: "Collect stray spellbolts and arrows",
                        skills: ["labor", "perception", "ranged_combat", "athletics"],
                        intermediates: [
                            "Scanning the training field for embedded {_OPTION0} projectiles",
                            "Carefully extracting a still-sizzling {_OPTION1} spellbolt from a target dummy",
                            "Sorting reusable arrows by fletching {_OPTION2} and arrowhead type",
                            "Nimbly dodging a delayed-action {_OPTION3} practice spell",
                            "Checking recovered ammunition for lingering {_OPTION4} enchantments",
                            "Returning salvaged projectiles to the appropriate {_OPTION5} bins"
                        ],
                        _OPTION0: ["magical", "mundane", "elemental", "trick"],
                        _OPTION1: ["ice shard", "lightning", "chaos energy", "acidic"],
                        _OPTION2: ["color-coding", "material composition", "enchantment signature", "owner's mark"],
                        _OPTION3: ["ricocheting", "wandering", "exploding (harmlessly)", "illusory"],
                        _OPTION4: ["piercing", "tracking", "returning", "blinding flash"],
                        _OPTION5: ["armory recycling", "elemental spell component", "fletcher's workshop", "deactivation chamber"]
                    },
                    {
                        name: "Repair battle scarred dummies",
                        skills: ["labor", "artisanry", "woodworking"],
                        intermediates: [
                            "Replacing splintered {_OPTION0} limbs with newly carved ones",
                            "Patching holes in {_OPTION1} torsos using sturdy materials",
                            "Hammering out dents in {_OPTION2} armor plates affixed to advanced dummies",
                            "Restuffing humanoid dummies with fresh {_OPTION3} and enchanted straw",
                            "Applying a new coat of {_OPTION4} paint to clearly mark target zones",
                            "Testing the dummy's resilience with a series of {_OPTION5} strikes"
                        ],
                        _OPTION0: ["oak", "ironwood", "magically animated straw", "clockwork practice"],
                        _OPTION1: ["thick leather", "reinforced canvas", "metal-banded wood", "self-healing fabric (partially)"],
                        _OPTION2: ["steel", "iron", "bronze practice", "enchanted alloy"],
                        _OPTION3: ["resilient sawdust", "blessed straw", "padding spells", "shock-absorbing moss"],
                        _OPTION4: ["high-visibility", "damage-indicating", "elemental-resistant", "illusionary 'skin'"],
                        _OPTION5: ["controlled magical", "blunt weapon", "piercing", "calibrated force"]
                    },
                    {
                        name: "Clear the obstacle course debris",
                        skills: ["labor", "athletics", "construction", "stamina"],
                        intermediates: [
                            "Hauling away broken sections of the {_OPTION0} wall",
                            "Shoveling loose {_OPTION1} and rubble from the climbing pits",
                            "Resetting dislodged {_OPTION2} swinging ropes and balance beams",
                            "Checking the structural integrity of the remaining {_OPTION3} platforms",
                            "Navigating the damaged course while performing {_OPTION4} clearing actions",
                            "Using a minor {_OPTION5} spell to levitate heavier pieces of debris"
                        ],
                        _OPTION0: ["wooden palisade", "stone climbing", "magically conjured ice", "rope bridge"],
                        _OPTION1: ["shattered rock", "splintered wood", "ectoplasmic residue", "expended magical charges"],
                        _OPTION2: ["enchanted climbing", "unstable", "fire-scorched", "water-slicked"],
                        _OPTION3: ["elevated", "moving", "illusory", "trap-laden"],
                        _OPTION4: ["agile", "strength-based", "careful", "rapid"],
                        _OPTION5: ["telekinesis", "earth-moving", "strength-enhancing", "localized gust"]
                    },
                    {
                        name: "Rake the sparring pit sand",
                        skills: ["labor", "stamina", "athletics"],
                        intermediates: [
                            "Using a wide, heavy-duty {_OPTION0} rake",
                            "Evening out deep {_OPTION1} and footprints in the sand",
                            "Removing stray {_OPTION2} fragments and discarded bandages",
                            "Creating a perfectly smooth surface for optimal {_OPTION3} and safety",
                            "Working up a considerable sweat under the {_OPTION4} training yard sun",
                            "Admiring the pristine condition of the freshly groomed {_OPTION5} arena"
                        ],
                        _OPTION0: ["iron", "enchanted wooden", "self-guiding", "dwarven-forged"],
                        _OPTION1: ["impact craters from spells", "weapon gouges", "dive rolls", "summoned creature"],
                        _OPTION2: ["broken weapon", "lost teeth", "expended rune stones", "small, mischievous sprites"],
                        _OPTION3: ["footing", "spellcasting", "dueling maneuvers", "ritual practice"],
                        _OPTION4: ["magically amplified", "ever-present twilight", "filtered", "unrelenting desert-like"],
                        _OPTION5: ["dueling", "sparring", "elemental practice", "grand melee"]
                    },
                    {
                        name: "Store practice wands and weapons",
                        skills: ["labor", "melee_combat", "enchanting", "logistics"],
                        intermediates: [
                            "Checking wands for any residual {_OPTION0} charges before racking them",
                            "Wiping down {_OPTION1} sword hilts and staff grips",
                            "Organizing items on designated {_OPTION2} racks by type and power level",
                            "Ensuring safety catches are engaged on {_OPTION3} practice crossbows",
                            "Applying a light {_OPTION4} oil to prevent rust on metal components",
                            "Updating the armory's {_OPTION5} inventory scrolls"
                        ],
                        _OPTION0: ["unstable magical", "wild elemental", "lingering necromantic", "unexpectedly potent"],
                        _OPTION1: ["sweat-slicked", "slightly singed", "residue-covered", "sticky potion-coated"],
                        _OPTION2: ["wand", "blade", "staff", "shield and armor"],
                        _OPTION3: ["blunted bolt", "training mechanism", "non-lethal enchantment", "apprentice-grade magical"],
                        _OPTION4: ["preservation", "enchantment-stabilizing", "anti-corrosion", "self-polishing alchemical"],
                        _OPTION5: ["digital (magical slate)", "parchment", "rune-carved", "living wood"]
                    },
                    {
                        name: "Mend torn padded armor",
                        skills: ["leatherworking", "tailoring", "armor", "artisanry"],
                        intermediates: [
                            "Selecting heavy-duty {_OPTION0} thread or sinew",
                            "Stitching up rips in the {_OPTION1} gambeson padding",
                            "Replacing worn-out {_OPTION2} buckles and straps",
                            "Reinforcing weak points with patches of {_OPTION3} or enchanted fabric",
                            "Checking the fit and articulation on a {_OPTION4} training dummy",
                            "Applying a {_OPTION5} conditioner to keep the leather supple"
                        ],
                        _OPTION0: ["dragon gut", "iron-spun flax", "shadoweave silk", "phoenix feather core"],
                        _OPTION1: ["multi-layered linen", "cured beast hide", "spell-resistant canvas", "impact-absorbing gel"],
                        _OPTION2: ["bronze", "hardened leather", "self-adjusting magical", "quick-release"],
                        _OPTION3: ["boiled leather", "small steel plates", "dragon scale fragments", "rune-inscribed linen"],
                        _OPTION4: ["articulated wooden", "standard human-sized", "golem", "slightly damaged"],
                        _OPTION5: ["waterproofing", "flexibility-enhancing alchemical", "durability-boosting magical", "scent-masking herbal"]
                    },
                    {
                        name: "Resurface scorch marks from fireballs",
                        skills: ["labor", "geomancy", "pyromancy", "masonry"],
                        intermediates: [
                            "Scraping away blackened and charred {_OPTION0} from walls and floors",
                            "Applying a {_OPTION1} paste to neutralize lingering heat and magic",
                            "Using minor geomancy to smooth over melted {_OPTION2} surfaces",
                            "Patching damaged areas with fresh {_OPTION3} or magically grown stone",
                            "Applying a new layer of fire-resistant {_OPTION4} coating",
                            "Quietly muttering about the {_OPTION5} of some apprentices"
                        ],
                        _OPTION0: ["stone", "wood", "target material", "unfortunate tapestries"],
                        _OPTION1: ["soot-absorbing alchemical", "heat-dispersing magical", "magic-dampening clay", "cooling elemental"],
                        _OPTION2: ["flagstone", "brickwork", "enchanted target", "practice dummy stands"],
                        _OPTION3: ["mortar", "stone dust and resin", "conjured earth", "rapid-growth crystal"],
                        _OPTION4: ["alchemical glaze", "elemental warding", "rune-etched sealant", "salamander scale powder"],
                        _OPTION5: ["reckless abandon", "enthusiasm over control", "sheer destructive power", "aiming skills"]
                    },
                    {
                        name: "Sweep up broken target shards",
                        skills: ["labor", "cleaning"],
                        intermediates: [
                            "Using a stiff-bristled {_OPTION0} broom designed for heavy debris",
                            "Carefully collecting sharp {_OPTION1} fragments from shattered targets",
                            "Avoiding stepping on nearly invisible splinters of {_OPTION2} crystal targets",
                            "Depositing shards into a specially reinforced {_OPTION3} disposal unit",
                            "Checking for shards embedded in nearby {_OPTION4} or training equipment",
                            "Wondering what kind of {_OPTION5} was used to cause such fragmentation"
                        ],
                        _OPTION0: ["ironwood", "magically enhanced", "self-levitating dustpan holding", "golem-operated"],
                        _OPTION1: ["ceramic", "hardened wood", "compressed sand", "petrified bone"],
                        _OPTION2: ["enchanted ice", "pure quartz", "force-field remnant", "glass"],
                        _OPTION3: ["lead-lined", "thick dragonhide", "magically shielded", "recycling elemental forge"],
                        _OPTION4: ["protective barriers", "viewing stands", "other dummies", "the ceiling somehow"],
                        _OPTION5: ["destructive spell", "high-impact projectile", "sonic vibration", "critical magical failure"]
                    },
                    {
                        name: "Polish training shields",
                        skills: ["labor", "defense", "smithing", "armor"],
                        intermediates: [
                            "Wiping away layers of grime, sweat, and {_OPTION0} marks",
                            "Using a fine grade {_OPTION1} polish on steel and iron shields",
                            "Buffing wooden shields with {_OPTION2} oil to a protective sheen",
                            "Checking and tightening loose {_OPTION3} straps and handles",
                            "Admiring the restored gleam on a shield's {_OPTION4} boss or emblem",
                            "Applying a minor {_OPTION5} enchantment to enhance durability or deflection"
                        ],
                        _OPTION0: ["scuff", "impact dent", "spell scorch", "practice weapon residue"],
                        _OPTION1: ["abrasive powder", "alchemical shining", "rust-removing", "self-buffing magical"],
                        _OPTION2: ["linseed and beeswax", "tung oil infused with ironwood sap", "enchanted hardening", "strengthening resin"],
                        _OPTION3: ["leather arm", "reinforced carrying", "buckler grip", "magically adjusting"],
                        _OPTION4: ["central metal", "house sigil", "warding rune", "reflective surface"],
                        _OPTION5: ["hardening", "impact-absorbing", "arrow-deflecting aura", "minor self-repair"]
                    },
                    {
                        name: "Re-chalk combat circles",
                        skills: ["labor", "magical_lore", "runes", "artistry"],
                        intermediates: [
                            "Sweeping away the faded remnants of old {_OPTION0} lines",
                            "Consulting ancient diagrams for the precise placement of {_OPTION1} symbols",
                            "Using a {_OPTION2} guide to ensure perfectly straight lines and arcs",
                            "Carefully drawing complex {_OPTION3} runes at key focal points of the circle",
                            "Ensuring the entire circle is geometrically {_OPTION4} and magically sound",
                            "Applying a {_OPTION5} fixative spray to make the chalk last longer"
                        ],
                        _OPTION0: ["ritual chalk", "magically charged dust", "faintly glowing", "scuffed and broken"],
                        _OPTION1: ["containment", "warding", "power amplification", "elemental attunement"],
                        _OPTION2: ["long enchanted ruler", "taut string and plumb-bob", "laser-like magical beam", "trained chalk-drawing mite"],
                        _OPTION3: ["binding", "channeling", "protective", "dimensional anchoring"],
                        _OPTION4: ["symmetrical", "aligned with ley lines", "energetically balanced", "spiritually sealed"],
                        _OPTION5: ["magical resin", "weather-resistant alchemical", "long-lasting enchantment", "glow-enhancing phosphorescent"]
                    },
                    {
                        name: "Reset magical ward traps",
                        skills: ["order_magic", "trap_handling", "magical_lore", "abjuration"],
                        intermediates: [
                            "Carefully disarming the triggered {_OPTION0} ward to prevent accidental discharge",
                            "Inspecting the {_OPTION1} components for any signs of damage or depletion",
                            "Realigning the {_OPTION2} focus crystals or runic conduits",
                            "Recharging the ward with a fresh infusion of {_OPTION3} energy",
                            "Cautiously testing the reset trap using a {_OPTION4} probe or summoned creature",
                            "Adjusting the {_OPTION5} trigger sensitivity to approved guild standards"
                        ],
                        _OPTION0: ["elemental burst", "stasis field", "alarm summoning", "minor banishment"],
                        _OPTION1: ["rune-stone matrix", "power crystal capacitor", "arcane sigil sequence", "trigger mechanism sensors"],
                        _OPTION2: ["energy flow", "targeting array", "detection grid", "amplification lens"],
                        _OPTION3: ["ambient magical", "stored spell", "elemental essence", "pure order"],
                        _OPTION4: ["long wooden", "magically animated", "disposable summoned", "remote-controlled mechanical"],
                        _OPTION5: ["magical signature recognition", "physical pressure plate", "proximity sensor range", "specific vocal command"]
                    },
                    {
                        name: "Maintain elemental summoning circles",
                        skills: ["elemental_summoning", "magical_lore", "runes", "geomancy"],
                        intermediates: [
                            "Clearing away residual {_OPTION0} energy and physical manifestations",
                            "Re-etching or repainting faded {_OPTION1} of binding and protection",
                            "Reinforcing the circle's boundary with ritually prepared {_OPTION2} materials",
                            "Checking for any breaches or weaknesses in the {_OPTION3} containment field",
                            "Placing fresh, appropriate offerings to appease specific {_OPTION4} entities",
                            "Recalibrating the circle's {_OPTION5} resonance for safer summoning"
                        ],
                        _OPTION0: ["lingering elemental", "chaotic feedback", "ectoplasmic", "dimensional stress"],
                        _OPTION1: ["powerful runes", "complex sigils", "ancient glyphs", "celestial alignments"],
                        _OPTION2: ["consecrated salt for earth elementals", "purified water for water spirits", "iron filings for fire sprites", "magnetized sand for air sylphs"],
                        _OPTION3: ["magical energy", "physical barrier", "dimensional anchor", "psychic ward"],
                        _OPTION4: ["salamanders", "undines", "gnomes", "djinn"],
                        _OPTION5: ["harmonic frequency", "elemental attunement", "dimensional stability", "power regulation"]
                    },
                    {
                        name: "Sharpen ceremonial blades",
                        skills: ["smithing", "one_handed_blades"],
                        intermediates: [
                            "Selecting the correct grit of {_OPTION0} whetstone for the blade's alloy",
                            "Carefully drawing the blade across the stone maintaining a precise {_OPTION1}",
                            "Testing the edge for {_OPTION2} sharpness suitable for ritual, not combat",
                            "Polishing the blade to a mirror shine with a {_OPTION3} cloth",
                            "Anointing the blade with consecrated {_OPTION4} oil as per tradition",
                            "Inspecting the intricate {_OPTION5} etched into the blade for wear"
                        ],
                        _OPTION0: ["water-cooled", "diamond-dust infused", "spirit-bound sharpening", "volcanic glass"],
                        _OPTION1: ["angle of incidence", "consistent pressure", "rhythmic motion", "arcane alignment"],
                        _OPTION2: ["symbolic", "aura-cutting", "energy-channeling", "perfectly keen"],
                        _OPTION3: ["blessed silk", "fine chamois leather", "enchanted velvet", "cloth of star-stuff"],
                        _OPTION4: ["moon-blessed olive", "ritualistically pure", "elementally charged", "dragon's blood (synthetic)"],
                        _OPTION5: ["ancient power runes", "celestial script", "protective glyphs", "lineage symbols"]
                    },
                    {
                        name: "Restring broken longbows",
                        skills: ["archery", "woodworking", "artisanry"],
                        intermediates: [
                            "Thoroughly inspecting the bow stave for any {_OPTION0} cracks or weaknesses",
                            "Selecting a new bowstring made of high-quality {_OPTION1} material",
                            "Using a bow stringer tool to carefully flex the {_OPTION2} limbs",
                            "Securely setting the new string into the {_OPTION3} nocks at each end",
                            "Checking the bow's {_OPTION4} height and ensuring proper tillering",
                            "Applying a coat of protective {_OPTION5} wax to the new string"
                        ],
                        _OPTION0: ["stress-induced", "impact-related", "magical energy surge", "hidden wood-grain"],
                        _OPTION1: ["dragon sinew", "elf-spun moonflax", "enchanted spider silk", "phoenix feather core"],
                        _OPTION2: ["yew wood", "ash heartwood", "composite horn and wood", "magically reinforced living wood"],
                        _OPTION3: ["carved horn", "reinforced wood", "mithril-tipped", "self-adjusting magical"],
                        _OPTION4: ["brace", "draw weight consistency", "limb balance", "string alignment"],
                        _OPTION5: ["beeswax and pine resin", "dragon's tear", "elemental-infused", "friction-reducing alchemical"]
                    },
                    {
                        name: "Re-balance throwing axes",
                        skills: ["throwing_weapons", "smithing", "legerdemain", "artisanry"],
                        intermediates: [
                            "Checking the {_OPTION0} for any warping or damage affecting flight",
                            "Subtly adjusting the weight distribution of the {_OPTION1} axe head",
                            "Testing the axe's spin and trajectory with a series of practice {_OPTION2}",
                            "Carefully reshaping the {_OPTION3} edge for optimal aerodynamics and impact",
                            "Tightening or replacing the {_OPTION4} haft binding for a secure grip",
                            "Adding or removing a small {_OPTION5} counterweight in the pommel if necessary"
                        ],
                        _OPTION0: ["wooden haft integrity", "axe head alignment", "overall structural balance", "magical flight enchantments"],
                        _OPTION1: ["forged steel", "razor-sharp iron", "enchanted adamantine", "double-bitted throwing"],
                        _OPTION2: ["throws at varying distances", "rotation counts", "target penetration tests", "aerial maneuvers"],
                        _OPTION3: ["leading cutting", "bearded lower", "aerodynamic trailing", "spell-channeling"],
                        _OPTION4: ["braided leather", "sinew-wrapped wire", "magically infused cord", "rune-carved grip"],
                        _OPTION5: ["lead plug", "brass stud", "dense ironwood insert", "enchanted gemstone"]
                    }
                ],
                scrying_chamber: [
                    {
                        name: "Polish scrying orbs and mirrors",
                        skills: ["labor", "divination", "magical_item_analysis", "artisanry"],
                        intermediates: [
                            "Selecting a {_OPTION0} polishing cloth",
                            "Applying a dab of {_OPTION1} solution to the orb's surface",
                            "Buffing out smudges from the {_OPTION2}",
                            "Whispering a {_OPTION3} clarification chant over the mirror",
                            "Checking for {_OPTION4} residue under a magelight",
                            "Carefully returning the {_OPTION5} orb to its velvet cushion"
                        ],
                        _OPTION0: ["silk", "chamois", "ectoplasmic", "moon-woven"],
                        _OPTION1: ["crystal sheen", "purified dew", "sphinx saliva", "powdered moonstone"],
                        _OPTION2: ["previous vision's imprint", "fingerprints of a nervous apprentice", "accumulated astral dust", "lingering emotional echoes"],
                        _OPTION3: ["gentle", "focusing", "minor", "repeated"],
                        _OPTION4: ["ethereal", "psychic", "unwanted spectral", "faint magical"],
                        _OPTION5: ["primary", "lesser-used", "obsidian", "newly acquired"]
                    },
                    {
                        name: "Cleanse divination pools of visions",
                        skills: ["divination", "hydromancy", "abjuration", "psychometry"],
                        intermediates: [
                            "Donning {_OPTION0} protective gloves",
                            "Pouring a vial of {_OPTION1} into the murky water",
                            "Stirring the pool with a {_OPTION2} rod",
                            "Chanting an {_OPTION3} to dispel lingering images",
                            "Skimming {_OPTION4} remnants from the surface",
                            "Feeling the water for any remaining {_OPTION5} disturbances"
                        ],
                        _OPTION0: ["thick rubber", "enchanted silk", "dragonhide", "lead-lined"],
                        _OPTION1: ["purifying salts", "solution of silvered water", "essence of clarity", "void-touched liquid"],
                        _OPTION2: ["silver", "obsidian", "coral", "crystal"],
                        _OPTION3: ["abjuration", "cleansing verse", "banishment incantation", "nullification psalm"],
                        _OPTION4: ["spectral", "fading visionary", "ectoplasmic", "dream-like"],
                        _OPTION5: ["psychic", "emotional", "temporal", "spatial"]
                    },
                    {
                        name: "Realign focusing crystals",
                        skills: ["divination", "lapidary_arts", "magical_item_analysis", "geomancy"],
                        intermediates: [
                            "Consulting the {_OPTION0} alignment chart",
                            "Gently nudging the {_OPTION1} crystal with a gloved finger",
                            "Checking the beam's trajectory against the {_OPTION2} marker",
                            "Making micro-adjustments using a {_OPTION3} tool",
                            "Humming a {_OPTION4} attunement frequency",
                            "Locking the crystal into its new {_OPTION5} position"
                        ],
                        _OPTION0: ["celestial", "geomantic", "master", "daily"],
                        _OPTION1: ["primary focusing", "secondary amplification", "quartz", "amethyst"],
                        _OPTION2: ["rune-etched", "celestially-aligned", "floor-inscribed", "spirit-lamp"],
                        _OPTION3: ["silver tweezer", "mithril spanner", "enchanted stylus", "sonic screwdriver"],
                        _OPTION4: ["resonant", "harmonic", "stabilizing", "clarifying"],
                        _OPTION5: ["precise", "optimal", "designated", "harmonically sound"]
                    },
                    {
                        name: "Dust ritual circles and sigils",
                        skills: ["labor", "magical_lore", "runes", "meditation"],
                        intermediates: [
                            "Selecting a brush made of {_OPTION0} bristles",
                            "Carefully sweeping dust away from the {_OPTION1} sigil",
                            "Avoiding disturbing the {_OPTION2} chalk lines",
                            "Reciting a {_OPTION3} mantra to maintain focus",
                            "Disposing of the {_OPTION4} dust in a warded container",
                            "Checking the integrity of the {_OPTION5} rune"
                        ],
                        _OPTION0: ["griffin feather", "manticore hair", "enchanted goat", "shadow-woven"],
                        _OPTION1: ["warding", "summoning", "protection", "enhancement"],
                        _OPTION2: ["consecrated", "salt", "powdered silver", "moon-dust"],
                        _OPTION3: ["cleansing", "protective", "focusing", "grounding"],
                        _OPTION4: ["ritually charged", "mundane", "spiritually inert", "potentially hazardous"],
                        _OPTION5: ["central power", "binding", "directional", "elemental"]
                    },
                    {
                        name: "Organize astrological charts",
                        skills: ["divination", "navigation", "memory", "cartography"],
                        intermediates: [
                            "Gathering scattered {_OPTION0} charts from the table",
                            "Sorting them by {_OPTION1} or constellation",
                            "Cross-referencing with the {_OPTION2} ephemeris",
                            "Rolling up the {_OPTION3} parchments carefully",
                            "Placing them into their designated {_OPTION4} tubes",
                            "Updating the {_OPTION5} index of stellar movements"
                        ],
                        _OPTION0: ["star", "planetary", "cometary", "lunar phase"],
                        _OPTION1: ["celestial house", "zodiac sign", "date of observation", "planetary alignment"],
                        _OPTION2: ["Grand Celestial", "pocket", "ancient stone", "oracle's"],
                        _OPTION3: ["oversized", "vellum", "papyrus", "recently inked"],
                        _OPTION4: ["labeled", "mahogany", "obsidian", "lead-lined"],
                        _OPTION5: ["master", "current", "prophetic", "historical"]
                    },
                    {
                        name: "Sweep away psychic residue",
                        skills: ["labor", "meditation", "psychometry"],
                        intermediates: [
                            "Centering oneself with a {_OPTION0} breathing technique",
                            "Donning a {_OPTION1} amulet for protection",
                            "Using a {_OPTION2} broom to gather unseen energies",
                            "Focusing on dispelling {_OPTION3} emotional imprints",
                            "Directing the residue towards a {_OPTION4} containment crystal",
                            "Sealing the crystal with a {_OPTION5} ward"
                        ],
                        _OPTION0: ["deep", "calming", "rhythmic", "Tower-taught"],
                        _OPTION1: ["mind-shielding", "thought-nullifying", "emotion-dampening", "spirit-warding"],
                        _OPTION2: ["silver-birch", "enchanted", "spirit-bound", "rune-carved"],
                        _OPTION3: ["fearful", "joyful", "sorrowful", "conflicting"],
                        _OPTION4: ["smoky quartz", "obsidian shard", "lead-lined", "soul-gem"],
                        _OPTION5: ["binding", "containment", "temporary", "permanent"]
                    },
                    {
                        name: "Replace spent incense and candles",
                        skills: ["labor", "alchemy", "magical_lore"],
                        intermediates: [
                            "Collecting burnt-out {_OPTION0} candle stubs",
                            "Emptying {_OPTION1} ash from the censers",
                            "Selecting new {_OPTION2} incense sticks from the apothecary",
                            "Placing fresh {_OPTION3} candles in their holders",
                            "Choosing a scent appropriate for upcoming {_OPTION4} divinations",
                            "Disposing of old materials in the {_OPTION5} ritual fire"
                        ],
                        _OPTION0: ["beeswax", "tallow", "astral-infused", "prophetic dream"],
                        _OPTION1: ["sacred", "ritual", "common", "enchanted"],
                        _OPTION2: ["dragon's blood", "sandalwood", "frankincense", "moonpetal"],
                        _OPTION3: ["unscented white", "colored elemental", "rune-scribed", "herb-infused"],
                        _OPTION4: ["scrying", "astral projection", "spirit communion", "chronomancy"],
                        _OPTION5: ["sacred", "cleansing", "alchemical", "ever-burning"]
                    },
                    {
                        name: "Attune divinatory instruments",
                        skills: ["divination", "enchanting", "musical_instruments", "implement_crafting"],
                        intermediates: [
                            "Picking up the {_OPTION0} pendulum",
                            "Humming a resonant frequency to align its {_OPTION1}",
                            "Gently striking the {_OPTION2} singing bowl",
                            "Adjusting the tension on the strings of the {_OPTION3} astral harp",
                            "Verifying the calibration with a known {_OPTION4} magical signature",
                            "Polishing the {_OPTION5} with a soft, enchanted cloth"
                        ],
                        _OPTION0: ["crystal", "brass", "silver", "bone"],
                        _OPTION1: ["spiritual anchor", "etheric connection", "vibrational matrix", "energy flow"],
                        _OPTION2: ["Tibetan", "quartz", "celestial bronze", "mithril"],
                        _OPTION3: ["ethereal", "moon-strung", "wind-chiming", "spirit-calling"],
                        _OPTION4: ["ley line", "artifact's aura", "master's energy", "celestial event's"],
                        _OPTION5: ["instrument's surface", "focusing lens", "resonating chamber", "control knobs"]
                    },
                    {
                        name: "Silence distracting astral echoes",
                        skills: ["order_magic", "meditation", "spectral_mastery", "spatial_warping"],
                        intermediates: [
                            "Identifying the source of the {_OPTION0} echo",
                            "Drawing a {_OPTION1} silencing rune on the air",
                            "Focusing {_OPTION2} magic to dampen the vibrations",
                            "Erecting a temporary {_OPTION3} barrier",
                            "Guiding the echo into a prepared {_OPTION4} null-space",
                            "Reinforcing the chamber's {_OPTION5} wards"
                        ],
                        _OPTION0: ["faint whispering", "distant screaming", "clanging metal", "unsettling melodic"],
                        _OPTION1: ["Hush", "Stillness", "Void", "Tranquility"],
                        _OPTION2: ["Order", "mental", "abjurative", "dimensional"],
                        _OPTION3: ["sonic", "ethereal", "psychic", "temporal"],
                        _OPTION4: ["pocket dimension", "soul gem", "warded box", "lead-lined urn"],
                        _OPTION5: ["acoustic", "psychic", "dimensional", "spiritual"]
                    },
                    {
                        name: "Clear energetic blockages",
                        skills: ["life_magic", "terramancy", "meditation", "psychometry"],
                        intermediates: [
                            "Sensing the flow of {_OPTION0} energy in the room",
                            "Identifying a point of {_OPTION1} stagnation",
                            "Channeling {_OPTION2} magic to dissolve the blockage",
                            "Using a {_OPTION3} crystal to draw out negative energies",
                            "Visualizing the energy pathways becoming {_OPTION4}",
                            "Grounding excess energy into the {_OPTION5} earth"
                        ],
                        _OPTION0: ["ambient magical", "ley line", "spiritual", "elemental"],
                        _OPTION1: ["spiritual", "emotional", "magical", "elemental"],
                        _OPTION2: ["Life", "cleansing", "restorative", "pure"],
                        _OPTION3: ["quartz", "selenite", "tourmaline", "amber"],
                        _OPTION4: ["clear and flowing", "bright and vibrant", "unobstructed", "harmonized"],
                        _OPTION5: ["Tower's foundation", "nearby ley line", "sacrificial altar", "consecrated"]
                    },
                    {
                        name: "Chart ley line convergences",
                        skills: ["divination", "terramancy", "geomancy", "cartography"],
                        intermediates: [
                            "Setting up the {_OPTION0} dowsing rods",
                            "Tracing the path of a {_OPTION1} ley line across the map",
                            "Marking a point of {_OPTION2} convergence with a pin",
                            "Calculating the {_OPTION3} intensity of the nexus",
                            "Noting any temporal or dimensional {_OPTION4} fluctuations",
                            "Adding the new data to the {_OPTION5} survey"
                        ],
                        _OPTION0: ["enchanted copper", "hazelwood", "silver-tipped", "crystal-handled"],
                        _OPTION1: ["major dragon", "minor elemental", "newly discovered", "shifting lunar"],
                        _OPTION2: ["powerful", "subtle", "triple", "unstable"],
                        _OPTION3: ["geomantic", "thaumaturgic", "spiritual", "elemental"],
                        _OPTION4: ["distortions", "anomalies", "resonances", "instabilities"],
                        _OPTION5: ["regional ley line", "Tower's energy", "continental geomantic", "master"]
                    },
                    {
                        name: "Calibrate chronomantic resonators",
                        skills: ["divination", "order_magic", "clockwork"],
                        intermediates: [
                            "Checking the {_OPTION0} gears of the resonator",
                            "Adjusting the {_OPTION1} frequency with a tuning fork",
                            "Observing the temporal distortions on a {_OPTION2} indicator",
                            "Fine-tuning the {_OPTION3} flow regulators",
                            "Synchronizing with the {_OPTION4} master clock",
                            "Locking the settings with a pulse of {_OPTION5} magic"
                        ],
                        _OPTION0: ["brass", "crystal", "obsidian", "temporal"],
                        _OPTION1: ["temporal", "harmonic", "sub-etheric", "chroniton"],
                        _OPTION2: ["flickering candle", "sandglass", "chronometer", "test subject's perception of time"],
                        _OPTION3: ["chroniton", "mana", "aetheric", "temporal energy"],
                        _OPTION4: ["Tower's", "celestial", "atomic", "magical"],
                        _OPTION5: ["Order", "stabilizing", "binding", "precise"]
                    },
                    {
                        name: "Interpret omens from burnt offerings",
                        skills: ["divination", "pyromancy", "mythology", "precognition"],
                        intermediates: [
                            "Sifting through the {_OPTION0} ashes in the brazier",
                            "Examining the patterns formed by the {_OPTION1} smoke stains",
                            "Looking for {_OPTION2} shapes in the remaining cinders",
                            "Consulting the {_OPTION3} tome of pyromantic symbols",
                            "Feeling for {_OPTION4} echoes of the future",
                            "Scribing the {_OPTION5} interpretation onto a scroll"
                        ],
                        _OPTION0: ["sacrificial herb", "blessed wood", "animal bone", "written plea"],
                        _OPTION1: ["soot", "charred residue", "grease", "vapor"],
                        _OPTION2: ["prophetic", "warning", "animalistic", "runic"],
                        _OPTION3: ["ancient", "forbidden", "master's personal", "Guild-standard"],
                        _OPTION4: ["faint", "strong", "disturbing", "hopeful"],
                        _OPTION5: ["cryptic", "direct", "multi-layered", "urgent"]
                    },
                    {
                        name: "Record prophetic dream sequences",
                        skills: ["oneiromancy", "divination", "scribing", "memory"],
                        intermediates: [
                            "Awakening from a {_OPTION0} dream trance",
                            "Quickly grabbing a {_OPTION1} quill and parchment",
                            "Sketching the key {_OPTION2} symbols before they fade",
                            "Writing down the narrative of the {_OPTION3} vision",
                            "Cross-referencing with the {_OPTION4} dream lexicon",
                            "Filing the record in the {_OPTION5} archive"
                        ],
                        _OPTION0: ["vivid", "fragmented", "recurring", "lucid"],
                        _OPTION1: ["never-blot", "eagle feather", "somnus-infused", "memory-enhancing"],
                        _OPTION2: ["oneiric", "allegorical", "color", "emotional"],
                        _OPTION3: ["nightmarish", "beatific", "confusing", "clear"],
                        _OPTION4: ["Grand", "Tower's", "forbidden", "personal"],
                        _OPTION5: ["Oneiric", "Prophecy", "Seer's", "restricted"]
                    },
                    {
                        name: "Cleanse chamber of lingering scrying entities",
                        skills: ["abjuration", "spectral_mastery", "elemental_summoning"],
                        intermediates: [
                            "Detecting the presence of a {_OPTION0} entity",
                            "Drawing a circle of {_OPTION1} salt around the affected area",
                            "Chanting a {_OPTION2} banishment incantation",
                            "Using a {_OPTION3} consecrated object to repel the entity",
                            "Opening a temporary portal to the {_OPTION4} plane",
                            "Sealing the chamber with {_OPTION5} wards"
                        ],
                        _OPTION0: ["curious astral", "minor elemental", "lost spiritual", "residual thought-form"],
                        _OPTION1: ["blessed", "black", "iron-infused", "rune-scribed"],
                        _OPTION2: ["powerful", "minor", "specific", "general"],
                        _OPTION3: ["holy symbol", "silver mirror", "bell", "athame"],
                        _OPTION4: ["entity's native", "elemental", "astral", "Void"],
                        _OPTION5: ["protective", "reinforced", "anti-spectral", "long-lasting"]
                    }
                ],
                herb_garden: [
                    {
                        name: "Weed the mandrake patch",
                        skills: ["labor", "nature_magic", "foraging", "monster_lore"],
                        intermediates: [
                            "Putting on {_OPTION0} earmuffs",
                            "Carefully pulling out a {_OPTION1} strangler vine",
                            "Avoiding the mandrakes' {_OPTION2} shrieks",
                            "Applying a {_OPTION3} herbal salve to minor scratches",
                            "Tossing the weeds onto the {_OPTION4} compost pile",
                            "Checking the mandrakes for signs of {_OPTION5} stress"
                        ],
                        _OPTION0: ["thick", "sound-dampening", "enchanted", "wax-filled"],
                        _OPTION1: ["thorny", "constricting", "parasitic", "mundane but stubborn"],
                        _OPTION2: ["deafening", "hypnotic", "infant-like", "soul-chilling"],
                        _OPTION3: ["soothing", "healing", "anti-toxin", "regenerative"],
                        _OPTION4: ["alchemical", "specially designated", "cursed", "regular garden"],
                        _OPTION5: ["wilting", "discoloration", "unusual silence", "aggressive root growth"]
                    },
                    {
                        name: "Prune overgrown moonpetal bushes",
                        skills: ["labor", "nature_magic", "farming", "artisanry"],
                        intermediates: [
                            "Selecting a pair of {_OPTION0} pruning shears",
                            "Waiting for the {_OPTION1} moon to be in the correct phase",
                            "Trimming away excess {_OPTION2} foliage",
                            "Shaping the bush into a more {_OPTION3} form",
                            "Collecting the {_OPTION4} cuttings for potion ingredients",
                            "Applying a {_OPTION5} sealant to the cuts"
                        ],
                        _OPTION0: ["silver", "obsidian-edged", "self-sharpening", "enchanted"],
                        _OPTION1: ["full", "crescent", "new", "harvest"],
                        _OPTION2: ["luminous", "shadowy", "thorny", "non-blooming"],
                        _OPTION3: ["manageable", "aesthetically pleasing", "magically conducive", "compact"],
                        _OPTION4: ["glowing", "potent", "young", "silver-dusted"],
                        _OPTION5: ["tree-sap", "alchemical", "protective magical", "moon-blessed"]
                    },
                    {
                        name: "Turn the alchemical compost heap",
                        skills: ["labor", "alchemy", "farming", "stamina"],
                        intermediates: [
                            "Donning a {_OPTION0} breathing mask against the fumes",
                            "Grabbing a {_OPTION1} pitchfork",
                            "Heaving a pile of {_OPTION2} decomposing matter",
                            "Mixing in a fresh batch of {_OPTION3} catalyst",
                            "Checking the heap's internal {_OPTION4} temperature",
                            "Feeling the {_OPTION5} surge of magical energy from the compost"
                        ],
                        _OPTION0: ["sturdy leather", "filter-enchanted", "herb-stuffed", "simple cloth"],
                        _OPTION1: ["rune-etched", "titanium", "strangely warm", "standard iron"],
                        _OPTION2: ["bubbling", "glowing", "strangely scented", "fuming"],
                        _OPTION3: ["powdered dragon scale", "phoenix ash", "ground unicorn horn", "yeast of quickening"],
                        _OPTION4: ["magical", "elemental", "alchemical", "biological"],
                        _OPTION5: ["subtle", "powerful", "life-giving", "transformative"]
                    },
                    {
                        name: "Organize enchanted gardening tools",
                        skills: ["labor", "nature_magic", "enchanting", "implement_crafting"],
                        intermediates: [
                            "Gathering all the {_OPTION0} tools from the shed",
                            "Wiping down the {_OPTION1} self-watering can",
                            "Checking the enchantments on the {_OPTION2} ever-sharp hoe",
                            "Hanging the tools on their designated {_OPTION3} hooks",
                            "Recharging a {_OPTION4} lumina-stone on the trowel",
                            "Labeling a new {_OPTION5} dibber with its properties"
                        ],
                        _OPTION0: ["scattered", "muddy", "slightly sparking", "humming"],
                        _OPTION1: ["copper", "silver", "clay", "crystal"],
                        _OPTION2: ["mithril", "adamantine", "obsidian", "bronze"],
                        _OPTION3: ["rune-marked", "magnetized", "specially crafted", "color-coded"],
                        _OPTION4: ["fading", "dimly glowing", "newly acquired", "erratically pulsing"],
                        _OPTION5: ["growth-enhancing", "soil-aerating", "pest-repelling", "seed-finding"]
                    },
                    {
                        name: "Harvest ripe nightbloom petals",
                        skills: ["labor", "foraging", "alchemy", "perception"],
                        intermediates: [
                            "Waiting for true {_OPTION0} to fall",
                            "Using a pair of {_OPTION1} tweezers to gently pluck petals",
                            "Avoiding the plant's {_OPTION2} soporific pollen",
                            "Collecting petals that shimmer with a {_OPTION3} light",
                            "Placing them into a {_OPTION4} silk-lined basket",
                            "Noticing the {_OPTION5} shift in the air as the petals are picked"
                        ],
                        _OPTION0: ["darkness", "midnight", "moonless night", "magical twilight"],
                        _OPTION1: ["silver", "ivory", "obsidian", "non-reactive"],
                        _OPTION2: ["potent", "subtle", "dream-inducing", "paralytic"],
                        _OPTION3: ["faint blue", "phosphorescent green", "deep violet", "star-like"],
                        _OPTION4: ["dark", "shadow-woven", "lead-lined", "preserving"],
                        _OPTION5: ["faint sighing", "temperature", "aromatic", "magical energy"]
                    },
                    {
                        name: "Clear dead and wilting foliage",
                        skills: ["labor", "farming", "nature_magic"],
                        intermediates: [
                            "Identifying plants with {_OPTION0} leaves",
                            "Snipping off {_OPTION1} branches with shears",
                            "Raking up piles of {_OPTION2} detritus",
                            "Checking for signs of {_OPTION3} blight or magical decay",
                            "Applying a {_OPTION4} restorative balm to affected stems",
                            "Carrying the refuse to the {_OPTION5} disposal pit"
                        ],
                        _OPTION0: ["brown and crispy", "yellowed", "blackened", "strangely drained"],
                        _OPTION1: ["dead", "diseased", "parasite-ridden", "energy-sapped"],
                        _OPTION2: ["dry", "mulchy", "slightly glowing", "unnaturally cold"],
                        _OPTION3: ["fungal", "insectoid", "elemental", "necrotic"],
                        _OPTION4: ["Nature Magic infused", "alchemical", "life-giving", "purifying"],
                        _OPTION5: ["consecrated", "alchemical", "ever-burning", "far-garden"]
                    },
                    {
                        name: "Enrich soil with dragon dung",
                        skills: ["labor", "farming", "beast_mastery", "alchemy"],
                        intermediates: [
                            "Wearing {_OPTION0} reinforced gloves and apron",
                            "Scooping {_OPTION1} dragon dung from the warded barrel",
                            "Carefully mixing it into the {_OPTION2} soil",
                            "Avoiding any still-smoldering {_OPTION3} embers",
                            "Feeling the {_OPTION4} warmth spread through the earth",
                            "Planting a {_OPTION5} fire-resistant herb in the treated patch"
                        ],
                        _OPTION0: ["thick dragonhide", "asbestos-lined", "elemental-warded", "mithril-chain"],
                        _OPTION1: ["fresh, steaming", "aged, crumbly", "metallic-sheened", "jewel-encrusted"],
                        _OPTION2: ["depleted", "sandy", "clay-heavy", "magically inert"],
                        _OPTION3: ["magical", "fiery", "undigested gem", "glowing"],
                        _OPTION4: ["intense", "pleasant", "life-giving", "potentially volatile"],
                        _OPTION5: ["salamander parsley", "ash-willow sapling", "magma rose", "cinderbloom seed"]
                    },
                    {
                        name: "Label magical herb beds",
                        skills: ["labor", "nature_magic", "runes", "magical_lore"],
                        intermediates: [
                            "Carving {_OPTION0} runes onto small stone tablets",
                            "Identifying a bed of unlabeled {_OPTION1} Whisperwind flowers",
                            "Consulting the {_OPTION2} Grand Herbarium for correct nomenclature",
                            "Cross-referencing with its {_OPTION3} magical properties",
                            "Placing the {_OPTION4} label firmly in the soil",
                            "Applying a {_OPTION5} weather-proofing charm to the label"
                        ],
                        _OPTION0: ["protective", "identification", "growth-enhancing", "elemental affinity"],
                        _OPTION1: ["pulsing", "color-shifting", "singing", "shyly hiding"],
                        _OPTION2: ["Tower's", "Archmage's personal", "ancient Elven", "forbidden"],
                        _OPTION3: ["healing", "poisonous", "illusionary", "transmutative"],
                        _OPTION4: ["newly carved", "re-inked", "enchanted", "glowing"],
                        _OPTION5: ["minor", "permanent", "rain-repelling", "sun-reflecting"]
                    },
                    {
                        name: "Water thirsty shadowferns",
                        skills: ["labor", "nature_magic", "hydromancy", "bloom"],
                        intermediates: [
                            "Filling a {_OPTION0} watering can with moon-kissed water",
                            "Approaching the patch of {_OPTION1} ferns",
                            "Gently pouring water at the {_OPTION2} base of each plant",
                            "Whispering a {_OPTION3} growth incantation",
                            "Watching the ferns' shadows {_OPTION4} in response",
                            "Checking the soil for appropriate {_OPTION5} moisture levels"
                        ],
                        _OPTION0: ["darkwood", "obsidian", "silver", "enchanted clay"],
                        _OPTION1: ["drooping", "ethereal", "vibrant purple", "deep black"],
                        _OPTION2: ["dark, mossy", "shadowy", "cool", "slightly disturbed"],
                        _OPTION3: ["gentle", "nature_magic", "shadow-binding", "lunar-aligned"],
                        _OPTION4: ["deepen and swirl", "dance playfully", "stretch languidly", "vibrate slightly"],
                        _OPTION5: ["dampness", "coolness", "magical resonance", "life-energy"]
                    },
                    {
                        name: "Sort dried herbs for storage",
                        skills: ["labor", "alchemy", "foraging", "memory"],
                        intermediates: [
                            "Spreading out bundles of dried {_OPTION0} on the table",
                            "Separating leaves from {_OPTION1} stems and roots",
                            "Checking for any signs of {_OPTION2} mold or pests",
                            "Placing sorted herbs into {_OPTION3} airtight jars",
                            "Labeling each jar with the herb name and {_OPTION4} date",
                            "Storing the jars in the cool, dark {_OPTION5} apothecary shelves"
                        ],
                        _OPTION0: ["sun-dried", "moon-dried", "magically preserved", "fire-cured"],
                        _OPTION1: ["brittle", "still fragrant", "potent", "unusually colored"],
                        _OPTION2: ["magical", "mundane", "ethereal", "alchemical"],
                        _OPTION3: ["clay", "smoked glass", "crystal", "rune-sealed"],
                        _OPTION4: ["harvest", "drying completion", "potency peak", "expiration"],
                        _OPTION5: ["underground", "lead-lined", "temperature-controlled", "warded"]
                    },
                    {
                        name: "Pacify aggressive snapdragons",
                        skills: ["nature_magic", "life_magic", "pharmacology", "beast_tongue"],
                        intermediates: [
                            "Approaching the {_OPTION0} snapdragon patch cautiously",
                            "Humming a {_OPTION1} soothing melody",
                            "Offering a small piece of {_OPTION2} crystallized honey",
                            "Gently stroking its {_OPTION3} scaled stalk",
                            "Spraying a {_OPTION4} calming mist over its snapping jaws",
                            "Retreating slowly as the plant becomes {_OPTION5}"
                        ],
                        _OPTION0: ["fire-breathing", "acid-spitting", "loudly barking", "territorial"],
                        _OPTION1: ["lullaby", "Nature's harmony", "Tower-taught calming chant", "simple folk"],
                        _OPTION2: ["bee-blessed", "mana-infused", "drowsing-draught coated", "specially prepared"],
                        _OPTION3: ["vibrant green", "fiery red", "surprisingly soft", "thorn-covered"],
                        _OPTION4: ["herbal", "potion-based", "magical", "moonflower-essence"],
                        _OPTION5: ["docile", "sleepy", "less agitated", "momentarily distracted"]
                    },
                    {
                        name: "Graft sun shy roots onto shadowstalks",
                        skills: ["nature_magic", "alchemy", "farming", "surgery"],
                        intermediates: [
                            "Selecting a healthy {_OPTION0} sun shy root cutting",
                            "Making a precise incision in a {_OPTION1} shadowstalk stem",
                            "Carefully inserting the {_OPTION2} root into the incision",
                            "Binding the graft with {_OPTION3} enchanted plant fibers",
                            "Applying an {_OPTION4} alchemical bonding agent",
                            "Whispering a {_OPTION5} prayer for successful fusion"
                        ],
                        _OPTION0: ["pale white", "lumina-infused", "delicate", "surprisingly resilient"],
                        _OPTION1: ["mature", "young and pliable", "dark purple", "actively writhing"],
                        _OPTION2: ["glowing", "pulsating", "sensitive", "reluctant"],
                        _OPTION3: ["living", "spider silk", "moon-spun", "self-tightening"],
                        _OPTION4: ["growth-promoting", "tissue-fusing", "life-sustaining", "shadow-attuned"],
                        _OPTION5: ["Nature Spirit's", "Druidic", "Tower's secret", "hopeful"]
                    },
                    {
                        name: "Collect dew from slumbering dreamlilies",
                        skills: ["legerdemain", "nature_magic", "oneiromancy", "stealth"],
                        intermediates: [
                            "Approaching the dreamlily patch at {_OPTION0}",
                            "Moving with {_OPTION1} silence to avoid waking them",
                            "Using a {_OPTION2} silver spoon to gather dew",
                            "Catching the {_OPTION3} iridescent droplets",
                            "Storing the dew in a {_OPTION4} crystal vial",
                            "Feeling the {_OPTION5} oneiric energies from the collected dew"
                        ],
                        _OPTION0: ["false dawn", "deepest night", "the witching hour", "the moment before sunrise"],
                        _OPTION1: ["cat-like", "absolute", "unnatural", "breathtaking"],
                        _OPTION2: ["enchanted", "moon-blessed", "feather-light", "specially crafted"],
                        _OPTION3: ["shimmering", "rainbow-hued", "potent", "elusive"],
                        _OPTION4: ["stoppered", "rune-etched", "chilled", "dark"],
                        _OPTION5: ["faint", "powerful", "soporific", "prophetic"]
                    },
                    {
                        name: "Set wards against blighted fairies",
                        skills: ["nature_magic", "order_magic", "monster_lore", "abjuration"],
                        intermediates: [
                            "Identifying areas frequented by {_OPTION0} fairies",
                            "Sprinkling a line of {_OPTION1} cold iron filings",
                            "Hanging {_OPTION2} bells that chime at unwelcome frequencies",
                            "Inscribing {_OPTION3} abjuration runes on garden stones",
                            "Planting {_OPTION4} fairy-repellent herbs like rue",
                            "Activating the wards with a pulse of {_OPTION5} magic"
                        ],
                        _OPTION0: ["mischievous", "malicious", "crop-destroying", "dream-stealing"],
                        _OPTION1: ["pure", "consecrated", "rust-proofed", "magnetized"],
                        _OPTION2: ["silver", "brass", "enchanted crystal", "bone"],
                        _OPTION3: ["binding", "repulsion", "confusion", "banishment"],
                        _OPTION4: ["pungent", "thorny", "iron-rich", "magically treated"],
                        _OPTION5: ["Order", "Nature", "protective", "focused"]
                    },
                    {
                        name: "Propagate rare lumina moss",
                        skills: ["nature_magic", "farming", "geomancy", "bloom"],
                        intermediates: [
                            "Taking a small cutting from the parent {_OPTION0} lumina moss",
                            "Preparing a bed of nutrient-rich, {_OPTION1} soil",
                            "Gently pressing the {_OPTION2} moss cutting onto the new bed",
                            "Watering it with {_OPTION3} geode-infused water",
                            "Placing a {_OPTION4} light-focusing crystal nearby",
                            "Whispering words of {_OPTION5} encouragement to the new growth"
                        ],
                        _OPTION0: ["brightly glowing", "pulsating softly", "ancient", "delicate"],
                        _OPTION1: ["dark", "mineral-heavy", "magically charged", "cave-simulated"],
                        _OPTION2: ["fragile", "resilient", "shimmering", "tentatively glowing"],
                        _OPTION3: ["pure", "slightly sparkling", "energized", "life-attuned"],
                        _OPTION4: ["quartz", "moonstone", "sunstone", "specially cut"],
                        _OPTION5: ["nurturing", "growth", "light-binding", "flourishing"]
                    }
                ],
                scriptorium: [
                    {
                        name: "Organize unfinished scrolls and codices",
                        skills: ["scribing", "magical_lore", "memory", "archive_delving"],
                        intermediates: [
                            "Deciphering faded {_OPTION0} script on a forgotten map",
                            "Carefully unrolling a brittle scroll detailing {_OPTION1}",
                            "Cross-referencing celestial charts from the Grand Orrery",
                            "Identifying a misplaced treatise on {_OPTION2} summoning",
                            "Re-inking a nearly lost warding symbol on a containment scroll",
                            "Muttering a mnemonic chant to recall ancient filing protocols",
                            "Sorting parchments by their subtle elemental affinity"
                        ],
                        _OPTION0: ["draconic", "ancient elven", "cryptic djinn", "celestial"],
                        _OPTION1: ["astral projection techniques", "elemental binding rituals", "golem creation formulae", "temporal stasis fields"],
                        _OPTION2: ["imp", "gargoyle", "minor elemental", "thought-form"]
                    },
                    {
                        name: "Recycle papyrus scraps",
                        skills: ["labor", "artisanry", "woodworking", "alchemy"],
                        intermediates: [
                            "Soaking shredded papyrus in a vat of {_OPTION0} solution",
                            "Pressing the resulting pulp into new sheets using a heavy {_OPTION1} press",
                            "Adding powdered moonstone for enhanced luminosity to the mixture",
                            "Carefully peeling a fresh, damp sheet from the drying frame",
                            "Filtering out residual ink pigments with a miniature distillation coil",
                            "Whispering a minor {_OPTION2} charm for increased durability",
                            "Stacking the recycled sheets for the Head Scribe's inspection"
                        ],
                        _OPTION0: ["riverbloom", "star-thistle concocted", "crystal-clear", "mana-infused"],
                        _OPTION1: ["oak", "brass-fitted stone", "enchanted crystal", "clockwork-powered"],
                        _OPTION2: ["preservation", "mending", "strengthening", "illumination"]
                    },
                    {
                        name: "Clean ink spills from desks",
                        skills: ["labor", "alchemy", "cleaning"],
                        intermediates: [
                            "Mixing a potent {_OPTION0} solvent for stubborn dragon's blood ink",
                            "Scrubbing away a shimmering pool of volatile {_OPTION1} ink",
                            "Neutralizing a particularly corrosive batch of squid ink with chalk dust",
                            "Applying a polishing paste made from powdered {_OPTION2} shell",
                            "Carefully wiping down antique mahogany and ebony desks",
                            "Disposing of soiled rags in the alchemical waste reclamation unit",
                            "Admiring the restored gleam of the ancient Scriptorium surfaces"
                        ],
                        _OPTION0: ["alchemical", "citrus-based", "spirit-infused", "mineral-based"],
                        _OPTION1: ["celestial blue", "shadow black", "phoenix feather crimson", "verdant green illusion"],
                        _OPTION2: ["griffin feather", "unicorn horn", "marble", "mother-of-pearl"]
                    },
                    {
                        name: "Sharpen dragon claw quills",
                        skills: ["artisanry", "scribing", "beast_mastery", "lapidary_arts"],
                        intermediates: [
                            "Selecting a suitably sized claw from the {_OPTION0} dragon talon collection",
                            "Carefully grinding the claw tip against a {_OPTION1} whetstone",
                            "Testing the newly formed point on a scrap of practice vellum",
                            "Polishing the claw's surface with powdered {_OPTION2} for a smooth finish",
                            "Checking the ink flow channel for any microscopic blockages",
                            "Feeling the subtle thrum of residual elemental magic in the claw",
                            "Arranging the sharpened quills in the master calligrapher's ornate stand"
                        ],
                        _OPTION0: ["young azure", "elder emerald", "shadow wyrm", "crystal"],
                        _OPTION1: ["diamond-grit", "obsidian shard", "enchanted river", "meteorite fragment"],
                        _OPTION2: ["pearl", "ruby dust", "sapphire powder", "adamantine flakes"]
                    },
                    {
                        name: "Restock vellum and enchanted inks",
                        skills: ["scribing", "alchemy", "enchanting", "bookkeeping"],
                        intermediates: [
                            "Checking current inventory levels against the master Scriptorium ledger",
                            "Unpacking a new crate of freshly cured {_OPTION0} vellum sheets",
                            "Carefully decanting shimmering {_OPTION1} ink into smaller, airtight vials",
                            "Labeling each ink vial with its specific enchantment and potency",
                            "Storing surplus vellum rolls in the climate-controlled archival vault",
                            "Noting the dwindling supply of rare {_OPTION2} ink for immediate reorder",
                            "Arranging the various supplies neatly on the Scriptorium's designated shelves"
                        ],
                        _OPTION0: ["lambskin", "dragonhide", "griffinskin", "celestial-grade"],
                        _OPTION1: ["everlasting", "truth-revealing", "illusion-weaving", "spell-enhancing"],
                        _OPTION2: ["invisibility", "transmutation", "elemental summoning", "prophetic dream"]
                    },
                    {
                        name: "Sort pigments by magical property",
                        skills: ["scribing", "alchemy", "magical_lore", "magical_item_analysis"],
                        intermediates: [
                            "Examining a vial of glowing {_OPTION0} pigment under a crystal magnifier lens",
                            "Identifying the elemental resonance of powdered {_OPTION1} flakes",
                            "Separating pigments used for {_OPTION2} spells from those for abjuration rituals",
                            "Cataloging a newly acquired sample of shadow-infused ochre from the Underworld",
                            "Feeling the subtle warmth emanating from a fire-aspected carmine pigment",
                            "Arranging pigment jars according to their school of magic compatibility",
                            "Updating the grand pigment inventory with precise runic annotations"
                        ],
                        _OPTION0: ["moonpetal blue", "sunstone yellow", "phoenix ash red", "void black"],
                        _OPTION1: ["dragon scale green", "griffin feather gold", "mandrake root brown", "kraken ink indigo"],
                        _OPTION2: ["illusionary", "conjuration", "transmutation", "divination"]
                    },
                    {
                        name: "Dust drafting tables and lecterns",
                        skills: ["labor", "cleaning"],
                        intermediates: [
                            "Wielding a long feather duster made from {_OPTION0} plumes",
                            "Wiping down ancient oak and rune-etched drafting tables",
                            "Carefully dusting around delicate astrolabes, orreries, and other arcane instruments",
                            "Clearing cobwebs spun by crystal spiders from the Scriptorium's high corners",
                            "Polishing the brass fittings and gem inlays on the grand central lectern",
                            "Trying not to sneeze from the motes of {_OPTION1} dust",
                            "Gently shooing away a stray {_OPTION2} that scurried from under a table leg"
                        ],
                        _OPTION0: ["griffin", "phoenix", "roc", "pegasus wing"],
                        _OPTION1: ["magical", "ancient library", "glittering spell", "choking enchanted"],
                        _OPTION2: ["scroll-mite", "bookwyrm hatchling", "escaped ink elemental", "paper golem fragment"]
                    },
                    {
                        name: "File away master copies of spells",
                        skills: ["scribing", "magical_lore", "memory", "abjuration"],
                        intermediates: [
                            "Verifying the {_OPTION0} authenticity seal on a newly scribed master spell scroll",
                            "Cross-referencing the spell's classification with the forbidden magic registry",
                            "Placing the scroll of {_OPTION1} into its designated, warded arcane niche",
                            "Whispering a complex protective ward over the enchanted filing cabinet",
                            "Updating the master spell index with the scroll's precise storage coordinates",
                            "Feeling the thrum of immense contained power from a nearby {_OPTION2} spell scroll",
                            "Ensuring the archival preservation runes are still actively glowing with power"
                        ],
                        _OPTION0: ["Archmage's personal", "Guild Chancellor's official", "Head Scribe's meticulous", "Tower Guardian's potent"],
                        _OPTION1: ["Meteor Shower", "Chain Lightning", "Animate Dead", "Town Portal"],
                        _OPTION2: ["Disintegration", "Time Stop", "Wish", "Clone"]
                    },
                    {
                        name: "Prepare fresh vellum for scribing",
                        skills: ["labor", "leatherworking", "scribing", "artisanry"],
                        intermediates: [
                            "Stretching a supple {_OPTION0} hide tautly on a large wooden frame",
                            "Scraping the hide to an even thickness using a lunar-silvered blade",
                            "Treating the surface with a carefully measured solution of {_OPTION1} and fine chalk",
                            "Polishing the vellum to a perfectly smooth finish with a {_OPTION2} stone",
                            "Cutting the prepared vellum into standard scroll and codex page sizes",
                            "Inspecting each finished sheet for minute imperfections under enchanted light",
                            "Stacking the pristine, prepared vellum for the waiting scribes"
                        ],
                        _OPTION0: ["young hydra", "manticore", "wyvern", "pegasus foal"],
                        _OPTION1: ["moonflower dew", "powdered pearl", "clarified mana", "distilled starlight"],
                        _OPTION2: ["pumice", "agate", "river-smoothed", "polished obsidian"]
                    },
                    {
                        name: "Correct misspelled incantations",
                        skills: ["scribing", "magical_lore", "linguistics", "spellcraft"],
                        intermediates: [
                            "Identifying a critical phonetic error in a complex {_OPTION0} chant",
                            "Consulting the 'Lexicon of Arcane {_OPTION1}' for proper enunciation",
                            "Carefully erasing the incorrect rune with a specialized alchemical solvent",
                            "Re-inking the corrected symbol with unwavering precision and enchanted ink",
                            "Cross-referencing the modified passage with a master copy of the {_OPTION2} spell",
                            "Muttering the corrected magical phrase softly to test its harmonic resonance",
                            "Feeling a wave of arcane stability as the spell matrix correctly aligns"
                        ],
                        _OPTION0: ["fireball", "teleportation", "summoning", "healing light"],
                        _OPTION1: ["Syllables", "Phonemes", "Vocables", "Ancient Runes"],
                        _OPTION2: ["Magic Arrow", "Bless", "Curse", "Shield"]
                    },
                    {
                        name: "Transcribe fragile texts before they crumble",
                        skills: ["scribing", "magical_lore", "legerdemain", "memory"],
                        intermediates: [
                            "Gently turning the brittle, yellowed pages of an ancient {_OPTION0} tome",
                            "Using magically enhanced spectacles to decipher nearly faded script",
                            "Rapidly memorizing entire passages just before they turn to irreplaceable dust",
                            "Swiftly copying the precious text onto fresh, durable {_OPTION1} vellum",
                            "Recreating intricate astronomical diagrams of forgotten {_OPTION2} constellations",
                            "Whispering a minor stasis charm over the original, crumbling document",
                            "Comparing the meticulous transcription for accuracy one final, painstaking time"
                        ],
                        _OPTION0: ["prophetic", "heretical", "alchemical", "necromantic"],
                        _OPTION1: ["dragonscale", "moon-treated", "enchanted archival", "everlasting papyrus"],
                        _OPTION2: ["celestial", "demonic plane", "elemental pathway", "draconic lineage"]
                    },
                    {
                        name: "Create forgery proof guild seals on documents",
                        skills: ["scribing", "enchanting", "forgery", "order_magic"],
                        intermediates: [
                            "Heating the special {_OPTION0} wax over a precisely controlled magical flame",
                            "Firmly pressing the Guild's master signet ring into the molten wax",
                            "Infusing the cooling seal with a subtle, {_OPTION1} enchantment",
                            "Tracing a microscopic rune of authenticity, visible only under {_OPTION2} light",
                            "Verifying the complex seal's integrity with a specialized detection charm",
                            "Allowing the newly formed seal to cool and harden on important guild decrees",
                            "Feeling the faint hum of protective and authenticating magic emanating from the seal"
                        ],
                        _OPTION0: ["arcane blue", "crimson dragon's blood", "silver star", "obsidian black"],
                        _OPTION1: ["truth-binding", "identity-verifying", "anti-tampering", "warding aura"],
                        _OPTION2: ["moon", "true-seeing", "arcane", "a specific magical frequency"]
                    },
                    {
                        name: "Illuminate manuscripts with powdered gems",
                        skills: ["scribing", "artistry", "lapidary_arts", "enchanting"],
                        intermediates: [
                            "Grinding precious {_OPTION0} into a fine, shimmering, dust-like powder",
                            "Mixing the valuable gem powder with an enchanted, quick-drying {_OPTION1} binder",
                            "Painstakingly applying the luminous, gem-infused paint to the manuscript's borders and capitals",
                            "Crafting intricate, flowing knotwork that subtly glows with inner magical light",
                            "Embedding a tiny, perfectly cut chip of {_OPTION2} at each chapter's beginning",
                            "Channeling a faint, harmonious magical aura into the delicate illuminations",
                            "Admiring the way the completed page catches and refracts the arcane library light"
                        ],
                        _OPTION0: ["sapphires", "rubies", "emeralds", "diamonds"],
                        _OPTION1: ["acacia gum", "dragon's tear resin", "pixie dust solution", "moonpetal nectar"],
                        _OPTION2: ["starstone", "sunstone", "fire opal", "moonstone"]
                    },
                    {
                        name: "Bind newly copied grimoires",
                        skills: ["scribing", "leatherworking", "artisanry", "enchanting"],
                        intermediates: [
                            "Selecting a piece of exquisitely treated {_OPTION0} hide for the grimoire's cover",
                            "Carefully stitching the gathered pages together with magically strengthened sinew thread",
                            "Attaching the sturdy cover and spine using potent {_OPTION1} adhesive",
                            "Embossing the grimoire's title and guild symbol using heated metallic stamps",
                            "Fastening an ornate clasp made of polished {_OPTION2} to secure the book",
                            "Whispering a minor charm of protection and longevity over the finished grimoire",
                            "Placing the newly bound grimoire on the 'ready for advanced enchanting' shelf"
                        ],
                        _OPTION0: ["basilisk", "manticore", "wyrmling", "shadow panther"],
                        _OPTION1: ["golem-grade", "alchemically potent", "spirit gum", "elf-crafted resin"],
                        _OPTION2: ["silver", "brass", "carved bone", "meteoric iron"]
                    },
                    {
                        name: "Research lost runic languages",
                        skills: ["runes", "ancient_languages", "magical_lore", "cryptography"],
                        intermediates: [
                            "Comparing a newly discovered obsidian tablet with the entries in the {_OPTION0} Codex",
                            "Cross-referencing unknown symbols with known {_OPTION1} pictographic glyphs",
                            "Attempting to decipher a recurring, complex rune possibly meaning '{_OPTION2}'",
                            "Using a scrying crystal to visualize the runes' original historical and magical context",
                            "Theorizing complex grammatical structures of a forgotten, powerful tongue",
                            "Experiencing a sudden flash of intuitive insight about a particular runic sequence's meaning",
                            "Making a significant breakthrough in translating a prophetic phrase about ancient titans"
                        ],
                        _OPTION0: ["Dragon Tongue", "Celestial Script", "Primordial Giant", "Atlantean Lost"],
                        _OPTION1: ["dwarven mining", "ancient elven star", "primordial elemental", "forgotten draconic"],
                        _OPTION2: ["power", "warding", "gateway", "binding", "forbidden knowledge"]
                    },
                ],
                infirmary: [
                    {
                        name: "Sterilize healing instruments",
                        skills: ["medicine", "life_magic", "pyromancy", "first_aid"],
                        intermediates: [
                            "Arranging silver scalpels, bone saws, and forceps neatly on a sterile tray",
                            "Passing each instrument methodically through a {_OPTION0} flame",
                            "Submerging the tools in a bubbling cauldron of thrice-sanctified water",
                            "Wiping down delicate probes with cloths soaked in a potent {_OPTION1} solution",
                            "Chanting a minor but effective purification incantation over the complete set",
                            "Checking for any remaining {_OPTION2} or microbial residue with a detection charm",
                            "Placing the gleaming, sterilized instruments into a sealed, warded container"
                        ],
                        _OPTION0: ["blue purifying", "white hot magical", "continual light", "phoenix-conjured"],
                        _OPTION1: ["alcohol-based", "holy water", "alchemically pure spirit", "anti-microbial herbal"],
                        _OPTION2: ["ethereal taint", "spiritual contagion", "bacterial presence", "negative magical"]
                    },
                    {
                        name: "Dispose of used bandages and poultices",
                        skills: ["labor", "medicine", "toxicology"],
                        intermediates: [
                            "Carefully collecting soiled linens and poultice remnants with enchanted tongs",
                            "Sorting bandages potentially tainted with lingering {_OPTION0} magic or contagions",
                            "Placing infectious or magically hazardous waste into specially warded biohazard containers",
                            "Sprinkling neutralizing {_OPTION1} powder over the waste to negate harmful energies",
                            "Transporting the sealed containers to the deep-pit alchemical incinerator",
                            "Steadfastly avoiding inhalation of any escaping {_OPTION2} fumes during disposal",
                            "Washing hands thoroughly with carbolic soap and a final cleansing charm"
                        ],
                        _OPTION0: ["necrotic", "curse-laden", "virulent disease", "parasitic entity"],
                        _OPTION1: ["quicklime", "silver salt", "purifying crystal dust", "consecrated ashwood"],
                        _OPTION2: ["miasmatic vapor", "toxic effluvium", "lingering magical essence", "foul spiritual"]
                    },
                    {
                        name: "Restock healing salves and elixirs",
                        skills: ["medicine", "alchemy", "life_magic", "bookkeeping"],
                        intermediates: [
                            "Checking the infirmary's inventory log for depleted {_OPTION0} potions and balms",
                            "Retrieving fresh, potent batches from the secure alchemical storage vaults",
                            "Carefully labeling new jars of {_OPTION1} salve with their precise brewing dates and ingredients",
                            "Arranging elixirs, potions, and salves by potency, application, and school of magic",
                            "Ensuring the {_OPTION2} charm on the main storage cabinet is active and strong",
                            "Updating the stock levels meticulously in the infirmary's enchanted ledger",
                            "Noticing a critically low supply of unicorn horn powder needed for advanced regeneration potions"
                        ],
                        _OPTION0: ["regeneration", "mana restoration", "universal antidote", "enhanced vitality"],
                        _OPTION1: ["sunpetal", "moonleaf", "dragonwort", "griffin's balm"],
                        _OPTION2: ["preservation", "cooling stasis", "anti-spoilage", "purity field"]
                    },
                    {
                        name: "Change bedding in recovery cots",
                        skills: ["labor", "hospitality", "medicine", "hygiene"],
                        intermediates: [
                            "Stripping soiled and sweat-stained linens from a recently vacated recovery cot",
                            "Spraying the cot frame thoroughly with a {_OPTION0} disinfectant mist",
                            "Laying out fresh, crisp sheets woven with fine {_OPTION1} threads for comfort",
                            "Plumping pillows generously infused with calming herbs like {_OPTION2}",
                            "Tucking in the corners with practiced efficiency to ensure patient comfort",
                            "Ensuring a completely clean and welcoming environment for the next ailing patient",
                            "Taking the bundled soiled linens to the infirmary's enchanted laundry chute"
                        ],
                        _OPTION0: ["silver-infused", "herbal essence", "magical cleansing", "steam-powered atomized"],
                        _OPTION1: ["silver", "healing enchantment", "comforting charm", "anti-microbial ward"],
                        _OPTION2: ["lavender", "chamomile", "dreamleaf", "peaceblossom"]
                    },
                    {
                        name: "Organize poultice ingredients",
                        skills: ["medicine", "foraging", "alchemy", "memory"],
                        intermediates: [
                            "Sorting piles of dried {_OPTION0} leaves from bundles of fresh silvervein mushrooms",
                            "Arranging neatly labeled jars of powdered {_OPTION1} alongside rendered troll fat",
                            "Checking the freshness and magical potency of rare, recently harvested sunpetal blossoms",
                            "Restocking various sizes of bandages and clean binding cloths",
                            "Labeling new batches of rare ingredients with their specific harvest date and location",
                            "Cross-referencing the 'Apothecary's Grand Concordance' for effective {_OPTION2} combinations",
                            "Carefully discarding any ingredients showing the slightest signs of spoilage or magical taint"
                        ],
                        _OPTION0: ["kingfoil", "mandrake root", "bloodmoss", "willowbark shavings"],
                        _OPTION1: ["unicorn horn", "manticore stingers", "phoenix tear crystals", "dragon scale dust"],
                        _OPTION2: ["wound-closing", "potent anti-venom", "rapid fever-reducing", "swift bone-mending"]
                    },
                    {
                        name: "Wash linens with cleansing charms",
                        skills: ["labor", "life_magic", "enchanting", "tailoring"],
                        intermediates: [
                            "Loading heaps of soiled infirmary linens into the enchanted washing cauldron",
                            "Adding a precise measure of powdered {_OPTION0} soap, known for its purity",
                            "Chanting the ancient 'Aqua Pura Vitae' cleansing incantation over the water",
                            "Stirring the churning water with a large, rune-etched oaken paddle",
                            "Watching as stubborn stains and impurities magically lift and vanish from the fabric",
                            "Rinsing the thoroughly cleansed linens with {_OPTION1} water drawn from a blessed spring",
                            "Wringing out the excess water using a magically assisted {_OPTION2} wringer mechanism"
                        ],
                        _OPTION0: ["sunstone", "pearlash", "riverbloom essence", "powdered silver"],
                        _OPTION1: ["pure spring", "blessed", "crystal clear mountain", "mana-infused ritual"],
                        _OPTION2: ["self-twisting", "clockwork-driven", "golem-assisted", "enchanted compression"]
                    },
                    {
                        name: "Sweep examination rooms for spirits",
                        skills: ["labor", "life_magic", "spectral_mastery"],
                        intermediates: [
                            "Lighting a thick bundle of {_OPTION0} sage, its smoke acrid and purifying",
                            "Wafting the billowing, cleansing smoke into shadowy corners and under furniture",
                            "Muttering a continuous warding chant to deter lingering {_OPTION1} or sorrowful echoes",
                            "Using a polished silver mirror to detect unseen presences or ethereal disturbances",
                            "Feeling a distinct cold spot developing near the {_OPTION2} operating table",
                            "Sprinkling a line of consecrated salt across all thresholds and windowsills",
                            "Confirming the room is now clear and serene with a pendulum dowsed in holy water"
                        ],
                        _OPTION0: ["ghostsbane", "spirit-ward herb", "dragon's breath incense", "silver birch"],
                        _OPTION1: ["wraiths", "poltergeists", "lost souls", "minor mischievous specters"],
                        _OPTION2: ["marble", "obsidian", "enchanted steel", "ancient oak examination"]
                    },
                    {
                        name: "Label medicinal herb jars anew",
                        skills: ["medicine", "alchemy", "runes", "memory"],
                        intermediates: [
                            "Carefully wiping old, faded, and peeling labels from ceramic and glass herb jars",
                            "Selecting appropriate, magically resonant runic symbols for an herb's {_OPTION0} properties",
                            "Inscribing the herb's common name, for example '{_OPTION1}', in clear, precise script",
                            "Adding a small, secondary rune indicating its primary {_OPTION2} or elemental affinity",
                            "Attaching the new, informative labels securely with magically adhesive gum arabic",
                            "Cross-checking each new label meticulously with entries in the master herbarium codex",
                            "Arranging the freshly labeled jars alphabetically and by use on the infirmary shelves"
                        ],
                        _OPTION0: ["healing", "toxic", "calming", "stimulant", "protective"],
                        _OPTION1: ["bloodroot", "nightshade berries", "valerian root", "ginseng"],
                        _OPTION2: ["Life", "Death", "Order", "Chaos", "Nature's balance"]
                    },
                    {
                        name: "Tidy patient bedside tables",
                        skills: ["labor", "hospitality", "patron_care"],
                        intermediates: [
                            "Clearing away empty potion vials, used tissues, and discarded bandage scraps",
                            "Wiping down the table surface with a soft cloth lightly soaked in {_OPTION0}",
                            "Refilling the personal water carafe with fresh, cool, purified water",
                            "Neatly arranging any personal items, like a well-worn copy of '{_OPTION1}'",
                            "Placing a small, cheerful vase containing a single, fresh {_OPTION2} flower",
                            "Ensuring the patient's call bell is within easy, comfortable reach",
                            "Offering a quiet, reassuring word of comfort if the patient is awake and lucid"
                        ],
                        _OPTION0: ["lavender water", "lemon-verbena solution", "mild antiseptic wash", "rosewater mist"],
                        _OPTION1: ["Tales of Heroic Knights", "Basic Cantrips for Beginners", "The Stargazer's Almanac", "Mysteries of the Deep"],
                        _OPTION2: ["sunpetal", "moonflower", "peacebloom", "whisperwind daisy"]
                    },
                    {
                        name: "Air out wards with purifying incense",
                        skills: ["labor", "life_magic", "alchemy", "protection"],
                        intermediates: [
                            "Propping open tall windows to allow fresh, {_OPTION0} air to gently circulate",
                            "Lighting a swinging censer generously filled with potent {_OPTION1} incense blend",
                            "Wafting the fragrant, purifying smoke methodically throughout the entire recovery ward",
                            "Visualizing negative energies, miasmas, and lingering illness being dispelled by the smoke",
                            "Replacing stale, heavy air with air carrying the clean, uplifting scents of {_OPTION2}",
                            "Carefully ensuring the aromatic smoke doesn't irritate any particularly sensitive patients",
                            "Closing the windows after the ward's air feels refreshed, cleansed, and revitalized"
                        ],
                        _OPTION0: ["mountain-crisp", "sea-kissed", "pine-scented forest", "magically filtered tower"],
                        _OPTION1: ["frankincense and myrrh", "sandalwood and silver flakes", "dragonsblood resin", "sacred white sage"],
                        _OPTION2: ["pine and mint", "lavender and chamomile", "eucalyptus and camphor", "healing herbs and flowers"]
                    },
                    {
                        name: "Brew fever reducing concoctions",
                        skills: ["medicine", "alchemy", "provisions", "pharmacology"],
                        intermediates: [
                            "Measuring precise amounts of dried willow bark and fresh {_OPTION0} leaves",
                            "Gently simmering the combined ingredients in a heavy copper cauldron over a low {_OPTION1} flame",
                            "Stirring the thickening mixture widdershins with a polished silver spoon for potency",
                            "Adding a single, potent drop of concentrated {_OPTION2} essence to the brew",
                            "Carefully straining the completed concoction through fine, sterile muslin cloth",
                            "Decanting the warm, aromatic brew into small, clearly labeled phials for dosage",
                            "Tasting a minuscule, diluted drop to check for correct bitterness and expected efficacy"
                        ],
                        _OPTION0: ["feverfew blossoms", "yarrow flowers", "catnip leaves", "crushed boneset"],
                        _OPTION1: ["magical", "alchemical heat", "ethereal blue", "slow burning enchanted"],
                        _OPTION2: ["peppermint", "wintergreen oil", "moonpetal nectar", "crystal dew"]
                    },
                    {
                        name: "Set broken bones with magical assistance",
                        skills: ["medicine", "life_magic", "geomancy", "surgery"],
                        intermediates: [
                            "Examining a glowing X-ray plate created by a {_OPTION0} diagnostic spell",
                            "Gently yet firmly manipulating the fractured limb back into perfect alignment",
                            "Chanting a powerful mending incantation derived from the {_OPTION1} school of magic",
                            "Channeling focused life energy directly into the break to accelerate bone knitting",
                            "Applying a thick, warm poultice of comfrey root and powdered {_OPTION2}",
                            "Immobilizing the healing limb securely with magically hardened and supportive bandages",
                            "Continuously monitoring the patient's vital signs and pain levels with a diagnostic charm"
                        ],
                        _OPTION0: ["Reveal Inner Structure", "Clairvoyant Skeletal Sight", "Bone-Scan Lumina", "Luminous Diagnosis Aura"],
                        _OPTION1: ["restoration", "Earth Magic", "Nature's Mend", "Somatic Renewal"],
                        _OPTION2: ["adamantine dust", "crushed pearl", "unicorn horn shavings", "granite powder"]
                    },
                    {
                        name: "Suture wounds using enchanted thread",
                        skills: ["medicine", "tailoring", "enchanting", "surgery"],
                        intermediates: [
                            "Selecting a fine, curved needle threaded with shimmering {_OPTION0} silk",
                            "Thoroughly cleaning the wound edges with an antiseptic and numbing solution",
                            "Skillfully and swiftly stitching the gaping wound edges neatly together",
                            "Whispering a quiet charm of {_OPTION1} into each perfectly placed stitch",
                            "Applying a thin layer of regenerative salve to prevent scarring and promote healing",
                            "Covering the freshly sutured wound with a sterile, {_OPTION2} dressing",
                            "Admiring the neatness and integrity of the magically enhanced, healing suture line"
                        ],
                        _OPTION0: ["spider-gossamer", "silver-spun", "self-dissolving enchanted", "healing-infused kelp"],
                        _OPTION1: ["rapid healing", "scar tissue prevention", "soothing pain reduction", "infection warding light"],
                        _OPTION2: ["mana-permeated gauze pad", "living moss patch", "translucent dragonfly wing membrane", "blessed linen strip"]
                    },
                    {
                        name: "Diagnose ailments using divination",
                        skills: ["medicine", "divination", "magical_lore", "diagnostics"],
                        intermediates: [
                            "Casting a handful of polished rune stones onto a black velvet divination cloth",
                            "Carefully interpreting the resulting patterns to understand the patient's afflicted {_OPTION0}",
                            "Gazing intently into a mist-filled crystal ball to perceive internal maladies or imbalances",
                            "Consulting the ancient, leather-bound 'Atlas of Arcane Afflictions and Their Cures'",
                            "Using a silver pendulum to dowse for areas of significant {_OPTION1} disruption",
                            "Cross-referencing complex divinatory insights with observed physical symptoms and patient history",
                            "Pinpointing the elusive source of the ailment as a rare, invasive {_OPTION2} parasite"
                        ],
                        _OPTION0: ["aura fluctuations", "life force signature", "spiritual imbalance points", "subtle magical affliction markers"],
                        _OPTION1: ["magical energy", "elemental harmony", "vital life energy", "chi flow"],
                        _OPTION2: ["ethereal", "astral", "shadow-born", "mana-leeching"]
                    },
                    {
                        name: "Comfort delirious patients with calming illusions",
                        skills: ["medicine", "mentalism", "insight"],
                        intermediates: [
                            "Gently placing a cool, reassuring hand on the feverish patient's forehead",
                            "Weaving a simple, serene illusion of a peaceful, sun-dappled {_OPTION0} scene",
                            "Mentally projecting feelings of profound serenity, safety, and gentle calm",
                            "Whispering soft, soothing words in a calm, rhythmic, almost hypnotic tone",
                            "Subtly shaping and adapting the illusion to respond to the patient's subconscious needs and fears",
                            "Observing the patient's agitated breathing becoming slower, deeper, and more regular",
                            "Maintaining the {_OPTION1} illusion steadily until the worst of the {_OPTION2} subsides"
                        ],
                        _OPTION0: ["meadow filled with wildflowers", "starry night sky over a calm sea", "tranquil, mist-shrouded lake", "sunlit, ancient forest glade"],
                        _OPTION1: ["deeply calming", "utterly peaceful", "gently protective", "blissfully serene"],
                        _OPTION2: ["frightening delirium", "chaotic fever dream", "terrifying night terror", "disorienting magical confusion"]
                    }
                ],
                meditation_chamber: [
                    {
                        name: "Polish meditation crystals",
                        skills: ["labor", "meditation", "lapidary_arts", "magical_item_analysis"],
                        intermediates: [
                            "Gathering polishing cloths and {_OPTION0} solutions",
                            "Gently wiping each crystal surface",
                            "Removing accumulated {_OPTION1} dust",
                            "Inspecting for micro-fractures with a {_OPTION2} lens",
                            "Buffing to a high {_OPTION3} sheen",
                            "Feeling the crystal's amplified {_OPTION4}"
                        ],
                        _OPTION0: ["blessed water", "alchemical", "moon-infused", "crystal-specific"],
                        _OPTION1: ["psychic", "elemental", "astral", "ambient"],
                        _OPTION2: ["magnifying", "scrying", "truth-seeing", "gemcutter's"],
                        _OPTION3: ["spiritual", "reflective", "magical", "etheric"],
                        _OPTION4: ["resonance", "energy", "clarity", "focus"]
                    },
                    {
                        name: "Arrange contemplation cushions",
                        skills: ["labor", "hospitality", "meditation"],
                        intermediates: [
                            "Fluffing the {_OPTION0} cushions",
                            "Consulting the ancient texts on {_OPTION1} placement",
                            "Aligning cushions with the chamber's {_OPTION2} lines",
                            "Ensuring comfortable spacing for {_OPTION3} practitioners",
                            "Testing the feel of each spot",
                            "Adjusting for optimal {_OPTION4} circulation"
                        ],
                        _OPTION0: ["velvet", "silk", "enchanted", "levitating"],
                        _OPTION1: ["sacred geometry", "astral", "geomantic", "elemental"],
                        _OPTION2: ["ley", "mana", "psychic", "architectural"],
                        _OPTION3: ["novice", "master", "visiting", "solitary"],
                        _OPTION4: ["energy", "mana", "thought-form", "serenity"]
                    },
                    {
                        name: "Sweep the sacred space with blessed broom",
                        skills: ["labor", "life_magic", "meditation"],
                        intermediates: [
                            "Retrieving the {_OPTION0} broom from its consecrated stand",
                            "Chanting a minor {_OPTION1} purification incantation",
                            "Sweeping away physical and {_OPTION2} debris",
                            "Focusing intent on cleansing the area",
                            "Guiding dislodged energies towards the {_OPTION3} portal",
                            "Feeling the renewed sanctity of the {_OPTION4}"
                        ],
                        _OPTION0: ["silver-birch", "ebony-handled", "rune-etched", "everglowing"],
                        _OPTION1: ["cleansing", "banishing", "sanctifying", "warding"],
                        _OPTION2: ["ethereal", "negative", "astral", "emotional"],
                        _OPTION3: ["disposal", "recycling", "nullification", "elemental"],
                        _OPTION4: ["space", "chamber", "altar", "threshold"]
                    },
                    {
                        name: "Refresh incense burners with calming herbs",
                        skills: ["labor", "alchemy", "meditation", "pharmacology"],
                        intermediates: [
                            "Emptying old ashes into a {_OPTION0} receptacle",
                            "Selecting a blend of {_OPTION1} herbs",
                            "Grinding herbs with a {_OPTION2} mortar and pestle",
                            "Carefully measuring portions for each burner",
                            "Lighting the incense with a {_OPTION3} flame",
                            "Inhaling the soothing {_OPTION4} aroma"
                        ],
                        _OPTION0: ["ritual", "earthenware", "silver", "containment"],
                        _OPTION1: ["Dreamleaf", "Serenity Bloom", "Whisperwind Petals", "Moonpetal Dust"],
                        _OPTION2: ["marble", "obsidian", "blessed", "alchemical"],
                        _OPTION3: ["magical", "pure", "everlasting", "tiny dragon's"],
                        _OPTION4: ["peaceful", "tranquilizing", "focus-enhancing", "spirit-lifting"]
                    },
                    {
                        name: "Align geomantic stones for optimal flow",
                        skills: ["meditation", "geomancy", "terramancy", "divination"],
                        intermediates: [
                            "Consulting the {_OPTION0} charts",
                            "Sensing the existing {_OPTION1} currents",
                            "Gently nudging a {_OPTION2} stone into place",
                            "Recalibrating the energy {_OPTION3} with fine adjustments",
                            "Verifying alignment with a {_OPTION4} pendulum",
                            "Feeling the harmonious {_OPTION5} resonating through the chamber"
                        ],
                        _OPTION0: ["geomantic", "astrological", "ley line", "elemental"],
                        _OPTION1: ["mana", "telluric", "earth", "psychic"],
                        _OPTION2: ["lodestone", "quartz", "granite", "obsidian"],
                        _OPTION3: ["nexus", "grid", "matrix", "confluence"],
                        _OPTION4: ["dowsing", "scrying", "crystal", "sensitive"],
                        _OPTION5: ["energy", "vibrations", "balance", "flow"]
                    },
                    {
                        name: "Cleanse aura disturbances",
                        skills: ["meditation", "life_magic", "psychometry", "occlumency"],
                        intermediates: [
                            "Entering a deep meditative state",
                            "Scanning the chamber for {_OPTION0} dissonances",
                            "Identifying the source of an {_OPTION1} imprint",
                            "Using {_OPTION2} techniques to smooth out auric ripples",
                            "Drawing out negative energies with a {_OPTION3} gesture",
                            "Sealing the cleansed space with a {_OPTION4} ward",
                            "Perceiving the chamber's aura returning to a {_OPTION5} hue"
                        ],
                        _OPTION0: ["auric", "psychic", "emotional", "ethereal"],
                        _OPTION1: ["lingering", "turbulent", "parasitic", "foreign"],
                        _OPTION2: ["gentle life magic", "focused will", "sonic healing", "abjuration patterns"],
                        _OPTION3: ["sweeping", "siphoning", "banishing", "cleansing"],
                        _OPTION4: ["protective", "minor", "temporary", "serenity"],
                        _OPTION5: ["clear", "golden", "serene", "balanced"]
                    },
                    {
                        name: "Dust altar and sacred relics",
                        skills: ["labor", "magical_lore", "mythology"],
                        intermediates: [
                            "Donning consecrated {_OPTION0} gloves",
                            "Choosing a brush made of {_OPTION1} feathers",
                            "Gently whisking dust from the Idol of {_OPTION2}",
                            "Carefully cleaning around the {_OPTION3} offering bowl",
                            "Recalling the history of each {_OPTION4} relic",
                            "Polishing the altar surface with {_OPTION5} oil"
                        ],
                        _OPTION0: ["silk", "enchanted linen", "purified leather", "non-reactive"],
                        _OPTION1: ["griffin", "phoenix", "swan", "enchanted owl"],
                        _OPTION2: ["the Serpent God", "the Moon Goddess", "the First Archmage", "a Forgotten One"],
                        _OPTION3: ["crystal", "silver", "ancient stone", "oracle's"],
                        _OPTION4: ["venerable", "powerful", "possibly cursed", "misunderstood"],
                        _OPTION5: ["sacred", "blessed", "lemongrass", "myrrh-infused"]
                    },
                    {
                        name: "Tune resonant bowls for harmony",
                        skills: ["musical_instruments", "bat_ear", "meditation"],
                        intermediates: [
                            "Selecting a {_OPTION0} striker",
                            "Gently tapping the rim of a {_OPTION1} singing bowl",
                            "Listening for the precise {_OPTION2} pitch",
                            "Making minute adjustments by adding or removing {_OPTION3} water",
                            "Harmonizing multiple bowls to create a {_OPTION4} chord",
                            "Feeling the air vibrate with {_OPTION5} frequencies"
                        ],
                        _OPTION0: ["suede-covered", "crystal", "rosewood", "dragonbone"],
                        _OPTION1: ["crystal", "bronze", "silver-alloy", "celestial metal"],
                        _OPTION2: ["fundamental", "harmonic", "resonant", "healing"],
                        _OPTION3: ["blessed", "moon-touched", "distilled", "elementally charged"],
                        _OPTION4: ["serene", "powerful", "meditative", "elemental"],
                        _OPTION5: ["soothing", "cleansing", "energizing", "balancing"]
                    },
                    {
                        name: "Straighten prayer rugs and mandalas",
                        skills: ["labor", "meditation", "artistry"],
                        intermediates: [
                            "Lifting the edge of a {_OPTION0} rug",
                            "Smoothing out wrinkles and creases",
                            "Aligning the rug's central motif with the chamber's {_OPTION1} axis",
                            "Checking the intricate patterns of a sand {_OPTION2}",
                            "Carefully adjusting a hanging {_OPTION3} tapestry",
                            "Ensuring all sacred patterns are {_OPTION4} and respected"
                        ],
                        _OPTION0: ["Persian", "Naga-woven", "celestial silk", "elemental-wool"],
                        _OPTION1: ["geomantic", "focal", "spiritual", "true north"],
                        _OPTION2: ["mandala", "yantra", "cosmogram", "sigil-map"],
                        _OPTION3: ["Kalachakra", "dream-catcher", "ancestral", "prophetic"],
                        _OPTION4: ["undisturbed", "perfectly aligned", "ritually correct", "symbolically potent"]
                    },
                    {
                        name: "Remove distracting mundane objects",
                        skills: ["labor", "introspection"],
                        intermediates: [
                            "Spotting a misplaced {_OPTION0}",
                            "Picking up a dropped {_OPTION1}",
                            "Wondering how a {_OPTION2} got in here",
                            "Placing items in the 'Lost and Found (Mundane)' {_OPTION3}",
                            "Ensuring only objects of {_OPTION4} significance remain",
                            "Appreciating the increased {_OPTION5} of the space"
                        ],
                        _OPTION0: ["quill", "ink pot", "snack wrapper", "mundane novel"],
                        _OPTION1: ["coin", "button", "glove", "shopping list"],
                        _OPTION2: ["rubber chicken", "spork", "garden gnome", "single sock"],
                        _OPTION3: ["box", "chest", "cubby", "dimensional pocket"],
                        _OPTION4: ["spiritual", "meditative", "ritual", "magical"],
                        _OPTION5: ["clarity", "focus", "serenity", "order"]
                    },
                    {
                        name: "Recharge mana focusing nodes",
                        skills: ["meditation", "order_magic", "enchanting", "mana_conservation"],
                        intermediates: [
                            "Identifying depleted {_OPTION0} nodes",
                            "Drawing ambient mana through a series of {_OPTION1} gestures",
                            "Channeling refined energy into a {_OPTION2} crystal matrix",
                            "Monitoring the node's {_OPTION3} levels",
                            "Sealing the node with a temporary {_OPTION4} sigil",
                            "Feeling the subtle thrum of a fully charged {_OPTION5}"
                        ],
                        _OPTION0: ["crystal", "geomantic", "astral", "ethereal"],
                        _OPTION1: ["arcane", "somatic", "ritualistic", "precise"],
                        _OPTION2: ["primary", "secondary", "amplifying", "stabilizing"],
                        _OPTION3: ["charge", "saturation", "resonance", "output"],
                        _OPTION4: ["containment", "conservation", "efficiency", "protection"],
                        _OPTION5: ["node", "network", "system", "conduit"]
                    },
                    {
                        name: "Cleanse the chamber of psychic echoes",
                        skills: ["meditation", "spectral_mastery", "abjuration", "psychometry"],
                        intermediates: [
                            "Tuning into the chamber's {_OPTION0} ambiance",
                            "Detecting lingering {_OPTION1} from past meditations",
                            "Employing a {_OPTION2} chant to dispel unwanted echoes",
                            "Using a {_OPTION3} focus to absorb stray thought-forms",
                            "Grounding residual psychic energy into the {_OPTION4}",
                            "Feeling the mental {_OPTION5} return to the room"
                        ],
                        _OPTION0: ["psychic", "mental", "emotional", "ethereal"],
                        _OPTION1: ["impressions", "emotions", "thought-forms", "memories"],
                        _OPTION2: ["sonic", "verbal", "runic", "silent"],
                        _OPTION3: ["crystal", "mirror", "symbol", "personal"],
                        _OPTION4: ["earth", "void", "elemental plane", "nearest ley line"],
                        _OPTION5: ["stillness", "clarity", "silence", "neutrality"]
                    },
                    {
                        name: "Transcribe meditative mantras onto scrolls",
                        skills: ["meditation", "scribing", "linguistics", "calligraphy"],
                        intermediates: [
                            "Selecting a high-quality {_OPTION0} parchment",
                            "Preparing {_OPTION1} ink infused with calming properties",
                            "Choosing a mantra for {_OPTION2} focus",
                            "Writing with precise {_OPTION3} strokes",
                            "Imbuing each character with meditative {_OPTION4}",
                            "Rolling and sealing the completed {_OPTION5} scroll"
                        ],
                        _OPTION0: ["vellum", "papyrus", "lambskin", "moon-fiber"],
                        _OPTION1: ["lapis lazuli", "silver", "dreamwood sap", "star-petal"],
                        _OPTION2: ["clarity", "peace", "insight", "elemental"],
                        _OPTION3: ["calligraphic", "runic", "sigilic", "ancient"],
                        _OPTION4: ["intent", "energy", "serenity", "power"],
                        _OPTION5: ["sacred", "empowered", "instructional", "personal"]
                    },
                    {
                        name: "Prepare ritual tea for introspection",
                        skills: ["meditation", "provisions", "alchemy", "introspection"],
                        intermediates: [
                            "Selecting {_OPTION0} leaves known for enhancing clarity",
                            "Heating {_OPTION1} water to the perfect temperature",
                            "Steeping the tea in a {_OPTION2} teapot",
                            "Adding a drop of {_OPTION3} essence",
                            "Pouring the tea into {_OPTION4} cups",
                            "Savoring the aroma before the {_OPTION5} begins"
                        ],
                        _OPTION0: ["Silver Lotus", "Mind's Eye", "Oracle's Whisper", "Starleaf"],
                        _OPTION1: ["spring", "blessed", "twice-boiled", "moon-kissed"],
                        _OPTION2: ["clay", "porcelain", "silver", "enchanted"],
                        _OPTION3: ["honey", "lotus nectar", "starlight dew", "clarity"],
                        _OPTION4: ["delicate", "runed", "simple ceramic", "scrying"],
                        _OPTION5: ["meditation", "ritual", "contemplation", "journey"]
                    },
                    {
                        name: "Guide apprentices in basic focus techniques",
                        skills: ["meditation", "pedagogy", "leadership", "tutoring"],
                        intermediates: [
                            "Gathering the {_OPTION0} apprentices",
                            "Explaining the importance of a {_OPTION1} mind",
                            "Leading a simple {_OPTION2} exercise",
                            "Correcting {_OPTION3} posture and breathing",
                            "Answering {_OPTION4} questions patiently",
                            "Observing their progress in achieving initial {_OPTION5}"
                        ],
                        _OPTION0: ["eager", "distracted", "talented", "clumsy"],
                        _OPTION1: ["still", "clear", "centered", "receptive"],
                        _OPTION2: ["breathing", "visualization", "sensory awareness", "candle-gazing"],
                        _OPTION3: ["slumped", "restless", "shallow", "erratic"],
                        _OPTION4: ["insightful", "basic", "repetitive", "off-topic"],
                        _OPTION5: ["focus", "calm", "concentration", "mindfulness"]
                    }
                ],
                storage_vault: [
                    {
                        name: "Organize resource crates by type",
                        skills: ["labor", "logistics", "bookkeeping", "memory"],
                        intermediates: [
                            "Dragging a heavy crate of {_OPTION0}",
                            "Checking labels or peeking inside",
                            "Consulting the {_OPTION1} manifest",
                            "Stacking crates of {_OPTION2} together",
                            "Making a new {_OPTION3} label if needed",
                            "Updating the inventory of the {_OPTION4} section"
                        ],
                        _OPTION0: ["golem parts", "crystal shards", "alchemical ingredients", "raw ore"],
                        _OPTION1: ["master", "digital", "holographic", "ancient scroll"],
                        _OPTION2: ["herbs", "metals", "gems", "scrolls"],
                        _OPTION3: ["runic", "color-coded", "magically glowing", "self-updating"],
                        _OPTION4: ["Gems & Crystals", "Metals & Minerals", "Herbs & Reagents", "Artifact Components"]
                    },
                    {
                        name: "Dust off forgotten artifacts",
                        skills: ["labor", "magical_lore", "history", "appraisal"],
                        intermediates: [
                            "Locating a particularly dusty {_OPTION0}",
                            "Using a soft brush made of {_OPTION1} bristles",
                            "Carefully wiping away centuries of {_OPTION2} accumulation",
                            "Revealing intricate {_OPTION3} carvings",
                            "Trying to recall the artifact's {_OPTION4} or origin",
                            "Wondering if it is valuable or just {_OPTION5}"
                        ],
                        _OPTION0: ["statue", "amulet", "weapon", "codex"],
                        _OPTION1: ["griffin feather", "manticore hair", "dragon's whisker", "enchanted silk"],
                        _OPTION2: ["cobweb", "magical residue", "temporal", "ectoplasmic"],
                        _OPTION3: ["runic", "celestial", "demonic", "forgotten"],
                        _OPTION4: ["purpose", "legend", "creator", "curse"],
                        _OPTION5: ["cursed", "inert", "dangerously powerful", "historically significant"]
                    },
                    {
                        name: "Take inventory of hoarded supplies",
                        skills: ["bookkeeping", "memory", "appraisal", "logistics"],
                        intermediates: [
                            "Opening a chest overflowing with {_OPTION0}",
                            "Counting individual {_OPTION1} units",
                            "Ticking items off the old {_OPTION2} list",
                            "Noting discrepancies and {_OPTION3} items",
                            "Estimating the value of a pile of {_OPTION4}",
                            "Sighing at the sheer amount of {_OPTION5} accumulated"
                        ],
                        _OPTION0: ["gemstones", "gold coins", "mana potions", "spell components"],
                        _OPTION1: ["phials", "ingots", "scrolls", "bundles"],
                        _OPTION2: ["parchment", "clay tablet", "crystal-based", "magical"],
                        _OPTION3: ["unaccounted", "damaged", "surprisingly multiplied", "transmuted"],
                        _OPTION4: ["dragon scales", "phoenix feathers", "shadowsilk bolts", "sunstone nuggets"],
                        _OPTION5: ["stuff", "loot", "reagents", "clutter"]
                    },
                    {
                        name: "Clear cobwebs from treasure chests",
                        skills: ["labor", "cleaning"],
                        intermediates: [
                            "Approaching a {_OPTION0} chest",
                            "Wielding a long-handled {_OPTION1} duster",
                            "Sweeping away thick curtains of {_OPTION2} cobwebs",
                            "Dodging a startled (and possibly giant) {_OPTION3}",
                            "Checking for any remaining {_OPTION4} nests",
                            "Admiring the now visible {_OPTION5} carvings on the chest"
                        ],
                        _OPTION0: ["ancient oak", "iron-bound", "rune-covered", "suspiciously silent"],
                        _OPTION1: ["feather", "bristle", "enchanted", "anti-spider"],
                        _OPTION2: ["ancient", "glistening", "magically reinforced", "slightly sticky"],
                        _OPTION3: ["spider", "cave cricket", "dust bunny elemental", "silverfish"],
                        _OPTION4: ["egg sacs", "spiderling", "web-based trap", "magical"],
                        _OPTION5: ["intricate", "warning", "ownership", "protective"]
                    },
                    {
                        name: "Label unmarked containers carefully",
                        skills: ["labor", "runes", "magical_item_analysis", "memory"],
                        intermediates: [
                            "Picking up an unlabeled {_OPTION0} jar",
                            "Sniffing cautiously at the contents or not",
                            "Attempting to identify the {_OPTION1} substance within",
                            "Inscribing a temporary label with {_OPTION2} chalk",
                            "Deciding on a permanent {_OPTION3} rune for identification",
                            "Hoping the contents are not something that eats {_OPTION4}"
                        ],
                        _OPTION0: ["clay", "glass", "metal", "strangely pulsing"],
                        _OPTION1: ["powdered", "liquid", "gaseous", "semi-sentient"],
                        _OPTION2: ["blessed", "mundane", "glow-in-the-dark", "self-erasing"],
                        _OPTION3: ["preservation", "warning", "contents-identifying", "elemental affinity"],
                        _OPTION4: ["labels", "containers", "curiosity", "magic users"]
                    },
                    {
                        name: "Reinforce weak shelving under heavy loads",
                        skills: ["labor", "construction", "woodworking", "smithing"],
                        intermediates: [
                            "Noticing a shelf groaning under stacks of {_OPTION0}",
                            "Fetching {_OPTION1} planks and metal braces",
                            "Carefully unloading the {_OPTION2} items",
                            "Nailing or {_OPTION3} new supports into place",
                            "Testing the shelf's new {_OPTION4}",
                            "Restacking the items hopefully more {_OPTION5}"
                        ],
                        _OPTION0: ["lead ingots", "obsidian blocks", "grimoires bound in iron", "petrified dragon eggs"],
                        _OPTION1: ["ironwood", "steel", "stone", "magically hardened"],
                        _OPTION2: ["heavy", "fragile", "cursed", "unstable"],
                        _OPTION3: ["bolting", "welding", "magically fusing", "conjuring"],
                        _OPTION4: ["strength", "stability", "load capacity", "structural integrity"],
                        _OPTION5: ["securely", "evenly", "logically", "artistically"]
                    },
                    {
                        name: "Sweep vault passages for traps and dust",
                        skills: ["labor", "trap_handling", "perception", "stealth"],
                        intermediates: [
                            "Entering a dark and {_OPTION0} passage",
                            "Using a {_OPTION1} broom to sweep ahead",
                            "Listening for the click of a {_OPTION2} mechanism",
                            "Carefully disarming a {_OPTION3} glyph",
                            "Sweeping piles of {_OPTION4} dust into a bag",
                            "Feeling relieved after passing a {_OPTION5} section"
                        ],
                        _OPTION0: ["dusty", "ominous", "rarely used", "trap-laden"],
                        _OPTION1: ["ten-foot", "enchanted", "weighted", "decoy"],
                        _OPTION2: ["pressure plate", "tripwire", "magical", "scuttling"],
                        _OPTION3: ["fireball", "poison dart", "net", "teleportation"],
                        _OPTION4: ["ancient", "sparkling", "cursed", "strangely warm"],
                        _OPTION5: ["particularly suspicious", "recently reset", "notoriously trapped", "alarmingly quiet"]
                    },
                    {
                        name: "Polish guarded relics and valuables",
                        skills: ["labor", "magical_item_analysis", "artisanry", "lapidary_arts"],
                        intermediates: [
                            "Approaching the {_OPTION0} of Unending Bling",
                            "Selecting a {_OPTION1} polishing cloth infused with protection spells",
                            "Gently rubbing a {_OPTION2} crown careful of its enchantments",
                            "Buffing a set of {_OPTION3} goblets",
                            "Applying a thin coat of {_OPTION4} wax to a dragon's egg",
                            "Stepping back to admire the renewed {_OPTION5} of the treasure"
                        ],
                        _OPTION0: ["Pedestal", "Display Case", "Altar", "Guardian Golem's Hoard"],
                        _OPTION1: ["unicorn hair", "dwarven silk", "elfin chamois", "gnomish microfiber"],
                        _OPTION2: ["lich king's", "sunken empire's", "archmage's", "forgotten deity's"],
                        _OPTION3: ["diamond-encrusted", "solid gold", "never-empty", "poison-detecting"],
                        _OPTION4: ["preservation", "anti-tarnish", "dragon-repellent", "lustrous"],
                        _OPTION5: ["sparkle", "radiance", "magical aura", "gleam"]
                    },
                    {
                        name: "Secure loose gemstones and ingots",
                        skills: ["labor", "legerdemain", "appraisal", "lapidary_arts"],
                        intermediates: [
                            "Spotting a scattering of loose {_OPTION0}",
                            "Carefully picking up a shimmering {_OPTION1}",
                            "Checking if any have rolled into a {_OPTION2} crevice",
                            "Placing them into a {_OPTION3} velvet bag",
                            "Ensuring the {_OPTION4} chest lid is properly closed",
                            "Counting the secured items for the {_OPTION5}"
                        ],
                        _OPTION0: ["rubies", "emeralds", "diamonds", "soul gems"],
                        _OPTION1: ["star sapphire", "black diamond", "fire opal", "perfectly cut"],
                        _OPTION2: ["dark", "bottomless", "monster-inhabited", "trap-triggering"],
                        _OPTION3: ["rune-stitched", "reinforced", "lead-lined", "bottomless"],
                        _OPTION4: ["treasure", "ingot", "gem", "overflowing"],
                        _OPTION5: ["ledger", "inventory", "peace of mind", "next appraisal"]
                    },
                    {
                        name: "Update the vault magical ledger",
                        skills: ["bookkeeping", "magical_lore", "scribing", "memory"],
                        intermediates: [
                            "Opening the ancient {_OPTION0} ledger",
                            "Dipping a {_OPTION1} quill into ever-full ink",
                            "Cross-referencing with the latest {_OPTION2} reports",
                            "Noting the addition of the {_OPTION3} of a Thousand Screams",
                            "Correcting a previous entry about the Orb of {_OPTION4}",
                            "Closing the ledger with a {_OPTION5} clasp"
                        ],
                        _OPTION0: ["dragon-hide bound", "iron-clad", "self-updating", "holographic"],
                        _OPTION1: ["phoenix feather", "griffin claw", "runed silver", "self-writing"],
                        _OPTION2: ["acquisition", "appraisal", "de-cursing", "containment"],
                        _OPTION3: ["Sceptre", "Amulet", "Dagger", "Music Box"],
                        _OPTION4: ["Confusion", "Slightly-Off-Key Singing", "Infinite Puns", "Temporary Blindness"],
                        _OPTION5: ["satisfying", "magical", "secure", "ominous"]
                    },
                    {
                        name: "Reset arcane locks and wards",
                        skills: ["order_magic", "lockpicking", "enchanting", "magical_lore"],
                        intermediates: [
                            "Approaching a door secured by {_OPTION0} glowing runes",
                            "Consulting the {_OPTION1} schematics for the warding sequence",
                            "Carefully disabling the outer {_OPTION2} layer",
                            "Recalibrating the {_OPTION3} crystal in the lock mechanism",
                            "Inputting the new {_OPTION4} sequence",
                            "Feeling the wards snap back into place with renewed {_OPTION5}"
                        ],
                        _OPTION0: ["pulsating", "shifting", "ancient", "newly installed"],
                        _OPTION1: ["master", "warden's", "emergency", "original"],
                        _OPTION2: ["alarm", "decoy", "mana drain", "illusory"],
                        _OPTION3: ["focusing", "key", "attunement", "power"],
                        _OPTION4: ["activation", "passphrase", "gestural", "psychic"],
                        _OPTION5: ["vigor", "strength", "complexity", "impenetrability"]
                    },
                    {
                        name: "Appraise newly acquired treasures",
                        skills: ["appraisal", "magical_item_analysis", "commerce_and_trade", "history"],
                        intermediates: [
                            "Examining a newly found {_OPTION0} goblet",
                            "Using a jeweler's loupe on an inscribed {_OPTION1}",
                            "Casting a minor {_OPTION2} spell to detect enchantments",
                            "Consulting a tome on {_OPTION3} artifacts",
                            "Estimating its value in {_OPTION4} gold pieces",
                            "Deciding whether to sell study or store the {_OPTION5}"
                        ],
                        _OPTION0: ["jeweled", "plain-looking", "strangely humming", "cursed-looking"],
                        _OPTION1: ["ring", "bracer", "pendant", "tablet"],
                        _OPTION2: ["identification", "aura reading", "history revealing", "curse detection"],
                        _OPTION3: ["ancient", "rare", "lost civilization", "forbidden"],
                        _OPTION4: ["thousands of", "a modest sum of", "an obscene amount of", "unquantifiable"],
                        _OPTION5: ["item", "treasure", "artifact", "piece of junk"]
                    },
                    {
                        name: "Identify and contain cursed items",
                        skills: ["magical_item_analysis", "order_magic", "death_magic", "risk_assessment"],
                        intermediates: [
                            "Carefully approaching a {_OPTION0} that radiates unease",
                            "Donning protective {_OPTION1} gauntlets",
                            "Using a {_OPTION2} rod to poke the suspicious item",
                            "Confirming a {_OPTION3} curse with a detection spell",
                            "Placing the item into a {_OPTION4} containment box",
                            "Labeling the box with multiple {_OPTION5} warnings"
                        ],
                        _OPTION0: ["dagger", "mirror", "doll", "music box"],
                        _OPTION1: ["lead-lined", "rune-etched", "silver-woven", "abjuration-infused"],
                        _OPTION2: ["silver", "ten-foot", "divining", "non-conductive"],
                        _OPTION3: ["soul-binding", "luck-draining", "transformation", "babbling"],
                        _OPTION4: ["lead-lined", "warded", "extra-dimensional", "null-magic"],
                        _OPTION5: ["danger", "do not open", "curse of instant regret", "contact head archivist"]
                    },
                    {
                        name: "Create hidden compartments for sensitive items",
                        skills: ["stealth", "engineering", "woodworking", "legerdemain"],
                        intermediates: [
                            "Selecting a sturdy {_OPTION0} chest for modification",
                            "Measuring out space for a false {_OPTION1}",
                            "Carefully cutting and fitting {_OPTION2} panels",
                            "Installing a nearly invisible {_OPTION3} mechanism",
                            "Testing the compartment with a decoy {_OPTION4}",
                            "Admiring the seamless and {_OPTION5} new hiding spot"
                        ],
                        _OPTION0: ["oak", "iron", "bookcase", "floorboard section"],
                        _OPTION1: ["bottom", "lid", "side", "back"],
                        _OPTION2: ["wooden", "metal", "camouflaged", "illusory"],
                        _OPTION3: ["spring-loaded", "pressure-sensitive", "magical trigger", "puzzle-based"],
                        _OPTION4: ["valuable", "document", "potion", "embarrassing personal item"],
                        _OPTION5: ["undetectable", "cleverly disguised", "perfectly hidden", "ingenious"]
                    },
                    {
                        name: "Rotate perishable magical components",
                        skills: ["alchemy", "magical_lore", "logistics", "memory"],
                        intermediates: [
                            "Checking the {_OPTION0} date on a jar of dried Mandrake root",
                            "Moving older batches of {_OPTION1} to the front",
                            "Discarding any {_OPTION2} reagents into a neutralizing solution",
                            "Noting which components like {_OPTION3} need restocking soon",
                            "Ensuring proper storage conditions for {_OPTION4} eyes",
                            "Updating the {_OPTION5} chart for component freshness"
                        ],
                        _OPTION0: ["expiration", "best-by", "harvest", "infusion"],
                        _OPTION1: ["phoenix tears", "dragon's blood", "unicorn horn powder", "pixie dust"],
                        _OPTION2: ["spoiled", "inert", "dangerously unstable", "transmuted"],
                        _OPTION3: ["glowmoss", "shadowsilk", "ectoplasm", "moonpetal dew"],
                        _OPTION4: ["newt", "basilisk", "beholder", "spider"],
                        _OPTION5: ["rotation", "inventory", "alchemical", "perishables"]
                    }
                ],
                kitchen: [
                    {
                        name: "Scrub cauldrons and stew pots",
                        skills: ["labor", "provisions", "stamina", "cleaning"],
                        intermediates: ["Soaking with {_OPTION0} water", "Scouring with {_OPTION1} sand", "Polishing with a {_OPTION2} cloth", "Inspecting for any remaining {_OPTION3} residue", "Rinsing with enchanted spring water", "Stacking them near the everburning hearth"],
                        _OPTION0: ["boiling", "blessed", "purified", "elemental"],
                        _OPTION1: ["silver", "volcanic", "river", "crystal"],
                        _OPTION2: ["linen", "silk", "wool", "enchanted"],
                        _OPTION3: ["grease", "magic", "food", "potion"]
                    },
                    {
                        name: "Organize exotic spice racks",
                        skills: ["provisions", "refined_palate", "memory", "foraging"],
                        intermediates: ["Identifying {_OPTION0} spices by scent", "Checking labels written in {_OPTION1}", "Arranging jars alphabetically by their {_OPTION2} name", "Wiping dust from {_OPTION3} containers", "Noting low stock of {_OPTION4}", "Cross-referencing with the latest {_OPTION5} recipe book"],
                        _OPTION0: ["fiery", "aromatic", "rare", "otherworldly"],
                        _OPTION1: ["Dwarvish runes", "Elven script", "Draconic symbols", "Orcish pictograms"],
                        _OPTION2: ["common", "magical", "planetary", "astral"],
                        _OPTION3: ["crystal", "clay", "silver", "wooden"],
                        _OPTION4: ["Dragon Peppers", "Moonpetal Dust", "Phoenix Ashes", "Shadowsalt"],
                        _OPTION5: ["Gorgon Ramesses' Cooking Compendium", "Archmage Antoine's Alchemical Appetizers", "Hag Agatha's Herbal Delights", "Griffin Gourmet's Guide to Sky-High Cuisine"]
                    },
                    {
                        name: "Wipe down preparation surfaces",
                        skills: ["labor", "provisions", "hygiene"],
                        intermediates: ["Spraying with a {_OPTION0} cleaning solution", "Scrubbing away stubborn {_OPTION1} stains", "Wiping with a magically absorbent {_OPTION2} sponge", "Buffing the {_OPTION3} countertops until they gleam", "Applying a thin layer of protective {_OPTION4} wax", "Ensuring no {_OPTION5} residue remains for the next concoction"],
                        _OPTION0: ["citrus-infused", "alchemically potent", "naturally derived", "blessed"],
                        _OPTION1: ["potion", "blood", "ectoplasm", "unknown goo"],
                        _OPTION2: ["sea", "mana", "crystal", "living"],
                        _OPTION3: ["stone", "marble", "obsidian", "enchanted wood"],
                        _OPTION4: ["bees", "dragonscale", "gleaming", "anti-bacterial"],
                        _OPTION5: ["magical", "chemical", "sticky", "slimy"]
                    },
                    {
                        name: "Mop the greasy and occasionally sticky floor",
                        skills: ["labor", "stamina", "cleaning"],
                        intermediates: ["Pouring {_OPTION0} cleansing liquid into a heavy bucket", "Wringing out the {_OPTION1} mop head with effort", "Scrubbing at a patch of stubborn {_OPTION2}", "Maneuvering around heavy {_OPTION3} legs", "Replacing the dirty {_OPTION4} water with fresh", "Admiring the briefly shimmering clean floor before the next spill"],
                        _OPTION0: ["bubbling", "pine-scented", "consecrated", "self-heating"],
                        _OPTION1: ["ogre-hair", "elemental-infused", "self-wringing", "ancient"],
                        _OPTION2: ["ectoplasm", "spilled rejuvenation potion", "troll jam", "dragon grease"],
                        _OPTION3: ["cauldron", "table", "apprentice", "kitchen golem"],
                        _OPTION4: ["murky", "glowing", "viscous", "strangely sentient"]
                    },
                    {
                        name: "Restock basic and magical ingredients",
                        skills: ["provisions", "alchemy", "bookkeeping", "logistics"],
                        intermediates: ["Checking the {_OPTION0} inventory ledger", "Fetching {_OPTION1} from the magically chilled storage", "Unpacking a crate of newly delivered {_OPTION2} from the Caravan Guild", "Arranging {_OPTION3} on designated, rune-labelled shelves", "Updating stock levels with a {_OPTION4} quill on the requisition scroll", "Noticing an order of {_OPTION5} is critically low"],
                        _OPTION0: ["master", "digitalized (gnomish tech)", "ethereal", "prophetic parchment"],
                        _OPTION1: ["Phoenix Eggs", "Powdered Unicorn Horn", "Dried Mandrake Root", "Bottled Starlight"],
                        _OPTION2: ["Glowcap Mushrooms from the Underdark", "Sunstone Crystals from desert nomads", "River Serpent Scales from the Serpent's Spine", "Shadow Lily Nectar from the Shadowfel"],
                        _OPTION3: ["rare herbs", "volatile potions", "finely ground reagents", "glittering crystals"],
                        _OPTION4: ["self-inking", "griffin feather", "enchanted", "invisible ink revealing"],
                        _OPTION5: ["Hydra Hearts for regeneration potions", "Gorgon's Tears for petrification reversal", "Djinn Lamps (empty) for elemental binding", "Philosopher's Stone fragments for transmutation"]
                    },
                    {
                        name: "Dispose of food scraps to the composting worms",
                        skills: ["labor", "provisions", "farming", "nature_magic"],
                        intermediates: ["Gathering fragrant {_OPTION0} scraps from collection bins", "Carrying a heavy bucket towards the {_OPTION1} worm farm in the undercroft", "Carefully opening the {_OPTION2} lid, releasing an earthy aroma", "Tipping the contents for the wriggling, grateful {_OPTION3}", "Sprinkling some {_OPTION4} growth enhancer on top", "Closing the lid and whispering a {_OPTION5} druidic growth charm"],
                        _OPTION0: ["vegetable peelings", "magical beast offcuts", "enchanted fruit cores", "leftover potion dregs"],
                        _OPTION1: ["subterranean", "magically accelerated", "ever-hungry", "oversized"],
                        _OPTION2: ["heavy stone", "runic-sealed wooden", "singing mushroom", "self-sealing clay"],
                        _OPTION3: ["Giant Earthworms of the Deep", "Mana Grubs that glow faintly", "Carrion Crawlers (young)", "Grave Worms (vegetarian diet)"],
                        _OPTION4: ["decay acceleration powder", "nutrient-rich bone meal", "mana-infused soil", "earth elemental essence"],
                        _OPTION5: ["quickening", "enriching", "potent", "secret"]
                    },
                    {
                        name: "Clean the everburning hearth or oven",
                        skills: ["labor", "pyromancy", "provisions", "engineering"],
                        intermediates: ["Temporarily dimming the {_OPTION0} flames with a pyromantic gesture", "Scraping out {_OPTION1} ash with a {_OPTION2} adamantine shovel", "Wiping soot from the {_OPTION3} fire-resistant bricks", "Checking the integrity of the heat-focusing {_OPTION4} runes", "Polishing the {_OPTION5} metalwork framing the hearth", "Reigniting the flames to their full {_OPTION6} glory with a snap of fingers"],
                        _OPTION0: ["eternal", "magical", "elemental-bound", "sacred phoenix"],
                        _OPTION1: ["magical", "cursed (but inert)", "glowing ember", "never-ending supply of"],
                        _OPTION2: ["mithril", "obsidian", "dragonbone", "enchanted iron"],
                        _OPTION3: ["fire-resistant", "rune-etched", "ancient dwarven", "self-repairing obsidian"],
                        _OPTION4: ["containment", "heat amplification", "efficiency", "elemental binding"],
                        _OPTION5: ["brass fittings", "copper pipes", "adamantine grates", "silver inlays"],
                        _OPTION6: ["roaring", "dancing", "whispering", "controlled blue"]
                    },
                    {
                        name: "Sharpen carving knives and cleavers",
                        skills: ["provisions", "smithing", "labor", "butchery"],
                        intermediates: ["Selecting a {_OPTION0} whetstone from the armory", "Applying {_OPTION1} honing oil to its surface", "Drawing the {_OPTION2} blade across the stone at a precise, ancestral angle", "Testing the sharpness on a {_OPTION3} floating feather", "Honing the razor edge with a {_OPTION4} steel", "Carefully wiping and storing the gleaming, hungry {_OPTION5}"],
                        _OPTION0: ["diamond-grit", "water-magic infused", "volcanic glass", "enchanted dwarven"],
                        _OPTION1: ["sharpening", "sacred anointing", "elemental", "cooling dragon"],
                        _OPTION2: ["orcish cleaver 'Gutrender'", "elven carving knife 'Leafblade'", "dwarven butchering axe 'Beardtrimmer'", "goblin shiv 'Pointy'"],
                        _OPTION3: ["piece of parchment that splits silently", "hanging hair that parts instantly", "target dummy's finger (willingly offered)", "shaft of sunlight"],
                        _OPTION4: ["dragonbone", "mithril", "adamantine", "obsidian honing rod"],
                        _OPTION5: ["blade", "tool of art", "weapon against tough roasts", "instrument of culinary precision"]
                    },
                    {
                        name: "Sort ladles spoons and spatulas",
                        skills: ["provisions", "analysis_and_logic", "memory"],
                        intermediates: ["Emptying the {_OPTION0} utensil drawer onto a clean cloth", "Wiping down each {_OPTION1} silver item with care", "Separating {_OPTION2} soup ladles from {_OPTION3} potion spatulas", "Arranging them by size and {_OPTION4} material, following the Guild's strict protocol", "Placing them neatly into their respective {_OPTION5} velvet-lined compartments", "Finding a rogue {_OPTION6} stirring rod, likely borrowed by an alchemist"],
                        _OPTION0: ["overflowing", "chaotic", "cluttered", "mysteriously humming"],
                        _OPTION1: ["gleaming silver", "polished wood", "carved bone", "etched crystal"],
                        _OPTION2: ["cauldron-sized soup", "delicate serving", "alchemical measuring", "scrying bowl"],
                        _OPTION3: ["ingredient mixing", "residue scraping", "omelette flipping", "enchanted runic"],
                        _OPTION4: ["magical property affinity", "intended alchemical use", "rune marking sequence", "frequency of use"],
                        _OPTION5: ["velvet-lined", "clearly labelled", "custom-fit magical", "rotating enchanted"],
                        _OPTION6: ["alchemical glass", "enchanted stirring", "borrowed ceremonial", "slightly sentient wooden"]
                    },
                    {
                        name: "Empty bins of peelings and offcuts",
                        skills: ["labor", "provisions", "urban_survival"],
                        intermediates: ["Lifting a surprisingly heavy {_OPTION0} bin overflowing with vegetable matter", "Carrying it carefully towards the {_OPTION1} disposal chute leading to the worm farm", "Avoiding tripping over a {_OPTION2} scurrying familiar", "Tipping the contents into the gaping, steaming {_OPTION3} maw of the chute", "Replacing the bin with a fresh {_OPTION4} magically scented liner", "Spraying a deodorizing {_OPTION5} charm to cleanse the air"],
                        _OPTION0: ["wooden", "metal", "self-emptying (but currently malfunctioning)", "cursed (makes contents heavier)"],
                        _OPTION1: ["compost heap", "monster-feeding pit", "void portal (small, temporary)", "recycling elemental"],
                        _OPTION2: ["kitchen imp helper", "wandering cauldron on tiny legs", "pile of animated potatoes", "sleeping apprentice under a table"],
                        _OPTION3: ["chute's dark", "monster's waiting", "portal's swirling", "grinder's hungry"],
                        _OPTION4: ["magically scented", "reinforced goblin-weave", "self-cleaning (minor enchantment)", "disposable parchment"],
                        _OPTION5: ["air-freshening breeze", "anti-pest warding", "odor-nullifying vacuum", "illusionary potpourri"]
                    },
                    {
                        name: "Prepare rations for expeditions",
                        skills: ["provisions", "survival", "logistics", "cooking"],
                        intermediates: ["Consulting the {_OPTION0} expedition manifest for duration and personnel", "Portioning out {_OPTION1} high-energy trail mix into individual pouches", "Wrapping {_OPTION2} stone-hard hardtack in oilcloth for preservation", "Sealing pouches of dried, spiced {_OPTION3} meat against spoilage", "Counting out {_OPTION4} water purification tablets blessed by a cleric", "Packing everything into {_OPTION5} magically expanded satchels", "Adding a small, hidden {_OPTION6} morale booster treat for each member"],
                        _OPTION0: ["upcoming perilous", "long-term underground", "scouting mission", "diplomatic envoy's catering"],
                        _OPTION1: ["ironwood nut and sunberry", "griffin jerky and roasted seeds", "dwarven rock biscuit", "elven waybread crumb"],
                        _OPTION2: ["stone-baked dwarven", "elven Lembas-like", "orcish iron", "twice-baked ship's"],
                        _OPTION3: ["wyvern strips", "dire boar jerky", "giant spider leg (surprisingly tasty)", "mystery salted"],
                        _OPTION4: ["alchemical purification", "cleric-blessed", "elemental-infused", "emergency teleport (single use, short range)"],
                        _OPTION5: ["sturdy leather", "expanded carrying capacity", "lightweight magical silk", "camouflaged beast hide"],
                        _OPTION6: ["candied ginger root", "honey cake square", "flask of potent dwarven ale (miniature)", "enchanted berry that tastes of home"]
                    },
                    {
                        name: "Bake enchanted bread for morale",
                        skills: ["provisions", "enchanting", "life_magic", "baking_pastry"],
                        intermediates: ["Kneading the {_OPTION0} dough with mana-infused hands, making it glow faintly", "Adding a pinch of powdered {_OPTION1} for courage", "Shaping loaves into uplifting {_OPTION2} forms", "Etching subtle {_OPTION3} runes of cheer and fellowship onto the crust before baking", "Baking in a {_OPTION4} oven blessed by a hearth spirit", "The aroma of {_OPTION5} bread filling the guild, lifting spirits", "Glazing the warm loaves with {_OPTION6} sun-kissed honey"],
                        _OPTION0: ["golden, glowing", "self-rising star-yeast", "ancient grain sourdough", "mana-enriched"],
                        _OPTION1: ["Sunpetal dust", "Laughing Cap mushroom spores", "Pixie Wing flakes", "Ground Moonstone slivers"],
                        _OPTION2: ["smiling sun faces", "happy griffin shapes", "singing sword silhouettes", "bountiful cornucopia designs"],
                        _OPTION3: ["joy", "courage", "fellowship", "vigor restoration"],
                        _OPTION4: ["dragon-fire brick", "elemental-powered crystal", "blessed clay", "arcane energy"],
                        _OPTION5: ["courage-inducing cinnamon", "hope-instilling honey-wheat", "friendship-binding rosemary", "heartwarming spiced apple"],
                        _OPTION6: ["elfin clover", "golden sun", "mana-infused crystal", "crystallized pixie"]
                    },
                    {
                        name: "Churn butter from manticore milk",
                        skills: ["provisions", "beast_mastery", "alchemy", "dairying"],
                        intermediates: ["Carefully pouring the volatile, {_OPTION0} manticore milk into the reinforced churn", "Adding a coagulant derived from {_OPTION1} to stabilize it", "Beginning the rhythmic, strenuous {_OPTION2} churning motion, warding against {_OPTION2_1}", "Feeling the mixture thicken into potent, {_OPTION3} butter", "Skimming off the slightly {_OPTION4} buttermilk for alchemical use", "Pressing the butter into {_OPTION5} molds depicting manticore visages", "Chilling the slightly {_OPTION6} butter in the ice-magic pantry"],
                        _OPTION0: ["fiery red", "acidic green", "electrically charged blue", "surprisingly placid white"],
                        _OPTION1: ["Cockatrice gizzard extract", "Basilisk venom (highly diluted)", "Gorgon's gaze (reflected and captured)", "Harpy feather ash"],
                        _OPTION2: ["vigorous", "enchanted (self-churning)", "hypnotic", "exhausting manual"],
                        _OPTION2_1: ["explosions", "corrosion", "accidental poisoning", "curdling"],
                        _OPTION3: ["spicy and fortifying", "tingling and energizing", "courage-inducing yet dangerous", "glowing with faint power"],
                        _OPTION4: ["caustic", "energizing", "mildly hallucinogenic", "surprisingly tasty (for some)"],
                        _OPTION5: ["roaring lion head", "stinging scorpion tail", "wise human face", "simple, unassuming block"],
                        _OPTION6: ["venomous (but edible)", "empowering (temporarily)", "courage-inducing (with side effects)", "dangerous-if-mishandled by non-initiates"]
                    },
                    {
                        name: "Ferment potent dwarven ale",
                        skills: ["fermentation_distillation", "alchemy", "customs"],
                        intermediates: ["Mashing {_OPTION0} iron-rich mountain barley in heated vats", "Boiling the wort with bitter {_OPTION1} cave hops and secret dwarven herbs", "Adding a strain of {_OPTION2} ancestral yeast, humming ancient songs to it", "Sealing the potent mixture in an {_OPTION3} rune-carved oak barrel", "Chanting a {_OPTION4} dwarven fermentation song to encourage the process", "Monitoring the {_OPTION5} pressure gauges and runic indicators closely", "Anticipating the first taste of the legendary, beard-strengthening {_OPTION6} brew"],
                        _OPTION0: ["iron-rich volcanic", "flame-toasted obsidian", "crystal-infused geode", "stone-ground ancestral"],
                        _OPTION1: ["shadow", "magma-kissed", "iron-laced", "glow-in-the-dark cave"],
                        _OPTION2: ["exceptionally hardy and alcohol-tolerant", "explosively potent and fast-acting", "long-bearded and wise", "singing (if you listen closely)"],
                        _OPTION3: ["rune-carved petrified", "iron-bound thunderwood", "obsidian-lined", "geode-encrusted"],
                        _OPTION4: ["boisterous and off-key", "solemn and rumbling", "secret and powerful", "very loud and enthusiastic"],
                        _OPTION5: ["bubbling and gurgling", "glowing faintly from within", "creaking ominously under pressure", "displaying prophetic runic patterns"],
                        _OPTION6: ["legendary 'Dragonsbreath'", "volatile 'Giantsbane'", "mind-bending 'Stoneshaper'", "bone-strengthening 'Adamant Ale'"]
                    },
                    {
                        name: "Identify and remove magically tainted foodstuffs",
                        skills: ["provisions", "magical_item_analysis", "toxicology", "arcane_sight"],
                        intermediates: ["Scanning shelves with an {_OPTION0} enchanted monocle, searching for discordant auras", "Waving a {_OPTION1} truth-detection crystal over suspicious-looking items", "Noticing a faint, sickly {_OPTION2} aura around some recently acquired {_OPTION3}", "Carefully isolating the tainted {_OPTION4} using telekinetic tongs", "Neutralizing its harmful magic with a sprinkle of {_OPTION5} counter-agent powder", "Disposing of the now inert residue in a {_OPTION6} lead-lined, rune-sealed container for deep burial"],
                        _OPTION0: ["truth-seeing", "aura-revealing", "poison-detecting", "curse-identifying"],
                        _OPTION1: ["quartz purity", "amethyst warding", "obsidian nullification", "diamond clarity"],
                        _OPTION2: ["sickly green miasma", "pulsing red malevolence", "chilling blue despair", "whispering shadow corruption"],
                        _OPTION3: ["exotic fruits from a cursed jungle", "cheese wheels from a haunted dairy", "jugs of wine from a vampire's cellar", "mysterious mushrooms offered by a shifty goblin"],
                        _OPTION4: ["glowing mushrooms that whisper secrets", "weeping sausages that leave trails of slime", "chattering teeth (disembodied, found in a pie)", "self-peeling potatoes that scream"],
                        _OPTION5: ["purification salt", "blessed water dew", "anti-magic dust", "containment rune chalk"],
                        _OPTION6: ["lead-lined vault", "rune-warded dimensional pocket", "extra-dimensional oubliette", "bottomless pit (temporarily summoned)"]
                    }
                ],
                stable: [
                    {
                        name: "Muck out griffin and hippogriff stalls",
                        skills: ["labor", "beast_mastery", "riding", "stamina"],
                        intermediates: ["Donning {_OPTION0} reinforced leather protective gear", "Wielding a {_OPTION1} rune-engraved pitchfork with practiced, weary ease", "Scooping piles of surprisingly large {_OPTION2} droppings into a reinforced barrow", "Avoiding a playful, razor-sharp nip from a nearby curious {_OPTION3}", "Wheeling the barrow to the designated, steaming {_OPTION4} manure heap outside the city walls", "Spreading fresh, sweet-smelling {_OPTION5} straw for bedding"],
                        _OPTION0: ["heavy leather and steel-toed boots", "enchanted linen (surprisingly resilient)", "golem-assisted exoskeleton (for the really big messes)", "surprisingly flimsy (but blessed) robes"],
                        _OPTION1: ["rune-engraved silver", "mithril-pronged", "blessed oaken", "self-cleaning (but slow)"],
                        _OPTION2: ["enormous, bowling ball-sized", "slightly magical and shimmering", "surprisingly fragrant (in a bad way)", "corrosive, smoking"],
                        _OPTION3: ["griffin fledgling", "hippogriff colt", "pegasus foal with attitude", "young manticore with boundary issues"],
                        _OPTION4: ["towering, mountain-like", "steaming and vaguely alive", "surprisingly fertile (gardeners love it)", "slightly dangerous (watch for dung beetles the size of fists)"],
                        _OPTION5: ["golden sun-dried", "enchanted sleep-inducing", "mountain cloud-soft", "feather-soft and hypoallergenic"]
                    },
                    {
                        name: "Brush down mounts equine and otherwise",
                        skills: ["labor", "beast_mastery", "riding", "animal_companionship"],
                        intermediates: ["Approaching a {_OPTION0} with a soothing murmur and an offering of {_OPTION0_1}", "Using a {_OPTION1} mithril curry comb to loosen caked mud and dander", "Following with a {_OPTION2} dragon-bristle body brush for achieving a brilliant shine", "Gently detangling a {_OPTION3} flowing, often magically imbued mane and tail", "Checking for any hidden {_OPTION4} ticks, burrs, or minor curses", "The mount expressing its deep contentment with a {_OPTION5} rumbling purr or soft nicker"],
                        _OPTION0: ["noble war steed", "fiery nightmare steed", "majestic royal griffin", "skittish silver hippogriff"],
                        _OPTION0_1: ["a sugar cube", "a piece of jerky", "a sky-apple", "a whispered compliment"],
                        _OPTION1: ["silver-chased", "dragonscale-studded", "enchanted self-warming", "whispering wind"],
                        _OPTION2: ["soft phoenix feather", "magic-infused polishing", "self-polishing elemental", "dwarven steel-bristle (for nightmares)"],
                        _OPTION3: ["flowing silken", "fiery ethereal", "feathered iridescent", "braided with warding charms"],
                        _OPTION4: ["shadow", "curse-bearing", "mana-draining", "particularly stubborn normal"],
                        _OPTION5: ["soft, grateful nicker", "rumbling, chest-vibrating purr (griffins)", "happy, whistling screech (hippogriffs)", "grateful snort of warm air (nightmares)"]
                    },
                    {
                        name: "Refill water troughs with fresh water",
                        skills: ["labor", "beast_mastery", "hydromancy", "animal_husbandry"],
                        intermediates: ["Emptying the old, algae-filled {_OPTION0} water from the stone troughs", "Scrubbing the trough interior with a stiff {_OPTION1} bristle brush and purifying salts", "Channeling fresh, cool water using a {_OPTION2} 'Create Water' spell or a water elemental's aid", "Or, if magic fails, carrying heavy buckets from the {_OPTION3} blessed well", "Adding a pinch of {_OPTION4} revitalizing mineral salts to the water", "Watching the grateful mounts eagerly {_OPTION5} lap up the clean water"],
                        _OPTION0: ["murky and insect-laden", "slime-covered and stagnant", "slightly glowing with unknown residue", "surprisingly clean (thanks to a minor enchantment)"],
                        _OPTION1: ["stiff-bristled dwarven", "elemental-powered scouring", "self-scrubbing enchanted", "blessed silver-wire"],
                        _OPTION2: ["Create Water cantrip", "Summon Minor Water Elemental", "Aquatic Conduit sigil", "Purify Liquid charm"],
                        _OPTION3: ["enchanted everfull", "bottomless abyss (carefully!)", "talking gargoyle-guarded", "sacred spring-fed cistern"],
                        _OPTION4: ["revitalizing stamina", "stamina-boosting electrolytic", "magical fortifying", "elemental purity"],
                        _OPTION5: ["lap delicately", "gulp thirstily", "splash playfully", "delicately sip (unicorns only)"]
                    },
                    {
                        name: "Restock hay oats and specialized feed",
                        skills: ["labor", "beast_mastery", "bookkeeping", "provisions"],
                        intermediates: ["Checking feed levels in each {_OPTION0} stall's manger", "Hoisting a fragrant bale of {_OPTION1} sun-cured mountain hay onto your shoulder", "Scooping out precise measures of {_OPTION2} iron-fortified oats", "Preparing a special, protein-rich mix of {_OPTION3} for the carnivorous griffins", "Updating the {_OPTION4} perpetual feed inventory scroll with a charcoal stylus", "Noticing the supply of {_OPTION5} is alarmingly low and needs reordering from the plains nomads"],
                        _OPTION0: ["pegasus sky-loft", "unicorn glade-stall", "nightmare shadow-pen", "hippogriff aerie-coop"],
                        _OPTION1: ["sweet-smelling timothy", "nutrient-rich alfalfa", "sun-dried cloud", "moon-kissed elven"],
                        _OPTION2: ["iron-fortified warhorse", "magically enhanced racing", "fire-roasted dwarven", "lightning-charged storm"],
                        _OPTION3: ["Sunmetal Pellets and dried Sky-Herring", "Skyberries and Cloudfish Jerky", "Essence of Wind and powdered Cloudstone", "Freshly hunted mountain goats (on special occasions)"],
                        _OPTION4: ["everlasting parchment", "self-updating crystal slate", "golem-maintained clay tablet", "prophetic dream journal (surprisingly accurate for supplies)"],
                        _OPTION5: ["Phoenix Cherries (for nightmares' fiery breath)", "Rainbow Carrots (for unicorns' coat sheen)", "Star Oats (for pegasi's flight endurance)", "Lightning Bugs (for hippogriffs' aerial acrobatics)"]
                    },
                    {
                        name: "Organize tack harnesses and flying gear",
                        skills: ["labor", "riding", "beast_mastery", "leatherworking"],
                        intermediates: ["Untangling a frustrating mess of {_OPTION0} leather reins and straps", "Hanging heavy {_OPTION1} aerial saddles on their designated, reinforced racks", "Sorting {_OPTION2} enchanted flight goggles by prescription and magical property", "Checking all {_OPTION3} load-bearing straps for wear and tear, especially near buckles", "Polishing the {_OPTION4} silver buckles and ornamental studs until they shine", "Storing {_OPTION5} emergency featherfall parachutes in easily accessible chests"],
                        _OPTION0: ["griffin flight", "hippogriff training", "pegasus ceremonial", "nightmare battle"],
                        _OPTION1: ["sky-leather combat", "dragonhide armored", "enchanted silk racing", "feather-light scouting"],
                        _OPTION2: ["wind-cutting aerodynamic", "night-vision goggled", "aura-seeing divinatory", "fog-piercing clarity"],
                        _OPTION3: ["cinch", "harness quick-release", "saddlebag securing", "emergency landing gear deployment"],
                        _OPTION4: ["moon-silver celestial", "star-forged dwarven", "sun-gold elven", "rune-etched protective"],
                        _OPTION5: ["featherfall-enchanted silk", "self-deploying gnomish contraption", "spider-silk dragline", "blessed griffin-down"]
                    },
                    {
                        name: "Sweep stable aisles and courtyard",
                        skills: ["labor", "cleaning", "animal_husbandry"],
                        intermediates: ["Grabbing a {_OPTION0} surprisingly heavy broom from the tool shed", "Sweeping loose {_OPTION1} straw, dust, and feathers into growing piles", "Dodging a {_OPTION2} delivery cart laden with fresh supplies", "Gathering the piles into a {_OPTION3} magically expanding dustpan", "Emptying the contents into the designated {_OPTION4} compost bin near the gardens", "The air feeling slightly less {_OPTION5} and more breathable"],
                        _OPTION0: ["sturdy straw besom", "enchanted self-sweeping (but currently sulking)", "witch's borrowed flight-capable", "dwarven ironwood and bristle"],
                        _OPTION1: ["hay fragments", "molted feathers of various sizes", "spilled oats and seeds", "glittering scales from unknown creatures"],
                        _OPTION2: ["hay bale", "feed sack", "newly arrived (and terrified) recruit", "runaway imp causing chaos"],
                        _OPTION3: ["giant iron", "magically expanding canvas", "talking (and complaining) enchanted", "long-handled silver"],
                        _OPTION4: ["designated stable", "ever-hungry monstrous", "transforming alchemical", "slightly magical and self-sorting"],
                        _OPTION5: ["dusty and sneeze-inducing", "chaotic and feather-filled", "dung-scented and fly-ridden", "suffocatingly stale"]
                    },
                    {
                        name: "Repair worn reins and saddlebags",
                        skills: ["leatherworking", "beast_mastery", "riding", "artisanry"],
                        intermediates: ["Inspecting a dangerously frayed {_OPTION0} rein that nearly caused an accident", "Selecting a supple piece of {_OPTION1} cured dragonhide for patching", "Stitching with an {_OPTION2} elven bone awl and enchanted sinew thread", "Replacing a broken {_OPTION3} mithril buckle with a newly forged one", "Applying {_OPTION4} weatherproofing conditioning oil to the repaired leather", "Testing the repair for {_OPTION5} strength by yanking on it vigorously"],
                        _OPTION0: ["griffin's primary steering", "hippogriff's emergency brake", "nightmare's soul-binding", "pegasus's cloud-guiding"],
                        _OPTION1: ["wyvern hide (flexible yet tough)", "basilisk skin (surprisingly supple)", "manticore leather (dangerously barbed)", "unicorn pelt (ethically sourced, of course)"],
                        _OPTION2: ["elfin silverwood", "dwarven runed steel", "magically guided self-stitching", "self-threading bone"],
                        _OPTION3: ["mithril quick-release", "adamantine heavy-duty", "bone toggle", "enchanted bronze self-fastening"],
                        _OPTION4: ["dragon's blood waterproofing", "unicorn tear softening", "manticore fat conditioning", "phoenix ash fireproofing"],
                        _OPTION5: ["aerial combat stress", "sudden dive maneuverability", "emergency stop reliability", "griffin's impatient tugging"]
                    },
                    {
                        name: "Polish saddles and protective barding",
                        skills: ["labor", "leatherworking", "smithing", "riding"],
                        intermediates: ["Applying fragrant {_OPTION0} polish to a well-worn leather flight saddle", "Buffing it to a {_OPTION1} battle-ready sheen with a soft sheepskin cloth", "Cleaning individual {_OPTION2} mithril chainmail links on a piece of griffin barding", "Removing {_OPTION3} rust spots from steel plate armor sections using acidic gel", "Checking for loose {_OPTION4} enchanted rivets or damaged articulated plates", "Admiring the gleaming, imposing, and now fully {_OPTION5} protective gear"],
                        _OPTION0: ["wyvern-fat and beeswax", "beeswax and rose oil (for pegasi)", "shadow-infused (for nightmares)", "sunstone dust (for griffins)"],
                        _OPTION1: ["battle-ready gleam", "parade-ground dazzling", "dangerously slick mirror", "subtly glowing protective"],
                        _OPTION2: ["mithril feather-light", "adamantine impervious", "dragonscale articulated", "shadowsteel silent"],
                        _OPTION3: ["bloodstain", "acidic slime", "magical corrosion", "stubborn demonic tarnish"],
                        _OPTION4: ["enchanted self-repairing", "explosive counter-measure (if mishandled)", "vibrating warning", "interlocking defense"],
                        _OPTION5: ["impressive and intimidating", "beautifully crafted and deadly", "newly enchanted with minor wards", "ready for parade or war"]
                    },
                    {
                        name: "Clear manure piles for the herb garden",
                        skills: ["labor", "farming", "beast_mastery", "logistics"],
                        intermediates: ["Shoveling highly potent {_OPTION0} manure into a reinforced wheelbarrow", "Navigating the winding path to the {_OPTION1} Arch-Alchemist's prized herb garden", "Carefully tipping the precious load onto the designated, steaming {_OPTION2} compost heap", "Spreading it evenly with a {_OPTION3} silver-tined rake, careful not to damage rare plants", "Receiving a rare nod of thanks from the notoriously prickly {_OPTION4} gnome head herbalist", "The scent of rich, magical {_OPTION5} earth mixing with the aroma of exotic herbs"],
                        _OPTION0: ["griffin 'sky-fertilizer'", "hippogriff 'aerie-gold'", "unicorn 'rainbow pellets' (surprisingly potent)", "nightmare 'shadow-mulch' (surprisingly fertile for dark herbs)"],
                        _OPTION1: ["rooftop sun-drenched", "secluded moon-kissed", "magically tended greenhouse", "carnivorous plant conservatory (they love it!)"],
                        _OPTION2: ["bubbling alchemical", "glowing with earth magic", "sentient (and hungry for more)", "perfectly balanced elemental"],
                        _OPTION3: ["silver-tined elven", "enchanted self-spreading", "borrowed (and slightly cursed) gnomish", "strangely light mithril"],
                        _OPTION4: ["cantankerous old", "cheerful but demanding", "potion-stained and eccentric", "slightly mad but brilliant"],
                        _OPTION5: ["magical compost", "potent fertilizer", "life-giving humus", "strangely aromatic and energy-rich"]
                    },
                    {
                        name: "Check and secure stall latches",
                        skills: ["labor", "beast_mastery", "engineering"],
                        intermediates: ["Walking down the long line of {_OPTION0} heavily reinforced stalls", "Testing each complex {_OPTION1} latch mechanism for looseness or tampering", "Tightening a {_OPTION2} adamantine bolt with a specialized dwarven torque wrench", "Applying {_OPTION3} silent-movement oil to a stiff, squeaking hinge", "Replacing a {_OPTION4} magically reinforced but worn-out spring in a latch", "Confirming each stall is {_OPTION5} secure against escape artists like {_OPTION6} the notorious hippogriff"],
                        _OPTION0: ["griffin aerie", "hippogriff nesting-box", "nightmare containment", "dire wolf den"],
                        _OPTION1: ["iron puzzle", "mithril combination", "rune-locked magical", "electrified deterrent"],
                        _OPTION2: ["heavy security", "enchanted anti-tamper", "self-tightening mechanical", "cursed (but only against unauthorized opening)"],
                        _OPTION3: ["never-rust alchemical", "silent-movement shadow", "elemental grease", "anti-magic nullification (for magical lockpickers)"],
                        _OPTION4: ["magically reinforced titanium", "adamantine coiled", "self-repairing clockwork", "captured air elemental powered"],
                        _OPTION5: ["doubly", "triply", "magically warded and", "absolutely, positively (hopefully)"],
                        _OPTION6: ["'Sparky' the Kleptomaniac Hippogriff", "'Shadowmane' the Phase-Shifting Nightmare", "'Clawdia' the Lockpicking Griffin", "'Houdini' the Vanishing Imp (who sometimes sleeps in stalls)"]
                    },
                    {
                        name: "Train young hippogriffs for aerial maneuvers",
                        skills: ["riding", "beast_mastery", "pedagogy", "acrobatics"],
                        intermediates: ["Coaxing a {_OPTION0} young, gangly hippogriff onto the cliffside training grounds", "Demonstrating a {_OPTION1} perfect barrel roll with an experienced, patient mount", "Guiding the fledgling through a gentle, wind-assisted {_OPTION2} ascent, offering encouragement", "Rewarding successful maneuvers and brave attempts with tasty {_OPTION3} sky-berries", "Practicing {_OPTION4} emergency landings in designated soft patches of cloud-moss", "A surge of pride watching the youngling finally master a wobbly but complete {_OPTION5} loop-the-loop", "Dodging an accidental, panicked {_OPTION6} dive bomb from the startled creature"],
                        _OPTION0: ["nervous and squawking", "excitable and nippy", "clumsy but eager", "overconfident and reckless"],
                        _OPTION1: ["flawless, dizzying", "textbook slow-motion", "slightly showy instructor's", "dangerously close to the cliff face"],
                        _OPTION2: ["spiral thermal", "straight upward gust-riding", "wind-assisted hovering", "hesitant, flapping"],
                        _OPTION3: ["tasty cloud", "encouraging sun", "magically enhanced agility", "rare star"],
                        _OPTION4: ["soft cloud-bank", "controlled stall", "tree-branch snag (gentle)", "water-ditch splash (shallow)"],
                        _OPTION5: ["perfect vertical", "wobbly but successful horizontal", "terrifyingly fast inverted", "surprisingly graceful (for a beginner)"],
                        _OPTION6: ["manure pellet", "feather storm", "claw-first (unintentionally)", "beak-first (with a yelp)"]
                    },
                    {
                        name: "Craft custom horseshoes for nightmare steeds",
                        skills: ["smithing", "beast_mastery", "pyromancy", "enchanting"],
                        intermediates: ["Heating {_OPTION0} shadowsteel ingots in the forge's roaring {_OPTION1} demonfire flames", "Hammering the glowing, malleable metal into a wicked, sharp-edged {_OPTION2} horseshoe shape on the rune-etched anvil", "Etching chilling runes of {_OPTION3} speed, terror, and flame-walking onto each shoe", "Quenching the still-hot shoe in a trough of {_OPTION4} Stygian soul-chilling oil", "Carefully fitting the slightly smoking shoe to a Nightmare's burning, ethereal {_OPTION5} hoof, using fire-resistant tongs", "The Nightmare snorting plumes of black smoke approvingly at its new, intimidating {_OPTION6} footwear"],
                        _OPTION0: ["cold iron from the Shadowfell", "meteoritic soul-infused starmetal", "volcanic obsidian mixed with bone ash", "crystallized fear essence"],
                        _OPTION1: ["hellfire-stoked", "dragon's breath bellows-driven", "balefire-enhanced", "elemental chaos"],
                        _OPTION2: ["wicked, serrated-edge", "burning, ever-hot", "silent, shadow-stepping", "fear-inducing, spiked"],
                        _OPTION3: ["unholy swiftness", "shadow-walking incorporeality", "flaming trails of dread", "unearthly silence and terror"],
                        _OPTION4: ["Stygian soul-chilling", "demon ichor tempering", "nightshade and blood", "ectoplasmic residue"],
                        _OPTION5: ["burning, immaterial", "shadowy, semi-solid", "massive, cloven", "surprisingly delicate, yet razor-sharp"],
                        _OPTION6: ["infernal clattering", "dread-inducing silent", "whispering shadow", "flame-wreathed terror-tread"]
                    },
                    {
                        name: "Apply healing salves to mount injuries",
                        skills: ["medicine", "beast_mastery", "life_magic", "alchemy"],
                        intermediates: ["Gently cleaning a {_OPTION0} deep, festering scratch on a griffin's powerful leg", "Selecting a jar of potent, glowing {_OPTION1} salve, carefully concocted with rare {_OPTION2}", "Murmuring a {_OPTION3} minor healing incantation to soothe pain and accelerate recovery", "Carefully applying the thick salve to the angry, {_OPTION4} wound with a sterile wooden applicator", "Bandaging the treated area with strips of {_OPTION5} self-adhesive, enchanted linen", "The mount visibly relaxing, showing signs of {_OPTION6} immediate relief and gratitude"],
                        _OPTION0: ["deep, bleeding", "minor, but irritating", "magically inflicted cursed", "self-inflicted (clumsy landing)"],
                        _OPTION1: ["golden phoenix-ash", "emerald green troll-blood", "pulsating life-essence", "soothing blue moonpetal"],
                        _OPTION2: ["Phoenix Tears and powdered Unicorn Horn", "Sunpetal essence and Basilisk blood (neutralized)", "Troll regeneration extract and silver_dew", "Dragon scale powder and elven moss"],
                        _OPTION3: ["soothing warmth", "regenerative light", "pain-numbing chill", "swift-mending temporal"],
                        _OPTION4: ["bleeding and inflamed", "infected and oozing", "cursed and resistant", "irritated and swollen"],
                        _OPTION5: ["self-tightening spider-silk", "antiseptic silver-weave", "regenerative moss-infused", "comforting blessed wool"],
                        _OPTION6: ["immediate, sighing", "gradual, visible mending", "faintly glowing", "audible (a soft purr or relieved snort)"]
                    },
                    {
                        name: "Braid warding charms into griffins manes",
                        skills: ["beast_mastery", "enchanting", "magical_lore", "order_magic"],
                        intermediates: ["Selecting auspiciously colored, magically treated {_OPTION0} silk ribbons", "Carving small, intricate {_OPTION1} protective runes onto polished {_OPTION2} beads of amber and jet", "Carefully braiding sections of the griffin's surprisingly soft, yet resilient {_OPTION3} feathered mane", "Weaving in the enchanted ribbons and the {_OPTION4} rune-carved, charmed beads with precision", "Chanting a low, rhythmic {_OPTION5} warding spell with each completed knot, focusing intent", "The griffin preening proudly, its mane now shimmering with faint {_OPTION6} protective magical energies"],
                        _OPTION0: ["sky blue and silver", "sun yellow and gold", "protective crimson and black", "camouflaging green and brown"],
                        _OPTION1: ["anti-arrow deflection", "fire resistance (minor)", "enhanced luck and perception", "confusion aura (for enemies targeting it)"],
                        _OPTION2: ["amber sunstone", "jet black obsidian", "moonstone silver", "carved dragon bone"],
                        _OPTION3: ["majestic, wind-tousled crest", "surprisingly soft neck-ruff", "electrically charged lightning-blue (storm griffins)", "iridescent rainbow-hued (royal griffins)"],
                        _OPTION4: ["gleaming, humming", "pulsating with stored energy", "whispering ancient secrets", "warm to the touch with imbued magic"],
                        _OPTION5: ["ancient shield-song", "powerful deflection verse", "subtle redirection cantrip", "rhythmic binding chant"],
                        _OPTION6: ["faint blue auroral", "golden, sun-like", "opalescent, shifting", "shadowy, obscuring"]
                    },
                    {
                        name: "Exercise restless dire wolves in the courtyard",
                        skills: ["beast_mastery", "athletics", "leadership", "animal_companionship"],
                        intermediates: ["Unlatching the {_OPTION0} reinforced iron kennel gates with extreme caution and respect", "Leading the eager, powerful pack of {_OPTION1} shadow-pelted dire wolves into the spacious, enclosed training courtyard", "Throwing an {_OPTION2} magically animated training dummy for them to chase, hunt, and 'destroy'", "Running alongside the thundering pack, testing your own considerable {_OPTION3} speed and endurance against theirs", "Practicing complex {_OPTION4} formation commands using hand signals and guttural calls", "The wolves panting happily, their wild, destructive {_OPTION5} energy productively spent for now", "Rewarding their obedience and effort with large, {_OPTION6} smoked boar bones from the kitchen stores"],
                        _OPTION0: ["reinforced iron-banded oak", "rune-warded silver-steel", "electrified containment field", "bone-decorated totem-guarded"],
                        _OPTION1: ["eager, slavering", "massive, muscle-bound", "shadow-pelted, red-eyed", "frost-breathing, winter-born"],
                        _OPTION2: ["indestructible (mostly) golem", "self-repairing straw-stuffed", "squealing, fleeing illusionary pig", "enchanted, darting will-o-wisp"],
                        _OPTION3: ["considerable, hard-won", "surprising, mage-enhanced", "quickly dwindling but determined", "legendary, almost wolf-like"],
                        _OPTION4: ["encircling attack", "defensive phalanx", "silent flanking maneuvers", "intimidating coordinated howl"],
                        _OPTION5: ["pent-up destructive", "nervous, pacing", "wild, untamed primal", "joyful, playful (in a terrifying way)"],
                        _OPTION6: ["giant, marrow-filled", "magically preserved and flavorful", "still-warm and dripping", "rune-carved (for dental health)"]
                    }
                ]
            }
        }
    },
};
