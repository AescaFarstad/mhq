import * as React from 'react';

import { State } from '../logic/model/state/State';
import { Lib } from '../logic/lib/Lib';
import { RC } from '../Global';
import { Landmark, Party } from '../logic/model/Scouting';
import { UISettings } from '../logic/model/state/UISettings';
import * as Button from 'react-bootstrap/lib/Button';
import { CreatePartyInput, SelectLandmarkInput, PartyModfyInput, PartyCancelInput, PartyBuyInput, PartyResetInput } from '../logic/input/Input';
import { PartyMemberLib } from '../logic/lib/PartyLib';
import { ButtonWithContext, Common } from './Common';
import { Stats } from '../logic/model/state/Stats';




export class PartyCreateView extends React.Component<any, any> 
{
    private get s():State {return this.props.state} 
    
    createParty = (e:any) =>
    {
        RC.input.pushInput(new PartyBuyInput());
    }
    
    cancelParty = (e:any) =>
    {
        RC.input.pushInput(new PartyCancelInput());
    }
    
    canCreateParty = () =>
    {
        return this.s.newParty.count > 0 && Stats.canAffordSimple(this.s.newPartyPrice, this.s.resources);
    }
    
    public render() 
    {
        const availableSize = this.s.partyMembersMax.value - this.s.partyMembers.value - this.s.newParty.count;
        const curClass =  availableSize == 0 ? "redAlert" : ""
        
        const unemployedLeft = this.s.unemployed.value - this.s.newParty.count;
        const unemplClass =  unemployedLeft == 0 ? "redAlert" : "";
        return (<div>
                    <div key="max">Max total party size: {this.s.partyMembersMax.value}</div>
                    <div key="cur" className={curClass}>Available party size: {availableSize}</div>
                    <div key="unemployed" className={unemplClass}>Unemployed citizens: {unemployedLeft}</div>
                    <PartyView party={this.s.newParty} maxMembers={Math.min(availableSize, unemployedLeft)}/>
                    <div className="partyCreateView">
                        <div key="price">
                            <div key="header" className="large">
                                Total price:
                            </div>
                            <div key="price" className="partyPrice">
                                {
                                    this.s.newPartyPrice.length == 0 ?
                                        "..."
                                    :
                                        this.s.newPartyPrice.map(p => Common.singleSimplePriceRenderer(p))
                                }
                            </div>
                        </div>
                        <div key="buy">
                            <Button  bsStyle="success" onClick={this.createParty} disabled={!this.canCreateParty()}>Create party</Button>
                        </div>
                        <div key="cancel">
                            <Button bsStyle="danger" onClick={this.cancelParty}>Go back</Button>
                        </div>
                    </div>
                </div>
        )
    }
}

export class PartyView extends React.Component<any, any> 
{
    private get party():Party {return this.props.party} 
    
    bolds = {
        speed:["scout", "wayfarer", "horse"],
        food:["hunter", "wayfarer"],
        storage:["scout", "ballista", "ox", "wayfarer", "horse"],
        offence:["warrior", "archer", "ballista"],
        defence:["warrior", "shaman"],
        craft:["engineer", "shaman"],
        siege:["ballista"],
        lore:["bard"]
    }
    
    handlePlus = (key:string) =>
    {
        RC.input.pushInput(new PartyModfyInput(key, 1));
    }
    
    handleMinus = (key:string) =>
    {
        RC.input.pushInput(new PartyModfyInput(key, -1));
    }
    
    handleMinusAll = (key:string) =>
    {
        RC.input.pushInput(new PartyResetInput());
    }
    
    
    public render() 
    {
        const members:Array<PartyMemberLib> = [];
        const memberNames:Array<string> = [null, "total"];
        
        const disablePlus = this.props.maxMembers == 0;
        
        for (let  iterator in (RC.lib.partyMemberByName as any)) 
        {
            members.push(RC.lib.partyMemberByName[iterator]);
            memberNames.push(iterator);
        }
        const stats:Array<string> = [
            "speed",
            "food",
            "storage",
            "offence",
            "defence",
            "armour",
            "lore",
            "craft",
            "siege"
            ];
        const result = [
            <div key="-4">{
                memberNames.map((n, index) => index < 2 ? 
                    <div key={n}/> 
                : 
                    <ButtonWithContext key={n} className="partyModifyButton" disabled={disablePlus} context={n} onContextClick={this.handlePlus}>+</ButtonWithContext>)
                }
            </div>,
            <div key="-3">{memberNames.map(n => <div key={n}>{n}</div>)}</div>,
            <div key="-2">{memberNames.map(this.renderMemberCount)}</div>,
            <div key="-1">{
                memberNames.map((n, index) => {
                        if (index == 0) 
                            return <div key={n}/> 
                        else if (index == 1)
                            return <ButtonWithContext key={n} disabled={!this.party.count} className="partyModifyButton" context={n} onContextClick={this.handleMinusAll}>-all</ButtonWithContext>
                        else
                            return <ButtonWithContext key={n} disabled={!this.party.members[n]} className="partyModifyButton" context={n} onContextClick={this.handleMinus}>-</ButtonWithContext>
                    })
                }
            </div>
        ];
        
        
        let row;
        for (let k = 0; k < stats.length; k++) 
        {
            row = [<div key="-2">{stats[k]}</div>];
            for (let i = -1; i < members.length; i++) 
            {
                let value = i == -1 ? this.party.stats[stats[k]] : members[i].stats[stats[k]];
                
                if (!value)
                    value = null;
                else if (stats[k] == "storage")
                    value /= 100;
                else if (stats[k] == "speed" && i == -1)
                    value = value.toFixed(1);
                    
                if (this.bolds[stats[k]] && this.bolds[stats[k]].indexOf(memberNames[i + 2]) != -1)
                    row.push(<div key={i} className="highlight">{value}</div>);
                else
                    row.push(<div key={i}>{value}</div>);
            }
            result.push(<div key={k}>{row}</div>);
        }
        
        result.push(
            <div key="price">{
                memberNames.map((n, index) => index < 2 ? 
                    <div key={n}/> 
                : 
                    <div  key={n} className="partyMemberPrice">{members[index - 2].price.map(p => Common.singlePriceLibRenderer(p))}</div>)
                }
            </div>)
            
        return <div className="partyStats">{result}</div>;
    }
    
    renderMemberCount = (n:string, index:number) =>
    {
        if (index == 1)
            return <div key={n} className={this.party.count == 0 ? "faded" : ""}>{this.party.count}</div>;
        if (!this.party.members[n])
            return index > 0 ? <div key={n} className="faded">0</div> : <div key={n}/>;
        else
            return <div key={n}>{this.party.members[n]}</div>;
    }
}

