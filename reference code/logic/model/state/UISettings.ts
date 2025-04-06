export class UISettings 
{
    public locale:string = "en";
    public activeTab:NavTab = NavTab.JOBS;
    public selectedLandmark:string;
    public isCreatingParty:boolean;
    public selectedParty:string;
    public isChoosingDestination:boolean;
    public alternatives:Array<SelectAlternatives> = [];

}

export class SelectAlternatives
{
    public type:MapEntityType;
    public name:string;
    
    constructor(type:MapEntityType, name:string)
    {
        this.name = name;
        this.type = type;
    }
}

export enum MapEntityType
{
    LANDMARK = "landmark",
    PARTY = "party",
}

export enum NavTab
{
    SETTLEMENT = "settlement",
    JOBS = "jobs",
    TECH = "tech",
    EXPLORE = "explore"
}