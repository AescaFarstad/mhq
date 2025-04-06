import * as React from 'react';

import { State } from '../logic/model/state/State';
import { NavTab } from '../logic/model/state/UISettings';
import { DialogView } from './DialogView';
import { Explore } from './Explore';
import { JobList } from './JobList';
import { NavPanel } from './NavPanel';
import { QuestPanel } from './QuestPanel';
import { ResourcePanel } from './ResourcePanel';
import { Settlement } from './Settlement';
import { TechView } from './TechView';

export class RootView extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        this.state = {blank:true};
    }

    private get s():State {return this.state as State}
    private lastModified:number;

    update(state:State) 
    {
        if (this.lastModified != state.dateModified)
        {
            this.setState(state);
            this.lastModified = state.dateModified;
        }
    }
    
    private activePanel(tab:NavTab)
    {
        switch(tab)
        {
            case NavTab.JOBS: return <JobList state={this.s}/>;
            case NavTab.SETTLEMENT: return <Settlement state={this.s}/>;
            case NavTab.TECH: return <TechView state={this.s}/>;
            case NavTab.EXPLORE: return <Explore state={this.s}/>;
        }
        return null;
    }

    public render() 
    {
        if (isNaN(this.state.dateModified))
        {
            return (
                <div>
                    Loading...
                </div>
            );
        }
        else 
        {
            if (this.s.activeDialog.name)
            {
                return (
                    <div >
                        <DialogView s={this.s.activeDialog}/>
                    </div>
                );
            }
            else
            {
                if (!this.s.facts.startingSequenceDone)
                    return <p>Something's boiling in the air</p>;
                else
                    return (
                        <div className="rootView">
                            <ResourcePanel state={this.s}/>
                            <div className="leftPlane">
                                <QuestPanel state={this.s}/>
                                <NavPanel state={this.s}/>
                                {this.activePanel(this.s.ui.activeTab)}
                            </div>
                        </div>
                    );
            }
        }
    }
}
//
