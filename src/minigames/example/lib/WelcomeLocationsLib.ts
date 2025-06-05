import type { WelcomeLocationDefinition } from './definitions/WelcomeLocationDefinition';
import { connectionLocationDefinitions } from '../data/welcomeLocations';

export class WelcomeLocationsLib {
    private locations: Map<string, WelcomeLocationDefinition> = new Map();

    constructor() {
        this.loadLocations();
    }

    private loadLocations(): void {
        for (const key in connectionLocationDefinitions) {
            if (Object.prototype.hasOwnProperty.call(connectionLocationDefinitions, key)) {
                const locData = connectionLocationDefinitions[key];
                const location: WelcomeLocationDefinition = { ...locData, id: key }; // Add id property
                this.locations.set(key, location);
            }
        }
    }

    public getLocation(id: string): WelcomeLocationDefinition | undefined {
        return this.locations.get(id);
    }

    public getAllLocations(): WelcomeLocationDefinition[] {
        return Array.from(this.locations.values());
    }
} 