import { FormulaLib, PriceLib } from '../../lib/BuildingLib';
import { JobLib } from '../../lib/JobLib';
import { ResourceLib } from '../../lib/ResourceLib';
import { Events } from '../Events';
import {
    Connection,
    Connections,
    ConnectionType,
    FormulaStat,
    IndependentStat,
    Job,
    Parameter,
    Price,
    Resource,
    Stat,
    Yield,
    SimplePrice,
} from './Stat';
import { State } from './State';



export namespace Stats
{

// Stat     ----------------------------------------------------------------------------------------------------------------------
//          ----------------------------------------------------------------------------------------------------------------------

    export function createParameter(name:string, connections:Connections):Parameter
    {
        let result = new Parameter();
        result.name = name;
        console.assert(!connections.connectablesByName[name]);
        connections.connectablesByName[name] = result;
        result.value = 0;
        result.add = 0;
        result.multiCache = 1;
        result.multi = [];
        return result;
    }
    
    export function createStat(name:string, connections:Connections):IndependentStat
    {
        let result = new IndependentStat();
        result.name = name;
        console.assert(!connections.connectablesByName[name]);
        connections.connectablesByName[name] = result;
        result.value = 0;
        return result;
    }
    
    export function createFormulaStat(name:string, formula:FormulaLib, connections:Connections):FormulaStat
    {
        let result = new FormulaStat();
        result.name = name;
        console.assert(!connections.connectablesByName[name]);
        connections.connectablesByName[name] = result;
        result.argument = 0;
        result.value = 0;
        result.formula = new FormulaLib();
        Object.assign(result.formula, formula);
        
        
        return result;
    }

    export function connectStr(from:string, to:string, type:ConnectionType, connections:Connections)
    {
        console.assert(connections.connectablesByName[from], "Connection source doesn't exist: " + from);
        console.assert(connections.connectablesByName[to], "Connection target doesn't exist: " + to);
        console.assert(!connections.connectablesByName[to].independent, "This object cannot be connected to. " + to);
        
        if (!connections.establishedConnections[from])
            connections.establishedConnections[from] = new Array<Connection>();
        let connection = new Connection();
        connection.target = to;
        connection.type = type;
        connections.establishedConnections[from].push(connection);
        
        if (type == ConnectionType.MULTY)
            (connections.connectablesByName[to] as Parameter).multi.push(from);

        applyConnection(connection, 0, connections.connectablesByName[from].value, connections);
    }

    export function connectStat(from:Stat, to:Parameter | FormulaStat, type:ConnectionType, connections:Connections)
    {
        console.assert(!(to as any).independent);//JIC
        connectStr(from.name, to.name, type, connections);
    }

    function setStat(stat:Stat, newValue:number, connections:Connections)
    {
        if (stat.value == newValue)
            return;
        console.log(stat.name + " " + stat.value + " -> " + newValue);
        let oldValue = stat.value;
        stat.value = newValue;
        applyConnections(stat, oldValue, newValue, connections);
    }

    export function modifyStat(stat:IndependentStat, delta:number, connections:Connections)
    {
        setStat(stat, stat.value + delta, connections);
    }
    
    export function modifyStatTo(stat:IndependentStat, newValue:number, connections:Connections)
    {
        setStat(stat, newValue, connections);
    }
    
    export function modifyParameterADD(parameter:Parameter, delta:number, connections:Connections)
    {
        parameter.add += delta;
        setStat(parameter, parameter.add * parameter.multiCache, connections);
    }

    function applyConnections(from:Stat, oldValue:number, newValue:number, connections:Connections)
    {
        let connectionsArray = connections.establishedConnections[from.name];
        if (connectionsArray)
        {
            for (const connection of connectionsArray) 
            {
                applyConnection(connection, oldValue, newValue, connections);
            }
        }
    }
    
    function applyConnection(connection:Connection, oldValue:number, newValue:number, connections:Connections)
    {
        let pstat:Parameter = connections.connectablesByName[connection.target];
        let fstat:FormulaStat = connections.connectablesByName[connection.target];
        
        if (connection.type == ConnectionType.ADD)
        {
            pstat.add += newValue - oldValue; 
            setStat(pstat, pstat.add * pstat.multiCache, connections);
        }
        else if (connection.type == ConnectionType.SUB)
        {
            pstat.add += -newValue + oldValue; 
            setStat(pstat, pstat.add * pstat.multiCache, connections);
        }
        else if (connection.type == ConnectionType.MULTY)
        {
            pstat.multiCache = 1;
            pstat.multi.forEach(element => pstat.multiCache*=connections.connectablesByName[element].value);
            setStat(pstat, pstat.add * pstat.multiCache, connections);
        }        
        else if (connection.type == ConnectionType.FORMULA)
        {
            fstat.argument = newValue;            
            setStat(fstat, Events.calculateFormula(fstat.formula, fstat.argument), connections);
        }
    }

// Resource ----------------------------------------------------------------------------------------------------------------------
//          ----------------------------------------------------------------------------------------------------------------------
    
