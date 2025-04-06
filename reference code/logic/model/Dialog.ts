import { DialogNodeLib, DialogSequenceLib } from '../lib/DialogLib';
import { State } from './state/State';

export namespace Dialog
{
    export function startDialog(state:State, dialogLib:DialogSequenceLib)
    {
        state.activeDialog.name = dialogLib.name;
        state.activeDialog.node = dialogLib.nodes[0].name;
    }

    export function applyAction(state:State, action:number)
    {
        let seq:DialogSequenceLib = state._lib.dialogByName[state.activeDialog.name];
        let node = seq.nodes.find(n => n.name == state.activeDialog.node);
        node.actions[action].forEach(a => {actionByName[a.name].call(null, state, seq, node, ...a.params)});
    }
    
    export function hasActiveDialog(state:State):boolean
    {
        return state.activeDialog.name != null;
    }

    let actionByName = 
    {
        "next": A_next,
        "setFact": A_setFact
    }

    function A_next(state:State, seq:DialogSequenceLib, node:DialogNodeLib)
    {
        let nodeIndex = seq.nodes.indexOf(node);
        nodeIndex++;
        if (nodeIndex == seq.nodes.length)
        {
            state.activeDialog.name = null;
            state.activeDialog.node = null;
            seq.endAction.forEach(a => actionByName[a.name].call(null, state, seq, node, ...a.params));
        }
        else
        {
            state.activeDialog.node = seq.nodes[nodeIndex].name;
        }
    }

    function A_setFact(state:State, seq:DialogSequenceLib, node:DialogNodeLib, factName:string)
    {
        state.facts[factName] = true;
    }
}
