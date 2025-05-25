import type { GameState } from '../GameState';
import { globalInputQueue } from '../GameState'; // Import globalInputQueue
import type { CmdInput, CmdCheatSkillUp } from './InputCommands';
import { Stats } from '../core/Stats';
import type { IndependentStat } from '../core/Stat';


// Map of handlers
const handlersByName = new Map<string, (gameState: GameState, command: CmdInput, deltaTime: number) => void>();
handlersByName.set("CmdCheatSkillUp", handleCheatSkillUp);

/**
 * Processes all queued commands in the GameState.
 * @param gameState The current game state.
 * @param deltaTime The time elapsed since the last update.
 */
export function processInputs(gameState: GameState, deltaTime: number): void {
    for (const command of globalInputQueue) { // Use globalInputQueue
        const handler = handlersByName.get(command.name);
        if (handler) {
            handler(gameState, command, deltaTime);
        } else {
            console.error(`No handler registered for command: ${command.name}`);
        }
    }
    globalInputQueue.length = 0; // Clear the globalInputQueue
}


// Handlers

function handleCheatSkillUp(gameState: GameState, command: CmdInput, deltaTime: number): void {
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

// Add other handlers here as top-level functions, e.g.:
// function handleOtherCommand(gameState: GameState, command: CmdInput, deltaTime: number): void { ... }