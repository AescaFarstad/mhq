import * as L from 'leaflet';
import * as React from 'react';
import { Map, TileLayer, Marker, Popup, Pane, Rectangle, Polyline } from 'react-leaflet';

import { State } from '../logic/model/state/State';
import { LatLng, Point } from 'leaflet';
import { Lib } from '../logic/lib/Lib';
import { RC } from '../Global';
import { Landmark, Party, Scouting } from '../logic/model/Scouting';
import { UISettings, SelectAlternatives, MapEntityType } from '../logic/model/state/UISettings';
import * as Button from 'react-bootstrap/lib/Button';
import { CreatePartyInput, SelectLandmarkInput, SelectPartyInput, SetOutInput, ChoosePartyTargetInput } from '../logic/input/Input';
import { renderToStaticMarkup } from 'react-dom/server';
import { PartyView, PartyCreateView } from './PartyView';
import { LandmarkLib } from '../logic/lib/MapLib';


export class Explore extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props); 
    }
  
    private get s():State {return this.props.state} 
    
    getUI()
    {
        if (this.s.ui.selectedParty)
            return <PartyUI state={this.s}/>
        else if (this.s.ui.selectedLandmark)
            return <LandmarkUI state={this.s}/> 
        else
            return null;
    }
    
    
    public render() 
    {
        if (this.s.ui.isCreatingParty)
            return (
                <div className="navTabContent">
                    <PartyCreateView state={this.s}/>
                </div>
            )
        else        
            return (
                <div className="navTabContent" style={{position:"relative"}}>
                    <Leaflet landmarks={this.s.landmarks} parties={this.s.parties} ui={this.s.ui}/>
                    {this.getUI()}                    
                </div>
            )
       
    }
}

    
    
class Leaflet extends React.Component<any, any> {
    state = {
        lat: -200,
        lng: 200,
        zoom: 2,
        mlat:0,
        mlng:0,
        msg:""
    }
    
    landmarkIcon = new L.DivIcon({
        html: renderToStaticMarkup( <img src="ore_diamond.png" className="landmark-icon"/>),
    });
    landmarkIconSelected = new L.DivIcon({
        html: renderToStaticMarkup( <img src="ore_diamond2.png" className="landmark-icon"/>),
    });
    
    partyIcon = new L.DivIcon({
        html: renderToStaticMarkup( <img src="scout.png" className="landmark-icon"/>),
    });
    partyIconSelected = new L.DivIcon({
        html: renderToStaticMarkup( <img src="scout_s.png" className="landmark-icon"/>),
    });
    
    private get ui():UISettings {return this.props.ui} 
    
    ref:any = React.createRef();
    
    mapItemById = {};
  
  
    onMouseMove = (e:any) => {
        //let center:LatLng = (e.target as any).getCenter();
        let center:LatLng = e.latlng;
        this.setState({mlat:center.lat, mlng:center.lng, msg:"a"});
        //JSON.stringify(this.ref ? this.ref.current.getTileSize() : 
    } 
    
    onMarkerClick = (e:any) => {        
        const landmark:Landmark = this.mapItemById[e.target.options.id];
        
        if (this.ui.isChoosingDestination)
            RC.input.pushInput(new ChoosePartyTargetInput(landmark.name))
        else
            RC.input.pushInput(new SelectLandmarkInput(landmark.name))
            
        this.setState({mlat:e.latlng.lat, mlng:e.latlng.lng, msg:landmark.name});
    }
    
    onMapClick = (e:any) => {
        if (this.ui.selectedLandmark)
            RC.input.pushInput(new SelectLandmarkInput(null));
        else if (this.ui.selectedParty)
            RC.input.pushInput(new SelectPartyInput(null));
    }
    
    onPartyClick = (e:any) => {
        const party:Party = this.mapItemById[e.target.options.id];
        RC.input.pushInput(new SelectPartyInput(party.name));
        
    }
    
    onMouseEnter = (e:any) => {
        console.log("on mouse enter");
    }
    
    onCreateParty = (e:any) => {
        console.log("crate party");
        RC.input.pushInput(new CreatePartyInput());
    }
 
    render() {
            //L.DomUtil.TRANSITION = "none";
            const position = [this.state.lat, this.state.lng]
            const res = 90;
            return (
                <div className="mapContainer">
                    <div>{this.state.mlat.toFixed(0) + " | " + this.state.mlng.toFixed(0) + " | " + this.state.msg}</div>
                    <Map className="leafletMap" 
                            center={position as any} 
                            zoom={this.state.zoom} 
                            crs={L.CRS.Simple} 
                            maxZoom={4} 
                            minZoom={1} 
                            animate={false} 
                            duration={1}
                            inertia={true}
                            attributionControl={false}
                            maxBoundsViscosity={0.97}
                            onMouseMove={this.onMouseMove}
                            onClick={this.onMapClick}
                            maxBounds={[[-350 + res, -100 + res],[100 - res, 350 - res]]}>
                        <TileLayer ref={this.ref} url="map/mapTile_{x}_{y}.jpg" maxNativeZoom={3} minNativeZoom={3}/> 
                        {this.props.landmarks.map(this.landMarker)}
                        {this.props.parties.map(this.party)}
                        {this.activePaths()}
                    </Map>
            </div>
            )
        }
  //{this.props.landmarks.map(this.landMarker)}
    landMarker = (landmark:Landmark) =>
    {
        const coords:Point = RC.lib.landmarkByName[landmark.name].coords;
        this.mapItemById["l_" + landmark.name] = landmark;
        if (this.ui.selectedLandmark == landmark.name)
        {
            return <Marker 
                    options={{id:"l_" + landmark.name}} 
                    key={landmark.name} 
                    icon={this.landmarkIconSelected} 
                    position={[coords.x, coords.y]}  
                    title={landmark.name} 
                    id={"l_" + landmark.name}/>
        }
        else
        {
            return <Marker 
                    options={{id:"l_" + landmark.name}} 
                    key={landmark.name} 
                    icon={this.landmarkIcon} 
                    position={[coords.x, coords.y]} 
                    onClick={this.onMarkerClick} 
                    title={landmark.name} 
                    id={"l_" + landmark.name}/>
        }
    } 
    
