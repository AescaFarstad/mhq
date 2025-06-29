import { BehTree } from '../core/behTree/BehTree';
import { ExecNode } from '../core/behTree/ExecNode';
import { AwaitEventNode } from '../core/behTree/AwaitEventNode';
import type { TreeDefinitionRegistry } from '../core/behTree/BehTreeTypes';
import type { GameState } from '../GameState';
import * as effects from '../effects';
import { WaitNode } from '../core/behTree/WaitNode';
import { RepeatNode } from '../core/behTree/RepeatNode';
import { SelectorNode } from '../core/behTree/SelectorNode';
import { SequencerNode } from '../core/behTree/SequencerNode';
import { CheckDNTypeNode } from '../core/behTree/DialogNodes';
import { EventProcessor } from '../Event';

export const behTreeDefinitions: TreeDefinitionRegistry = {
    'dialog': () => new BehTree('dialog', [
        // Initialize dialog with starting node
        new ExecNode('initDialog', (node, state) => {
            const dialog = state.dialogs[node.root.blackboard.dialogName];
            const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
            dialog.nodes.push(dialogDefinition.startingNodeId);
            return true;
        }),
        
        // Main dialog loop
        new RepeatNode('dialogLoop', [
            new SelectorNode('processCurrentNode', [
                // Handle message nodes
                new SequencerNode('messageFlow', [
                    new CheckDNTypeNode('checkMessage', 'message'),
                    new ExecNode('processMessage', (node, state) => {
                        const dialog = state.dialogs[node.root.blackboard.dialogName];
                        const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
                        
                        const lastNodeId = dialog.nodes[dialog.nodes.length - 1];
                        const currentNode = dialogDefinition.nodes[lastNodeId];
                        
                        if (currentNode?.next) {
                            dialog.nodes.push(currentNode.next);
                            return true;
                        }
                        return false; // No next node - will fall through to dialogFinished
                    })
                ]),
                
                // Handle choice nodes
                new SequencerNode('choiceFlow', [
                    new CheckDNTypeNode('checkChoice', 'choice'),
                    new AwaitEventNode('waitChoice', 'dialogChoice'),
                    new ExecNode('processChoice', (node, state) => {
                        const dialog = state.dialogs[node.root.blackboard.dialogName];
                        const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
                        
                        const lastChoiceId = dialog.choicesMade[dialog.choicesMade.length - 1];
                        const lastNodeId = dialog.nodes[dialog.nodes.length - 1];
                        const choiceNode = dialogDefinition.nodes[lastNodeId] as any;
                        const choice = choiceNode.choices.find((c: any) => c.id === lastChoiceId);
                        
                        if (choice?.next) {
                            dialog.nodes.push(choice.next);
                            return true;
                        }
                        return false; // No next node - will fall through to dialogFinished
                    })
                ]),
                
                // Dialog finished - only executes if all above failed
                new ExecNode('dialogFinished', (node, state) => {
                    const dialogFinishedEvent = {
                        id: 'dialogFinished',
                        params: { dialogName: node.root.blackboard.dialogName },
                        effects: []
                    };
                    EventProcessor.processSingleEvent(dialogFinishedEvent, state);
                    return false; // Exit RepeatNode
                })
            ])
        ])
    ]),

    'introSequence': () => new BehTree('introSequence', [
        new ExecNode('startIntro', (_node, state: GameState) => {
            effects.startMinigame(state, { name: 'Intro' });
        }),
        new AwaitEventNode(
            'awaitIntroComplete',
            'minigameComplete',
            (eventDef) => eventDef.params?.minigameType === 'Intro'
        ),
        new ExecNode('startWelcome', (_node, state: GameState) => {
            effects.startMinigame(state, { name: 'Welcome' });
        }),
        new AwaitEventNode(
            'awaitWelcomeComplete',
            'minigameComplete',
            (eventDef) => eventDef.params?.minigameType === 'Welcome'
        ),
        new ExecNode('startIngress', (_node, state: GameState) => {
            effects.startMinigame(state, { name: 'Ingress' });
        }),
        new AwaitEventNode(
            'awaitIngressComplete', 
            'minigameComplete', 
            (eventDef) => eventDef.params?.minigameType === 'Ingress'
        ),
    ]),

    'cheatWelcome': () => new BehTree('cheatWelcome', [
        new AwaitEventNode(
            'awaitWelcomeStart',
            'minigameStarted',
            (eventDef) => eventDef.params?.minigameType === 'Welcome'
        ),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatWelcome', (_node, state: GameState) => {
            effects.applyWelcomeResults(state, { locationId: "aeiga_reika" });
            state.exitMinigame();
        }),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('skipIngressEngagement', (_node, state: GameState) => {
            effects.skipIngressEngagement(state);
        })
    ]),

    'cheatIntro': () => new BehTree('cheatIntro', [
        new AwaitEventNode(
            'awaitIntroStart',
            'minigameStarted',
            (eventDef) => eventDef.params?.minigameType === 'Intro'
        ),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatIntro', (_node, state: GameState) => {
            state.exitMinigame();
        }),
    ]),

    'cheatStart': () => new BehTree('cheatStart', [
        new AwaitEventNode(
            'awaitIntroStart',
            'minigameStarted',
            (eventDef) => eventDef.params?.minigameType === 'Intro'
        ),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatIntro', (_node, state: GameState) => {
            state.exitMinigame();
        }),
        new WaitNode({ durationMin: 0.1 }),
        new AwaitEventNode(
            'awaitWelcomeStart',
            'minigameStarted',
            (eventDef) => eventDef.params?.minigameType === 'Welcome'
        ),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatWelcome', (_node, state: GameState) => {
            effects.applyWelcomeResults(state, { locationId: "aeiga_reika" });
            state.exitMinigame();
        }),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatIngress', (_node, state: GameState) => {
            effects.applyIngressResults(state, { 
                characterId: "ingress_aeiga_reika_chaos_artificer", 
                characterName: undefined, 
                xpBonus: 29, 
                attributePoints: 1, 
                skillPoints: 1, 
                specPoints: 1,
                allSubmittedWords: ["frame", "gather", "misinformation", "dossier", "kompromat", "corrupt", "influence", "bribe", "link", "dark", "knife", "mind", "workshop", "empathy", "stone", "heart", "soul", "mantra", "hypnosys", "book", "word", "death", "live", "life", "plant", "cross", "symbol", "path", "trail", "structure", "castle", "mage", "guild", "magic", "craft", "master", "detail", "cog", "fog", "part", "pact", "gear", "crystal", "tower", "companion", "wild", "wagon", "dragon", "treaty", "spy", "empire", "feast", "tavern", "merchant", "gem", "ledger", "tunnel", "profit", "caravan", "whisper", "dice", "hammer", "bow", "leather", "robe", "ore", "harvest", "horse", "griffin", "watch", "scent", "lock", "phantom", "blade", "flame", "shadow"]
            });
            state.exitMinigame();
        }),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('switchToDiscoverTab', (_node, state: GameState) => {
            effects.switchToTab(state, { tabName: "Discover" });
        }),
    ])
};

export default behTreeDefinitions; 