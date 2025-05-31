export interface CmdInput {
  name: string;
}

export interface CmdCheatSkillUp extends CmdInput {
  name: "CmdCheatSkillUp";
  characterId: string;
  skillId: string;
  amount: number;
}

export interface CmdConstructBuilding extends CmdInput {
  name: "CmdConstructBuilding";
  buildingId: string;
}

export interface CmdTimeScale extends CmdInput {
  name: "CmdTimeScale";
  scale: number;
}

export interface CmdTickOnce extends CmdInput {
  name: "CmdTickOnce";
}

// Add other command interfaces here, e.g.:
// export interface CmdOtherAction extends CmdInput { ... }