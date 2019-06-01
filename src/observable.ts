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
    readonly max: number;
    protected subs: SubFunction<T>[] = [];

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
     * Subscribes for receiving data events triggered by methods `next` and `nextSync`.
     *
     * @param cb
     * Data notification callback function.
     *
     * @returns {Subscription}
     * Object to let unsubscribe safely.
     */
    public subscribe(cb: SubFunction<T>): Subscription {
        this.subs.push(cb);
        return new Subscription(this.createUnsub(cb));
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
    public next(data: T, cb?: (count: number) => void): number {
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
    public nextSync(data: T): number {
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
    public nextSafe(data: T, onError: (error: any) => void): number {
        const r = this.getRecipients();
        r.forEach(func => nextCall(() => {
            try {
                const res = func(data);
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
     * Gets all recipients that must receive data sent by methods `next` and `nextSync`.
     *
     * It returns a copy of subscribers array for safe iteration, while applying the
     * maximum limit when it is set with the `max` option.
     */
    private getRecipients(): SubFunction<T>[] {
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
    protected createUnsub(cb: SubFunction<T>): () => void {
        return () => {
            this.subs.splice(this.subs.indexOf(cb), 1);
        };
    }
}

// for compatibility with web browsers:
const nextCall = typeof process === 'undefined' ? setTimeout : process.nextTick;
