<template>
  <div class="explore-tab">
    <div class="explore-controls">
      <input 
        type="text" 
        v-model="exploreInput" 
        class="explore-input" 
        placeholder="Enter stat name to explore its connections..."
      />

      <button @click="clearTree" class="clear-button">Clear</button>
      <div class="controls-right">
        <label>
          <input type="checkbox" v-model="showIncoming" @change="buildConnectionTree"> 
          Show incoming connections
        </label>
        <label>
          <input type="checkbox" v-model="showOutgoing" @change="buildConnectionTree"> 
          Show outgoing connections
        </label>
        <label>
          Max depth: 
          <input type="number" v-model.number="maxDepth" min="1" max="10" @change="buildConnectionTree" class="depth-input">
        </label>
      </div>
    </div>
    
    <div class="tree-container" v-if="nodes.length > 0">
      <VueFlow 
        :nodes="nodes" 
        :edges="edges"
        :fit-view-on-init="true"
        :nodes-draggable="true"
        :nodes-connectable="false"
        :elements-selectable="true"
        :min-zoom="0.1"
        :max-zoom="2"
        @nodes-initialized="onNodesInitialized"
      >
        <Background />
        <Controls />
        <MiniMap />
        
        <template #node-stat="{ data }">
          <div :class="['stat-node', data.nodeType]">
            <div class="stat-name">{{ data.label }}</div>
            <div class="stat-value">{{ data.value }}</div>
            <div v-if="data.params" class="stat-params">
              <div v-for="(value, key) in data.params" :key="key" class="param-item">
                {{ key }}: {{ formatParamValue(value) }}
              </div>
            </div>
            <div class="stat-type">{{ data.statType }}</div>
          </div>
        </template>
      </VueFlow>
    </div>
    
    <div v-else-if="exploreInput.trim() && searchAttempted" class="no-results">
      <p>No stat found with name: "{{ exploreInput }}"</p>
    </div>
    
    <div v-else class="instructions">
      <p>Enter a stat name above to visualize its connection tree.</p>
      <p>The visualization will show how stats are connected and how changes propagate through the system.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, watch } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { GameState } from '../../logic/GameState';
import { ConnectionType, type Stat, type Connection, Parameter, FormulaStat, IndependentStat, FormulaParameter, GateParameter } from '../../logic/core/Stat';

// Inject game state
const gameState = inject<GameState>('gameState');

// Reactive state  
const exploreInput = ref(gameState?.uiState.debugExploreInput || '');
const searchAttempted = ref(false);
const showIncoming = ref(true);
const showOutgoing = ref(true);
const maxDepth = ref(7);

// Vue Flow state
const nodes = ref<any[]>([]);
const edges = ref<any[]>([]);

// Computed properties

// Connection type labels for better readability
const connectionTypeLabels: Record<ConnectionType, string> = {
  [ConnectionType.ADD]: 'ADD',
  [ConnectionType.SUB]: 'SUB',
  [ConnectionType.MULTY]: 'MULT',
  [ConnectionType.DIV]: 'DIV',
  [ConnectionType.FORMULA]: 'FORMULA',
  [ConnectionType.NAMED_INPUT]: 'NAMED_INPUT',
  [ConnectionType.GATE_THRESHOLD]: 'GATE_THRESHOLD',
  [ConnectionType.GATE_VALUE]: 'GATE_VALUE',
};

// Get stat type for display
function getStatType(stat: Stat): string {
  if (stat instanceof IndependentStat) return 'Independent';
  if (stat instanceof Parameter) return 'Parameter';
  if (stat instanceof FormulaStat) return 'Formula';
  if (stat instanceof FormulaParameter) return 'FormulaParam';
  if (stat instanceof GateParameter) return 'Gate';
  return 'Unknown';
}

// Format parameter values for display
function formatParamValue(value: any): string {
  if (typeof value === 'number') {
    return value.toFixed(3);
  }
  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
}

// Get stat parameters for display
function getStatParams(stat: Stat): Record<string, any> | undefined {
  if (stat instanceof Parameter) {
    const params: Record<string, any> = { 
      add: stat.add, 
      multiCache: stat.multiCache 
    };
    if (stat.multi.length > 0) {
      params.multiSources = stat.multi;
    }
    if (stat.divSources.length > 0) {
      params.divSources = stat.divSources;
    }
    return params;
  }
  if (stat instanceof FormulaStat) {
    return { argument: stat.argument };
  }
  if (stat instanceof FormulaParameter) {
    const params: Record<string, any> = {};
    // Show each named input with its value
    Object.entries(stat.inputs).forEach(([key, value]) => {
      params[`input_${key}`] = value;
    });
    params.totalInputs = Object.keys(stat.inputs).length;
    return params;
  }
  if (stat instanceof GateParameter) {
    return { 
      baseValue: stat.baseValue, 
      threshold: stat.threshold, 
      inputValue: stat.inputValue,
      isAboveThreshold: stat.isAboveThreshold 
    };
  }
  return undefined;
}

