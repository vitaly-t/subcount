"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_1 = require("./subscription");
/**
 * @class Observable
 * @description
 * Basic implementation of subscribing to events and triggering them.
 */
class Observable {
    /**
     * @constructor
     *
     * @param {IObservableOptions} [options]
     * Configuration Options.
     */
    constructor(options) {
        this.subs = [];
        this.max = options && options.max > 0 ? options.max : 0;
    }
    /**
     * Subscribes for receiving data events triggered by methods `next` and `nextSync`.
     *
     * @param cb
     * Data notification callback function.
     *
     * @returns {Subscription}
     * Object to let unsubscribe safely.
     */
    subscribe(cb) {
        this.subs.push(cb);
        return new subscription_1.Subscription(this.createUnsub(cb));
    }
    /**
     * Asynchronous data broadcast to all subscribed clients.
     *
     * It is triggered within a separate `nextTick` for each client under Node.js,
     * and within `setTimeout` when running in web browsers.
     *
     * @param {} data
     * Data to be sent, according to the type template.
     *
     * @param {(count: number) => void} [cb]
     * Optional callback function to be notified when the last recipient has received the data.
     * The function takes one parameter - total number of clients that received the data.
     *
     * @returns {number}
     * Number of clients that will be receiving the data.
     */
    next(data, cb) {
        const r = this.getRecipients();
        r.forEach((func, index) => nextCall(() => {
            func(data);
            if (index === r.length - 1 && typeof cb === 'function') {
                cb(r.length); // finished sending
            }
        }));
        return r.length;
    }
    /**
     * Synchronous data broadcast.
     *
     * @param {} data
     * Data to be sent, according to the type template.
     *
     * @returns {number}
     * Number of clients that have received the data.
     */
    nextSync(data) {
        const r = this.getRecipients();
        r.forEach(cb => cb(data));
        return r.length;
    }
    /**
     * Provided safety features:
     *
     * 1. Streams all errors into the callback
     * 3. Handles asynchronous callbacks
     *
     * @param data
     *
     * @param onError
     */
    nextSafe(data, onError) {
        const r = this.getRecipients();
        r.forEach(func => nextCall(() => {
            try {
                const res = func(data);
                if (res && typeof res.catch === 'function') {
                    res.catch(onError);
                }
            }
            catch (e) {
                onError(e);
            }
        }));
        return r.length;
    }
    /**
     * Gets all recipients that must receive data sent by methods `next` and `nextSync`.
     *
     * It returns a copy of subscribers array for safe iteration, while applying the
     * maximum limit when it is set with the `max` option.
     */
    getRecipients() {
        const end = this.max ? this.max : this.subs.length;
        return this.subs.slice(0, end);
    }
    /**
     * Creates unsubscribe callback function for the `Subscription` class.
     *
     * @param {SubFunction} cb
     * Subscription callback function.
     *
     * @returns {Function}
     * Function that implements the unsubscribe request.
     */
    createUnsub(cb) {
        return () => {
            this.subs.splice(this.subs.indexOf(cb), 1);
        };
    }
}
exports.Observable = Observable;
// for compatibility with web browsers:
const nextCall = typeof process === 'undefined' ? setTimeout : process.nextTick;
