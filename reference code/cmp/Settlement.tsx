import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import { RC } from '../Global';
import { BuildInput } from '../logic/input/Input';
import { Building } from '../logic/model/Buildings';
import { State } from '../logic/model/state/State';
import { Common } from './Common';

export class Settlement extends React.Component<any, any> 
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
        return(
            <div className="navTabContent">
                {this.s.buildings.filter(b => b.isDiscovered).map(b => <div key={b.name} className="buildingBox">
                                                                        <div key="button"><BuildButton building={b}/></div>
                                                                        <div key="price">{b.price.map(p => Common.singlePriceRenderer(p))}</div>
                                                                        <div key="value">{b.effects.map(e => Common.questEffectRenderer(e.effect, this.s, e.one.value))}</div>
                                                                        </div>)}
            </div>
        )
    }
}

class BuildButton extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        this.handleClick = (e:any) => RC.input.pushInput(new BuildInput(props.building.name));
        this.building = props.building;
    }

    private handleClick;
    private building:Building;
    
    public render() 
    {
        return(
            <Button onClick={this.handleClick}>{this.building.name}<br/>{this.building.count.value} / {this.building.max.value}</Button>
        )
    }
}