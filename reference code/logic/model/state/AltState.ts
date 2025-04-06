import { Job, Resource, Stat } from './Stat';
import { State } from './State';

export class AltState
{
    public resources:ResourcesStruct;
    public jobs:JobsStruct;

    public build(state:State)
    {
        this.resources = new ResourcesStruct();
        state.resources.forEach(res=>this.resources[res.name] = res);

        this.resources.unemployed = state.unemployed;
        
        this.jobs = new JobsStruct();
        state.jobs.forEach(job=>this.jobs[job.name] = job);
    }
}

class ResourcesStruct
{
    public pop:Resource;
    public unemployed:Stat;
    public food:Resource;
    public wood:Resource;
    public stone:Resource;
    public housing:Resource;
    public science:Resource;

}

class JobsStruct
{
    public bushes:Job;
    public rocks:Job;
    public forest:Job;
    public totem:Job;

}