import { FormulaLib } from '../lib/BuildingLib';
import { EventLib } from '../lib/EventLib';
import { Dialog } from './Dialog';
import { Quests } from './Quests';
import { EffectDescription } from './state/Stat';
import { State } from './state/State';
import { Stats } from './state/Stats';
import { Techs } from './Techs';

export namespace Events
{
    export enum EventConditions
    {
        NO_DIALOG = "noDialog",
        HAS_FACT = "hasFact",
        PROVIDE_HOUSING = "provideHousing"
    }
    
    export function createCondition(condition:EffectDescription):(state:State, params:EffectDescription) => boolean
    {
        switch(condition.key)
        {
            case EventConditions.NO_DIALOG:         return condition_noDialog;
            case EventConditions.HAS_FACT:          return condition_hasFact;
            case EventConditions.PROVIDE_HOUSING:   return condition_provideHousing;
            default: throw "unknown event condition: " + condition.key; 
        }
    }
    
    export enum EventEffects
    {
        GIVE_MAX_RESOURCE = "giveMaxResource",
        GIVE_RESOURCE = "giveResource",
        ADD_WORKPLACE = "addWorkplace",
        DISCOVER_RESOURCE = "discoverResource",
        DISCOVER_BUILDING = "discoverBuilding",
        DISCOVER_TECH = "discoverTech",
        DISCOVER_NEIGHB_TECH = "discoverNeighboursOfTech",
        DISCOVER_TAB = "discoverTab",
        ADD_YIELD = "addYield",
        START_DIALOG = "startDialog",
        START_QUEST = "startQuest",
        DESCRIPTION = "description",
        D_COMPLETE_QUEST = "d_completeQuest",
        GIVE_MAX_PARTY_MEMBERS = "giveMaxPartyMembers"
    }
    
    export function execEffect(effect:EffectDescription, state:State)
    {
        if (!effect.previousAmount)
            effect.previousAmount = 0;
        switch(effect.key as EventEffects)
        {
            case EventEffects.GIVE_MAX_RESOURCE:        return effect_giveMaxResource       (state, effect.resource, effect.amount - effect.previousAmount);
            case EventEffects.GIVE_RESOURCE:            return effect_giveResource          (state, effect.resource, effect.amount - effect.previousAmount);
            case EventEffects.ADD_WORKPLACE:            return effect_addWorkplace          (state, effect.job, effect.amount - effect.previousAmount);
            case EventEffects.DISCOVER_RESOURCE:        return effect_discoverResource      (state, effect.resource);
            case EventEffects.DISCOVER_BUILDING:        return effect_discoverBuilding      (state, effect.name);
            case EventEffects.DISCOVER_TECH:            return effect_discoverTech          (state, effect.name);
            case EventEffects.DISCOVER_NEIGHB_TECH:     return effect_discoverNeighbTech    (state, effect.name);
            case EventEffects.DISCOVER_TAB:             return effect_discoverTab           (state, effect.name);
            case EventEffects.ADD_YIELD:                return effect_addYield              (state, effect.job, effect.resource, effect.amount - effect.previousAmount);
            case EventEffects.START_DIALOG:             return effect_startDialog           (state, effect.name);
            case EventEffects.START_QUEST:              return effect_startQuest            (state, effect.name);
            case EventEffects.DESCRIPTION:              return; 
            case EventEffects.D_COMPLETE_QUEST:         return effect_d_completeQuest       (state, effect.name);
            case EventEffects.GIVE_MAX_PARTY_MEMBERS:   return effect_giveMaxPartyMembers   (state, effect.amount);
            default: throw "unknown event effect: " + effect.key; 
        }
    }
    
    export function calculateFormula(formula:FormulaLib, x:number)
    {
        switch(formula.name)
        {
            case "exp": return formula.a * Math.pow(formula.b, x);
            case "poly": return formula.a + formula.b * x + formula.c * x * x;
            case "sigmoidOffset": return sigmoid(formula.a, x, formula.b);
            case "power": return Math.pow(formula.a, x);
            default: throw "unknown formula: " + formula.name; 
        }
    }
    
    function sigmoid(base:number, offset:number, stepness:number):number
    {
        const currentOffset = Math.log(1/(1-base) - 1)/stepness; 
        return 1-1/(Math.exp(stepness*(currentOffset + offset)) + 1);
    }
    
    //Conditions------------------------------------------------------------------------------------------------------------------------
    //          ------------------------------------------------------------------------------------------------------------------------
    
    function condition_noDialog(state:State, params?:EffectDescription):boolean
    {
        return !Dialog.hasActiveDialog(state);
    }
    
    function condition_hasFact(state:State, params:EffectDescription):boolean
    {
        return state.facts[params.name];
    }
    
    function condition_provideHousing(state:State, params:EffectDescription):boolean
    {
        return state._alt.resources.pop.value <= state._alt.resources.housing.value;
    }
    
    //Effects   ------------------------------------------------------------------------------------------------------------------------
    //          ------------------------------------------------------------------------------------------------------------------------
    
    function effect_giveMaxResource(state:State, name:string, amount:number)
    {
        Stats.modifyParameterADD(state.resources.find(res => res.name == name).max, amount, state.connections);
    }
    
    function effect_giveResource(state:State, name:string, amount:number)
    {
        Stats.modifyStat(state.resources.find(res => res.name == name), amount, state.connections);
    }
    
    function effect_addWorkplace(state:State, name:string, amount:number)
    {
        Stats.modifyParameterADD(state.jobs.find(job => job.name == name).max, amount, state.connections);
    }
    
    function effect_discoverResource(state:State, name:string)
    {
        state.resources.find(res => res.name == name).isDiscovered = true;
    }
    
    function effect_discoverBuilding(state:State, name:string)
    {
        state.buildings.find(res => res.name == name).isDiscovered = true;
    }
    
    function effect_discoverTech(state:State, name:string)
    {
        state.techs.find(res => res.name == name).isDiscovered = true;
        state.tech.lastTechChange = state.dateModified;
    }
    
    function effect_discoverNeighbTech(state:State, name:string)
    {
        Techs.getNeighbours(name, state.techs, state._lib).forEach(n => n.isDiscovered = true);
        state.tech.lastTechChange = state.dateModified;
    }
    
    function effect_discoverTab(state:State, name:string)
    {
        state.discoveredTabs[name] = true;
    }
    
    function effect_addYield(state:State, job:string, resource:string, amount:number)
    {
        Stats.addYield(state.jobs.find(j => j.name == job), state.resources.find(res => res.name == resource), amount, state.connections);
    }
    
    function effect_startDialog(state:State, name:string)
    {
        Dialog.startDialog(state, state._lib.dialogByName[name]);
    }
    
    function effect_startQuest(state:State, name:string)
    {
        Quests.startQuest(name, state);
    }
    
    function effect_d_completeQuest(state:State, name:string)
    {
        if (state.activeQuests.length == 0)
            return;
        name = name ? name : state.activeQuests[0];
        Quests.completeQuest(name, state);
    }
    
    function effect_giveMaxPartyMembers(state:State, amount:number)
    {
        Stats.modifyStat(state.partyMembersMax, 1, state.connections);
    }
}

export class Event
{
    public lib:EventLib;
    public conditions:Array<EventCondition>;
}

export class EventCondition
{
    public params:EffectDescription;
    public test:(state:State, params:any) => boolean;
}
