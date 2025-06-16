// Define atlas configurations here
const A_DEFAULT_ATLAS_CONFIGS = [
    { name: "skills", imagePath: "img/skills.png", jsonPath: "img/skills.json" },
    { name: "heroes", imagePath: "img/heroes.jpg", jsonPath: "img/heroes.json" },
    //{ name: "locations", imagePath: "img/locations.jpg", jsonPath: "img/locations.json" },
];
export class AtlasManager {
    static instance = null;
    atlasLoadPromises = new Map();
    // Make constructor private for singleton pattern
    constructor(atlasConfigs) {
        for (const config of atlasConfigs) {
            if (this.atlasLoadPromises.has(config.name)) {
                console.warn('AtlasManager: Duplicate atlas name ' + config.name + ' in config. Ignoring subsequent entry.');
                continue;
            }
            this.atlasLoadPromises.set(config.name, this.loadAtlas(config));
        }
    }
    static getInstance() {
        if (!AtlasManager.instance) {
            AtlasManager.instance = new AtlasManager(A_DEFAULT_ATLAS_CONFIGS);
        }
        return AtlasManager.instance;
    }
    async loadAtlas(config) {
        try {
            const imagePromise = new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = (evt) => reject(new Error('Failed to load atlas image ' + config.imagePath + ': ' + evt));
                image.src = config.imagePath;
            });
            const jsonPromise = fetch(config.jsonPath).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch atlas JSON ' + config.jsonPath + ': ' + response.statusText);
                }
                return response.json();
            }).catch((fetchErr) => {
                throw new Error('Failed to fetch or parse atlas JSON ' + config.jsonPath + ': ' + fetchErr.message);
            });
            const [image, description] = await Promise.all([imagePromise, jsonPromise]);
            return { image, description };
        }
        catch (error) {
            console.error('AtlasManager: Error loading atlas ' + config.name + ':', error);
            throw error;
        }
    }
    async getAtlasImage(atlasName, imageName) {
        const atlasDataPromise = this.atlasLoadPromises.get(atlasName);
        if (!atlasDataPromise) {
            console.warn('AtlasManager: Atlas ' + atlasName + ' not configured.');
            return undefined;
        }
        try {
            const atlasData = await atlasDataPromise;
            const rect = atlasData.description[imageName];
            if (!rect) {
                if (!atlasData.description) {
                    console.warn('AtlasManager: Atlas description for ' + atlasName + ' is missing or invalid.');
                }
                else {
                    //This is a typical situation, so don't spam the console
                    //console.warn('AtlasManager: Image ' + imageName + ' not found in atlas ' + atlasName + '. Available keys: ' + Object.keys(atlasData.description).join(', '));
                }
                return undefined;
            }
            return { image: atlasData.image, rect };
        }
        catch (error) {
            return undefined;
        }
    }
}
