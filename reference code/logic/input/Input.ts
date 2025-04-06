let idCounter = 0;

export interface IInput
{
    pushInput(cmd:BaseInput);
}

export enum InputType {
    INVALID,
    DIALOG,
    NAV_TAB,
    JOB_ASSIGMENT,
    BUILD,
    QUEST_DIALOG,
    DEBUG,
    TECH_HOVER,
    TECH_SELECT,
    TECH_START,
    TECH_ACKNOWLEDGE,
    SELECT_LANDMARK,
    CREATE_PARTY,
    PARTY_MODIFY,
    PARTY_BUY,
    PARTY_CANCEL,
    PARTY_RESET,
    SELECT_PARTY,
    SET_OUT_PARTY,
    CHOOSE_TARGET_PARTY
}

export class BaseInput
{
    public id:number;
    public type:InputType;

    constructor()
    {
        this.id = idCounter++;
    }
}

export class DialogInput extends BaseInput
{
    public actionIndex:number;

    constructor(actionIndex:number)
    {
        super();
        this.type = InputType.DIALOG;
        this.actionIndex = actionIndex;
    }
}

export class NavTabInput extends BaseInput
{
    public activeTab:number;

    constructor(activeTab:number)
    {
        super();
        this.type = InputType.NAV_TAB;
        this.activeTab = activeTab;
    }
}

export class JobAssigmentInput extends BaseInput
{
    public job:string;
    public amount:number;

    constructor(job:string, amount:number)
    {
        super();
        this.type = InputType.JOB_ASSIGMENT;
        this.job = job;
        this.amount = amount;
    }
}

export class BuildInput extends BaseInput
{
    public building:string;

    constructor(building:string)
    {
        super();
        this.type = InputType.BUILD;
        this.building = building;
    }
}

export class QuestDialogInput extends BaseInput
{
    public dialog:string;

    constructor(dialog:string)
    {
        super();
        this.type = InputType.QUEST_DIALOG;
        this.dialog = dialog
    }
}

export class DebugInput extends BaseInput
{
    public cmd:any;

    constructor(cmd:any)
    {
        super();
        this.type = InputType.DEBUG;
        this.cmd = cmd
    }
}

export class TechHoverInput extends BaseInput
{
    public tech:string;

    constructor(tech:string)
    {
        super();
        this.type = InputType.TECH_HOVER;
        this.tech = tech;
    }
}

export class TechSelectInput extends BaseInput
{
    public tech:string;

    constructor(tech:string)
    {
        super();
        this.type = InputType.TECH_SELECT;
        this.tech = tech;
    }
}


export class TechStartInput extends BaseInput
{
    constructor()
    {
        super();
        this.type = InputType.TECH_START;
    }
}

export class TechAcknowledgeInput extends BaseInput
{
    constructor()
    {
        super();
        this.type = InputType.TECH_ACKNOWLEDGE;
    }
}

export class SelectLandmarkInput extends BaseInput
{
    public landmark:string;

    constructor(landmark:string)
    {
        super();
        this.type = InputType.SELECT_LANDMARK;
        this.landmark = landmark;
    }
}

export class CreatePartyInput extends BaseInput
{
    constructor()
    {
        super();
        this.type = InputType.CREATE_PARTY;
    }
}

export class PartyModfyInput extends BaseInput
{
    public member:string;
    public delta:number;
    
    constructor(member:string, delta:number)
    {
        super();
        this.type = InputType.PARTY_MODIFY;
        this.member = member;
        this.delta = delta;
    }
}

export class PartyBuyInput extends BaseInput
{
    constructor()
    {
        super();
        this.type = InputType.PARTY_BUY;
    }
}

export class PartyCancelInput extends BaseInput
{
    constructor()
    {
        super();
        this.type = InputType.PARTY_CANCEL;
    }
}


export class PartyResetInput extends BaseInput
{
    constructor()
    {
        super();
        this.type = InputType.PARTY_RESET;
    }
}

export class SelectPartyInput extends BaseInput
{
    party:string
    
    constructor(party:string)
    {
        super();
        this.type = InputType.SELECT_PARTY;
        this.party = party;
    }
}

export class SetOutInput extends BaseInput
{
    constructor()
    {
        super();
        this.type = InputType.SET_OUT_PARTY;
    }
}

export class ChoosePartyTargetInput extends BaseInput
{
    public landmark:string;

    constructor(landmark:string)
    {
        super();
        this.type = InputType.CHOOSE_TARGET_PARTY;
        this.landmark = landmark;
    }
}