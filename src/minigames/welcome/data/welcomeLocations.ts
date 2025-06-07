import type { WelcomeLocationDefinition } from '../lib/definitions/WelcomeLocationDefinition';

export const connectionLocationDefinitions: Record<string, Omit<WelcomeLocationDefinition, 'id'>> = {
    turfablie:{
        name: 'Turfablie',
        description: 'Highland artificer town with established merchant routes. Peaceful and picturesque.',
        imageName: 'location (1)',
        pros: ['Strong, stable telepathic signal', 'Minimal resistance to merger', 'Thriving markets'],
        cons: ['Guild masters are not as skilled'],
    },
    aeiga_reika:{
        name: 'Aeiga-Reika',
        description: 'Industrial port city. Home to a large golem foundry. Salty and smoggy.',
        imageName: 'location (2)',
        pros: ['Skilled guild masters', 'Wealthy port commerce'],
        cons: ['Weak signal and intermittent telepathic interference during possession'],
    },
    sequoiter:{
        name: 'Sequoiter',
        description: 'Last outpost before the boreal wilderness. Currently experiencing rapid growth.',
        imageName: 'location',
        pros: ['Relatively skilled guild masters', 'Better-maintained guild infrastructure'],
        cons: ['Weak telepathic signal', 'Targets have strong mental defenses'],
    }
}