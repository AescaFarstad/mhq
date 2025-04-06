import * as React from 'react';
import { Modal } from 'react-bootstrap/lib';
import * as Button from 'react-bootstrap/lib/Button';

import { RC } from '../Global';
import { DialogInput } from '../logic/input/Input';
import { DialogNodeLib, DialogSequenceLib } from '../logic/lib/DialogLib';
import { DialogState } from '../logic/model/state/State';

export class DialogView extends React.Component<any, any> 
{
    private s:DialogState;

    constructor(props: any)
    {
        super(props);
        this.s = props.s;
    }

    public render() 
    {
        let seq:DialogSequenceLib = RC.lib.dialogByName[this.s.name];
        let nodeLib:DialogNodeLib = seq.nodes.find(a => a.name == this.s.node);
        return (
            <div>
                <p> Something's boiling in the air</p>
            <Modal show={true} onHide={()=>true}>
                <Modal.Header>
                    <Modal.Title>{RC.locale.dialogName(seq)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p dangerouslySetInnerHTML={{__html: RC.locale.dialogMessage(seq, nodeLib)}}/>
                </Modal.Body>
                <Modal.Footer>
                    {nodeLib.actions.map((action, index) => 
                        <Button key={nodeLib.name + action[0]} onClick={(e)=>RC.input.pushInput(new DialogInput(index))}>{RC.locale.dialogButtonCaption(action)}</Button>)
                    }
                </Modal.Footer>
            </Modal>
            </div>
        )
    }
}