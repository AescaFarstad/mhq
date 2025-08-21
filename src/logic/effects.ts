import { GameState } from './GameState';
import {
    ModifyResourceParams,
    ModifyResourceIncomeParams,
    AddCharacterParams,
    DiscoverEffectParams,
    StartMinigameParams,
    EndMinigameParams,
    ApplyIngressResultsParams,
    ApplyWelcomeResultsParams,
    GivePointsParams,
    EventDefinition
} from './lib/definitions/EventDefinition';
import { Stats } from './core/Stats';
import { IndependentStat } from './core/Stat';
import { Character } from './Character';
import { Character as CharacterOps } from './Character';
import type { Skill } from './lib/definitions/SkillDefinition';
import { addResource } from './Resource';
import { Building } from './Building';
import { ClickCounterGame } from '../minigames/click_counter/ClickCounterGame';
import { WelcomeGame } from '../minigames/welcome/WelcomeGame';
import { IngressGame } from '../minigames/ingress/IngressGame';
import { ExampleGame } from '../minigames/example/ExampleGame';
import { IntroGame } from '../minigames/intro/IntroGame';
import { FirstStepsGame } from '../minigames/firststeps/FirstStepsGame';
import { EventProcessor } from './Event';
import { discoverItem } from './Discovery';
import { C } from './lib/C';


export function giveResource(state: GameState, params: ModifyResourceParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'giveResource':`, params);
    }
    
    const res = state.resources.get(params.resource);
    if (res) {
        Stats.modifyStat(res.current, params.amount, state.connections);
    } else {
        console.warn(`E 'giveResource': Resource "${params.resource}" not found.`);
    }
}

export function giveMaxResource(state: GameState, params: ModifyResourceParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'giveMaxResource':`, params);
    }
    
    let res = state.resources.get(params.resource);
    if (!res) {
        res = addResource(state.resources, params.resource, 0, 0, state.connections);
    }
    const currentMax = res.max.add;
    const delta = params.amount - currentMax;
    Stats.modifyParameterADD(res.max, delta, state.connections);
}

export function addResourceIncome(state: GameState, params: ModifyResourceIncomeParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'addResourceIncome':`, params);
    }
    
    const res = state.resources.get(params.resource);
    if (res) {
        Stats.modifyParameterADD(res.income, params.amount, state.connections);
    } else {
        console.warn(`E 'addResourceIncome': Resource "${params.resource}" not found.`);
    }
}

export function discover(state: GameState, params: DiscoverEffectParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'discover':`, params);
    }
    
    discoverItem(params.key, 'event', state);
}

export function startDialog(): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'startDialog':`, {});
    }
    
    // const params = effect.params as StartDialogParams;
}

export function addCharacterByName(state: GameState, params: AddCharacterParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'addCharacterByName':`, params);
    }
    
    const charDef = state.lib.characters.getCharacter(params.characterId);
    if (charDef) {
        Character.addCharacter(state, charDef.id);
    } else {
        console.warn(`E 'addCharacterByName': Character definition "${params.characterId}" not found in Lib.`);
    }
}

export function giveAllSkillsAndSpecsEffect(state: GameState, character : Character): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'giveAllSkillsAndSpecsEffect': ${character}`);
    }

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

export function giveSkillsAndSpecs(state: GameState, _params: any): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'giveSkillsAndSpecs':`, _params);
    }
    
    const protagonist = Character.getProtagonistCharacter(state);
    if (!protagonist) {
        console.warn("[giveSkillsAndSpecs]: No protagonist character found. Cannot give skills.");
        return;
    }
    
    // Replicating the nested effect call without circular dependency
    giveAllSkillsAndSpecsEffect(state, protagonist);
}

export function construct(state: GameState, params: { building: string }): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'construct':`, params);
    }
    
    if (params.building) {
        Building.addBuilding(state, params.building);
    } else {
        console.warn(`E 'construct': Missing 'building' parameter.`);
    }
}

export function startMinigame(state: GameState, params: StartMinigameParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'startMinigame':`);
        console.dir(params);
    }
    
    if (state.activeMinigame) {
        console.warn(`E 'startMinigame': Minigame '${state.activeMinigame.type}' already active. Cannot start '${params.name}'.`);
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
    } else if (params.name === 'Intro') {
        minigameInstance = new IntroGame(`event-${params.name}-${Date.now()}`);
    } else if (params.name === 'FirstSteps') {
        minigameInstance = new FirstStepsGame(`event-${params.name}-${Date.now()}`);
    } else {
        console.warn(`E 'startMinigame': Unknown minigame name '${params.name}'.`);
        return;
    }
    
    if (minigameInstance) {
        state.startMinigame(minigameInstance);

        const startEvent: EventDefinition = {
            id: 'minigameStarted',
            params: { minigameType: minigameInstance.type },
            effects: []
        };
        EventProcessor.processSingleEvent(startEvent, state);
    }
}

