import type { GameState } from '../GameState';
import { globalInputQueue } from '../GameState'; // Import globalInputQueue
import type { CmdInput, CmdCheatSkillUp, CmdConstructBuilding, CmdTimeScale, CmdFireCharacter, CmdSpendAttributePoint, CmdSpendSkillPoint, CmdSpendSpecPoint, CmdSubmitDiscovery, CmdRemoveCrystalWord } from './InputCommands';
import { Stats } from '../core/Stats';
import type { IndependentStat } from '../core/Stat';
import { Building } from '../Building'; // Import Building namespace
import { processDiscoveryAttempt } from '../Discovery';


// Map of handlers
const handlersByName = new Map<string, (gameState: GameState, command: CmdInput) => void>();
handlersByName.set("CmdCheatSkillUp", handleCheatSkillUp);
handlersByName.set("CmdConstructBuilding", handleConstructBuilding); // Added handler for CmdConstructBuilding
handlersByName.set("CmdTimeScale", handleTimeScale); 
handlersByName.set("CmdTickOnce", handleTickOnce);
handlersByName.set("CmdFireCharacter", handleFireCharacter);
handlersByName.set("CmdSpendAttributePoint", handleSpendAttributePoint);
handlersByName.set("CmdSpendSkillPoint", handleSpendSkillPoint);
handlersByName.set("CmdSpendSpecPoint", handleSpendSpecPoint);
handlersByName.set("CmdSubmitDiscovery", handleSubmitDiscovery);
handlersByName.set("CmdRemoveCrystalWord", handleRemoveCrystalWord);

/**
 * Processes all queued commands in the GameState.
 * @param gameState The current game state.
 */
export function processInputs(gameState: GameState): void {
    for (const command of globalInputQueue) { // Use globalInputQueue
        const handler = handlersByName.get(command.name);
        if (handler) {
            handler(gameState, command);
        } else {
            console.error(`No handler registered for command: ${command.name}`);
        }
    }
    globalInputQueue.length = 0; // Clear the globalInputQueue
}


// Handlers

function handleCheatSkillUp(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdCheatSkillUp;
    const character = gameState.characters.find(c => c.characterId === specificCommand.characterId);

    if (!character) {
        console.error(`CmdCheatSkillUp: Character with ID '${specificCommand.characterId}' not found.`);
        return;
    }

    const skillStat = character.skills[specificCommand.skillId] as IndependentStat;

    if (!skillStat) {
        console.error(`CmdCheatSkillUp: Skill with ID '${specificCommand.skillId}' not found for character '${character.name}' (ID: ${character.characterId}).`);
        return;
    }

    Stats.setIndependentStat(skillStat, skillStat.value + specificCommand.amount, gameState.connections);
}

function handleConstructBuilding(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdConstructBuilding;
    Building.addBuilding(gameState, specificCommand.buildingId);
}

function handleTimeScale(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdTimeScale;
    if (gameState.timeScale.current === specificCommand.scale) {
        gameState.swapTimeScale();
    } else {
        gameState.setTimeScale(specificCommand.scale);
    }
}

function handleTickOnce(gameState: GameState, _command: CmdInput): void {
    gameState.allowedUpdates++;
    // Pause the game by setting current time scale to 0 and storing the previous one
    if (gameState.timeScale.current !== 0) { // Only update previous if not already paused
        gameState.timeScale.previous = gameState.timeScale.current;
    }
    gameState.timeScale.current = 0;
}

function handleFireCharacter(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdFireCharacter;
    const characterIndex = gameState.characters.findIndex(c => c.characterId === specificCommand.characterId);

    if (characterIndex === -1) {
        console.error(`CmdFireCharacter: Character with ID '${specificCommand.characterId}' not found.`);
        return;
    }

    const character = gameState.characters[characterIndex];
    
    // Manually subtract the character's upkeep from total upkeep
    Stats.modifyParameterADD(gameState.totalCharacterUpkeep, -character.upkeep.value, gameState.connections);
    
    // Remove character from the array
    gameState.characters.splice(characterIndex, 1);
    
    // Update UI state
    import('../UIStateManager').then(({ updateCharacterUIData }) => {
        updateCharacterUIData(gameState);
    });
    
    console.log(`Character '${character.name}' (ID: ${character.characterId}) has been fired.`);
}