    const PREFIX_RES:string = "res_";

    export function createResource(lib:ResourceLib, connections:Connections):Resource
    {
        let result = new Resource();
        result.name = lib.name;
        result.income = createParameter(PREFIX_RES + lib.name+"_income", connections);
        result.max = createParameter(PREFIX_RES + lib.name+"_max", connections);
        result.income.value = 0;
        result.max.value = 0;
        connections.connectablesByName[lib.name] = result;
        return result;
    }

    export function updateResource(res:Resource, timeDelta:number)
    {
        if (res.value >= res.max.value && res.income.value >= 0)
            return;
        let delta = res.income.value * timeDelta / 1000;      
        if (delta > 0 && res.value + delta > res.max.value)
            res.value = res.max.value;
        else
            res.value = res.value + delta;
    }
    
// Job      ----------------------------------------------------------------------------------------------------------------------
//          ----------------------------------------------------------------------------------------------------------------------

    const PREFIX_JOB:string = "job_";

    export function createJob(lib:JobLib, unemployed:Parameter, connections:Connections):Job
    {
        var result:Job = new Job();
        result.name = lib.name;
        result.pop = createStat(PREFIX_JOB + lib.name + "_pop", connections);
        result.max = createParameter(PREFIX_JOB + lib.name + "_max", connections);
        result.yields = new Array<Yield>();

        connectStat(result.pop, unemployed, ConnectionType.SUB, connections);

        return result;
    }

    export function addYield(job:Job, resource:Resource, amount:number, connections:Connections)
    {
        let yld = job.yields.find(y => y.resource == resource.name);
        if (!yld)
        {
            yld = new Yield();
            yld.one = createParameter(PREFIX_JOB + job.name + "_y_1_" + resource.name, connections);
            yld.sum = createParameter(PREFIX_JOB + job.name + "_sum_" + resource.name, connections);
            yld.resource = resource.name;
            job.yields.push(yld);
            connectStat(yld.one, yld.sum, ConnectionType.ADD, connections);
            connectStat(job.pop, yld.sum, ConnectionType.MULTY, connections);
            connectStat(yld.sum, resource.income, ConnectionType.ADD, connections);
        }
        modifyParameterADD(yld.one, amount, connections);
    }

    export function employ(jobStr:string, amount:number, state:State)
    {
        let job = state.jobs.find(j => j.name == jobStr);
        if (amount > 0)
        {
            amount = Math.min(state._alt.resources.unemployed.value, amount);
            amount = Math.min(job.max.value - job.pop.value, amount);
        }
        else
        {
            amount = -Math.min(job.pop.value, -amount);
        }
        modifyStat(job.pop, amount, state.connections);
    }
    
// Price    ----------------------------------------------------------------------------------------------------------------------
//          ----------------------------------------------------------------------------------------------------------------------

    export function createPrice(lib:PriceLib, connections:Connections, namePrefix:string = "x_"):Price
    {
        let result = new Price();
        result.resource = lib.resource;
        result.stat = createFormulaStat(namePrefix + lib.resource + "_price", lib.formula, connections);
        
        return result;
    }
    
    export function canAfford(price:Array<Price>, resources:Array<Resource>):boolean
    {
        return price.every(p => resources.find(r => r.name == p.resource).value >= p.stat.value);
    }
    
    export function canAffordLib(price:Array<PriceLib>, resources:Array<Resource>):boolean
    {
        return price.every(p => resources.find(r => r.name == p.resource).value >= Events.calculateFormula(p.formula, 1));
    }
    
    export function canAffordSimple(price:Array<SimplePrice>, resources:Array<Resource>):boolean
    {
        return price.every(p => resources.find(r => r.name == p.resource).value >= p.value);
    }
    
    export function applyPrice(price:Array<Price>, state:State)
    {
        return price.forEach(p => modifyStat(state.resources.find(r => r.name == p.resource), -p.stat.value, state.connections));
    }
    
    export function applySimplePrice(price:Array<SimplePrice>, state:State)
    {
        return price.forEach(p => modifyStat(state.resources.find(r => r.name == p.resource), -p.value, state.connections));
    }
}