export interface CmdInput {
  name: string;
}

export interface CmdCheatSkillUp extends CmdInput {
  name: "CmdCheatSkillUp";
  characterId: string;
  skillId: string;
  amount: number;
}