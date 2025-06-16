export class BehNode {
    uid;
    name;
    type;
    root;
    parent;
    constructor(name) {
        this.name = name;
        this.type = this.constructor.name;
    }
    getHierarchicalPath() {
        if (this.parent) {
            return `${this.parent.getHierarchicalPath()}.${this.name}`;
        }
        return this.name;
    }
    init(_state) {
    }
    exit() {
        // Base implementation does nothing.
        // Nodes that subscribe to events or updates must override this.
    }
    handleEvent(_eventDef, _state, _eventContext) {
        // Base implementation does nothing.
    }
    update(_deltaTime, _state) {
        // Base implementation does nothing.
    }
}
