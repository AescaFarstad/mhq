import { connectionLocationDefinitions } from '../data/welcomeLocations';
export class WelcomeLocationsLib {
    locations = new Map();
    constructor() {
        this.loadLocations();
    }
    loadLocations() {
        for (const key in connectionLocationDefinitions) {
            if (Object.prototype.hasOwnProperty.call(connectionLocationDefinitions, key)) {
                const locData = connectionLocationDefinitions[key];
                const location = { ...locData, id: key }; // Add id property
                this.locations.set(key, location);
            }
        }
    }
    getLocation(id) {
        return this.locations.get(id);
    }
    getAllLocations() {
        return Array.from(this.locations.values());
    }
}
