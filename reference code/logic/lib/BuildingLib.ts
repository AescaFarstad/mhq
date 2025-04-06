import { EffectDescription } from '../model/state/Stat';
import { JSONToEffectDescription } from './EventLib';

export class BuildingLib 
{
    public name:string;
    public startMax:number;
    public startEffects:Array<EffectDescription>;
    public price:Array<PriceLib>;
}

export class PriceLib 
{
    public resource:string;
    public formula:FormulaLib;
}

export class FormulaLib
{
    public name:string = null;
    public a:number = 0;
    public b:number = 0;
    public c:number = 0;
}

export function JSONToBuildingLib(source:any):Array<BuildingLib>
{
    let result = new Array<BuildingLib>();
    for (let key in source) 
    {  
        let event:BuildingLib = new BuildingLib();
        event.name = key;
        event.startMax = source[key].max;
        event.startEffects = JSONToEffectDescription(source[key].effects);
        event.price = JSONToPrice(source[key].price);
        
        result.push(event);
    }
    return result;
}

export function JSONToPrice(source:Array<any>):Array<PriceLib>
{
    let result = new Array<PriceLib>();
    for (let item of source) 
    {  
        let price:PriceLib = new PriceLib();
        price.resource = item.resource;
        price.formula = JSONToFormula(item.formula);
        result.push(price);
    }
    return result;
}


export function JSONToFormula(item:any):FormulaLib
{
    let result = new FormulaLib();
    result.name = item.name;
    result.a = item.a ? item.a : 0;
    result.b = item.b ? item.b : 0;
    result.c = item.c ? item.c : 0;    
    return result;
}