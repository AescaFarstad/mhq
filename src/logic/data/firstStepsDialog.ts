import { MESSAGE, CHOICE, SKILL_CHECK } from '../dialog/DialogTreeNodes';

export const firstStepsDialogRaw = {
  behTreeId: 'firstStepsDialog',
  verificationKey: 'skipAccessibility' as const,
  nodes: [
    {
      id: 'initial_arrival',
      type: MESSAGE,
      text: "You're in a guild hall which is partially collapsed, utterly cluttered, chilly and confusing. Even though you came up with {number} words, The Life feels much more vast than you could have imagined. You're struck with your first goosebumps.",
      next: 'initial_choice'
    },
    
    {
      id: 'initial_choice',
      type: CHOICE,
      choices: [ { text: "Look around." } ],
      leaf: true,
    },
    
    {
      id: 'exploration_option_1',
      type: CHOICE,
      choices: [
        { text: "Check the cracks in the walls", next: 'check_cracks' }
      ], data: {level: 1}
    },
    
    {
      id: 'exploration_option_2', 
      type: CHOICE,
      choices: [
        { text: "Check the glittering pink substance on the floor", next: 'check_pink_substance' }
      ], data: {level: 1}
    },
    
    {
      id: 'exploration_option_3',
      type: CHOICE, 
      choices: [
        { text: "Look for basic necessities", next: 'basic_necessities' }
      ], data: {level: 1}
    },
    
    {
      id: 'exploration_option_4',
      type: CHOICE,
      choices: [
        { text: "Look into the eyes of the portraits on the wall", next: 'portraits' }
      ], data: {level: 2}
    },
    
    {
      id: 'exploration_option_5',
      type: CHOICE,
      choices: [
        { text: "Step onto the creaky floorboard", next: 'creaky_floorboard' }
      ], data: {level: 2}
    },
    
    {
      id: 'exploration_option_6',
      type: CHOICE,
      choices: [
        { text: "Investigate the humming noise upstairs", next: 'humming_noise_check' }
      ], data: {level: 4}
    },
    
    {
      id: 'exploration_option_7',
      type: CHOICE,
      choices: [
        { text: "Smell the air", next: 'smell_air_check' }
      ], data: {level: 4}
    },
    
    {
      id: 'exploration_option_8',
      type: CHOICE,
      choices: [
        { text: "Check equipment", next: 'check_equipment' }
      ], data: {level: 4}
    },
    
    {
      id: 'check_cracks',
      type: MESSAGE,
      text: "They are not too deep. You will not be buried today. Maybe tomorrow.",
      leaf: true
    },
    
    {
      id: 'check_pink_substance',
      type: MESSAGE,
      text: "Nail polish.",
      next: 'pink_substance_sense_check'
    },
    
    {
      id: 'pink_substance_sense_check',
      type: SKILL_CHECK,
      text: "You examine it more closely...",
      skillIds: ['perception'],
      successThreshold: 1,
      successNext: 'pink_substance_safe',
      failureNext: 'pink_substance_uncertain'
    },
    
    {
      id: 'pink_substance_safe',
      type: MESSAGE,
      text: "Non-toxic. Harmless.",
      next: 'pink_substance_options'
    },
    
    {
      id: 'pink_substance_uncertain',
      type: MESSAGE,
      text: "As long as it's not moving, it's probably safe?",
      next: 'pink_substance_options'
    },
    
    {
      id: 'pink_substance_options',
      type: CHOICE,
      choices: [
        { text: "Smudge it with your boot, just to make sure", next: 'smudge_boot' },
        { text: "Sniff it", next: 'sniff_substance_check' }
      ]
    },
    
    {
      id: 'smudge_boot',
      type: MESSAGE,
      text: "Your boot is glittering now.",
      leaf: true,
    },
    
    {
      id: 'sniff_substance_check',
      type: SKILL_CHECK,
      text: "You lean in to sniff the substance...",
      skillIds: ['alchemy', 'wolf_nose', 'pharmacology', 'refined_palate'],
      successThreshold: 1,
      successNext: 'sniff_success',
      failureNext: 'sniff_failure'
    },
    
    {
      id: 'sniff_success',
      type: MESSAGE,
      text: "Beeswax based.",
      leaf: true,
    },
    
    {
      id: 'sniff_failure',
      type: MESSAGE,
      text: "Your nose is glittering now.",
      leaf: true,
    },
    
    {
      id: 'basic_necessities',
      type: MESSAGE,
      text: "There is a water barrel by the entrance. You have some food in your rucksack.",
      leaf: true,
    },
    
    {
      id: 'portraits',
      type: MESSAGE,
      text: "These are the previous headmasters. The last one is a mirror.",
      leaf: true,
    },
    
    {
      id: 'creaky_floorboard',
      type: MESSAGE,
      text: "It gives way. There is a purse with 9 gold coins.",
      effects: [
        { key: "giveResource", params: { resource: "gold", amount: 9 } }
      ],
      leaf: true,
    },
    
    {
      id: 'humming_noise_check',
      type: SKILL_CHECK,
      text: "You listen carefully to the humming noise...",
      skillIds: ['bat_ear', 'psychometry', 'meditation', 'musical_instruments'],
      successThreshold: 1,
      successNext: 'humming_identified',
      failureNext: 'humming_mysterious'
    },
    
    {
      id: 'humming_identified',
      type: MESSAGE,
      text: "This is a humming bowl.",
      next: 'humming_climbing_check'
    },
    
    {
      id: 'humming_mysterious',
      type: MESSAGE,
      text: "Hard to say what it is exactly.",
      next: 'humming_climbing_check'
    },
    
    {
      id: 'humming_climbing_check',
      type: SKILL_CHECK,
      text: "You attempt to reach the source of the humming...",
      skillIds: ['climbing', 'strength'],
      successThreshold: 1,
      successNext: 'humming_success',
      failureNext: 'humming_failure'
    },
    
    {
      id: 'humming_success',
      type: MESSAGE,
      text: "You lift yourself up through a crack and reach for it. You grabbed a copper humming bowl. This will be useful.",
      effects: [
        { key: "discover", params: { key: "item_copper_humming_bowl" } }
      ],
      leaf: true,
    },
    
    {
      id: 'humming_failure',
      type: MESSAGE,
      text: "You lift yourself up, but it's just barely out of reach.",
      leaf: true,
    },
    
    {
      id: 'smell_air_check',
      type: SKILL_CHECK,
      text: "You take a deep breath, analyzing the scents...",
      skillIds: ['wolf_nose', 'refined_palate', 'alchemy', 'pharmacology', 'incendiaries'],
      successThreshold: 1,
      successNext: 'smell_success',
      failureNext: 'smell_failure'
    },
    
    {
      id: 'smell_success',
      type: MESSAGE,
      text: "Smells sweet and homely. Sandalwood, propolis. A trace of bitter myrrh. No alcohol. At least not on the first floor.",
      leaf: true,
    },
    
    {
      id: 'smell_failure',
      type: MESSAGE,
      text: "Smells sweet and homely. You pick out sandalwood but then you sneeze.",
      leaf: true,
    },
    
    {
      id: 'check_equipment',
      type: MESSAGE,
      text: "All damaged. Parts missing. Will require investment to fix. But there is a mysterious room with a smoky moon-like ball.",
      next: 'equipment_choice'
    },
    
    {
      id: 'equipment_choice',
      type: CHOICE,
      choices: [
        { text: "Begin your first task of removing clutter from the mysterious room", next: 'begin_first_task' }
      ]
    },
    
    {
      id: 'begin_first_task',
      type: MESSAGE,
      text: "You decide to start making this place livable. Time to get to work.",
      effects: [
        { key: "discover", params: { key: "Tasks" } },
        { key: "switchToTab", params: { tabName: "Tasks" } }
      ],
      data: {
        end:true
      }
    }
  ]
}; 