export function endMinigame(state: GameState, params: EndMinigameParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'endMinigame':`, params);
    }

    if (state.activeMinigame && state.activeMinigame.id === params.minigameId) {
        state.endMinigame();
    } else {
        console.warn(`E 'endMinigame': Minigame with id '${params.minigameId}' not active.`);
    }
}

export function startBehTree(state: GameState, params: { treeName: string }): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'startBehTree':`, params);
    }
    
    const treeDef = state.lib.behTrees.getTree(params.treeName);
    if (treeDef) {
        const treeInstance = treeDef();
        state.invoker.addTree(treeInstance, state);
    } else {
        console.warn(`E 'startBehTree': Tree definition "${params.treeName}" not found.`);
    }
}

export function applyIngressResults(state: GameState, params: ApplyIngressResultsParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'applyIngressResults':`);
        console.dir(params);
    }
    
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

        character.isProtagonist = true;

        // Apply bonuses
        Stats.modifyStat(character.xp, params.xpBonus * character.nextLevelXp.value * 0.01, state.connections);
        Stats.modifyStat(character.attributePoints, params.attributePoints, state.connections);
        Stats.modifyStat(character.skillPoints, params.skillPoints, state.connections);
        Stats.modifyStat(character.specPoints, params.specPoints, state.connections);

        // Store ingress word data if provided
        if (params.allSubmittedWords) {
            const sessionId = `${params.characterId}_${Date.now()}`;
            state.ingressGameResults[sessionId] = {
                characterId: params.characterId,
                characterName: params.characterName,
                completedAt: Date.now(),
                allSubmittedWords: params.allSubmittedWords,
                xpBonus: params.xpBonus,
                attributePoints: params.attributePoints,
                skillPoints: params.skillPoints,
                specPoints: params.specPoints,
            };

            // Add unique words to crystal ball storage
            for (const word of params.allSubmittedWords) {
                if (!state.crystalBallWords.includes(word)) {
                    state.crystalBallWords.push(word);
                }
            }
        }
    } else {
        console.warn(`E 'ApplyIngressResults': Could not find or add character with ID "${params.characterId}".`);
    }
}

export function applyWelcomeResults(state: GameState, params: ApplyWelcomeResultsParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'applyWelcomeResults':`, params);
    }
    
    if (params.locationId) {
        state.locationId = params.locationId;
    } else {
        console.warn(`E 'applyWelcomeResults': Missing 'locationId' parameter.`);
    }
}

export function givePoints(state: GameState, params: GivePointsParams): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'givePoints':`, params);
    }
    
    const protagonist = Character.getProtagonistCharacter(state);
    if (!protagonist) {
        console.warn("[givePoints]: No protagonist character found. Cannot give points.");
        return;
    }
    
    // Apply the points to the protagonist character
    Stats.modifyStat(protagonist.attributePoints, params.attributePoints, state.connections);
    Stats.modifyStat(protagonist.skillPoints, params.skillPoints, state.connections);
    Stats.modifyStat(protagonist.specPoints, params.specPoints, state.connections);
}

export function addCrystalBallWords(state: GameState, params: { words: string[] }): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'addCrystalBallWords':`);
        console.dir(params);
    }
    
    for (const word of params.words) {
        if (!state.crystalBallWords.includes(word)) {
            state.crystalBallWords.push(word);
        }
    }
}

export function skipIngressEngagement(state: GameState): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'skipIngressEngagement':`, {});
    }
    
    if (state.activeMinigame?.type === 'Ingress') {
        const ingressGame = state.activeMinigame as IngressGame;
        if (!ingressGame.state.engaged) {
            ingressGame.engage();
        }
    } else {
        console.warn('Effect skipIngressEngagement: No active Ingress minigame found.');
    }
}

export function switchToTab(state: GameState, params: { tabName: string }): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'switchToTab':`, params);
    }
    
    state.setActiveTab(params.tabName);
}

export function modifyIndependentStat(state: GameState, params: { statName: string; amount: number }): void {
    if (C.DEBUG_EFFECTS) {
        console.log(`E 'modifyIndependentStat':`, params);
    }
    
    const stat = state.connections.connectablesByName.get(params.statName);
    if (stat?.independent) {
        Stats.modifyStat(stat as IndependentStat, params.amount, state.connections);
    } else {
        console.warn(`Cannot set stat ${params.statName}: not found or not independent`);
    }
} 