    party = (p:Party) =>
    {        
        this.mapItemById["p_" + p.name] = p;
        if (this.ui.selectedParty == p.name)
        {
            return <Marker 
                    options={{id:"p_" + p.name}} 
                    key={p.name} 
                    icon={this.partyIconSelected} 
                    position={[p.location.x, p.location.y]}  
                    title={p.name}  
                    id={"p_" + p.name}/>
        }
        else
        {
            return <Marker 
                    options={{id:"p_" + p.name}} 
                    key={p.name} 
                    icon={this.partyIcon} 
                    position={[p.location.x, p.location.y]} 
                    onClick={this.ui.isChoosingDestination ? null : this.onPartyClick} 
                    title={p.name} 
                    id={"p_" + p.name}/>
        }
    }
    
    landmarkLocIndex(x:number, y:number)
    {
        return x * RC.lib.settings.mapMaxSize + y;
    }
    
    activePaths()
    {
        if (!this.ui.isChoosingDestination)
            return null;
        const party:Party = this.props.parties.find(p => p.name == this.ui.selectedParty);
        //console.log([party.location.x, party.location.y, this.state.lat, this.state.lng]);
        return (
            <Polyline color="lime" positions={[[party.location.x, party.location.y], [this.state.mlat, this.state.mlng]]} />
        )
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

class LandmarkUI extends React.Component<any, any> {
    
    private get ui():UISettings {return this.props.state.ui} 
    
    onCreateParty = (e:any) => {
        console.log("crate party");
        RC.input.pushInput(new CreatePartyInput());
    }
 
    render() {
            return (
                <div className="mapUIWrapper">
                    <div className="mapUI">
                        <div key="title" className="mapUITitle">{this.ui.selectedLandmark}</div>
                        <hr className="narrow"/>
                        <div key="descrition" className="mapUIDescription">Everything the light touches needs to be watered. Daily. Get to work.</div>
                        <hr className="narrow"/>
                        {this.getActions()}
                       
                    </div>
                    <AlternativesUI alternatives={this.ui.alternatives}/>
                </div>
            )
        }
        
    getActions()
    {
        const lib:LandmarkLib = RC.lib.landmarkByName[this.ui.selectedLandmark];
        if (lib.isBase)
            return (
                        <div key="actionStack" className="mapUIActionStack">
                            <Button onClick={this.onCreateParty}>Create party</Button>
                        </div>
            )
        const nearbyParties = Scouting.findPartiesNearby(lib.coords, this.props.state);
        if (nearbyParties.length == 0)
            return null;
        
        return (
                        <div key="actionStack" className="mapUIActionStack">
                            <Button>Investigate</Button>
                        </div>
        )
    }
}

class PartyUI extends React.Component<any, any> {
    
    private get ui():UISettings {return this.props.state.ui} 
    private get s():State {return this.props.state} 
    
    onGoParty = (e:any) => {
        console.log("go party");
        RC.input.pushInput(new SetOutInput());
    }
    
    destination()
    {
        const party = this.s.parties.find(p => p.name == this.ui.selectedParty);
        if (party.destination)
            return <div key="destination">On the way to: {party.destination}</div>
        else
            return null;
    }
 
    render() {
        const party = this.s.parties.find(p => p.name == this.ui.selectedParty);
        const members = [];
        
        for (let  key in (party.members as any)) {
            members.push(<div key={key}>{key}: {party.members[key]}</div>);
        }
        
            return (
                <div className="mapUIWrapper">
                    <div className="mapUI">
                        <div key="title" className="mapUITitle">{this.ui.selectedParty}</div>
                        <hr className="narrow"/>
                        <div key="descrition" className="mapUIDescription">{members}</div>
                        <hr className="narrow"/>
                        {this.destination()}
                        <div key="actionStack" className="mapUIActionStack">
                            <Button onClick={this.onGoParty}>Set out</Button>
                        </div>
                    </div>
                    <AlternativesUI alternatives={this.ui.alternatives}/>
                </div>
            )
        }
}

class AlternativesUI extends React.Component<any, any> {
    
    private get alternatives():Array<SelectAlternatives> {return this.props.alternatives}
    
    onSelect = (e:any) => {  
        const index = parseInt((e.target.id as string).substr(7));
        const ent = this.alternatives[index];
        if (ent.type == MapEntityType.LANDMARK)
            RC.input.pushInput(new SelectLandmarkInput(ent.name));
        else
            RC.input.pushInput(new SelectPartyInput(ent.name));
    }
 
    render() {
            if (this.alternatives.length == 0)
                return null;
                
            return (
                <div className="mapUI">
                    <div key="title" className="large">Other entities nearby:</div>
                    <br/>
                    {this.alternatives.map((a, index) => <Button className="alternativeButton" key={index} id={"alt_ent" + index} onClick={this.onSelect}> Select {a.type} {a.name}</Button>)}
                </div>
            )
        }
}


    


