import { JSONToBuildingLib } from './BuildingLib';
import { JSONToDialogSequenceLib } from './DialogLib';
import { EventLib, JSONToEventLib } from './EventLib';
import { JSONToJobLib } from './JobLib';
import { JSONToResourceLib } from './ResourceLib';
import { Settings } from './Settings';
import { JSONToTechLib, TechLib } from './TechLib';
import { JSONToLandmarkLib } from './MapLib';
import { JSONToPartyMemberLib } from './PartyLib';

var dialogJSONData = require('./json/DialogSequence.json');
var resourceJSONData = require('./json/Resource.json');
var jobJSONData = require('./json/Jobs.json');
var eventJSONData = require('./json/Events.json');
var buildigJSONData = require('./json/Buildings.json');
var questJSONData = require('./json/Quests.json');
var techJSONData = require('./json/Tech.json');
var landmarkJSONData = require('./json/Landmarks.json');
var partyJSONData = require('./json/Party.json');

export class Lib 
{
    public settings:Settings = new Settings();
    public dialogByName:Object = {};
    public resourceByName:Object = {};
    public jobByName:Object = {};
    public buildingByName:Object = {};
    public events:Array<EventLib> = [];
    public questsByName:Object = {};
    public techByName:Object = {};
    public landmarkByName:Object = {};
    public techIndexed:Object = {};
    public partyMemberByName:Object = {};
    private maxTech:number = 1000;

    constructor() {

    }

    init()
    {
        //console.log("json:");
        //console.log(JSON.stringify(dialogJSONData, null, 4));

        JSONToDialogSequenceLib(dialogJSONData).forEach(item => this.dialogByName[item.name] = item);
        JSONToResourceLib(resourceJSONData).forEach(item => this.resourceByName[item.name] = item);
        JSONToJobLib(jobJSONData).forEach(item => this.jobByName[item.name] = item);
        JSONToBuildingLib(buildigJSONData).forEach(item => this.buildingByName[item.name] = item);
        JSONToLandmarkLib(landmarkJSONData).forEach(item => this.landmarkByName[item.name] = item);
        JSONToPartyMemberLib(partyJSONData).forEach(item => this.partyMemberByName[item.name] = item);
        JSONToTechLib(techJSONData, this.settings).forEach(item => {
            this.techByName[item.name] = item;
            this.techIndexed[item.coords.x + item.coords.y * this.maxTech] = item;
            });
        JSONToEventLib(questJSONData).forEach(item => {
            this.questsByName[item.name] = item;
            if (item.dialogs)
                item.dialogs.forEach(d => this.dialogByName[d.dialog.name] = d.dialog);
        });
        this.events = JSONToEventLib(eventJSONData);

    }
    
    public techByPoint(x:number, y:number):TechLib
    {
        return this.techIndexed[x + y*this.maxTech];
    }
}