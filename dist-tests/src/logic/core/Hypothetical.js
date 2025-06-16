import { Stats } from './Stats';
export var Hypothetical;
(function (Hypothetical) {
    function createHypotheticalForAttributeUpgrade(gameState, attributeStat, amount = 1) {
        const key = `attr_${attributeStat.name}_${amount}`;
        if (gameState.hypothetical?.key === key) {
            return;
        }
        const newConnections = Stats.cloneConnections(gameState.connections);
        const clonedStat = Stats.getStatAsserted(attributeStat.name, newConnections);
        Stats.setIndependentStat(clonedStat, clonedStat.value + amount, newConnections);
        gameState.hypothetical = { key, connections: newConnections };
    }
    Hypothetical.createHypotheticalForAttributeUpgrade = createHypotheticalForAttributeUpgrade;
    function createHypotheticalForSkillUpgrade(gameState, skillStat, amount = 1) {
        const key = `skill_${skillStat.name}_${amount}`;
        if (gameState.hypothetical?.key === key) {
            return;
        }
        const newConnections = Stats.cloneConnections(gameState.connections);
        const clonedStat = Stats.getStatAsserted(skillStat.name, newConnections);
        Stats.setIndependentStat(clonedStat, clonedStat.value + amount, newConnections);
        gameState.hypothetical = { key, connections: newConnections };
    }
    Hypothetical.createHypotheticalForSkillUpgrade = createHypotheticalForSkillUpgrade;
    function createHypotheticalForSpecUpgrade(gameState, specStat, amount = 1) {
        const key = `spec_${specStat.name}_${amount}`;
        if (gameState.hypothetical?.key === key) {
            return;
        }
        const newConnections = Stats.cloneConnections(gameState.connections);
        const clonedStat = Stats.getStatAsserted(specStat.name, newConnections);
        Stats.setIndependentStat(clonedStat, clonedStat.value + amount, newConnections);
        gameState.hypothetical = { key, connections: newConnections };
    }
    Hypothetical.createHypotheticalForSpecUpgrade = createHypotheticalForSpecUpgrade;
    function clearHypothetical(gameState) {
        if (gameState.hypothetical) {
            gameState.hypothetical = null;
        }
    }
    Hypothetical.clearHypothetical = clearHypothetical;
})(Hypothetical || (Hypothetical = {}));
