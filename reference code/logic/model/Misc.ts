import { State } from './state/State';

export namespace Misc
{
    export function random(state:State):number
    {
        state.randomSeed = (state.randomSeed * 16807) % 0x7FFFFFFF;
        if (state.randomSeed == 0)
            state.randomSeed++;
        return state.randomSeed / 0x7FFFFFFF + 0.000000000233;
    }
    
    export function randomInRange(state:State, min:number, max:number):number
    {
        return (max - min) * random(state) + min;
    }
}