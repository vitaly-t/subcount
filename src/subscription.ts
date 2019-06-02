/**
 * @class Subscription
 * @description
 * Represents result of subscribing to an observable object, to provide a safe way to unsubscribe.
 */
export class Subscription {
    private _unsub: () => void;

    constructor(unsub: () => void, sub: { cancel: () => void }) {
        this._unsub = unsub;
        sub.cancel = () => {
            // Observable cancels subscription:
            this._unsub = null;
        };
    }

    /**
     * Indicates whether the subscription is live / active.
     *
     * It can be useful for subscribers, if `unsubscribe` or `unsubscribeAll`
     * can be used without their knowledge.
     */
    public get live(): boolean {
        return !!this._unsub;
    }

    /**
     * Unsubscribes a live subscription from the observable.
     */
    public unsubscribe(): void {
        if (this._unsub) {
            this._unsub();
            this._unsub = null; // to protect from repeated calls
        }
    }

}
