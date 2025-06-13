import { GameState, ALL_TAB_IDS } from './GameState';
import {
    ModifyResourceParams,
    ModifyResourceIncomeParams,
    AddCharacterParams,
    DiscoverEffectParams,
    StartMinigameParams,
    ApplyIngressResultsParams,
    ApplyWelcomeResultsParams,
    GivePointsParams,
    EventContext,
    EventDefinition
} from './lib/definitions/EventDefinition';
import { Stats } from './core/Stats';
import { Character } from './Character';
import { Character as CharacterOps } from './Character';
import type { Skill } from './lib/definitions/SkillDefinition';
import { getResource, addResource } from './Resource';
import { Building } from './Building';
import { ClickCounterGame } from '../minigames/click_counter/ClickCounterGame';
import { WelcomeGame } from '../minigames/welcome/WelcomeGame';
import { IngressGame } from '../minigames/ingress/IngressGame';
import { ExampleGame } from '../minigames/example/ExampleGame';
import { EventProcessor } from './Event';

export function giveResource(state: GameState, params: ModifyResourceParams): void {
    const res = getResource(state.resources, params.resource);
    if (res) {
        Stats.modifyStat(res.current, params.amount, state.connections);
    } else {
        console.warn(`Effect 'giveResource': Resource "${params.resource}" not found.`);
    }
}

export function giveMaxResource(state: GameState, params: ModifyResourceParams): void {
    let res = getResource(state.resources, params.resource);
    if (!res) {
        res = addResource(state.resources, params.resource, 0, 0, state.connections);
    }
    const currentMax = res.max.add;
    const delta = params.amount - currentMax;
    Stats.modifyParameterADD(res.max, delta, state.connections);
}

export function addResourceIncome(state: GameState, params: ModifyResourceIncomeParams): void {
    const res = getResource(state.resources, params.resource);
    if (res) {
        Stats.modifyParameterADD(res.income, params.amount, state.connections);
    } else {
        console.warn(`Effect 'addResourceIncome': Resource "${params.resource}" not found.`);
    }
}

export function discover(state: GameState, params: DiscoverEffectParams): void {
    state.markAsDiscovered(params.key);
}

export function discoverAllBuildings(state: GameState): void {
    for (const buildingDef of state.lib.buildings.values()) {
        state.markAsDiscovered(buildingDef.id);
    }
}

export function discoverAllSkills(state: GameState): void {
    const allSkills = state.lib.skills.getAllSkillItems();
    for (const skillId in allSkills) {
        state.markAsDiscovered(skillId); // Discover skill itself
        const skillItem = allSkills[skillId];
        if (skillItem.type === 'skill') {
            // Discover attribute
            state.markAsDiscovered(skillItem.attribute);
            // Discover specializations
            skillItem.specializations.forEach(specId => state.markAsDiscovered(specId));
        }
    }
    // Discover all attribute categories and their individual attributes
    const attributeDefs = state.lib.attributes.getAttributeDefinitions();
    for (const categoryKey in attributeDefs) {
        state.markAsDiscovered(categoryKey);
        // Also discover individual attributes within each category
        const category = attributeDefs[categoryKey];
        if (category.attributes) {
            for (const attributeKey in category.attributes) {
                state.markAsDiscovered(attributeKey);
            }
        }
    }
}

export function discoverAllResources(state: GameState): void {
    for (const resourceName of state.resources.keys()) {
        state.markAsDiscovered(resourceName);
    }
}

export function discoverAll(state: GameState): void {
    // Use the individual discovery functions for consistency
    discoverAllBuildings(state);
    discoverAllSkills(state);
    discoverAllAttributes(state);
    discoverAllResources(state);
    discoverAllTabs(state);
}

export function startDialog(): void {
    // const params = effect.params as StartDialogParams;
}

export function addCharacterByName(state: GameState, params: AddCharacterParams): void {
    const charDef = state.lib.characters.getCharacter(params.characterId);
    if (charDef) {
        Character.addCharacter(state, charDef.id);
    } else {
        console.warn(`Effect 'addCharacterByName': Character definition "${params.characterId}" not found in Lib.`);
    }
}

export function giveAllSkillsAndSpecsEffect(state: GameState, context: EventContext): void {
    if (!context || !('characterId' in context) || !('skills' in context) || !('specializations' in context)) {
        console.warn("[giveAllSkillsAndSpecsEffect]: Invalid character context provided (must be a Character object):");
        console.log(context);
        return;
    }
    const character = context as Character; // context is expected to be Character here

    const allSkillDefs = state.lib.skills.getAllSkills() as Record<string, Skill>;

    if (Object.keys(allSkillDefs).length === 0) {
        console.warn(`[giveAllSkillsAndSpecsEffect] For ${character.name}: No skill definitions found in state.lib.skills.getAllSkills(). Cannot give skills.`);
        return;
    }

    const connections = state.connections;

    for (const skillId in allSkillDefs) {
        if (Object.prototype.hasOwnProperty.call(allSkillDefs, skillId)) {
            const skillDef = allSkillDefs[skillId];
            Character.setOrUpdateSkillAndAllSpecializations(character, skillId, skillDef, 1, connections);
        }
    }
}

