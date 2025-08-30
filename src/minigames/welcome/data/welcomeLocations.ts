import type { WelcomeLocationDefinition } from '../lib/definitions/WelcomeLocationDefinition';

export const connectionLocationDefinitions: Record<string, Omit<WelcomeLocationDefinition, 'id'>> = {
  turfablie:{
    name: 'Turfablie',
    description: 'Highland artificer town with established merchant routes. Peaceful and picturesque.',
    imageName: 'turfablie.jpg',
    pros: ["High altitude — closer to the Heavens", 'Thriving markets'],
    cons: ['Some madman had previously attempted building the stairway with unfortunate results and the locals are now disenchanted with the idea'],
  },
  aeiga_reika:{
    name: 'Aeiga-Reika',
    description: 'Industrial port city. Home to a large golem foundry. Salty and smoggy.',
    imageName: 'aeiga_reika.jpg',
    pros: ['Skilled recruiting pool', 'Wealthy port commerce'],
    cons: ['Requires long descent', 'Significant criminal presence'],
  },
  sequoiter:{
    name: 'Sequoiter',
    description: 'Last outpost before the boreal wilderness. Currently experiencing rapid growth.',
    imageName: 'sequoiter.jpg',
    pros: ['Competent recruiting pool', 'Better-preserved guild infrastructure'],
    cons: ['Requires long descent', 'High resource importing costs'],
  }
}