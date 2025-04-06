import { Point } from "../../utils/HMath";

export class LandmarkLib
{
    public name:string;
    public coords:Point;
    public isBase:Boolean;
}

export function JSONToLandmarkLib(source:any):Array<LandmarkLib>
{
    let result = new Array<LandmarkLib>();
    for (let key in source) 
    {  
        let event:LandmarkLib = new LandmarkLib();
        event.name = key;
        event.coords = new Point();
        event.coords.x = source[key].coords.x;
        event.coords.y = source[key].coords.y;
        event.isBase = source[key].type == "base";
        
        result.push(event);
    }
    return result;
}