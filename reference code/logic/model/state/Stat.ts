import { FormulaLib } from '../../lib/BuildingLib';

export class Connections
{
    public connectablesByName:Map<string, Stat> = new Map<string, Stat>();
    public establishedConnections:Map<string, Array<Connection>> = new Map<string, Array<Connection>>();
}

export class Connection
{
    public target:string;
    public type:ConnectionType;
}

export enum ConnectionType
{
    ADD = 1,
    MULTY = 2,
    SUB = 3,
    FORMULA = 4,
}

export interface Stat
{
    name:string;
    value:number;
}

export class Parameter implements Stat
{
    public name:string;
    public add:number;
    public multi:Array<string>;
    public multiCache:number;
    public value:number;
}

export class IndependentStat implements Stat
{
    public name:string;
    public value:number;
    public readonly independent:boolean = true;
}

export class FormulaStat implements Stat
{
    public name:string;
    public value:number;
    public argument:number;
    public formula:FormulaLib;
}

export class Price
{
    public resource:string;
    public stat:FormulaStat;
}

export class SimplePrice
{
    public resource:string;
    public value:number;
}

export class Resource extends IndependentStat
{
    public name:string;
    public value:number = 0;
    public income:Parameter;
    public max:Parameter;
    public isDiscovered:boolean = false;
}

export class Yield
{
    public resource:string;
    public one:Parameter;
    public sum:Parameter;
}

export class Job
{
    public name:string;
    public pop:IndependentStat;
    public max:Parameter;
    public yields:Array<Yield>;
}

export class EffectDescription
{
    public key:string = null;
    public name:string = null;
    public amount:number = 0;
    public previousAmount:number = 0;
    public job:string = null;
    public resource:string = null;
}