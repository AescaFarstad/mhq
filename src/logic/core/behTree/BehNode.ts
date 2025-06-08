import type { GameState } from '../../GameState';
import type { EventDefinition, EventContext } from '../../lib/definitions/EventDefinition';
import type { IBehNode, IBehTree, IContainerNode } from './BehTreeTypes';

export class BehNode implements IBehNode {
    public uid!: string;
    public name: string;
    public type: string;
    public root!: IBehTree;
    public parent?: IContainerNode;

    constructor(name: string) {
        this.name = name;
        this.type = this.constructor.name;
    }

    public getHierarchicalPath(): string {
        if (this.parent) {
            return `${this.parent.getHierarchicalPath()}.${this.name}`;
        }
        return this.name;
    }

    public init(_state: GameState): void {
    }

    public exit(): void {
        // Base implementation does nothing.
        // Nodes that subscribe to events or updates must override this.
    }

    public handleEvent(_eventDef: EventDefinition, _state: GameState, _eventContext?: EventContext): void {
        // Base implementation does nothing.
    }

    public update(_deltaTime: number, _state: GameState): void {
        // Base implementation does nothing.
    }
} 