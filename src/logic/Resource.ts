import { IndependentStat, Parameter, Connections } from './core/Stat';
import { Stats } from './core/Stats';
import { RESOURCE_STAT_PREFIX } from './core/statPrefixes';

export interface Resource {
  name: string;
  current: IndependentStat;
  income: Parameter;
  max: Parameter;
}

export function addResource(resources: Map<string, Resource>, name: string, initialValue: number, initialMax: number, connections: Connections): Resource {
  if (resources.has(name)) {
    console.warn(`Resource "${name}" already exists.`);
    return resources.get(name)!;
  }

  const currentStatName = `${RESOURCE_STAT_PREFIX}${name}_current`;
  const incomeStatName = `${RESOURCE_STAT_PREFIX}${name}_income`;
  const maxStatName = `${RESOURCE_STAT_PREFIX}${name}_max`;

  const current = Stats.createStat(currentStatName, initialValue, connections);
  const income = Stats.createParameter(incomeStatName, connections);
  const max = Stats.createParameter(maxStatName, connections);

  Stats.modifyParameterADD(max, initialMax, connections);

  const resource: Resource = {
    name,
    current,
    income,
    max
  };
  resources.set(name, resource);
  return resource;
}

export function updateAllResources(resources: Map<string, Resource>, deltaTime: number, connections: Connections): void {
  for (const resource of resources.values()) {
    const incomeValue = resource.income.value;
    if (incomeValue === 0) {
      continue;
    }

    const maxValue = resource.max.value;
    const currentValue = resource.current.value;

    const gained = incomeValue * deltaTime;
    let newValue = currentValue + gained;

    if (newValue > maxValue) {
      newValue = maxValue;
    } else if (newValue < 0) {
      newValue = 0;
    }

    if (Math.abs(newValue - currentValue) > 1e-6) {
      Stats.setIndependentStat(resource.current, newValue, connections);
    }
  }
} 