import { MESSAGE, CHOICE } from '../dialog/DialogTreeNodes';

export const introDialogRaw = {
  nodes: [
    {
      id: 'deity_greeting',
      type: MESSAGE,
      text: 'So, ready to become mortal?',
      speakerId: 'deity',
      data: {
        bg: 'introBg1.webp',
        delay: 1.2
      }
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
      text: 'I need you to come into the mortal world to build <strong>a stairway to the Heavens</strong>.',
      speakerId: 'deity',
      next: 'player_response_2',
      data: {
        bg: 'introBg2.webp',
        delay: 1.5
      }
    },
    
    {
      id: 'deity_explanation_no',
      type: MESSAGE,
      text: 'No, not at all. I need you to come into the mortal world to build <strong>a stairway to the Heavens</strong>.',
      speakerId: 'deity',
      next: 'player_response_2',
      data: {
        bg: 'introBg2.webp',
        delay: 1.5
      }
      
    },
    
    {
      id: 'player_response_2',
      type: CHOICE,
      choices: [
        { text: "Me? But... shouldn't people build it themselves to become worthy of ascending?", next: 'deity_worthiness_response' }
      ]
    },
    
    {
      id: 'deity_worthiness_response',
      type: MESSAGE,
      text: 'I\'d prefer they accomplish spiritual feats instead of spending their lives building the impossible.',
      speakerId: 'deity',
      data: {
        delay: 3.1
      }
    },
    
    {
      type: MESSAGE,
      text: 'Heroes—there are plenty.',
      speakerId: 'deity',
      data: {
        delay: 0.5
      }
    },
    
    {
      type: MESSAGE,
      text: 'These people <strong>are</strong> worthy already.',
      speakerId: 'deity',
      data: {
        delay: 0.5
      }
    },
    
    {
      type: MESSAGE,
      text: '<strong>You</strong> will build the stairway for them.',
      speakerId: 'deity',
      data: {
        delay: 1.0
      }
    },
    
    {
      id: 'player_response_3',
      type: CHOICE,
      choices: [
        { text: "Could you be planning a global flood by any chance?", next: 'deity_flood_response' },
        { text: "But... me? Of all deities? Why?", next: 'deity_why_response' }
      ]
    },
    
    {
      id: 'deity_flood_response',
      type: MESSAGE,
      text: "...",
      speakerId: 'deity',
      data: {
        delay: 3.1
      },
    },
    
    {
      type: MESSAGE,
      text: "Let's focus on the details of <b>your</b> mission.",
      speakerId: 'deity',
      data: {
        delay: 1.5
      },
    },
    
    {
      type: MESSAGE,
      text: "I will create a character for you and weave them into the narrative of the world.",
      speakerId: 'deity',
    },
    
    {
      type: MESSAGE,
      text: "You will have to start as a hermit, nobody will know you. This avoids altering people's memories. But I will put you in charge of an abandoned mages guild.",
      speakerId: 'deity',
    },
    
    {
      type: MESSAGE,
      text: "Develop the establishment, hire personnel, do research, and then build the wonder!",
      speakerId: 'deity',
      next: 'player_response_4',
    },
    
    {
      id: 'deity_why_response',
      type: MESSAGE,
      text: "Nevermind, I'll ask someone else then. You may go. I thought you'd be interested...",
      speakerId: 'deity',
      data: {
        end: true
      }
    },
    
    {
      id: 'player_response_4',
      type: CHOICE,
      choices: [
        { text: "Where shall I be arriving?" }
      ]
    },
  ]
};