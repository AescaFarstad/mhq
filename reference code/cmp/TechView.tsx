import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import { MUID } from '../cview/Manual';
import { TechMapRenderer } from '../cview/TechMapRenderer';
import { RC } from '../Global';
import { TechAcknowledgeInput, TechHoverInput, TechSelectInput, TechStartInput } from '../logic/input/Input';
import { TechLib } from '../logic/lib/TechLib';
import { State, TechState } from '../logic/model/state/State';
import { Tech, Techs } from '../logic/model/Techs';
import { Point } from '../utils/HMath';
import { VHex } from '../utils/VHex';
import { Common, ManualCanvas } from './Common';

export class TechView extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }

    private get s():State {return this.props.state} 
    
    private onOKClick(e:any)
    {
        RC.input.pushInput(new TechAcknowledgeInput());
    }

    public render() 
    {
        if (this.s.tech.currentTech)
        {
            return (
                <div className="navTabContent">
                    <div>
                        {this.s.tech.currentTech} research progress: {(this.s.tech.techProgress * 100).toFixed()}%
                    </div>
                </div>
            )
        }
        else if (!this.s.tech.lastAcknowledged)
        {
            const lib = RC.lib.techByName[this.s.tech.lastResearched];
            if (this.s.tech.lastResult)
                return(     
                    <div className="navTabContent researchResult">
                        <div key="mesg">{"We have successfully researched " + this.s.tech.lastResearched}!</div>
                        <div key="title" className="techEffectList">
                            <div key="title">You get:</div>
                            <div key="eff" className="effectItem">{lib.onSuccess.map(e => Common.questEffectRenderer(e, this.s))}</div>
                        </div>
                        <Button bsSize="large" onClick={this.onOKClick}>OK</Button>
                    </div>
                );
            else
                return(     
                    <div className="navTabContent researchResult">
                        <div key="mesg">{"Researching " + this.s.tech.lastResearched + " didn't go well. Should we try again or is it all futile?"}</div>
                        <div key="title">Consolation:</div>
                        <div key="eff">{lib.onFailure.map(e => Common.questEffectRenderer(e, this.s))}</div>
                        <Button bsSize="large" onClick={this.onOKClick}>OK</Button>
                    </div>
                );
        }
        else
        {
            let currentTech = this.s.tech.hoverTech ? this.s.techs.find(t => t.name == this.s.tech.hoverTech) : null;
            if (!currentTech)
                currentTech = this.s.tech.selectedTech ? this.s.techs.find(t => t.name == this.s.tech.selectedTech) : null;
                //console.log(
            return(
                <div className="navTabContent">
                    <TechDescription  className="techDescription" tech={currentTech} state={this.s}/>
                    <div className=" techBox">
                        <TechMap state={this.s} width={700} height={700}/>
                        <TechOverlay state={this.s} width={700} height={700}/>
                    </div>
                </div>
            )
        }
    }
}

export class TechDescription extends React.Component<any, any> 
{
    private get s():State {return this.props.state} 
    private get tech():Tech {return this.props.tech} 

    constructor(props: any)
    {
        super(props);
    }
    
    private onResearchClick(e:any) 
    {
        RC.input.pushInput(new TechStartInput());
    }
    
    private getFooterContent(disabled:boolean) 
    {
        if (this.s.tech.selectedTech == this.tech.name)
            return <Button disabled={disabled} bsSize="large" onClick={this.onResearchClick}>Research</Button>;
        else if (this.tech.isResearched)
            return "Already researched";
        else
            return "Click hex to select";
    }

    public render() 
    {
        if (!this.tech)
            return <div className="techDescription"/>
            
        
        let lib:TechLib = RC.lib.techByName[this.tech.name];
        const disabled = this.s.tech.selectedTech == this.tech.name && !Techs.canAfford(this.tech, this.s, RC.lib);
        return(
            
            <div className="techDescription relative">
                <div className="techHeader">{this.tech.name}:</div>
                <div key="desc" className="description">
                    Here is some explanation about what the tech actually means and how you're supposed to think about it
                </div>
                <div key="failure">
                    <div className="questPanelHeader">on failure:</div>
                    <br/>
                    <div className="effectItem">{lib.onFailure.map(e => Common.questEffectRenderer(e, this.s))}</div>
                </div>
                <div key="success">
                    <div className="questPanelHeader">on success:</div>
                    <br/>
                    <div className="effectItem">{lib.onSuccess.map(e => Common.questEffectRenderer(e, this.s))}</div>
                </div>
                <div key="button" className="techButton">
                    {disabled ? <div className="footnote">Not enough resources.</div> : null}
                    {this.getFooterContent(disabled)}
                </div>
            </div>
        )
    }
}
/*
Price: {Techs.getPrice(this.tech, RC.lib, this.s.numResearchedTech)}<br/>
                                Discount: {((1 - this.tech.discount.value) * 100).toFixed()}%<br/>
                                Research probability: {(this.tech.probability.value * 100).toFixed()}%
                                
                                <div key="footer" className="techDescriptionFooter">
                                
                                
                        </div>
*/

