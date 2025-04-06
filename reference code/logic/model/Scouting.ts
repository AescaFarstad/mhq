import { LandmarkLib } from '../lib/MapLib';
import { Point, HMath } from '../../utils/HMath';
import { PartyMemberStats, PartyMemberLib } from '../lib/PartyLib';
import { State } from './state/State';
import { Stats } from './state/Stats';
import { Events } from './Events';
import { SimplePrice } from './state/Stat';
import { utils } from 'react-bootstrap';
import { Util } from 'leaflet';
import { AescaUtils } from '../../utils/Utils';
import { SelectAlternatives, MapEntityType } from './state/UISettings';

export class Landmark
{
    public name:string;
    public isDiscovered:boolean;
}

export class Party
{
    name:string;
    members:any = {};
    count:number = 0;
    location:Point = new Point();
    stats:PartyMemberStats = new PartyMemberStats();
    destination:string;
}


export namespace Scouting 
{    
    export function createLandmark(lib:LandmarkLib)
    {
        let result = new Landmark();
        result.name = lib.name;
        return result;
    }
    
    
    export function createParty(state:State)
    {
        if (Stats.canAffordSimple(state.newPartyPrice, state.resources))
        {
            Stats.applySimplePrice(state.newPartyPrice, state);
            state.parties.push(state.newParty);
            const base:Landmark = state.landmarks.find(l => state._lib.landmarkByName[l.name].isBase);
            const baseLib:LandmarkLib = state._lib.landmarkByName[base.name];
            state.newParty.location = new Point(baseLib.coords.x, baseLib.coords.y);
            state.newParty.name = AescaUtils.getUniqueId();
            Stats.modifyStat(state.partyMembers, state.newParty.count, state.connections);
            state.newParty = new Party();
            state.newPartyPrice = [];
            updateAlternatives(state);
        }        
    }
    
    export function resetParty(state:State)
    {
        state.newParty = new Party();
        state.newPartyPrice = [];
    }
    
    export function modifyParty(member:string, delta:number, state:State)
    {
        if (delta > 0)
            delta = Math.min(100000, delta);
        else
            delta = -Math.min(state.newParty.count, -delta);
            
        if (!delta)
            return;
            
        state.newParty.count += delta;
        
        if (!state.newParty.members[member])
            state.newParty.members[member] = delta;
        else
            state.newParty.members[member] += delta;
            
        const memberLib:PartyMemberLib = state._lib.partyMemberByName[member];
        memberLib.price.forEach(p => {
            const diff = delta * Events.calculateFormula(p.formula, 1);
            const existingPrice = state.newPartyPrice.find(r => r.resource == p.resource);
            if (existingPrice)
            {
                existingPrice.value += diff;
            }
            else
            {
                const newPrice = new SimplePrice();
                newPrice.resource = p.resource;
                newPrice.value = diff;
                state.newPartyPrice.push(newPrice);
            }
        });
        
        for (let  key in (memberLib.stats as any)) {
            state.newParty.stats[key] += delta * memberLib.stats[key];
        }
        
        let speed = 0;        
        for (let  key in (state.newParty.members as any)) {
            let lib:PartyMemberLib = state._lib.partyMemberByName[key];
            speed += state.newParty.members[key] * Math.pow(lib.stats.speed, 1/10);
        }
        speed /= state.newParty.count;
        speed = Math.pow(speed, 10);
        state.newParty.stats.speed = speed;
        
    }
    
    export function updateScouting(state:State, timeDelata:number)
    {
        for (const party of state.parties) 
        {
            if (party.destination)
            {
                const landmark:LandmarkLib = state._lib.landmarkByName[party.destination];
                const step = Math.min(Point.distance(party.location, landmark.coords), timeDelata * party.stats.speed / 1000 / 20);
                if (step < 0.0001)
                {
                    party.location.x = landmark.coords.x;
                    party.location.y = landmark.coords.y;
                    party.destination  = null;
                    updateAlternatives(state);
                }
                else
                {
                    let move = Point.subtract(landmark.coords, party.location);
                    move = Point.scaleTo(move, step);
                    party.location = Point.add(party.location, move);                    
                }
            }
        }
    }
    
    export function updateAlternatives(state:State)
    {
        const selectedParty = state.parties.find(p => p.name == state.ui.selectedParty);
        const landmarkLib:LandmarkLib = state.ui.selectedLandmark ? state._lib.landmarkByName[state.ui.selectedLandmark] : null;
        let location = selectedParty ? selectedParty.location : null;
        location = landmarkLib ? landmarkLib.coords : location;
        
        state.ui.alternatives = [];
        if (location)
        {
            for (const party of state.parties) 
            {
                if (Point.distance(party.location, location) < state._lib.settings.nearbyRadius && party != selectedParty)
                    state.ui.alternatives.push(new SelectAlternatives(MapEntityType.PARTY, party.name));
            }
            
            for (const landmark of state.landmarks) 
            {
                let lib:LandmarkLib = state._lib.landmarkByName[landmark.name];
                if (Point.distance(lib.coords, location) < state._lib.settings.nearbyRadius && lib != landmarkLib)
                    state.ui.alternatives.push(new SelectAlternatives(MapEntityType.LANDMARK, lib.name));
            }
        }
    }
    
    export function findPartiesNearby(location:Point, state:State):Array<Party>
    {
        return state.parties.filter(p => p.destination == null && Point.distance(p.location, location) < state._lib.settings.nearbyRadius);
    }
    
}