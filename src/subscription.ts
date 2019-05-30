export class Subscription {
    private unsub: () => void;

    constructor(unsub: () => void) {
        this.unsub = unsub;
    }

    public unsubscribe(): void {
        if (this.unsub) {
            this.unsub();
            this.unsub = null; // to protect from repeated calls
        }
    }
}
