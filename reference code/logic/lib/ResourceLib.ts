export class ResourceLib
{
    public name:string;
}


export function JSONToResourceLib(source:any):Array<ResourceLib>
{
    let result = new Array<ResourceLib>();
    for (let key in source) 
    {  
        let resource:ResourceLib = new ResourceLib();
        resource.name = key;
        result.push(resource);
    }
    return result;
}