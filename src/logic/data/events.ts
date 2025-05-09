import { 
  ModifyResourceParams, 
  DiscoverParams, 
  AddCharacterParams
} from '../lib/definitions/EventDefinition';

// Define the shape of our events data
interface ConditionData {
  key: string;
  params?: Record<string, any>;
}

interface EffectData {
  key: string;
  params: ModifyResourceParams | DiscoverParams | AddCharacterParams | Record<string, any>;
}

interface EventData {
  triggerOnce?: boolean;
  conditions: ConditionData[];
  effects: EffectData[];
}

type EventsDataType = Record<string, EventData>;

const events: EventsDataType = {
  "startGame": {
    triggerOnce: true,
    conditions: [
      { key: "alwaysTrue" }
    ],
    effects: [
      { key: "giveMaxResource", params: { resource: "gold", amount: 1000 } },
      { key: "giveResource", params: { resource: "gold", amount: 50 } },
      { key: "giveMaxResource", params: { resource: "mana", amount: 100 } },
      { key: "discoverResource", params: { target: "gold" } },
      { key: "discoverTab", params: { target: "resources" } },
      { key: "discoverTab", params: { target: "buildings" } },
      { key: "addResourceIncome", params: { resource: "gold", amount: 10, source: "Council Funding" } },
      { key: "addResourceIncome", params: { resource: "mana", amount: 1, source: "Innate" } },
      { key: "addCharacterByName", params: { characterId: "you_char" } },
      { key: "addCharacterByName", params: { characterId: "nadia_char" } }
    ]
  },
  "giveAllSkillsAndSpecs": {
    triggerOnce: true,
    conditions: [
      { key: "alwaysTrue" }
    ],
    effects: [
      { key: "giveAllSkillsAndSpecsEffect", params: {} }
    ]
  }
};

export default events; 