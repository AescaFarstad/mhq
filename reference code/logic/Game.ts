import {
    BaseInput,
    BuildInput,
    DebugInput,
    DialogInput,
    IInput,
    InputType,
    JobAssigmentInput,
    NavTabInput,
    QuestDialogInput,
    TechHoverInput,
    TechSelectInput,
    TechStartInput,
    TechAcknowledgeInput,
    SelectPartyInput,
    PartyBuyInput,
} from './input/Input';
import { EventLib, JSONToEffectDescription } from './lib/EventLib';
import { Lib } from './lib/Lib';
import { Buildings } from './model/Buildings';
import { Dialog } from './model/Dialog';
import { Event, EventCondition, Events } from './model/Events';
import { Quests } from './model/Quests';
import { Rules } from './model/Rules';
import { ConnectionType } from './model/state/Stat';
import { State } from './model/state/State';
import { Stats } from './model/state/Stats';
import { NavTab } from './model/state/UISettings';
import { Techs } from './model/Techs';
import { Party, Scouting } from './model/Scouting';
import { SelectLandmarkInput, CreatePartyInput, PartyModfyInput, ChoosePartyTargetInput } from './input/Input';


export class Game implements IInput
{
    public state:State = new State();
    public lib:Lib = new Lib();    

    private cmd:BaseInput = null;
    private events:Array<Event>;
    
    private debugInput:Array<any> = [
        [new DialogInput(0), (state:State) => state.activeDialog ],
        new DialogInput(0),
        new DialogInput(0),
        new JobAssigmentInput("forest", 1000),
        new JobAssigmentInput("forest", -2),
        new JobAssigmentInput("bushes", 1000),            /**/
        new DebugInput([{key:"d_completeQuest"}]),
       // new NavTabInput(NavTab.TECH as any),
        new NavTabInput(NavTab.EXPLORE as any),
        new DebugInput([{key:"giveResource", resource:"science", amount:115}]),
        new DebugInput([{key:"discoverResource", resource:"science"}]),
        new DebugInput([{key:"discoverTab", name:NavTab.EXPLORE}]),
        new SelectLandmarkInput("rock"),
        new CreatePartyInput(),
        new TechSelectInput("exploration"),
        new TechStartInput(),
        [new TechAcknowledgeInput(), (state:State) => !state.tech.lastAcknowledged ], 
        new DebugInput([{key:"giveMaxResource", resource:"wood", amount:13150}]),       
        new DebugInput([{key:"giveResource", resource:"wood", amount:13150}]),
        new BuildInput("scoutLodge"),
        new BuildInput("scoutLodge"),
        new BuildInput("scoutLodge"),
        new BuildInput("scoutLodge"),
        new BuildInput("scoutLodge"),
        new PartyModfyInput("scout", 1),
        new PartyBuyInput(),
        new SelectPartyInput("0"),
        new DebugInput([{key:"giveResource", resource:"pop", amount:25}]),
        new SelectLandmarkInput("rock"),
        new CreatePartyInput()
    ]
 
    constructor() {
    }

