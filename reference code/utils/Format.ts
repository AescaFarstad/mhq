export function prettify(value:number)
{
    if (Math.abs(value) >= 10)
        return (value | 0).toString();
    else if ((value | 0) != value)
        return value.toFixed(1);
    else
        return value.toString();
}