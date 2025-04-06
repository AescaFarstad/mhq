export class Point
{
    constructor(x:number = 0, y:number = 0)
    {
        this.x = x;
        this.y = y;
    }
    
    public x:number = 0;
    public y:number = 0;
    
    public toString():string { return "[" + this.x + "," + this.y + "]"; }
    
    public static distance(p1:Point, p2:Point)
    {
        return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
    }
    
    public static getLength(p:Point)
    {
        return Math.sqrt(p.x*p.x + p.y*p.y);
    }
    
    public static subtract(p1:Point, p2:Point)
    {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }
    
    public static add(p1:Point, p2:Point)
    {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }
    
    public static scaleTo(p:Point, value:number)
    {
        const length = Point.getLength(p);
        const factor = value / length;
        return new Point(p.x * factor, p.y * factor);
    }
}

export class VPoint
{
    public x:number = 0;
    public y:number = 0;
    public z:number = 0;
}

export namespace HMath
{
    
}