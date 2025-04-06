import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import { RC } from '../Global';
import { QuestDialogInput } from '../logic/input/Input';
import { EventLib } from '../logic/lib/EventLib';
import { State } from '../logic/model/state/State';
import { Common } from './Common';

export class QuestPanel extends React.Component<any, any> 
{
    private _s:State;

    constructor(props: any)
    {
        super(props);
        this._s = props.state;
    }

    private get s():State {return this._s}

    public render() 
    {
        if (this.s.activeQuests.length <= 0)
            return <div className="questPanel"/>;
            
        let activeQuest:EventLib = this.s._lib.questsByName[this.s.activeQuests[0]];
        return(
            <div className="questPanel">
                <div>
                    <div>You don't own the land until you build the roof above your bed - an ancient law says. And so we must.</div>
                </div>
                <div>
                    <div className="questPanelHeader">To complete:</div>
                    {activeQuest.conditions.map(c => Common.questConditionRenderer(c, this.s))}
                </div>
                <div>
                    <div className="questPanelHeader">Outcome:</div>
                    {activeQuest.effects.map(e => Common.questEffectRenderer(e, this.s))}
                </div>
                <div>
                    {activeQuest.dialogs.map(d => <DialogButton key={d.title} title={d.title} dialog={d.dialog.name}/>)}
                </div>
            </div>
        )
    }
}

class DialogButton extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        this.title = props.title;
    }

    private handleClick = (e:any) => RC.input.pushInput(new QuestDialogInput(this.props.dialog));
    private title:string;
    
    public render() 
    {
        return(
            <Button onClick={this.handleClick}>{this.title}</Button>
        )
    }
}

