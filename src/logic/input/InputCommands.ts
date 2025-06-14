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

export interface CmdFireCharacter extends CmdInput {
  name: "CmdFireCharacter";
  characterId: string;
}

export interface CmdSpendAttributePoint extends CmdInput {
  name: "CmdSpendAttributePoint";
  characterId: string;
  attributeId: string;
}

export interface CmdSpendSkillPoint extends CmdInput {
  name: "CmdSpendSkillPoint";
  characterId: string;
  skillId: string;
}

export interface CmdSpendSpecPoint extends CmdInput {
  name: "CmdSpendSpecPoint";
  characterId: string;
  specId: string;
}

export interface CmdSubmitDiscovery extends CmdInput {
  name: "CmdSubmitDiscovery";
  input: string;
}

// Add other command interfaces here, e.g.:
// export interface CmdOtherAction extends CmdInput { ... }