// Find all connections that point TO a specific stat (incoming)
function findIncomingConnections(targetStatName: string): Array<{from: string, connection: Connection}> {
  if (!gameState) return [];
  
  const incoming: Array<{from: string, connection: Connection}> = [];
  
  // Search through all established connections
  for (const [fromStatName, connections] of gameState.connections.establishedConnections) {
    for (const connection of connections) {
      if (connection.target === targetStatName) {
        incoming.push({ from: fromStatName, connection });
      }
    }
  }
  
  return incoming;
}

// Find all outgoing connections from a stat
function findOutgoingConnections(fromStatName: string): Connection[] {
  if (!gameState) return [];
  return gameState.connections.establishedConnections.get(fromStatName) || [];
}

// Build the connection tree
function buildConnectionTree() {
  if (!gameState || !exploreInput.value.trim()) {
    clearTree();
    return;
  }
  
  searchAttempted.value = true;
  
  const rootStatName = exploreInput.value.trim();
  const rootStat = gameState.connections.connectablesByName.get(rootStatName);
  
  if (!rootStat) {
    nodes.value = [];
    edges.value = [];
    return;
  }
  
  const newNodes: any[] = [];
  const newEdges: any[] = [];
  const visited = new Set<string>();
  const nodePositions = new Map<string, {x: number, y: number}>();
  
  // Add root node
  const rootNodeType = rootStat.independent ? 'root-independent' : 'root';
  newNodes.push({
    id: rootStatName,
    type: 'stat',
    position: { x: 0, y: 0 },
    data: {
      label: rootStatName,
      value: rootStat.value.toFixed(3),
      params: getStatParams(rootStat),
      statType: getStatType(rootStat),
      nodeType: rootNodeType
    }
  });
  nodePositions.set(rootStatName, { x: 0, y: 0 });
  visited.add(rootStatName);
  
  // Track levels for positioning
  let currentLevel = 0;
  const levelNodes = new Map<number, string[]>();
  levelNodes.set(0, [rootStatName]);
  
  // Process incoming connections (stats that affect this one)
  if (showIncoming.value) {
    const queue: Array<{statName: string, depth: number, level: number}> = [];
    const incoming = findIncomingConnections(rootStatName);
    
    incoming.forEach((inc, _index) => {
      queue.push({ statName: inc.from, depth: 1, level: -1 });
    });
    
    while (queue.length > 0 && currentLevel > -maxDepth.value) {
      const { statName, depth, level } = queue.shift()!;
      
      if (depth > maxDepth.value || visited.has(statName)) continue;
      
      const stat = gameState.connections.connectablesByName.get(statName);
      if (!stat) continue;
      
      visited.add(statName);
      
      // Position nodes at the current level
      if (!levelNodes.has(level)) {
        levelNodes.set(level, []);
      }
      levelNodes.get(level)!.push(statName);
      
      const nodeType = stat.independent ? 'source' : 'intermediate';
      newNodes.push({
        id: statName,
        type: 'stat',
        position: { x: 0, y: 0 }, // Will be calculated later
        data: {
          label: statName,
          value: stat.value.toFixed(3),
          params: getStatParams(stat),
          statType: getStatType(stat),
          nodeType: nodeType
        }
      });
      
      // Add edges for incoming connections to this stat
      const incomingToThis = findIncomingConnections(statName);
      incomingToThis.forEach(inc => {
        if (!visited.has(inc.from) && depth < maxDepth.value) {
          queue.push({ statName: inc.from, depth: depth + 1, level: level - 1 });
        }
      });
      
      currentLevel = Math.min(currentLevel, level);
    }
  }
  
  // Process outgoing connections (stats affected by this one)
  if (showOutgoing.value) {
    const queue: Array<{statName: string, depth: number, level: number}> = [];
    const outgoing = findOutgoingConnections(rootStatName);
    
    outgoing.forEach((conn, _index) => {
      queue.push({ statName: conn.target, depth: 1, level: 1 });
    });
    
    let maxLevel = 0;
    
    while (queue.length > 0 && maxLevel < maxDepth.value) {
      const { statName, depth, level } = queue.shift()!;
      
      if (depth > maxDepth.value || visited.has(statName)) continue;
      
      const stat = gameState.connections.connectablesByName.get(statName);
      if (!stat) continue;
      
      visited.add(statName);
      
      // Position nodes at the current level
      if (!levelNodes.has(level)) {
        levelNodes.set(level, []);
      }
      levelNodes.get(level)!.push(statName);
      
      const nodeType = 'target';
      newNodes.push({
        id: statName,
        type: 'stat',
        position: { x: 0, y: 0 }, // Will be calculated later
        data: {
          label: statName,
          value: stat.value.toFixed(3),
          params: getStatParams(stat),
          statType: getStatType(stat),
          nodeType: nodeType
        }
      });
      
      // Add outgoing connections from this stat
      const outgoingFromThis = findOutgoingConnections(statName);
      outgoingFromThis.forEach(conn => {
        if (!visited.has(conn.target) && depth < maxDepth.value) {
          queue.push({ statName: conn.target, depth: depth + 1, level: level + 1 });
        }
      });
      
      maxLevel = Math.max(maxLevel, level);
    }
  }
  
  // Calculate positions for all nodes
  const levelSpacing = 300;
  const nodeSpacing = 150;
  
  for (const [level, nodeNames] of levelNodes) {
    const y = level * levelSpacing;
    const totalWidth = (nodeNames.length - 1) * nodeSpacing;
    const startX = -totalWidth / 2;
    
    nodeNames.forEach((nodeName, index) => {
      const x = startX + index * nodeSpacing;
      nodePositions.set(nodeName, { x, y });
      
      // Update node position
      const node = newNodes.find(n => n.id === nodeName);
      if (node) {
        node.position = { x, y };
      }
    });
  }
  
  // Add edges
  for (const [fromStatName, connections] of gameState.connections.establishedConnections) {
    if (!visited.has(fromStatName)) continue;
    
    for (const connection of connections) {
      if (!visited.has(connection.target)) continue;
      
      const edgeLabel = connectionTypeLabels[connection.type];
      const edgeId = `${fromStatName}-${connection.target}-${connection.type}`;
      
      newEdges.push({
        id: edgeId,
        source: fromStatName,
        target: connection.target,
        label: connection.inputName ? `${edgeLabel}(${connection.inputName})` : edgeLabel,
        type: 'default',
        style: { stroke: getConnectionColor(connection.type) }
      });
    }
  }
  
  nodes.value = newNodes;
  edges.value = newEdges;
}

