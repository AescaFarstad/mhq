import { PriceLib, JSONToPrice } from './BuildingLib';

export class PartyMemberLib
{
    public name:string;
    public price:Array<PriceLib>;
    public stats:PartyMemberStats;
}

export class PartyMemberStats
{
    public speed:number = 0;
    public food:number = 0;
    public storage:number = 0;
    public offence:number = 0;
    public defence:number = 0;
    public armor:number = 0;
    public lore:number = 0;
    public craft:number = 0;
    public siege:number = 0;
}
        
export function JSONToPartyMemberLib(source:any):Array<PartyMemberLib>
{
    let result = new Array<PartyMemberLib>();
    for (let key in source) 
    {  
        let member:PartyMemberLib = new PartyMemberLib();
        member.name = key;
        member.stats = JSONToPartyMemberStats(source[key].stats);
        member.price = JSONToPrice(source[key].price);
        
        result.push(member);
    }
    return result;
}       

export function JSONToPartyMemberStats(source:any):PartyMemberStats
{
    return Object.assign(new PartyMemberStats(), source);
}