import { BehTree } from '../core/behTree/BehTree';
import { ExecNode } from '../core/behTree/ExecNode';
import { EvalNode } from '../core/behTree/EvalNode';
import { AwaitEventNode } from '../core/behTree/AwaitEventNode';
import { TreeDefinitionRegistry, NodeResult, IBehNode } from '../core/behTree/BehTreeTypes';
import type { GameState } from '../GameState';
import * as effects from '../effects';
import { WaitNode } from '../core/behTree/WaitNode';
import { RepeatNode } from '../core/behTree/RepeatNode';
import { SelectorNode } from '../core/behTree/SelectorNode';
import { SequencerNode } from '../core/behTree/SequencerNode';
import { CheckDNTypeNode, ProcessMessageDNNode, ProcessChoiceDNNode } from '../core/behTree/DialogNodes';
import { EventProcessor } from '../Event';
import { Character } from '../Character';
import type { EventDefinition } from '../lib/definitions/EventDefinition';
import { AwaitAndProcessEventNode } from '../core/behTree/AwaitAndProcessEventNode';
import { SkillCheckNode } from '../DialogTreeNodes';
import { AnySuccessAllFailureNode } from '../core/behTree/AnySuccessAllFailureNode';

export const behTreeDefinitions: TreeDefinitionRegistry = {
    'dialog': () => new BehTree('dialog', [
        // Initialize dialog with starting node
        new ExecNode('initDialog', (node, state) => {
            const dialog = state.dialogs[node.root.blackboard.dialogName];
            const dialogDefinition = state.lib.dialogs.getDialog(dialog.definitionId)!;
            dialog.nodes.push(dialogDefinition.startingNodeId);
        }),
        
        // Main dialog loop
        new RepeatNode('dialogLoop', [
            new SelectorNode('processCurrentNode', [
                // Handle message nodes
                new SequencerNode('messageFlow', [
                    new CheckDNTypeNode('checkMessage', 'message'),
                    new ProcessMessageDNNode('processMessage')
                ]),
                
                // Handle choice nodes
                new SequencerNode('choiceFlow', [
                    new CheckDNTypeNode('checkChoice', 'choice'),
                    new AwaitEventNode('waitChoice', 'dialogChoice', (node, eventDef) => {
                        return eventDef.params?.dialogName === node.root.blackboard.dialogName;
                    }),
                    new ProcessChoiceDNNode('processChoice')
                ]),
                
                // Dialog finished - only executes if all above failed
                new EvalNode('dialogFinished', (node, state) => {
                    const dialogFinishedEvent = {
                        id: 'dialogFinished',
                        params: { dialogName: node.root.blackboard.dialogName },
                        effects: []
                    };
                    EventProcessor.processSingleEvent(dialogFinishedEvent, state);
                    return false; // Return false to exit the RepeatNode
                })
            ])
        ])
    ]),

    'firstStepsDialog': () => new BehTree('firstStepsDialog', [
        new ExecNode('init', (node, state) => {
            const dialog = state.dialogs[node.root.blackboard.dialogName];
            const dialogDef = state.lib.dialogs.getDialog(dialog.definitionId)!;
            
            node.root.blackboard.leafCounter = 0;
            node.root.blackboard.dialogEnded = false;
            node.root.blackboard.canAddNodeAt = state.gameTime;
            dialog.nodes = [dialogDef.startingNodeId];
        }),
        new RepeatNode('mainLoop', [
            new EvalNode('checkEnd', (node, _state) => !node.root.blackboard.dialogEnded),
            new AnySuccessAllFailureNode('parallelProcessor', [
                // Branch A: Automatic Advancement
                new SequencerNode('autoAdvance', [
                    new EvalNode('timeCheck', (node, state) => state.gameTime >= node.root.blackboard.canAddNodeAt),
                    new ExecNode('addNextNode', (node, state) => {
                        const dialog = state.dialogs[node.root.blackboard.dialogName];
                        const dialogDef = state.lib.dialogs.getDialog(dialog.definitionId)!;

                        // 1. Try to advance from an existing non-choice node
                        for (const nodeId of dialog.nodes) {
                            const nodeDef = dialogDef.nodes[nodeId];
                            let nextNodeId: string | undefined = undefined;

                            if (nodeDef.type === 'message') {
                                nextNodeId = nodeDef.next;
                            } else if (nodeDef.type === 'skill_check') {
                                const scNode = nodeDef as SkillCheckNode;
                                const protagonist = Character.getProtagonistCharacter(state);
                                const proficiency = Character.getProficiency(protagonist!, scNode.skillIds[0], state);
                                nextNodeId = proficiency >= scNode.successThreshold ? scNode.successNext : scNode.failureNext;
                            }

                            if (nextNodeId && !dialog.nodes.includes(nextNodeId)) {
                                if (nodeDef.leaf) node.root.blackboard.leafCounter++;
                                if (nodeDef.data?.end) node.root.blackboard.dialogEnded = true;
                                dialog.nodes.push(nextNodeId);
                                node.root.blackboard.canAddNodeAt = state.gameTime + 1000;
                                return NodeResult.SUCCESS;
                            }
                        }

                        // 2. If no auto-advancement, try to add a level-gated node
                        const leafCounter = node.root.blackboard.leafCounter;
                        for (const nodeId in dialogDef.nodes) {
                             const nodeDef = dialogDef.nodes[nodeId];
                            if (nodeDef.data?.level <= leafCounter && !dialog.nodes.includes(nodeId)) {
                                dialog.nodes.push(nodeId);
                                node.root.blackboard.canAddNodeAt = state.gameTime + 1000;
                                return NodeResult.SUCCESS;
                            }
                        }

                        return NodeResult.FAILURE; // No node to add
                    })
                ]),

                // Branch B: Player Choice
                new AwaitAndProcessEventNode('playerChoice', 'dialogChoice',
                    (event: EventDefinition, node: IBehNode, state: GameState) => {
                        if (event.params?.dialogName !== node.root.name) {
                            return false;
                        }

                        const dialog = state.dialogs[node.root.blackboard.dialogName];
                        const dialogDef = state.lib.dialogs.getDialog(dialog.definitionId)!;
                        const choiceId = event.params?.choiceId;

                        const parentNode = Object.values(dialogDef.nodes).find(n => n.type === 'choice' && (n as any).choices.some((c: any) => c.id === choiceId)) as any;
                        if (!parentNode) return false;

                        if (parentNode.leaf) node.root.blackboard.leafCounter++;
                        if (parentNode.data?.end) node.root.blackboard.dialogEnded = true;

                        const choice = parentNode.choices.find((c: any) => c.id === choiceId);
                        if (choice?.next && !dialog.nodes.includes(choice.next)) {
                            dialog.nodes.push(choice.next);
                            node.root.blackboard.canAddNodeAt = state.gameTime + 1000;
                        }
                        return true;
                    }
                )
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
            (_, eventDef) => eventDef.params?.minigameType === 'Intro'
        ),
        new ExecNode('startWelcome', (_node, state: GameState) => {
            effects.startMinigame(state, { name: 'Welcome' });
        }),
        new AwaitEventNode(
            'awaitWelcomeComplete',
            'minigameComplete',
            (_, eventDef) => eventDef.params?.minigameType === 'Welcome'
        ),
        new ExecNode('startIngress', (_node, state: GameState) => {
            effects.startMinigame(state, { name: 'Ingress' });
        }),
        new AwaitEventNode(
            'awaitIngressComplete', 
            'minigameComplete', 
            (_, eventDef) => eventDef.params?.minigameType === 'Ingress'
        ),
        new ExecNode('startFirstSteps', (_node, state: GameState) => {
            effects.startMinigame(state, { name: 'FirstSteps' });
        }),
        new AwaitEventNode(
            'awaitFirstStepsComplete',
            'minigameComplete',
            (_, eventDef) => eventDef.params?.minigameType === 'FirstSteps'
        ),
    ]),

    'cheatWelcome': () => new BehTree('cheatWelcome', [
        new AwaitEventNode(
            'awaitWelcomeStart',
            'minigameStarted',
            (_, eventDef) => eventDef.params?.minigameType === 'Welcome'
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
            (_, eventDef) => eventDef.params?.minigameType === 'Intro'
        ),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatIntro', (_node, state: GameState) => {
            state.exitMinigame();
        }),
    ]),

    'cheatIntroAndWelcome': () => new BehTree('cheatIntroAndWelcome', [
        new AwaitEventNode(
            'awaitIntroStart',
            'minigameStarted',
            (_, eventDef) => eventDef.params?.minigameType === 'Intro'
        ),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatIntro', (_node, state: GameState) => {
            state.exitMinigame();
        }),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatWelcome', (_node, state: GameState) => {
            effects.applyWelcomeResults(state, { locationId: "sequoiter" }); //aeiga_reika turfablie sequoiter
            state.exitMinigame();
        }),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('skipIngressEngagement', (_node, state: GameState) => {
            effects.skipIngressEngagement(state);
        })
    ]),

    'cheatStart': () => new BehTree('cheatStart', [
        new AwaitEventNode(
            'awaitIntroStart',
            'minigameStarted',
            (_, eventDef) => eventDef.params?.minigameType === 'Intro'
        ),
        new WaitNode({ durationMin: 0.1 }),
        new ExecNode('cheatIntro', (_node, state: GameState) => {
            state.exitMinigame();
        }),
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