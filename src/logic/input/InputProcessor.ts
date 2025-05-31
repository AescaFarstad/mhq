import type { GameState } from '../GameState';
import { globalInputQueue } from '../GameState'; // Import globalInputQueue
import type { CmdInput, CmdCheatSkillUp, CmdConstructBuilding, CmdTimeScale } from './InputCommands';
import { Stats } from '../core/Stats';
import type { IndependentStat } from '../core/Stat';
import { Building } from '../Building'; // Import Building namespace


// Map of handlers
const handlersByName = new Map<string, (gameState: GameState, command: CmdInput) => void>();
handlersByName.set("CmdCheatSkillUp", handleCheatSkillUp);
handlersByName.set("CmdConstructBuilding", handleConstructBuilding); // Added handler for CmdConstructBuilding
handlersByName.set("CmdTimeScale", handleTimeScale); 
handlersByName.set("CmdTickOnce", handleTickOnce);

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

    const charDef = gameState.lib.characters.getCharacter(character.characterId)!;

    const skillStat = character.skills[specificCommand.skillId] as IndependentStat;

    if (!skillStat) {
        console.error(`CmdCheatSkillUp: Skill with ID '${specificCommand.skillId}' not found for character '${charDef.name}' (ID: ${character.characterId}).`);
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

// Add other handlers here as top-level functions, e.g.:
// function handleOtherCommand(gameState: GameState, command: CmdInput): void { ... }