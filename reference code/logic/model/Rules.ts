import { Job } from './state/Stat';
import { State } from './state/State';
import { Stats } from './state/Stats';

export namespace Rules
{
    export function avoidStarving(state:State)
    {
        const food = state._alt.resources.food;
        let bestJob:Job;
        while(food.value < -food.income.value)
        {
            if (state.unemployed.value == 0)
                Stats.employ(findWorstFoodJob(state).name, -1, state);
            Stats.employ(findBestFoodJob(state).name, 1, state);
        }
    }
        
    function findBestFoodJob(state:State):Job
    {
        let bestJob = state.jobs[0];
        let bestJobFY = bestJob.yields.find(y => y.resource == state._alt.resources.food.name);
        for (let index = 1; index < state.jobs.length; index++) 
        {
            const element = state.jobs[index];
            if (element.pop.value < element.max.value)
            {
                let foodYield = element.yields.find(y => y.resource == state._alt.resources.food.name);
                if (!bestJobFY || foodYield && foodYield.one.value > bestJobFY.one.value)
                {
                    bestJob = element;
                    bestJobFY = foodYield;
                }
            }            
        }
        return bestJob;
    }
    
    function findWorstFoodJob(state:State):Job
    {
        let bestJob;
        let bestJobFY;
        
        for (let index = 0; index < state.jobs.length; index++) 
        {
            const element = state.jobs[index];
            if (element.pop.value > 0)
            {
                let foodYield = element.yields.find(y => y.resource == state._alt.resources.food.name);
                if (!foodYield)
                {
                    return element;
                }
                else if (!bestJob)
                {
                    bestJob = element;
                    bestJobFY = foodYield;
                }
                else if (foodYield.one.value < bestJobFY.one.value)
                {
                    bestJob = element;
                    bestJobFY = foodYield;
                }
            }            
        }
        return bestJob;
    }
}