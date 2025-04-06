
export class Signal
{
    private subscribers:Array<Function> = new Array<Function>();
    private dispatchInProgress:boolean = false;
    private newSubscribers:Array<Function> = new Array<Function>();

    public subscribe(callback:Function)
    {
        if (this.dispatchInProgress)
        {
            console.assert(this.subscribers.indexOf(callback) == -1, "This callback is already present in the subscribers list.");
            console.assert(this.newSubscribers.indexOf(callback) == -1, "This callback is already present in the newSubscribers list.");
            this.newSubscribers.push(callback);
        }
        else
        {
            console.assert(this.subscribers.indexOf(callback) == -1, "This callback is already present in the subscribers list.");
            this.subscribers.push(callback);
        }
    }

    public unsubscribe(callback:Function)
    {
        if (this.dispatchInProgress)
        {
            let index = this.subscribers.indexOf(callback);
            if (index < 0)
                var indexNew = this.newSubscribers.indexOf(callback);
                console.assert(index < 0 != indexNew < 0, "Problems unsubscribing");
            if (index >= 0)
                this.subscribers.splice(index, 1); //TODO nosplice
            if (indexNew >= 0)
                this.newSubscribers.splice(index, 1);
        }
        else
        {
            let index = this.subscribers.indexOf(callback);
            console.assert(index >= 0 , "Not subscribed to the signal");
            this.subscribers.splice(index, 1); //TODO nosplice
        }
    }

    public dispatch()
    {
        this.dispatchInProgress = true;
        for (let index = 0; index < this.subscribers.length; index++) {
            this.subscribers[index]();
        }
        this.dispatchInProgress = false;

        if (this.newSubscribers.length > 0)
        {
            this.subscribers = this.subscribers.concat(this.newSubscribers);
            this.newSubscribers = new Array<Function>()
        }
    }
}