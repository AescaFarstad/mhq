import * as React from 'react';

import { MUID } from '../cview/Manual';
import { RC } from '../Global';
import { Events } from '../logic/model/Events';
import { EffectDescription, Price, SimplePrice } from '../logic/model/state/Stat';
import { State } from '../logic/model/state/State';
import { prettify } from '../utils/Format';
import * as Button from 'react-bootstrap/lib/Button';
import { ButtonProps } from 'react-bootstrap/lib/Button';
import { Sizes } from 'react-bootstrap';
import { PriceLib } from '../logic/lib/BuildingLib';

export namespace Common
{
    export function questEffectRenderer(effect:EffectDescription, state:State, overrideAmount:any = null)
    {
        if (overrideAmount === null)
            overrideAmount = effect.amount;
        switch(effect.key)
        {
            case Events.EventEffects.DESCRIPTION: {
                return (
                    <div key={effect.key + effect.name}>• Custom description...</div>
                );
            }
            case Events.EventEffects.GIVE_MAX_RESOURCE:{
                return (
                    <div key={effect.key + effect.resource}>• {effect.resource} storage: {overrideAmount}</div>
                );
            }
            case Events.EventEffects.GIVE_RESOURCE:{
                return (
                    <div key={effect.key + effect.resource}>• {effect.resource}: {overrideAmount}</div>
                );
            }
            case Events.EventEffects.ADD_WORKPLACE:{
                return (
                    <div key={effect.key + effect.job}>• {effect.job} work space: {overrideAmount}</div>
                );
            }
            case Events.EventEffects.ADD_YIELD:{
                return (
                    <div key={effect.key + effect.job}>• {effect.job} {effect.resource} yield: {overrideAmount}</div>
                );
            }
            case Events.EventEffects.ADD_YIELD:{
                return (
                    <div key={effect.key + effect.job}>• {effect.job} {effect.resource} yield: {overrideAmount}</div>
                );
            }
            case Events.EventEffects.DISCOVER_RESOURCE:
            case Events.EventEffects.DISCOVER_BUILDING:
            case Events.EventEffects.DISCOVER_TAB:
            case Events.EventEffects.START_DIALOG:
            case Events.EventEffects.START_QUEST:
            default:
                return null;
        }
    }

    export function questConditionRenderer(condition:EffectDescription, state:State)
    {
        switch(condition.key)
        {
            case Events.EventConditions.PROVIDE_HOUSING: {
                const conditionComplete = Events.createCondition(condition)(state, condition);
                const res = state._alt.resources;
                const check = conditionComplete ? "✓" : "•";
                return (
                    <div key={condition.key + condition.name}>{check} Provide housing for everyone&nbsp;{res.housing.value}&nbsp;/&nbsp;{res.pop.value}</div>
                );
            }
            case Events.EventConditions.NO_DIALOG:
            case Events.EventConditions.HAS_FACT:
            default:
                return null;
        }
    }
    
    export function singlePriceRenderer(price:Price)
    {
        return <div key={price.resource}>{prettify(price.stat.value)}&nbsp;&nbsp;{price.resource}</div>
    }
    
    export function singlePriceLibRenderer(price:PriceLib)
    {
        const value = Events.calculateFormula(price.formula, 1);
        return <div key={price.resource}>{prettify(value)}&nbsp;&nbsp;{price.resource}</div>
    }
    
    export function singleSimplePriceRenderer(price:SimplePrice)
    {
        return <div key={price.resource}>{prettify(price.value)}&nbsp;&nbsp;{price.resource}</div>
    }
}

interface IExternalCanvasProps
{
    muid:MUID;
    width:number;
    height:number;
    onClick?: (e:any) => void;
    onDoubleClick?: (e:any) => void;
    onMouseDown?: (e:any) => void;
    onMouseUp?: (e:any) => void;
    onMouseMove?: (e:any) => void;
    onMouseEnter?: (e:any) => void;
    onMouseLeave?: (e:any) => void;
    onMouseOver?: (e:any) => void;
    onWheel?: (e:any) => void;
}

export class ManualCanvas extends React.Component<IExternalCanvasProps, any> 
{
    private muid:MUID;
    private width:MUID;
    private height:MUID;
    public ref:React.RefObject<any> = React.createRef<any>();    
    
    onClick: (e:any) => void;
    onDoubleClick: (e:any) => void;
    onMouseDown: (e:any) => void;
    onMouseUp: (e:any) => void;
    onMouseMove: (e:any) => void;
    onMouseEnter: (e:any) => void;
    onMouseLeave: (e:any) => void;
    onMouseOver: (e:any) => void;
    onWheel: (e:any) => void;

    constructor(props: any)
    {
        super(props);
        this.muid = props.muid;
        this.width = props.width;
        this.height = props.height;
        
        this.onClick = props.onClick;
        this.onDoubleClick = props.onDoubleClick;
        this.onMouseDown = props.onMouseDown;
        this.onMouseUp = props.onMouseUp;
        this.onMouseMove = props.onMouseMove;
        this.onMouseEnter = props.onMouseEnter;
        this.onMouseLeave = props.onMouseLeave;
        this.onMouseOver = props.onMouseOver;
        this.onWheel = props.onWheel;
        
    }
    
    public componentDidMount()
    {
        RC.manual.mount(this.muid, this.ref.current);
    }
    
    public componentWillUnmount()
    {
        RC.manual.unmount(this.muid);
    }

    public render() 
    {
        return <canvas ref={this.ref} 
                width={this.width} 
                height={this.height} 
                onClick={this.onClick} 
                onDoubleClick={this.onDoubleClick} 
                onMouseUp={this.onMouseUp} 
                onMouseDown={this.onMouseDown} 
                onMouseMove={this.onMouseMove} 
                onMouseEnter={this.onMouseEnter} 
                onMouseLeave={this.onMouseLeave} 
                onMouseOver={this.onMouseOver} 
                onWheel={this.onWheel}/>
    }
}


interface IIncDecPairProps 
{
    callback:Function;
    name:string;
}

export class IncDecPair extends React.Component<IIncDecPairProps, any> 
{
    handlePlus = (e:any) =>
    {
        this.props.callback(this.props.name, 1);
    }
    
    handleMinus = (e:any) =>
    {
        this.props.callback(this.props.name, -1);
    }
    
    public render() 
    {
        return (
            <div key={this.props.name}>
                <Button key="plus" bsSize="small" className="incDecButton" onClick={this.handlePlus}>+</Button>
                <Button key="minus" bsSize="small" className="incDecButton" onClick={this.handleMinus}>-</Button>
            </div>
        );
    }
}


interface IButtonWithContextProps extends ButtonProps
{
    onContextClick:Function;
    context:any;
    
    bsClass?: string;
    active?: boolean;
    block?: boolean;
    bsStyle?: string | null;
    bsSize?: Sizes;
    componentClass?: React.ReactType;
    disabled?: boolean;
}

export class ButtonWithContext extends React.Component<IButtonWithContextProps, any> 
{
    handleClick = (e:any) =>
    {
        this.props.onContextClick(this.props.context);
    }
    
    public render() 
    {
        return (
            <Button {...this.props} onClick={this.handleClick}>{this.props.children}</Button>
        );
    }
}