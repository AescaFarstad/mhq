import type { LibItem } from '../../../../logic/lib/definitions/LibDefinitions';

export interface WordDefinition extends LibItem {
    name: string;
    type: 'useful' | 'offensive' | '';
    points: number;
    wasTypo?: boolean;
} 