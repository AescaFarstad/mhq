import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap/lib';

import { RC } from '../Global';
import { NavTabInput } from '../logic/input/Input';
import { State } from '../logic/model/state/State';
import { NavTab } from '../logic/model/state/UISettings';

export class NavPanel extends React.Component<any, any> 
{
    private _s:State;

    constructor(props: any)
    {
        super(props);
        this._s = props.state;
    }

    handleSelect(tab:any): any
    {
        RC.input.pushInput(new NavTabInput(tab));
    }

    private get s():State {return this._s}

    public render() 
    {
        return(
            <div className="navPanel">
                <Nav bsStyle="tabs" activeKey={this.s.ui.activeTab} onSelect={this.handleSelect}> 
                    {[NavTab.SETTLEMENT, NavTab.JOBS, NavTab.EXPLORE, NavTab.TECH].
                        filter(t => this.s.discoveredTabs[t]).
                        map(t => <NavItem key={t} eventKey={t} role="tab">{t}</NavItem>)
                        }
                </Nav>
            </div>
        )
    }

    
    
}