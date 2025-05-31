import { 
  ModifyResourceParams, 
  DiscoverParams, 
  AddCharacterParams,
  DiscoverEffectParams
} from '../lib/definitions/EventDefinition';

// Define the shape of our events data
interface ConditionData {
  key: string;
  params?: Record<string, any>;
}

interface EffectData {
  key: string;
  params: ModifyResourceParams | DiscoverParams | AddCharacterParams | Record<string, any> | DiscoverEffectParams;
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
      { key: "discover", params: { key: "gold" } },
      { key: "discover", params: { key: "resources" } },
      { key: "discover", params: { key: "buildings" } },
      { key: "addResourceIncome", params: { resource: "gold", amount: 10, source: "Council Funding" } },
      { key: "addResourceIncome", params: { resource: "mana", amount: 1, source: "Innate" } },
      { key: "addCharacterByName", params: { characterId: "you_char" } },
      { key: "addCharacterByName", params: { characterId: "nadia_char" } },
      { key: "discover", params: { key: "gold" } },
      { key: "giveResource", params: { resource: "clutter", amount: 50 } },
      { key: "construct", params: { building: "meditation_chamber" } },
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