    public init() 
    {
        this.lib.init();
        const state = this.state;

        state.unemployed = Stats.createParameter("unemployed", state.connections);
        state.partyMembersMax = Stats.createStat("partyMembersMax", state.connections);
        state.partyMembers = Stats.createStat("partyMembers", state.connections);
        state.foodConsumption = Stats.createParameter("foodConsumption", state.connections);
        state.totalFoodConsumption = Stats.createParameter("totalFoodConsumption", state.connections);

        for (let  key in (this.lib.resourceByName as any)) {
            state.resources.push(Stats.createResource(this.lib.resourceByName[key], state.connections)); 
        }
        for (let  key in (this.lib.jobByName as any)) {
            state.jobs.push(Stats.createJob(this.lib.jobByName[key], state.unemployed, state.connections));
        }
        for (let  key in (this.lib.buildingByName as any)) {
            state.buildings.push(Buildings.createBuilding(this.lib.buildingByName[key], state.connections));
        }
        for (let  key in (this.lib.techByName as any)) {
            state.techs.push(Techs.createTech(this.lib.techByName[key], state.connections));
        }
        for (let  key in (this.lib.landmarkByName as any)) {
            state.landmarks.push(Scouting.createLandmark(this.lib.landmarkByName[key]));
        }
        
        const pop = state.resources.find(res => res.name == "pop");
        const food = state.resources.find(res => res.name == "food");
        
        Stats.connectStat(pop, state.unemployed, ConnectionType.ADD, state.connections);
        Stats.connectStat(state.foodConsumption, state.totalFoodConsumption, ConnectionType.MULTY, state.connections);
        Stats.connectStat(pop, state.totalFoodConsumption, ConnectionType.ADD, state.connections);
        Stats.connectStat(state.totalFoodConsumption, food.income, ConnectionType.SUB, state.connections);
        
        Stats.modifyParameterADD(state.foodConsumption, this.lib.settings.startingFoodConsumption, state.connections);
        
        this.events = new Array<Event>();
        for (const e of this.lib.events) 
        {
            let event = new Event();
            event.lib = e;
            event.conditions = [];
            for (const condition of e.conditions) 
            {
                let con = new EventCondition();
                con.params = condition;
                con.test = Events.createCondition(condition);
                event.conditions.push(con);
            }
            this.events.push(event);
        }
        
        this.state._alt.build(this.state);
        
        
    }

    public update(time:number)
    {
        if (isNaN(this.state.dateStarted))
        {
            this.state.dateStarted = time;
            this.state.dateModified = time;
        }
        else
        {
            let diff = Math.min(time - this.state.dateModified, this.lib.settings.maxTimeAway);
            let skipTime:number = time - this.state.dateModified - diff;
            this.state.skippedTime += skipTime;
            this.state.dateModified += skipTime;
            let numSteps = Math.floor(diff / this.lib.settings.stepSize);
            for(let i = 0; i < numSteps; i++)
            {
                this.doStep(this.state, this.lib.settings.stepSize);
            }
            this.state.lastBatchDuration = numSteps * this.lib.settings.stepSize;
        }
        
    }

    public doStep(state:State, timeDelta:number)
    {
        state._lib = this.lib;


        if (this.cmd)
        {
            this.applyInput();
            this.cmd = null;
        }
        if (!this.cmd && this.debugInput.length > 0)
        {
            if (this.debugInput[0] instanceof BaseInput) 
                this.cmd = this.debugInput.splice(0, 1)[0];
            else if (this.debugInput[0][1](this.state))
                this.cmd = this.debugInput.splice(0, 1)[0][0];
        }
        
        for (const res of state.resources) 
        {
            Stats.updateResource(res, timeDelta);
        }
        
        Rules.avoidStarving(state);
        
        Techs.updateResearch(state, timeDelta);
        Scouting.updateScouting(state, timeDelta);
            
        
        for (const e of this.events) 
        {
            let success = true;
            for (const trigger of e.conditions) 
            {
                if (!trigger.test(state, trigger.params))
                {
                    success = false;
                    break;
                }
            }
            if (success)
            {
                console.log("Event: " + e.lib.name);
                state.passedEvents.push(e.lib.name);
                for (const eff of e.lib.effects) 
                {
                    Events.execEffect(eff, state);    
                }
                this.events.splice(this.events.indexOf(e), 1);
                break;
            }
        }
        
        for (const q of this.state.activeQuests) 
        {
            let qLib:EventLib = this.lib.questsByName[q];
            let success = true;
            for (const trigger of qLib.conditions) 
            {                
                if (!Events.createCondition(trigger)(this.state, trigger))
                {
                    success = false;
                    break;
                }
            }
            if (success)
            {
                Quests.completeQuest(q, this.state);
                break;//must break;
            }
        }

        state.numSteps++;
        state.dateModified += timeDelta;
    }