export class TechMap extends React.Component<any, any> 
{
    private get s():State {return this.props.state} 
    
    private ref:React.RefObject<ManualCanvas> = React.createRef<ManualCanvas>();
    private width:number;
    private height:number;

    constructor(props: any)
    {
        super(props);
        this.width = props.width;
        this.height = props.height;
        
        this.traceCoords = (e:any) =>{
            let rect = (this.ref.current.ref.current as HTMLCanvasElement).getBoundingClientRect();
            console.log((e.clientX - rect.left).toFixed(1) + "  " + (e.clientY - rect.top).toFixed(1));
            console.log("HEX: " + this.hexFromPoint(e.clientX, e.clientY).toString());
        }
        
        this.onMouseMove = (e:any) =>{
            let tech = this.techFromEvent(e);
            if (!tech && this.s.tech.hoverTech)
                RC.input.pushInput(new TechHoverInput(null));
            else if (tech && tech.name != this.s.tech.hoverTech)
                RC.input.pushInput(new TechHoverInput(tech.name));
            
        }
        
        this.onClick = (e:any) =>{            
            let tech = this.techFromEvent(e);
            if (tech.isResearched)
                return;
            if (!tech && this.s.tech.selectedTech)
                RC.input.pushInput(new TechSelectInput(null));
            else if (tech && tech.name != this.s.tech.selectedTech)
                RC.input.pushInput(new TechSelectInput(tech.name));
        }
    }
    
    private hexFromPoint(x:number, y:number):Point
    {
        let rect = (this.ref.current.ref.current as HTMLCanvasElement).getBoundingClientRect();
        return VHex.hexFromPoint(TechMapRenderer.SIZE, (x - rect.left) - this.width/2, (y - rect.top) - this.height/2)
    }
    
    private techFromEvent(e:any):Tech
    {
        let hex = this.hexFromPoint(e.clientX, e.clientY);
        return Techs.techFromHex(hex.x, hex.y, this.s, RC.lib);
    }
    
    shouldComponentUpdate(nextProps, nextState) 
    {
        const s:TechState = nextProps.state.tech as TechState;
        const result = s.selectedTech != this.s.tech.selectedTech 
            || s.hoverTech != this.s.tech.hoverTech
            || s.lastTechChange != this.s.tech.lastTechChange;
        return result;
    }
    
    private traceCoords:(e:any)=>void;
    private onMouseMove:(e:any)=>void;
    private onClick:(e:any)=>void;

    public render() 
    {
        return(
            <div>
                <ManualCanvas 
                    ref={this.ref} 
                    muid={MUID.TECHMAP} 
                    width={this.width} 
                    height={this.height} 
                    onDoubleClick={this.traceCoords}
                    onMouseMove={this.onMouseMove}
                    onClick={this.onClick}/>
            </div>
        )
    }
}

export class TechOverlay extends React.Component<any, any> 
{
    private width:number;
    private height:number;
    
    private get s():State {return this.props.state} 

    constructor(props: any)
    {
        super(props);
        this.width = props.width;
        this.height = props.height;
    }

    public render() 
    {
        return this.s.techs.map(t => {
            if (!t.isResearched && !t.isDiscovered)
                return null;
            const lib:TechLib = RC.lib.techByName[t.name];
            // .navTabContent padding will move the hexes but not the overlay. that's why it has margin instead of paddings
            const left = VHex.getCenterX(TechMapRenderer.SIZE, lib.coords.x, lib.coords.y) + this.width/2 - TechMapRenderer.SIZE * Math.sqrt(3)/2;
            const top = VHex.getCenterY(TechMapRenderer.SIZE, lib.coords.x, lib.coords.y) + this.height/2 - TechMapRenderer.SIZE;
            return(
                <div key={t.name} className="techOverlayItem" style={{
                        left:left, 
                        top:top, 
                        position:'absolute', 
                        width:TechMapRenderer.SIZE*Math.sqrt(3), 
                        height:TechMapRenderer.SIZE*2,
                        justifyContent:"center",
                        display:"flex",
                        flexDirection:"column"
                        }}>
                    <div key="name" className="noSelect">{t.name} </div>
                    {!t.isResearched ? 
                        <div key="stats" className="techOverlayStats noSelect">
                            <div key="probability">Chance: {Math.floor(t.probability.value * 100).toFixed()}%</div>
                            {t.discount.value != 1 ? <div key="discount">Discount: {Math.floor((1 - t.discount.value) * 100).toFixed()}%</div> : null}
                            <div key="price">Price: {Techs.getPrice(t, RC.lib, this.s.numResearchedTech)}</div>
                        </div>
                    : null}
                </div>
        )
        });
    }
}


