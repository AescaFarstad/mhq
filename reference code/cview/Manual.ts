import { State } from '../logic/model/state/State';
import { TechMapRenderer } from './TechMapRenderer';

export class ManualUpdater
{
    private nodeById:any = {};
    private nodes:Array<IManualUpdatable> = [];
    
    public update(state:State)
    {
        for (const node of this.nodes) 
        {
            if (node.ref)
                node.update(state);
        }
    }
    
    public mount(id:string, ref:any)
    {
        if (!this.nodeById[id])
            this.init(id);
        this.nodeById[id].ref = ref;
    }
    
    public unmount(id:string)
    {
        this.nodeById[id].ref = null;
    }
    
    private init(id:string)
    {
        const newNode = this.create(id);
        newNode.id = id;
        this.nodeById[id] = newNode;
        this.nodes.push(newNode);
    }
    
    private create(id:string):IManualUpdatable
    {
        switch(id)
        {
            case "techMap": return new TechMapRenderer();
            default: throw "No class can update " + id;
        }
    }
}

export interface IManualUpdatable
{
    ref:any;
    update(state:State);
    id:string;    
}

export enum MUID
{
    TECHMAP = "techMap"
}