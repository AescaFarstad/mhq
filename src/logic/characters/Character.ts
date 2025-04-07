import { Connections, IndependentStat, Parameter, ConnectionType, Stat } from '../core/Stat';
import { Stats } from '../core/Stats';
import { CharacterDefinition } from './CharacterDefinition';
import { AttributeDefinitions } from '../attributes/AttributeDefinition';

/**
 * Represents an active character instance in the game with dynamic stats.
 */
export class Character {
    /** Static definition data. */
    public definition: CharacterDefinition;
    /** Stat: Current level of the character. */
    public level: IndependentStat;
    /** Stat: Base upkeep cost (can be modified by effects/items later). */
    public baseUpkeep: IndependentStat;
    /** Stat: Final calculated upkeep cost (Parameter derived from baseUpkeep and level). */
    public upkeep: Parameter;

    /** Flat structure holding all attribute stats as IndependentStats. */
    public attributes: Record<string, IndependentStat> = {};

    /** Prefix used for internal stat names. Accessible for ID generation elsewhere. */
    public static readonly STAT_PREFIX = "chr_";

    /**
     * Creates a new Character instance and its associated stats.
     *
     * @param definition The static definition of the character.
     * @param connections The Connections manager instance.
     * @param attributeDefs The definitions for all attributes (from AttributeLib).
     */
    constructor(
        definition: CharacterDefinition,
        connections: Connections,
        attributeDefs: AttributeDefinitions
    ) {
        this.definition = definition;
        const idPrefix = `${Character.STAT_PREFIX}${definition.id}__`;

        // 1. Create core IndependentStats
        this.level = Stats.createStat(`${idPrefix}level`, definition.initialLevel, connections);
        this.baseUpkeep = Stats.createStat(`${idPrefix}base_upkeep`, definition.baseUpkeep, connections);

        // 2. Create the derived Parameter for final upkeep
        this.upkeep = Stats.createParameter(`${idPrefix}upkeep`, connections);

        // 3. Connect core stats
        Stats.connectStat(this.baseUpkeep, this.upkeep, ConnectionType.ADD, connections);
        Stats.connectStat(this.level, this.upkeep, ConnectionType.MULTY, connections);

        // 4. Create ALL Attribute Stats as IndependentStats from flat initialAttributes structure
        for (const categoryKey in attributeDefs) {
            const categoryDef = attributeDefs[categoryKey];

            // Create Stat for the Primary Attribute Category Key (e.g., 'physique')
            const primaryStatId = `${idPrefix}${categoryKey}`;
            // Fetch value directly from flat initialAttributes using categoryKey
            const primaryInitialValue = definition.initialAttributes?.[categoryKey] ?? 0;
            const primaryStat = Stats.createStat(primaryStatId, primaryInitialValue, connections);
            this.attributes[primaryStatId] = primaryStat;
            // console.log(`Created primary attribute stat: ${primaryStatId} with initial value ${primaryInitialValue}`);

            // Create Stats for Secondary Attributes within the Category (e.g., 'strength')
            for (const attributeKey in categoryDef.attributes) {
                const secondaryStatId = `${idPrefix}${attributeKey}`; // Use hierarchical ID for uniqueness
                // Fetch value directly from flat initialAttributes using attributeKey
                const initialValue = definition.initialAttributes?.[attributeKey] ?? 0;
                const secondaryStat = Stats.createStat(secondaryStatId, initialValue, connections);
                this.attributes[secondaryStatId] = secondaryStat; // Store using unique hierarchical ID
                // console.log(`Created secondary attribute stat: ${secondaryStatId} with initial value ${initialValue}`);
            }
        }

        console.log(`Created character ${definition.name} stats. Initial calculated upkeep: ${this.upkeep.value}`);
        // console.log(`Character attributes:`, this.attributes);
    }

    // Add methods here later, e.g., levelUp(), equipItem(), etc.
    // These methods would use Stats.modifyStat (for level/baseUpkeep/attributes) or
    // potentially modify parameters connected to baseUpkeep/level.
} 