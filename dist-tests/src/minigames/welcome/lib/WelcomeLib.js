import { WelcomeLocationsLib } from './WelcomeLocationsLib';
export class WelcomeLib {
    locations = new WelcomeLocationsLib();
    isLoaded = false;
    constructor() {
        this.loadAllDefinitions();
    }
    loadAllDefinitions() {
        if (this.isLoaded) {
            return;
        }
        try {
            // Currently, only locations are loaded directly by its own class constructor
            // Add other WelcomeLib specific loading if needed
            this.isLoaded = true;
        }
        catch (error) {
            console.error("Failed to process WelcomeLib definitions:", error);
            this.isLoaded = false;
        }
    }
}