// Get color for connection type
function getConnectionColor(type: ConnectionType): string {
  const colors: Record<ConnectionType, string> = {
    [ConnectionType.ADD]: '#4CAF50',
    [ConnectionType.SUB]: '#F44336',
    [ConnectionType.MULTY]: '#2196F3',
    [ConnectionType.DIV]: '#FF9800',
    [ConnectionType.FORMULA]: '#9C27B0',
    [ConnectionType.NAMED_INPUT]: '#607D8B',
    [ConnectionType.GATE_THRESHOLD]: '#795548',
    [ConnectionType.GATE_VALUE]: '#009688',
  };
  return colors[type] || '#666666';
}

// Clear the tree
function clearTree() {
  nodes.value = [];
  edges.value = [];
  searchAttempted.value = false;
}

// Handle nodes initialization
function onNodesInitialized() {
  // Vue Flow callback when nodes are ready
}

// Debounce timer
let debounceTimer: number | null = null;

// Watch for input changes and auto-update tree
watch(exploreInput, async (newValue) => {
  // Save to UI state
  if (gameState) {
    gameState.uiState.debugExploreInput = newValue;
  }
  
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  // Debounce the tree building to avoid too many updates
  debounceTimer = setTimeout(() => {
    buildConnectionTree();
  }, 300) as any;
}, { immediate: false });

// Watch for other control changes
watch([showIncoming, showOutgoing, maxDepth], () => {
  if (exploreInput.value.trim()) {
    buildConnectionTree();
  }
});

// Initial setup
onMounted(() => {
  // Build initial tree if there's a saved input
  if (exploreInput.value.trim()) {
    buildConnectionTree();
  }
});
</script>

<style scoped>
.explore-tab {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
  min-height: 500px;
}

.explore-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
}

.explore-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
}

.clear-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: #6c757d;
  color: white;
}

.clear-button:hover {
  background-color: #545b62;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
}

.controls-right label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.depth-input {
  width: 50px;
  padding: 4px;
  border: 1px solid #ced4da;
  border-radius: 3px;
  font-family: monospace;
}

.tree-container {
  flex: 1;
  height: 100%;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #6c757d;
}



.instructions {
  padding: 40px 20px;
  text-align: center;
  color: #6c757d;
}

.instructions p {
  margin-bottom: 10px;
  font-size: 16px;
}

/* Node styles */
.stat-node {
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  background: white;
  min-width: 180px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-node.root {
  border-color: #007bff;
  background: #e3f2fd;
}

.stat-node.root-independent {
  border-color: #28a745;
  background: #e8f5e8;
}

.stat-node.source {
  border-color: #ffc107;
  background: #fff3cd;
}

.stat-node.target {
  border-color: #dc3545;
  background: #f8d7da;
}

.stat-node.intermediate {
  border-color: #6c757d;
  background: #f8f9fa;
}

.stat-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: #212529;
}

.stat-value {
  font-family: monospace;
  font-size: 16px;
  color: #007bff;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-params {
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 4px;
}

.param-item {
  margin-bottom: 2px;
}

.stat-type {
  font-size: 10px;
  color: #adb5bd;
  text-transform: uppercase;
  font-weight: bold;
}
</style>

<!-- Import Vue Flow styles -->
<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';

/* Fix Vue Flow container issues */
.vue-flow {
  height: 100% !important;
  width: 100% !important;
}

.vue-flow__viewport {
  height: 100% !important;
  width: 100% !important;
}

.vue-flow__panel {
  z-index: 5 !important;
}
</style> 