function handleSpendAttributePoint(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdSpendAttributePoint;
    const character = gameState.characters.find(c => c.characterId === specificCommand.characterId);

    if (!character) {
        console.error(`CmdSpendAttributePoint: Character with ID '${specificCommand.characterId}' not found.`);
        return;
    }

    if (character.attributePoints.value <= 0) {
        console.error(`CmdSpendAttributePoint: Character '${character.name}' has no attribute points to spend.`);
        return;
    }

    // Find the attribute stat by checking for the full stat ID
    let attributeStat: IndependentStat | undefined = undefined;
    for (const attrKey in character.attributes) {
        if (attrKey.includes(specificCommand.attributeId)) {
            attributeStat = character.attributes[attrKey] as IndependentStat;
            break;
        }
    }
    if (!attributeStat) {
        console.error(`CmdSpendAttributePoint: Attribute with ID '${specificCommand.attributeId}' not found for character '${character.name}'.`);
        return;
    }

    // Increment attribute and decrement attribute points
    Stats.setIndependentStat(attributeStat, attributeStat.value + 1, gameState.connections);
    Stats.setIndependentStat(character.attributePoints, character.attributePoints.value - 1, gameState.connections);
}

function handleSpendSkillPoint(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdSpendSkillPoint;
    const character = gameState.characters.find(c => c.characterId === specificCommand.characterId);

    if (!character) {
        console.error(`CmdSpendSkillPoint: Character with ID '${specificCommand.characterId}' not found.`);
        return;
    }

    if (character.skillPoints.value <= 0) {
        console.error(`CmdSpendSkillPoint: Character '${character.name}' has no skill points to spend.`);
        return;
    }

    const skillStat = character.skills[specificCommand.skillId] as IndependentStat;
    if (!skillStat) {
        console.error(`CmdSpendSkillPoint: Skill with ID '${specificCommand.skillId}' not found for character '${character.name}'.`);
        return;
    }

    // Increment skill and decrement skill points
    Stats.setIndependentStat(skillStat, skillStat.value + 1, gameState.connections);
    Stats.setIndependentStat(character.skillPoints, character.skillPoints.value - 1, gameState.connections);
}

function handleSpendSpecPoint(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdSpendSpecPoint;
    const character = gameState.characters.find(c => c.characterId === specificCommand.characterId);

    if (!character) {
        console.error(`CmdSpendSpecPoint: Character with ID '${specificCommand.characterId}' not found.`);
        return;
    }

    if (character.specPoints.value <= 0) {
        console.error(`CmdSpendSpecPoint: Character '${character.name}' has no specialization points to spend.`);
        return;
    }

    const specStat = character.specializations[specificCommand.specId] as IndependentStat;
    if (!specStat) {
        console.error(`CmdSpendSpecPoint: Specialization with ID '${specificCommand.specId}' not found for character '${character.name}'.`);
        return;
    }

    // Increment specialization and decrement spec points
    Stats.setIndependentStat(specStat, specStat.value + 1, gameState.connections);
    Stats.setIndependentStat(character.specPoints, character.specPoints.value - 1, gameState.connections);
}

function handleSubmitDiscovery(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdSubmitDiscovery;
    processDiscoveryAttempt(specificCommand.input, gameState);
}

function handleRemoveCrystalWord(gameState: GameState, command: CmdInput): void {
    const specificCommand = command as CmdRemoveCrystalWord;
    const wordIndex = gameState.crystalBallWords.indexOf(specificCommand.word);
    if (wordIndex > -1) {
        gameState.crystalBallWords.splice(wordIndex, 1);
    }
}

// Add other handlers here as top-level functions, e.g.:
// function handleOtherCommand(gameState: GameState, command: CmdInput): void { ... }