export namespace AescaUtils
{
    let idCounter:number = 0;
    
    export function getUniqueId()
    {
        return (idCounter++).toString();
    }
}