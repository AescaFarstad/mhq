import { Point } from '../../utils/HMath';
import { EffectDescription } from '../model/state/Stat';
import { FormulaLib } from './BuildingLib';
import { JSONToEffectDescription } from './EventLib';
import { Settings } from './Settings';

export class TechLib
{
    public name:string;
    public coords:Point;
    public probability:FormulaLib;
    public discount:FormulaLib;
    public onSuccess:Array<EffectDescription>;
    public onFailure:Array<EffectDescription>;
}


export function JSONToTechLib(source:any, settings:Settings):Array<TechLib>
{
    const techDiscountFormula = new FormulaLib();
    techDiscountFormula.name = "power";
    techDiscountFormula.a = 1 - settings.techDiscount;
    
    let result = new Array<TechLib>();
    for (let key in source) 
    {  
        let tech:TechLib = new TechLib();
        tech.name = key;
        tech.coords = JSONToPoint(source[key].coords);
        tech.onSuccess = JSONToEffectDescription(source[key].onSuccess);
        tech.onFailure = JSONToEffectDescription(source[key].onFailure);
        
        tech.probability = new FormulaLib();
        tech.probability.name = "sigmoidOffset";
        tech.probability.a = source[key].probability;
        tech.probability.b = source[key].improvement;
        
        tech.discount = techDiscountFormula;
        
        result.push(tech);
    }
    return result;
}

export function JSONToPoint(source:any):Point
{
    let result = new Point();
    result.x = source.x;
    result.y = source.y;
    return result;
}