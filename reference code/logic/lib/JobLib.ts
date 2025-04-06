export class JobLib
{
    public name:string;
}


export function JSONToJobLib(source:any):Array<JobLib>
{
    let result = new Array<JobLib>();
    for (let key in source) 
    {  
        let job:JobLib = new JobLib();
        job.name = key;
        result.push(job);
    }
    return result;
}