/**
 * @class Subscription
 * @description
 * Represents result of subscribing to an observable object,
 * to provide a safe way to unsubscribe.
 */
export class Subscription {
    private _unsub: () => void;

    constructor(unsub: () => void) {
        this._unsub = unsub;
    }

    /**
     * Unsubscribes from the observable.
     */
    public unsubscribe(): void {
        if (this._unsub) {
            this._unsub();
            this._unsub = null; // to protect from repeated calls
        }
    }
}
