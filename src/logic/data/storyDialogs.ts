import { MESSAGE, CHOICE, DialogNodeDef } from '../DialogTreeNodes';

// JSON-like dialog definition that will be converted to DialogDefinition
export interface DialogDefRaw {
    nodes: DialogNodeDef[];
    behTreeId?: string; // Optional behavior tree to process this dialog (defaults to 'dialog')
}

export const storyDialogsRaw: Record<string, DialogDefRaw> = {
    introDialog: {
        nodes: [
            {
                id: 'deity_greeting',
                type: MESSAGE,
                text: 'So, ready to become mortal?',
                speakerId: 'deity'
            },
            
            {
                id: 'player_response_1',
                type: CHOICE,
                choices: [
                    { text: "It's an honor.", next: 'deity_explanation_yes' },
                    { text: "Have I done wrong?", next: 'deity_explanation_no' }
                ]
            },
            
            {
                id: 'deity_explanation_yes',
                type: MESSAGE,
                text: 'I need you to come into the mortal world to build a stairway to the Havens.',
                speakerId: 'deity',
                next: 'player_response_2'
            },
            
            {
                id: 'deity_explanation_no',
                type: MESSAGE,
                text: 'No, not at all. I need you to come into the mortal world to build a stairway to the Havens.',
                speakerId: 'deity',
                next: 'player_response_2'
                
            },
            
            {
                id: 'player_response_2',
                type: CHOICE,
                choices: [
                    { text: "Me? But... shouldn't people build one on their own to be worthy to ascend?", next: 'deity_worthiness_response' }
                ]
            },
            
            {
                id: 'deity_worthiness_response',
                type: MESSAGE,
                text: 'I prefer they accomplished spiritual feats instead of spending their short lives building the impossible.',
                speakerId: 'deity'
            },
            
            {
                type: MESSAGE,
                text: 'Heroes—there are plenty.',
                speakerId: 'deity'
            },
            
            {
                type: MESSAGE,
                text: 'They are worthy already.',
                speakerId: 'deity'
            },
            
            {
                type: MESSAGE,
                text: '<strong>You</strong> will build the stairway for them.',
                speakerId: 'deity'
            },
            
            {
                id: 'player_response_3',
                type: CHOICE,
                choices: [
                    { text: "I see. Let us proceed then.", next: 'deity_mission_briefing' },
                    { text: "But... me? Of all deities? Why?", next: 'deity_why_response' }
                ]
            },
            
            {
                id: 'deity_mission_briefing',
                type: MESSAGE,
                text: "I will create a character for you and weave them into the narrative of the world. You will have to start as a hermit, I'm sorry. But you shall have a mages guild in your disposal. Develop the establishment, hire personnel, do research, and then build the wonder!",
                speakerId: 'deity'
            },
            
            {
                id: 'deity_why_response',
                type: MESSAGE,
                text: "Nevermind, I'll ask someone else then. You may go. I thought you'd be interested...",
                speakerId: 'deity'
            }
        ]
    }
};