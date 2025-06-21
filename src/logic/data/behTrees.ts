import { BehTree } from '../core/behTree/BehTree';
import { ExecNode } from '../core/behTree/ExecNode';
import { AwaitEventNode } from '../core/behTree/AwaitEventNode';
import type { TreeDefinitionRegistry } from '../core/behTree/BehTreeTypes';
import type { GameState } from '../GameState';
import * as effects from '../effects';
import { WaitNode } from '../core/behTree/WaitNode';

export const behTreeDefinitions: TreeDefinitionRegistry = {
    'introSequence': () => new BehTree('introSequence', [
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
    'cheatIntro': () => new BehTree('cheatIntro', [
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
                allSubmittedWords: ["aesca", "link", "mind", "stone", "heart", "soul", "mantra", "hypnosys", "book", "word", "death", "live", "life", "plant", "cross", "symbol", "path", "trail", "structure", "castle", "mage", "guild", "magic", "craft", "master", "detail", "cog", "fog", "part", "pact", "gear"]
            });
            state.exitMinigame();
        }),
    ])
};

export default behTreeDefinitions; 