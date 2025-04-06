import { EffectDescription } from '../model/state/Stat';
import { DialogSequenceLib, JSONToDialogSequenceLib } from './DialogLib';

export class EventLib
{
    public name:string;
    public conditions:Array<EffectDescription>;
    public effects:Array<EffectDescription>;
    public dialogs:Array<QuestDialogLib>;
    public priority:number;
}

export class QuestDialogLib
{
    public title:string;
    public dialog:DialogSequenceLib;
}

export function JSONToEventLib(source:any):Array<EventLib>
{
    let result = new Array<EventLib>();
    for (let key in source) 
    {  
        let event:EventLib = new EventLib();
        event.name = key;
        event.conditions = JSONToEffectDescription(source[key].conditions);
        event.effects = JSONToEffectDescription(source[key].effects);
        event.dialogs = JSONToQuestDialogs(source[key].dialogs);
        event.priority = source[key].priority;
        result.push(event);
    }
    return result;
}

export function JSONToEffectDescription(source:Array<any>):Array<EffectDescription>
{
    let result = new Array<EffectDescription>();
    for (let item of source)
        result.push(Object.assign(new EffectDescription(), item));
    return result;
}

function JSONToQuestDialogs(source:Array<any>):Array<QuestDialogLib>
{
    if (!source)
        return null;
        
    let result = new Array<QuestDialogLib>();
    for (let item of source)
    {
        let qd = new QuestDialogLib();
        qd.title = item.title
        qd.dialog = JSONToDialogSequenceLib(item.dialog)[0];
        result.push(qd);
    }
    return result;
}