import type { LibItem } from '../../../../logic/lib/definitions/LibDefinitions';

export interface WelcomeLocationDefinition extends LibItem {
    // Define properties for connection locations here
    name: string;
    description: string;
    imageName: string;
    pros: string[];
    cons: string[];
    // Add other relevant properties
} 