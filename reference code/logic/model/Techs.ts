import { Point } from '../../utils/HMath';
import { Lib } from '../lib/Lib';
import { TechLib } from '../lib/TechLib';
import { Events } from './Events';
import { Misc } from './Misc';
import { Connections, ConnectionType, FormulaStat, IndependentStat } from './state/Stat';
import { State, TechState } from './state/State';
import { Stats } from './state/Stats';

export class Tech
{
    public name:string;
    public failCount:IndependentStat;
    public inspirationCount:IndependentStat;
    public neighbourCount:IndependentStat;
    public discount:FormulaStat;
    public probability:FormulaStat;
    public isResearched:boolean;
    public isDiscovered:boolean;
}


export namespace Techs
{
    export function createTech(lib:TechLib, connections:Connections):Tech
    {
        let result = new Tech();
        result.name = lib.name;
        result.failCount = Stats.createStat("tech_" + lib.name + "_fail", connections);
        result.inspirationCount = Stats.createStat("tech_" + lib.name + "_inspiration", connections);
        result.neighbourCount = Stats.createStat("tech_" + lib.name + "_neighbours", connections);
        result.discount = Stats.createFormulaStat("tech_" + lib.name + "_discount", lib.discount, connections);
        result.probability = Stats.createFormulaStat("tech_" + lib.name + "_probability", lib.probability, connections);
        Stats.connectStat(result.failCount, result.probability, ConnectionType.FORMULA, connections);
        Stats.connectStat(result.neighbourCount, result.discount, ConnectionType.FORMULA, connections);
        
        return result;
    }
    
    export function getPrice(tech:Tech, libs:Lib, numResearched:number):number
    {
        const coords = libByTech(tech, libs).coords;
        const s = libs.settings;
        const ring = s.techPriceRing * (Math.abs(coords.x) + Math.abs(coords.y));
        return Math.ceil(s.techPriceFlat * Math.pow(s.techPriceBase, numResearched + ring) * tech.discount.value);
    }
    
    export function canAfford(tech:Tech, state:State, libs:Lib):boolean
    {
        const price = getPrice(tech, libs, state.numResearchedTech);
        return state._alt.resources.science.value >= price;
    }
    
    export function startResearch(tech:Tech, state:State)
    {
        state.tech.currentTech = tech.name;
        state.tech.techProgress = 0;
        state.tech.lastTechChange = state.dateModified;
        state._alt.resources.science.value -= getPrice(tech, state._lib, state.numResearchedTech);
    }
    
    export function updateResearch(state:State, timeDelta:number)
    {        
        if (state.tech.currentTech)
        {
            state.tech.techProgress += timeDelta * state._lib.settings.researchSpeed;
            if (state.tech.techProgress >= 1)
                finishResearch(state);
        }
    }
    
    export function finishResearch(state:State)
    {
        const tech = state.techs.find(t => t.name == state.tech.currentTech);
        const success = Misc.random(state) < tech.probability.value;
        const lib = libByTech(tech, state._lib);
        
        if (success)
        {
            state.numResearchedTech++;
            tech.isResearched = true;
            lib.onSuccess.forEach(e => Events.execEffect(e, state));
            state.tech.lastTechChange = state.dateModified;
            getNeighbours(tech.name, state.techs, state._lib).forEach(n => {
                Stats.modifyStat(n.neighbourCount, 1, state.connections);
                n.isDiscovered = true;
            });
        }
        else
        {
            Stats.modifyStat(tech.failCount, 1, state.connections);
            lib.onFailure.forEach(e => Events.execEffect(e, state));
            state.numResearchedTech++;
        }
        state.tech.lastResult = success;
        state.tech.lastResearched = state.tech.currentTech;
        state.tech.lastAcknowledged = false;
        
        state.tech.currentTech = null;
    }
    
    export function acknowledge(techs:TechState)
    {
        techs.lastAcknowledged = true;
        techs.selectedTech = null;
        techs.hoverTech = null;
    }
    
    function libByTech(tech:Tech, libs:Lib):TechLib
    {
        return libs.techByName[tech.name];
    }
    
    export function techFromHex(x:number, y:number, state:State, libs:Lib)
    {
        const lib = libs.techByPoint(x, y);
        if (!lib)
            return null;
        return state.techs.find(t => t.name == lib.name);
    }
    
    const neighbours = [new Point(1, -1), new Point(1, 0), new Point(0, 1), new Point(-1, 1), new Point(-1, 0), new Point(0, -1)];
    
    export function getNeighbours(tech:string, techs:Array<Tech>, libs:Lib):Array<Tech>
    {
        const techLib:TechLib = libs.techByName[tech];
        const resultLibs = neighbours.map(n => libs.techByPoint(techLib.coords.x + n.x, techLib.coords.y + n.y));
        return techs.filter(t => resultLibs.find(l => l && l.name == t.name) != null);
    }
}
