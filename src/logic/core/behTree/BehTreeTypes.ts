import type { GameState } from '../../GameState';
import type { EventDefinition, EventContext } from '../../lib/definitions/EventDefinition';

export enum NodeResult {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE'
}

export type TreeDefinitionFn = () => IBehTree;

export type TreeDefinitionRegistry = Record<string, TreeDefinitionFn>;

export interface IContainerNode extends IBehNode {
    report(result: NodeResult, state: GameState): void;
}

export interface IBehNode {
    uid: string; //Deterministic, based on hierarchical name
    name: string;
    type: string; //coincides with the name of the class
    root: IBehTree;
    parent?: IContainerNode; //Root has no parent
    
    init(state: GameState): void;
    exit(): void;
    handleEvent?(eventDef: EventDefinition, state: GameState, eventContext?: EventContext): void;
    update?(deltaTime: number, state: GameState): void;
    getHierarchicalPath(): string;
}

export interface IBehTree extends IContainerNode {
    invoker?: IInvoker;
    blackboard: Record<string, any>; //No references, only plain data. Prefer to store data in gameState if possible.
}

/**
 * The Invoker manages all behavior trees and their event/update subscriptions
 */
export interface IInvoker {
    trees: IBehTree[];
    completedTrees: string[];
    eventListeners: Map<string, IBehNode[]>;
    updateListeners: IBehNode[];
    
    update(deltaTime: number, state: GameState): void;
    handleEvent(eventDef: EventDefinition, state: GameState, context?: EventContext): void;
    
    addTree(tree: IBehTree, state: GameState): void;
    reportTreeComplete(tree: IBehTree): void;
    
    addEventListener(eventName: string, node: IBehNode): void;
    removeEventListener(node: IBehNode): void;
    addUpdateListener(node: IBehNode): void;
    removeUpdateListener(node: IBehNode): void;
    
    logVerbose: boolean;
}

export type ExecLambda = (node: IBehNode, state: GameState) => void;

export type EventLambda = (
    node: IBehNode, 
    eventDef: EventDefinition, 
    state: GameState,
    eventContext?: EventContext
) => void;