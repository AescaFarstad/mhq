import { BehTree } from '../core/behTree/BehTree';
import { ExecNode } from '../core/behTree/ExecNode';
import { AwaitEventNode } from '../core/behTree/AwaitEventNode';
import type { TreeDefinitionRegistry } from '../core/behTree/BehTreeTypes';
import type { GameState } from '../GameState';
import * as effects from '../effects';

export const behTreeDefinitions: TreeDefinitionRegistry = {
    'introSequence': () => new BehTree('introSequence', [
        new ExecNode('startWelcome', (_node, state: GameState) => {
            effects.startMinigame(state, { name: 'Welcome' });
        }),
        new AwaitEventNode(
            'awaitWelcomeComplete', 
            'minigameComplete', 
            (_node, _eventDef, state: GameState) => {
                effects.startMinigame(state, { name: 'Ingress' });
            },
            (eventDef) => eventDef.params?.minigameType === 'Welcome'
        ),
        new AwaitEventNode(
            'awaitIngressComplete', 
            'minigameComplete', 
            (_node, _eventDef, _state: GameState) => {
                // Tree completes here
            },
            (eventDef) => eventDef.params?.minigameType === 'Ingress'
        ),
    ])
};

export default behTreeDefinitions; 