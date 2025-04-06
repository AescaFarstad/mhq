export class DialogSequenceLib 
{
    public name:string;
    public nodes: Array<DialogNodeLib>;
    public endAction:Array<DialogActionLib>;

}

export class DialogNodeLib 
{
    public name:string;
    public actions: Array<Array<DialogActionLib>>;
}

export class DialogActionLib
{
    public name:string;
    public params:Array<any>;
    public locale:string;
}

export function JSONToDialogSequenceLib(source:any):Array<DialogSequenceLib>
{
    let result = new Array<DialogSequenceLib>();
    for (let key in source) 
    {  
        let seq:DialogSequenceLib = new DialogSequenceLib();
        seq.name = key;
        seq.nodes = new Array<DialogNodeLib>();
        for (let nodeSource of source[key].nodes)
        {
            seq.nodes.push(JSONToDialogNodeLib(nodeSource));
        }
        seq.endAction = JSONToDialogAction(source[key].endAction);
        result.push(seq);
    }
    return result;
}

function JSONToDialogNodeLib(source:any):DialogNodeLib
{
    let result = new DialogNodeLib();
    result.name = source.name;
    result.actions = new Array<Array<DialogActionLib>>();
    for (let item of source.actions)
    {
        result.actions.push(JSONToDialogAction(item));
    }
    return result;
}
//Possible values:
//["1"]
//[{name="1", params=[]}]
//["1", "2"]
//[["1", {name="2", params=[]}], "3"]
function JSONToDialogAction(source:any):Array<DialogActionLib>
{    
    if (typeof source == "string")
    {
        let da = new DialogActionLib();
        da.name = source;
        da.params=[];
        da.locale="dialog.actions."+source;
        return [da];
    }
    else if (Array.isArray(source))
    {
        return (source as Array<any>).map(item => JSONToDialogAction(item)[0]);
    }
    else //object
    {
        return [source];
    }
}
