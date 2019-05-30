/**
 * @class Subscription
 * @description
 * Represents result of subscribing to an observable object,
 * to provide a safe way to unsubscribe.
 */
export class Subscription {
    private unsub: () => void;

    constructor(unsub: () => void) {
        this.unsub = unsub;
    }

    /**
     * Unsubscribes from the observable.
     */
    public unsubscribe(): void {
        if (this.unsub) {
            this.unsub();
            this.unsub = null; // to protect from repeated calls
        }
    }
}
