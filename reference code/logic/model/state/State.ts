import { Lib } from '../../lib/Lib';
import { Building } from '../Buildings';
import { Tech } from '../Techs';
import { AltState } from './AltState';
import { Facts } from './Facts';
import { Connections, Job, Parameter, Resource, Price, SimplePrice, Stat, IndependentStat } from './Stat';
import { UISettings } from './UISettings';
import { Landmark, Party } from '../Scouting';


export class State 
{
    public _lib:Lib = null;
    public _alt:AltState = new AltState();


    public dateStarted:number;
    public dateModified:number;
    public skippedTime:number = 0;
    public numSteps:number = 0;
    public lastBatchDuration:number;
    public activeDialog:DialogState = new DialogState();
    public activeQuests:Array<string> = [];
    public discoveredTabs:Object = {};
    public unemployed:Parameter;
    public foodConsumption:Parameter;
    public totalFoodConsumption:Parameter;
    public partyMembersMax:IndependentStat;
    public partyMembers:IndependentStat;

    public facts:Facts = new Facts();
    public ui:UISettings = new UISettings();
    public resources:Array<Resource> = new Array<Resource>();
    public jobs:Array<Job> = new Array<Job>();
    public connections:Connections = new Connections();
    public passedEvents:Array<string> = [];
    public buildings:Array<Building> = [];
    public landmarks:Array<Landmark> = [];
    public techs:Array<Tech> = [];
    public numResearchedTech:number = 0;
    public randomSeed:number = 1834;
    public tech:TechState = new TechState();
    public mapVP:MapViewport = new MapViewport();
    public parties:Array<Party> = [];
    public newParty:Party = new Party();
    public newPartyPrice:Array<SimplePrice> = [];

    public static toJSON(state:State):string
    {
        let tmp1 = state._lib;
        let tmp2 = state._alt;
        state._lib = null;
        state._alt = null;
        let result = JSON.stringify(state);
        state._lib = tmp1;
        state._alt = tmp2;
        return result;
    }

}

export class DialogState
{
    public name:string;
    public node:string;
}

export class TechState
{
    public selectedTech:string;
    public hoverTech:string;
    public lastTechChange:number = -1;
    public currentTech:string;
    public techProgress:number;
    public lastResearched:string;
    public lastResult:boolean;
    public lastAcknowledged:boolean = true;
}

export class MapViewport
{
    public lat:number;
    public lon:number;
    public zoom:number;
}