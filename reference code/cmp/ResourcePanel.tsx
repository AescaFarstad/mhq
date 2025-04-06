import * as React from 'react';

import { RC } from '../Global';
import { Resource, Stat } from '../logic/model/state/Stat';
import { State } from '../logic/model/state/State';
import { prettify } from '../utils/Format';

export class ResourcePanel extends React.Component<any, any> 
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
        let res = this.s._alt.resources;

        let list = [
            res.food,
            res.wood,
            res.stone,
            res.science
        ];
        return(
            <div className="resourcePanel">
                <div key={"header"}>
                    <div className="resName">Name:</div>
                    <div className="resValue">? / <b>max</b></div>
                    <div className="resIncome">+</div>
                </div>
                <hr className="narrow"/>
                <PopRenderer pop={res.pop} unemployed={res.unemployed} housing={res.housing}/>
                {list.map(a => showResource(a, this.s))}
            </div>
        )
    }

    
    
}

const PopRenderer: React.SFC<{pop:Resource, unemployed:Stat, housing:Resource}> = (props) => {
        return <div key={"pop"}>
                <div className="resName">{RC.locale.resourceName(props.pop)}</div>
                <div className="resValue">{prettify(props.pop.value)} / {prettify(props.housing.value)}</div>
                <div className="resIncome">{props.unemployed.value != 0 ? "(" + prettify(props.unemployed.value) + ")" : ""}</div>
                </div>;
}

function showResource(res:Resource, state:State)
{
    if (!res.isDiscovered)
        return null;
    return(
        <div key={res.name}>
            <div className="resName">{RC.locale.resourceName(res)}</div>
            <div className="resValue">{prettify(res.value)} / <b>{prettify(res.max.value)}</b></div>
            <div className="resIncome">{res.income.value != 0 ? prettify(res.income.value) : ""}</div>
        </div>
        );
}