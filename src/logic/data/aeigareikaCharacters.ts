import { CharacterDefinition } from '../lib/definitions/CharacterDefinition';

type CharacterData = Record<string, Omit<CharacterDefinition, 'id'>>;

const charactersData: CharacterData = {
        "ingress_aeiga_reika_geomancer_engineer": {
            name: "Vane",
            gender: "male",
            fullImage: "ingress_char (13)",
            location: "aeiga_reika",
            initialLevel: 1,
            baseUpkeep: 0.0,
            bio: "Vane once navigated Aeiga-Reika's hazardous steam tunnels, keeping the city's metal heart beating. When a tremor revealed the forgotten Mages Guild, its sturdy, defensible structure seemed a far better claim than his squalid bunk in the Soot Warrens. He's been alone, tinkering ever since.",
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
        "ingress_aeiga_reika_chaos_artificer": {
            name: "Lyra",
            gender: "female",
            fullImage: "ingress_char (12)",
            location: "aeiga_reika",
            initialLevel: 1,
            baseUpkeep: 0.0,
            bio: "Lyra was a promising, if volatile, apprentice in the Titan Assembly Hall, until her 'unauthorized experiments' became too disruptive. Finding the old guild hall was a stroke of luck, a private workshop far from prying eyes and stifling rules. She's been happily dismantling and 'improving' things in solitude.",
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
        "ingress_aeiga_reika_nature_healer": {
            name: "Riostord",
            gender: "male",
            fullImage: "ingress_char (11)",
            location: "aeiga_reika",
            initialLevel: 1,
            baseUpkeep: 0.0,
            bio: "Riostord came to Aeiga-Reika researching the resilience of life in extreme environments, but the city's relentless industry proved disheartening. He sought solace in the abandoned guild hall, hoping its ancient stones might yet nurture something green. But it wasn't his quiet focus on his studies that left him isolated...",
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
                        verdant_call: 3
                    }
                },
                medicine: {
                    level: 3,
                    specializations: {
                        pharmacology: 2,
                        first_aid: 2
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
                        agriculture: 1,
                        bestiary: 1
                    }
                },
                survival: {
                    level: 2,
                    specializations: {
                        foraging: 2
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
        "ingress_aeiga_reika_secret_seer": {
            name: "Seraphina",
            gender: "female",
            fullImage: "ingress_char (10)",
            location: "aeiga_reika",
            initialLevel: 1,
            baseUpkeep: 0.0,
            bio: "Seraphina, once an adept in the city's web of whispers and secrets, found the dilapidated guild hall an ideal, unassuming nexus for her operations. Its solitude suited her need for discretion, allowing her to observe and gather information undisturbed. She prefers the company of secrets to people.",
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
        "ingress_aeiga_reika_grim_fighter": {
            name: "Marcaedro",
            gender: "male",
            fullImage: "ingress_char (9)",
            location: "aeiga_reika",
            initialLevel: 1,
            baseUpkeep: 0.0,
            bio: "Marcaedro 'Grim' survived Aeiga-Reika's illegal golem fighting pits through shadow magic and brutal combat skills, known for dismantling constructs with hammer and fist. When a destroyed warehouse revealed a forgotten guild hall behind it, he claimed the defensible structure as his base. His fearsome reputation in the underworld ensures no one challenges his squatter's claim.",
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