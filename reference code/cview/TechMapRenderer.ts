import { RC } from '../Global';
import { TechLib } from '../logic/lib/TechLib';
import { State } from '../logic/model/state/State';
import { VHex } from '../utils/VHex';
import { IManualUpdatable } from './Manual';

export class TechMapRenderer implements IManualUpdatable
{    
    public static SIZE:number = 60;
    
    public ref:any;
    public id:string = "";
    
    private get canvas():HTMLCanvasElement { return this.ref as HTMLCanvasElement;}
    
    private lastTime:number = 0;

    public update(state:State)
    {
        if (state.tech.lastTechChange != this.lastTime)
        {
            this.lastTime = state.tech.lastTechChange;
            this.redraw(state);
        }
    }
    
    private redraw(state:State)
    {
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "#4e5d6c";
		ctx.strokeStyle = "#5e6d7c";
        
        for (const tech of state.techs) 
        {
            if (!tech.isDiscovered || tech.isResearched)
                continue;
            this.drawHex(ctx, tech.name);
        }
        
        ctx.fillStyle = "#5cb85c";
		ctx.strokeStyle = "#5e6d7c";
        
        for (const tech of state.techs) 
        {
            if (!tech.isDiscovered || !tech.isResearched)
                continue;
            this.drawHex(ctx, tech.name);
        }
        
        ctx.fillStyle = "#5cb85c";
		ctx.strokeStyle = "#5e6d7c";
        
        if (state.tech.hoverTech)
        {
            for (const tech of state.techs) 
            {
                if (tech.name == state.tech.hoverTech)
                {
                    if (!tech.isResearched)
                    {
                        ctx.fillStyle = "#4e5d9c";
                        ctx.strokeStyle = "#5e6d7c";
                    }
                    else
                    {
                        ctx.fillStyle = "#6cc86c";
                        ctx.strokeStyle = "#5e6d7c";
                    }
                    this.drawHex(ctx, tech.name);
                    break;
                }
            }            
        }
        
        if (state.tech.selectedTech)
        {
            for (const tech of state.techs) 
            {
                if (tech.name == state.tech.selectedTech)
                {
                    ctx.fillStyle = "#5e6dac";
                    ctx.strokeStyle = "#5e6d7c";
                    this.drawHex(ctx, tech.name);
                    break;
                }
            }
        }
    }
    
    private drawHex(ctx:CanvasRenderingContext2D, techName:string)
    {
        let lib:TechLib = RC.lib.techByName[techName];
        let x = VHex.getCenterX(TechMapRenderer.SIZE, lib.coords.x, lib.coords.y) + this.canvas.width / 2;
        let y = VHex.getCenterY(TechMapRenderer.SIZE, lib.coords.x, lib.coords.y) + this.canvas.height / 2; 
        VHex.drawHex(ctx, x, y, TechMapRenderer.SIZE * 0.96);
        ctx.fill();
        ctx.stroke(); 
    }
    
}