    public pushInput(cmd:BaseInput)
    {
        if (this.cmd)
        {
            console.log("Already has input this frame. Ignored." + this.state.numSteps);
        }
        else
        {
            this.cmd = cmd;
        }
    }

    private applyInput()
    {
        console.log("Input: " + JSON.stringify(this.cmd, null, 4));
        const cmd = this.cmd;
        const state = this.state;
        
        switch(cmd.type)
        {
            case InputType.DIALOG:
                Dialog.applyAction(this.state, (cmd as DialogInput).actionIndex);
                break;
            case InputType.NAV_TAB:
                this.state.ui.activeTab = (this.state, (cmd as NavTabInput).activeTab) as any;
                state.tech.lastTechChange = state.dateModified;
                break;
            case InputType.JOB_ASSIGMENT:
                let input = cmd as JobAssigmentInput;
                Stats.employ(input.job, input.amount, state);
                break;
            case InputType.BUILD:
                Buildings.build(state.buildings.find(b => b.name == (cmd as BuildInput).building), state);
                break;
            case InputType.QUEST_DIALOG:
                if (!Dialog.hasActiveDialog(state))
                    Dialog.startDialog(state, this.lib.dialogByName[(cmd as QuestDialogInput).dialog]);
                break;
            case InputType.DEBUG:
                let effects = JSONToEffectDescription((cmd as DebugInput).cmd);
                effects.forEach(e => Events.execEffect(e, state));
                break;
            case InputType.TECH_HOVER:
                state.tech.hoverTech = (cmd as TechHoverInput).tech;
                state.tech.lastTechChange = state.dateModified;
                break;
            case InputType.TECH_SELECT:
                state.tech.selectedTech = (cmd as TechSelectInput).tech;
                state.tech.lastTechChange = state.dateModified;
                break;
            case InputType.TECH_START:
                const tech = state.techs.find(t => t.name == state.tech.selectedTech);
                if (state.tech.selectedTech && Techs.canAfford(tech, state, this.lib))
                    Techs.startResearch(tech, state);
                break;
            case InputType.TECH_ACKNOWLEDGE:
                Techs.acknowledge(state.tech);
                break;
            case InputType.SELECT_LANDMARK:
                state.ui.selectedLandmark = (cmd as SelectLandmarkInput).landmark;
                state.ui.selectedParty = null;
                state.ui.isChoosingDestination = false;
                Scouting.updateAlternatives(state);
                break;
            case InputType.CREATE_PARTY:
                state.ui.isCreatingParty = true;
                break;
            case InputType.PARTY_BUY:
                Scouting.createParty(state);
                state.ui.isCreatingParty = false;
                break;
            case InputType.PARTY_CANCEL:
                state.ui.isCreatingParty = false;
                Scouting.resetParty(state);
                break;
            case InputType.PARTY_RESET:
                Scouting.resetParty(state);
                break;
            case InputType.PARTY_MODIFY:
                const pmi = cmd as PartyModfyInput;
                Scouting.modifyParty(pmi.member, pmi.delta, state);
                break;
            case InputType.SELECT_PARTY:
                const spi = cmd as SelectPartyInput;
                state.ui.selectedParty = spi.party;
                state.ui.selectedLandmark = null;
                state.ui.isChoosingDestination = false;
                Scouting.updateAlternatives(state);
                break;
            case InputType.SET_OUT_PARTY:
                state.ui.isChoosingDestination = true;
                break;
            case InputType.CHOOSE_TARGET_PARTY:
                const cpti = cmd as ChoosePartyTargetInput;
                const party = state.parties.find(p => p.name == state.ui.selectedParty);
                party.destination = cpti.landmark;
                state.ui.isChoosingDestination = false;
                state.ui.selectedParty = null;
                break;
            default:
                console.log("Input type not implemented: " + this.cmd.type);
        }
    }

    public startGame(state:State)
    {
        console.log("game start");
        
    }
}