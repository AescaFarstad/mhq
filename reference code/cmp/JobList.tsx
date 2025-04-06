import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import { RC } from '../Global';
import { JobAssigmentInput } from '../logic/input/Input';
import { Job } from '../logic/model/state/Stat';
import { State } from '../logic/model/state/State';
import { prettify } from '../utils/Format';

export class JobList extends React.Component<any, any> 
{
    private _s:State;

    constructor(props: any)
    {
        super(props);
        this._s = props.state;
    }

    handleSelect(tab:any): any
    {
        console.log(tab)
    }

    private get s():State {return this._s}

    public render() 
    {
        return(
            <div className="navTabContent">
                        {this.s.jobs.map(j => j.max.value > 0 ? <JobItem key={j.name} job={j}/> : null)}
            </div>
        )
    }
}

class AssignJobButton extends React.Component<any, any> 
{
    private amount:number;

    constructor(props: any)
    {
        super(props);
        this.amount = props.amount;
        this.handleClick = (e:any) => RC.input.pushInput(new JobAssigmentInput(props.job.name, props.amount));
    }

    private handleClick;
    
    private text():string
    {
        const sign = this.amount > 0 ? "+" : "";
        const value = Math.abs(this.amount) > 999 ? (this.amount < 0 ? "-all" : "all" ): this.amount;
        return sign+value;
    }
    
    public render() 
    {
        return(
            <Button className="jobModifyButton" onClick={this.handleClick}>{this.text()}</Button>
        )
    }
}


const JobItem: React.SFC<{job:Job}> = (props) => 
    {
        const j:Job = props.job;
        return(
            <div key={j.name} className="jobItem">
                <div key="buttons">
                    <div className="jobItemButtonsGroup">
                        <AssignJobButton amount={-1000} job={j}/>
                        <AssignJobButton amount={-5} job={j}/>
                        <AssignJobButton amount={-1} job={j}/>
                        <div className="jobTitleButton">{j.name}<br/>{j.pop.value} / {j.max.value}</div>
                        <AssignJobButton amount={1} job={j}/>
                        <AssignJobButton amount={5} job={j}/>
                        <AssignJobButton amount={1000} job={j}/>
                    </div>
                </div>
                <div key="stats">
                    <table className="jobStatsTable">
                        <thead>
                        <tr>
                            <td/>
                            {j.yields.map(y => <td key={y.resource}>{y.resource}</td>)}
                        </tr>
                        </thead>
                        <tbody>
                            <tr key="each">
                                <td>each:</td>
                                {j.yields.map(y => <td key={y.resource}>{prettify( y.one.value)}</td>)}
                            </tr>
                            <tr key="all">
                                <td>sum:</td>
                                {j.yields.map(y => <td key={y.resource}>{prettify( y.sum.value)}</td>)} 
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }