import { Resource } from '../model/state/Stat';
import { DialogActionLib, DialogNodeLib, DialogSequenceLib } from './DialogLib';
import { UILocale } from './ui';

var root = {
    "dialog": require('./json/locale/dialog.json'),
    "resource": require('./json/locale/resource.json'),
    "job": require('./json/locale/job.json'),
}

export class Locale 
{
    public currentLocale:string;
    public get(key:string):string
    {
        let nodes = key.split(".");
        let node:any = root;
        for (let index = 0; index < nodes.length; index++) {
            node = node[nodes[index]];
        }
        return node[this.currentLocale];
    }

    public dialogName(seq:DialogSequenceLib):string { return root.dialog["seq_" + seq.name].name[this.currentLocale] }
    public dialogMessage(seq:DialogSequenceLib, node:DialogNodeLib):string { return root.dialog["seq_" + seq.name]["node_" + node.name][this.currentLocale] }
    public dialogButtonCaption(action:Array<DialogActionLib>):string { return action[0].locale ? this.get(action[0].locale) : root.dialog.actions[action[0].name][this.currentLocale] }

    public resourceName(resource:Resource):string {return root.resource[resource.name][this.currentLocale] }
    public ui:UILocale = new UILocale();
}