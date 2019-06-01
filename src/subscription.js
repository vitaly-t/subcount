"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Subscription
 * @description
 * Represents result of subscribing to an observable object,
 * to provide a safe way to unsubscribe.
 */
class Subscription {
    constructor(unsub) {
        this.unsub = unsub;
    }
    /**
     * Unsubscribes from the observable.
     */
    unsubscribe() {
        if (this.unsub) {
            this.unsub();
            this.unsub = null; // to protect from repeated calls
        }
    }
}
exports.Subscription = Subscription;
