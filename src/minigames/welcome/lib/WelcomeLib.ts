import { WelcomeLocationsLib } from './WelcomeLocationsLib';

export class WelcomeLib {
    public locations: WelcomeLocationsLib = new WelcomeLocationsLib();
    public isLoaded: boolean = false;

    constructor() {
        this.loadAllDefinitions();
    }

    private loadAllDefinitions(): void {
        if (this.isLoaded) {
            return;
        }
        try {
            // Currently, only locations are loaded directly by its own class constructor
            // Add other WelcomeLib specific loading if needed
            this.isLoaded = true;
        } catch (error) {
            console.error("Failed to process WelcomeLib definitions:", error);
            this.isLoaded = false;
        }
    }
} 