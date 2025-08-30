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
import { CheckDNTypeNode, ProcessMessageDNNode, ProcessChoiceDNNode } from '../dialog/DialogNodes';
import { EventProcessor } from '../Event';
import { Character } from '../Character';
import type { EventDefinition } from '../lib/definitions/EventDefinition';
import { AwaitAndProcessEventNode } from '../core/behTree/AwaitAndProcessEventNode';
import { type ChoiceDNode, SkillCheckNode } from '../dialog/DialogTreeNodes';
import { AnySuccessAllFailureNode } from '../core/behTree/AnySuccessAllFailureNode';
import { TickerNode } from '../core/behTree/TickerNode';

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
          new TickerNode('waitForTimer', (node, state) => state.gameTime >= node.root.blackboard.canAddNodeAt),
          new ExecNode('addNextNode', (node, state) => {
            const dialog = state.dialogs[node.root.blackboard.dialogName];
            const dialogDef = state.lib.dialogs.getDialog(dialog.definitionId)!;

            let nextNodeId: string | undefined = undefined;
            let sourceNodeDef: any = undefined;

            // 1. Find the first possible advancement from an existing node
            for (const nodeId of dialog.nodes) {
              const nodeDef = dialogDef.nodes[nodeId];
              let potentialNextNodeId: string | undefined = undefined;

              if (nodeDef.type === 'message') {
                if (nodeDef.next) {
                  potentialNextNodeId = nodeDef.next;
                }
              } else if (nodeDef.type === 'skill_check') {
                const scNode = nodeDef as SkillCheckNode;
                const protagonist = Character.getProtagonistCharacter(state)!;
                let hasSuccess = false;
                const threshold = scNode.successThreshold || 1;
                for (const skillId of scNode.skillIds) {
                  const proficiency = Character.getProficiency(protagonist, skillId, state);
                  if (proficiency >= threshold) {
                    hasSuccess = true;
                    break;
                  }
                }
                potentialNextNodeId = hasSuccess ? scNode.successNext : scNode.failureNext;
              }
              
              if (potentialNextNodeId && !dialog.nodes.includes(potentialNextNodeId)) {
                nextNodeId = potentialNextNodeId;
                sourceNodeDef = nodeDef;
                break; // Found our node, stop searching
              }
            }

            // 2. If we found a node to advance to, add it
            if (nextNodeId && sourceNodeDef) {
              if (sourceNodeDef.leaf) node.root.blackboard.leafCounter++;
              if ((sourceNodeDef as any).data?.end) node.root.blackboard.dialogEnded = true;
              dialog.nodes.push(nextNodeId);
              node.root.blackboard.canAddNodeAt = state.gameTime + 1;
              node.parent?.report(NodeResult.SUCCESS, state, node);
              return;
            }

            // 3. If no auto-advancement, try to add a level-gated node
            const leafCounter = node.root.blackboard.leafCounter;
            for (const nodeId in dialogDef.nodes) {
               const nodeDef = dialogDef.nodes[nodeId];
              if (nodeDef.data?.level <= leafCounter && !dialog.nodes.includes(nodeId)) {
                dialog.nodes.push(nodeId);
                if (nodeDef.leaf && !('choices' in nodeDef) && !('next' in nodeDef)) {
                  node.root.blackboard.leafCounter++;
                }
                node.root.blackboard.canAddNodeAt = state.gameTime + 1;
                node.parent?.report(NodeResult.SUCCESS, state, node);
                return;
              }
            }
            
            node.parent?.report(NodeResult.FAILURE, state, node);
          })
        ]),

        // Branch B: Player Choice
        new AwaitAndProcessEventNode('playerChoice', 'dialogChoice',
          (event: EventDefinition, node: IBehNode, state: GameState) => {
            console.log('[BehTree] playerChoice event:', JSON.stringify(event));
            if (event.params?.dialogName !== node.root.blackboard.dialogName) {
              return false;
            }

            const dialog = state.dialogs[node.root.blackboard.dialogName];
            const dialogDef = state.lib.dialogs.getDialog(dialog.definitionId)!;
            const choiceId = event.params?.choiceId;

            if (!choiceId) {
              console.error(`[BehTree] playerChoice event is missing a choiceId`, event.params);
              return false;
            }

            let parentNode: ChoiceDNode | undefined = undefined;
            let parentNodeId: string | undefined = undefined;

            for (const nodeId in dialogDef.nodes) {
              const n = dialogDef.nodes[nodeId];
              if (n.type === 'choice') {
                if ((n as ChoiceDNode).choices.some(c => c.id === choiceId)) {
                  parentNode = n as ChoiceDNode;
                  parentNodeId = nodeId;
                  break;
                }
              }
            }

            if (!parentNode || !parentNodeId) {
              console.error(`[BehTree] Could not find parent choice node for choiceId: ${choiceId}`);
              return false;
            }

            console.log(`[BehTree] Found parent node ${parentNodeId} for choice ${choiceId}`);

            const choice = parentNode.choices.find((c: any) => c.id === choiceId);
            if (!choice) {
              // This should be impossible if the parentNode was found, but as a safeguard:
              console.error(`[BehTree] Could not find choice with id ${choiceId} in parent ${parentNodeId}`);
              return false;
            }

            if (parentNode.leaf) {
              node.root.blackboard.leafCounter++;
              console.log(`[BehTree] Parent node ${parentNodeId} is a leaf. Incremented leafCounter to ${node.root.blackboard.leafCounter}`);
            }

            if (parentNode.data?.end) node.root.blackboard.dialogEnded = true;

            if (choice.next && !dialog.nodes.includes(choice.next)) {
              dialog.nodes.push(choice.next);
              console.log(`[BehTree] Added next node from choice: ${choice.next}`);
              const nextNodeDef = dialogDef.nodes[choice.next];
              if (nextNodeDef.leaf && !nextNodeDef.next && (nextNodeDef.type === 'message' || nextNodeDef.type === 'skill_check')) {
                node.root.blackboard.leafCounter++;
                console.log(`[BehTree] Added node ${choice.next} is a terminal leaf. Incremented leafCounter to ${node.root.blackboard.leafCounter}`);
              }
              node.root.blackboard.canAddNodeAt = state.gameTime + 1;
            }
            return true;
          }
        ),
        // Branch C: Check for dialog end
        new SequencerNode('endChecker', [
          new EvalNode('hasDialogEnded', (node, _state) => node.root.blackboard.dialogEnded),
          new ExecNode('endTheMinigame', (node, state) => {
            effects.endMinigame(state, { minigameId: node.root.blackboard.dialogName });
          })
        ])
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
      state.endMinigame();
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
      state.endMinigame();
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
      state.endMinigame();
    }),
    new WaitNode({ durationMin: 0.1 }),
    new ExecNode('cheatWelcome', (_node, state: GameState) => {
      effects.applyWelcomeResults(state, { locationId: "sequoiter" }); //aeiga_reika turfablie sequoiter
      state.endMinigame();
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
      state.endMinigame();
    }),
    new WaitNode({ durationMin: 0.1 }),
    new ExecNode('cheatWelcome', (_node, state: GameState) => {
      effects.applyWelcomeResults(state, { locationId: "aeiga_reika" });
      state.endMinigame();
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
      state.endMinigame();
    }),
    new WaitNode({ durationMin: 0.1 }),
    new ExecNode('switchToDiscoverTab', (_node, state: GameState) => {
      effects.switchToTab(state, { tabName: "Discover" });
    }),
  ])
};

export default behTreeDefinitions; 