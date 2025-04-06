import { Events } from './Events';
import { State } from './state/State';

export namespace Quests
{
    export function startQuest(name:string, state:State)
    {
        state.activeQuests.push(name);
    }
    
    export function completeQuest(name:string, state:State)
    {        
        console.log("Quest complete: " + name);
        let qLib = state._lib.questsByName[name];
        for (const eff of qLib.effects) 
        {
            Events.execEffect(eff, state);    
        }
        state.activeQuests.splice(state.activeQuests.indexOf(name), 1);
    }
}