export function giveSkillsAndSpecs(state: GameState, _params: any, _context?: EventContext): void {
    if (!state.characters || state.characters.length === 0) {
        console.warn("[giveSkillsAndSpecs]: No characters found in state. Cannot give skills.");
        return;
    }

    const firstCharacter = state.characters[0] as Character;
    
    // Replicating the nested effect call without circular dependency
    giveAllSkillsAndSpecsEffect(state, firstCharacter);
}

export function construct(state: GameState, params: { building: string }): void {
    if (params.building) {
        Building.addBuilding(state, params.building);
    } else {
        console.warn(`Effect 'construct': Missing 'building' parameter.`);
    }
}

export function startMinigame(state: GameState, params: StartMinigameParams): void {
    if (state.activeMinigame) {
        console.warn(`Effect 'startMinigame': Minigame '${state.activeMinigame.type}' already active. Cannot start '${params.name}'.`);
        return;
    }
    let minigameInstance;
    // This part would need a factory or switch if more minigames exist
    if (params.name === 'ClickCounter') {
        // Extract specific params for ClickCounter if any, e.g., clicksToWin
        const clicksToWin = params.minigameParams?.clicksToWin as number | undefined;
        minigameInstance = new ClickCounterGame(`event-${params.name}-${Date.now()}`, clicksToWin);
    } else if (params.name === 'Welcome') {
        minigameInstance = new WelcomeGame(`event-${params.name}-${Date.now()}`);
    } else if (params.name === 'Ingress') {
        minigameInstance = new IngressGame(`event-${params.name}-${Date.now()}`);
    } else if (params.name === 'Example') {
        minigameInstance = new ExampleGame(`event-${params.name}-${Date.now()}`);
    } else {
        console.warn(`Effect 'startMinigame': Unknown minigame name '${params.name}'.`);
        return;
    }
    
    if (minigameInstance) {
        state.startMinigame(minigameInstance);
        console.log(`Event 'startMinigame': Started minigame '${params.name}'.`);

        const startEvent: EventDefinition = {
            id: 'minigameStarted',
            params: { minigameType: minigameInstance.type },
            effects: []
        };
        EventProcessor.processSingleEvent(startEvent, state);
    }
}

export function startBehTree(state: GameState, params: { treeName: string }): void {
    const treeDef = state.lib.behTrees.getTree(params.treeName);
    if (treeDef) {
        const treeInstance = treeDef();
        state.invoker.addTree(treeInstance, state);
    } else {
        console.warn(`Effect 'startBehTree': Tree definition "${params.treeName}" not found.`);
    }
}

export function applyIngressResults(state: GameState, params: ApplyIngressResultsParams): void {
    console.log(`Applying ingress results:`, params);
    let character = state.characters.find(c => c.characterId === params.characterId);

    if (!character) {
        // If character not found, try to add them
        character = CharacterOps.addCharacter(state, params.characterId);
    }

    if (character) {
        // Update name if provided
        if (params.characterName) {
            character.name = params.characterName;
        }

        // Apply bonuses
        Stats.modifyStat(character.xp, params.xpBonus * character.nextLevelXp.value * 0.01, state.connections);
        console.log(`Applying xp: ${params.xpBonus} * ${character.nextLevelXp.value} * 0.01 = ${params.xpBonus * character.nextLevelXp.value * 0.01} to ${character.name}`);
        Stats.modifyStat(character.attributePoints, params.attributePoints, state.connections);
        Stats.modifyStat(character.skillPoints, params.skillPoints, state.connections);
        Stats.modifyStat(character.specPoints, params.specPoints, state.connections);

        console.log(`Applied Ingress results to character: ${character.name}`);
    } else {
        console.warn(`Effect 'ApplyIngressResults': Could not find or add character with ID "${params.characterId}".`);
    }
}

export function applyWelcomeResults(state: GameState, params: ApplyWelcomeResultsParams): void {
    console.log(`Applying welcome results:`, params);
    if (params.locationId) {
        state.locationId = params.locationId;
    } else {
        console.warn(`Effect 'applyWelcomeResults': Missing 'locationId' parameter.`);
    }
}

export function discoverAllAttributes(state: GameState): void {
    const attributeDefs = state.lib.attributes.getAttributeDefinitions();
    for (const categoryKey in attributeDefs) {
        state.markAsDiscovered(categoryKey);
        // Also discover individual attributes within each category
        const category = attributeDefs[categoryKey];
        if (category.attributes) {
            for (const attributeKey in category.attributes) {
                state.markAsDiscovered(attributeKey);
            }
        }
    }
}

export function discoverAllTabs(state: GameState): void {
    ALL_TAB_IDS.forEach(tabId => state.markAsDiscovered(tabId));
}

export function givePoints(state: GameState, params: GivePointsParams): void {
    if (!state.characters || state.characters.length === 0) {
        console.warn("[givePoints]: No characters found in state. Cannot give points.");
        return;
    }

    const firstCharacter = state.characters[0] as Character;
    
    // Apply the points to the first character
    Stats.modifyStat(firstCharacter.attributePoints, params.attributePoints, state.connections);
    Stats.modifyStat(firstCharacter.skillPoints, params.skillPoints, state.connections);
    Stats.modifyStat(firstCharacter.specPoints, params.specPoints, state.connections);
} 