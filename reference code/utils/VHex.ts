import { Point } from './HMath';

export namespace VHex
{
    export function drawHex(context:CanvasRenderingContext2D, centerX:number, centerY:number, size:number)
    {
		context.beginPath();
		for (let i: number = 0; i < 6; i++) {
			var angle:number = Math.PI / 3 * (i + 0.5);
			let x = centerX + size * Math.cos(angle);
			let y = centerY + size * Math.sin(angle);
			if (i == 0)
				context.moveTo(x, y);
			else
				context.lineTo(x, y);
		}
		context.closePath();
    }
    
    export function getCenterX(frameSize:number, x:number, y:number):number 
    {
		return frameSize * Math.sqrt(3) * (x + y / 2);
	} 

	export function getCenterY(frameSize:number, x:number, y:number):number 
    {
		return frameSize * y * 3 / 2;
	} 
    
	export function hexFromPoint(frameSize:number, x:number, y:number):Point 
    {
        let result = new Point();
		result.x = (Math.sqrt(3)/3 * x  -  1./3 * y) / frameSize;
        result.y = (2/3 * y) / frameSize;
        let z = -result.x-result.y;
        
        let rx = Math.round(result.x);
        let ry = Math.round(result.y);
        let rz = Math.round(z);

        let x_diff = Math.abs(rx - result.x);
        let y_diff = Math.abs(ry - result.y);
        let z_diff = Math.abs(rz - z);

        if (x_diff > y_diff && x_diff > z_diff)
            rx = -ry - rz;
        else if (y_diff > z_diff)
            ry = -rx - rz;
            
        result.x = rx;
        result.y = ry;
        
        return result;
	} 
}