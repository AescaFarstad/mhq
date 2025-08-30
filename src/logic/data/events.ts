import { C } from '../lib/C';
import { 
  ModifyResourceParams, 
  DiscoverParams, 
  AddCharacterParams,
  DiscoverEffectParams,
  GivePointsParams
} from '../lib/definitions/EventDefinition';

// Define the shape of our events data
interface EffectData {
  key: string;
  params: ModifyResourceParams | DiscoverParams | AddCharacterParams | Record<string, any> | DiscoverEffectParams | GivePointsParams;
}

interface EventData {
  effects: EffectData[];
}

type EventsDataType = Record<string, EventData>;

const events: EventsDataType = {
  "startGame": {
  effects: [
    { key: "giveMaxResource", params: { resource: "gold", amount: 1000 } },
    { key: "giveResource", params: { resource: "gold", amount: 50 } },
    { key: "giveMaxResource", params: { resource: "mana", amount: 100 } },
    { key: "discover", params: { key: "gold" } },
    { key: "discover", params: { key: "resources" } },
    { key: "discover", params: { key: "buildings" } },
    { key: "addResourceIncome", params: { resource: "gold", amount: 10, source: "Council Funding" } },
    { key: "addResourceIncome", params: { resource: "mana", amount: 1, source: "Innate" } },
    { key: "discover", params: { key: "gold" } },
    { key: "discover", params: { key: "Castle" } },
    { key: "discover", params: { key: "Crew" } },
    { key: "discover", params: { key: "Debug" } },

    { key: "discover", params: { key: C.DISCOVERY_SKILL_BROWSER } },
    { key: "discover", params: { key: C.DISCOVERY_INNER_COSMOS } },
    //{ key: "giveResource", params: { resource: "clutter", amount: 50 } },
    { key: "construct", params: { building: "meditation_chamber" } },
    // { key: "modifyIndependentStat", params: { statName: "inspiration_charges", amount: 3 } },

    // { key: "startBehTree", params: { treeName: "cheatStart" } },
    // { key: "startBehTree", params: { treeName: "cheatWelcome" } },
    // { key: "startBehTree", params: { treeName: "cheatIntro" } },
    // { key: "startBehTree", params: { treeName: "cheatIntroAndWelcome" } },

    //{ key: "discoverAll", params: {} },
    //{ key: "addCharacterByName", params: { characterId: "ingress_aeiga_reika_secret_seer" } },
    //{ key: "addCharacterByName", params: { characterId: "ingress_sequoiter_sky_pathfinder" } },
    { key: "startBehTree", params: { treeName: "introSequence" } },
    //{ key: "giveSkillsAndSpecs", params: {} },
    //{ key: "givePoints", params: {attributePoints: 10, skillPoints: 10, specPoints: 10} },
  ]
  },
  "giveAllSkillsAndSpecs": {
  effects: [
    { key: "giveAllSkillsAndSpecsEffect", params: {} }
  ]
  },
  "giveFirstCharAllSkills": {
  effects: [
    { key: "giveSkillsAndSpecs", params: {} }
  ]
  }
};

export default events; 