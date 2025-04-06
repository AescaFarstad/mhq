import { BuildingLib } from '../lib/BuildingLib';
import { Events } from './Events';
import { Connections, ConnectionType, EffectDescription, IndependentStat, Parameter, Price } from './state/Stat';
import { State } from './state/State';
import { Stats } from './state/Stats';



export class Building
{
    public name:string;
    public count:IndependentStat;
    public max:Parameter;
    public price:Array<Price>;
    public effects:Array<BuildingEffect>;
    public isDiscovered:boolean;
}

class BuildingEffect
{
    public effect:EffectDescription;
    public one:Parameter;
    public sum:Parameter;
}

export namespace Buildings
{
    export function createBuilding(lib:BuildingLib, connections:Connections):Building
    {
        let result = new Building();
        result.name = lib.name;
        result.count = Stats.createStat("building_" + lib.name + "_count", connections);
        result.max = Stats.createParameter("building_" + lib.name + "_max", connections);
        result.price = [];
        for (const item of lib.price)
        {
            let newPrice = Stats.createPrice(item, connections, "building_" + lib.name + "_");
            result.price.push(newPrice);
            Stats.connectStat(result.count, newPrice.stat, ConnectionType.FORMULA, connections);
        }
        
        Stats.modifyParameterADD(result.max, lib.startMax, connections);
        
        result.effects = [];
        for (let index = 0; index < lib.startEffects.length; index++)
            result.effects.push(createBuildingEffect(result, lib.startEffects[index], index, connections)); //TODO id in json instead of index?
        return result;
    }
    
    function createBuildingEffect(building:Building, effect:EffectDescription, index:number, connections:Connections):BuildingEffect
    {
        let result:BuildingEffect = new BuildingEffect();
        result.effect = Object.assign(new EffectDescription(), effect);
        result.one = Stats.createParameter("building_" + building.name + "_" + effect.key+index + "_one", connections);
        result.sum = Stats.createParameter("building_" + building.name + "_" + effect.key+index + "_sum", connections);
        
        Stats.connectStat(result.one, result.sum, ConnectionType.ADD, connections);
        Stats.connectStat(building.count, result.sum, ConnectionType.MULTY, connections);
        Stats.modifyParameterADD(result.one, result.effect.amount, connections);
        result.effect.amount = 0;
        
        return result;
    }
    
    export function canAfford(building:Building, state:State):boolean
    {
        return Stats.canAfford(building.price, state.resources);
    }
    
    export function build(building:Building, state:State)
    {
        if (building.max.value <= building.count.value)
            return;
        if (!Stats.canAfford(building.price, state.resources))
            return;
            
        Stats.applyPrice(building.price, state);
        Stats.modifyStat(building.count, 1, state.connections);
        
        for (const effect of building.effects) 
        {
            effect.effect.previousAmount = effect.effect.amount;
            effect.effect.amount = effect.sum.value;
            Events.execEffect(effect.effect, state);
        }        
    }
}