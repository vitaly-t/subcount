import {Subscription} from './subscription';

/**
 * @interface IObservableOptions
 * @description
 * Constructor options for the `Observable` class.
 */
export interface IObservableOptions {
    /**
     * Maximum number of subscribers that can receive data.
     * Default is 0, meaning "no limit applies"
     */
    max?: number;
}

/**
 * Subscription callback function type.
 */
export type SubFunction<T> = (data: T) => any;

/**
 * @class Observable
 * @description
 * Basic implementation of subscribing to events and triggering them.
 */
export class Observable<T = any> {

    /**
     * Maximum number of subscribers that can receive data.
     * 0 = "no limit applies"
     */
    readonly max: number;

    protected _subs: SubFunction<T>[] = [];

    /**
     * @constructor
     *
     * @param {IObservableOptions} [options]
     * Configuration Options.
     */
    constructor(options?: IObservableOptions) {
        this.max = options && options.max > 0 ? options.max : 0;
    }

    /**
     * Subscribes for receiving all data events.
     *
     * @param {Function} cb
     * Data notification callback function.
     *
     * @returns {Subscription}
     * Object for unsubscribing safely.
     */
    public subscribe(cb: SubFunction<T>): Subscription {
        this._subs.push(cb);
        return new Subscription(this.createUnsub(cb));
    }

    /**
     * Asynchronous data broadcast to all subscribers.
     *
     * @param {} data
     * Data to be sent, according to the type template.
     *
     * @param {Function} [cb]
     * Optional callback function to be notified when the last recipient has received the data.
     * The function takes one parameter - total number of clients that received the data.
     *
     * @returns {number}
     * Number of clients that will be receiving the data.
     */
    public next(data: T, cb?: (count: number) => void): number {
        const r = this._getRecipients();
        r.forEach((sub, index) => nextCall(() => {
            sub(data);
            if (index === r.length - 1 && typeof cb === 'function') {
                cb(r.length); // finished sending
            }
        }));
        return r.length;
    }

    /**
     * Safe asynchronous data broadcast to all subscribers.
     *
     * Errors from subscription callbacks are passed into the callback function,
     * which handles both synchronous and asynchronous subscription functions.
     *
     * @param {} data
     * Data to be sent, according to the type template.
     *
     * @param {Function} onError
     * Callback for handling errors from subscribers.
     *
     * @returns {number}
     * Number of clients that will be receiving the data.
     */
    public nextSafe(data: T, onError: (err: any) => void): number {
        const r = this._getRecipients();
        r.forEach(sub => nextCall(() => {
            try {
                const res = sub(data);
                if (res && typeof res.catch === 'function') {
                    res.catch(onError);
                }
            } catch (e) {
                onError(e);
            }
        }));
        return r.length;
    }

    /**
     * Synchronous data broadcast to all subscribers.
     *
     * @param {} data
     * Data to be sent, according to the type template.
     *
     * @returns {number}
     * Number of clients that have received the data.
     */
    public nextSync(data: T): number {
        const r = this._getRecipients();
        r.forEach(sub => sub(data));
        return r.length;
    }

    /**
     * Current number of subscribers.
     */
    public get count(): number {
        return this._subs.length;
    }

    /**
     * Gets all recipients that must receive data.
     *
     * It returns a copy of subscribers array for safe iteration, while applying the
     * maximum limit when it is set with the `max` option.
     */
    private _getRecipients(): SubFunction<T>[] {
        const end = this.max ? this.max : this._subs.length;
        return this._subs.slice(0, end);
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
    protected createUnsub(cb: SubFunction<T>): () => void {
        return () => {
            this._subs.splice(this._subs.indexOf(cb), 1);
        };
    }
}

// for compatibility with web browsers:
const nextCall = typeof process === 'undefined' ? setTimeout : process.nextTick;
