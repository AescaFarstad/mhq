export class Invoker {
    trees = [];
    completedTrees = [];
    eventListeners = new Map();
    updateListeners = [];
    logVerbose = false;
    listenersMutationCount = 0;
    addTree(tree, state) {
        if (this.logVerbose) {
            console.log(`[Invoker] Adding and initializing tree: ${tree.name}`);
        }
        tree.invoker = this;
        this.trees.push(tree);
        tree.init(state);
    }
    reportTreeComplete(tree) {
        if (this.logVerbose) {
            console.log(`[Invoker] Tree completed: ${tree.name}`);
        }
        this.trees = this.trees.filter(t => t.uid !== tree.uid);
        if (!this.completedTrees.includes(tree.name)) {
            this.completedTrees.push(tree.name);
        }
    }
    update(deltaTime, state) {
        const initialMutationCount = this.listenersMutationCount;
        const listenersToUpdate = [...this.updateListeners];
        for (const listener of listenersToUpdate) {
            if (initialMutationCount === this.listenersMutationCount) {
                // Fast path: No mutations have occurred.
                listener.update?.(deltaTime, state);
            }
            else {
                // Slow path: The listeners array has been modified.
                // Check if the listener still exists before updating.
                if (this.updateListeners.find(n => n.uid === listener.uid)) {
                    listener.update?.(deltaTime, state);
                }
            }
        }
    }
    handleEvent(eventDef, state, context) {
        const listenersForEvent = this.eventListeners.get(eventDef.id);
        if (!listenersForEvent || listenersForEvent.length === 0) {
            return;
        }
        if (this.logVerbose) {
            console.log(`[Invoker] Handling event: ${eventDef.id} for ${listenersForEvent.length} listeners.`);
        }
        const initialMutationCount = this.listenersMutationCount;
        const listenersToProcess = [...listenersForEvent];
        for (const listener of listenersToProcess) {
            if (initialMutationCount === this.listenersMutationCount) {
                // Fast path: No mutations.
                listener.handleEvent?.(eventDef, state, context);
            }
            else {
                // Slow path: Check for existence in the current list for this event.
                const currentListeners = this.eventListeners.get(eventDef.id);
                if (currentListeners?.find(n => n.uid === listener.uid)) {
                    listener.handleEvent?.(eventDef, state, context);
                }
            }
        }
    }
    addEventListener(eventName, node) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        const listeners = this.eventListeners.get(eventName);
        if (!listeners.find(n => n.uid === node.uid)) {
            listeners.push(node);
            this.listenersMutationCount++;
        }
    }
    removeEventListener(node) {
        for (const listeners of this.eventListeners.values()) {
            const index = listeners.findIndex(n => n.uid === node.uid);
            if (index > -1) {
                listeners.splice(index, 1);
                this.listenersMutationCount++;
            }
        }
    }
    addUpdateListener(node) {
        if (!this.updateListeners.find(n => n.uid === node.uid)) {
            this.updateListeners.push(node);
            this.listenersMutationCount++;
        }
    }
    removeUpdateListener(node) {
        const initialLength = this.updateListeners.length;
        this.updateListeners = this.updateListeners.filter(n => n.uid !== node.uid);
        if (this.updateListeners.length !== initialLength) {
            this.listenersMutationCount++;
        }
    }
}
