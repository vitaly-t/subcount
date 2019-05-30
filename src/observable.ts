import {Subscription} from './subscription';

/**
 * @class Observable
 * @description
 * Basic implementation of subscribing to events and triggering them.
 */
export class Observable<T = any> {
    readonly max: number;
    protected subs: ((data: T) => void)[] = [];

    /**
     * @constructor
     *
     * @param {} [options]
     * Configuration options.
     *
     * @param {number} [options.max = 0]
     * Maximum number of subscribers that can receive data.
     * Default is 0, meaning "no limit applies"
     */
    constructor(options?: { max?: number }) {
        this.max = (options && options.max > 0) ? options.max : 0;
    }

    public subscribe(cb: (data: T) => void): Subscription {
        this.subs.push(cb);
        return new Subscription(this.createUnsub(cb));
    }

    /**
     * Asynchronous data broadcast, in a separate processor tick for each recipient.
     *
     * @param data
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
        const r = this.getRecipients();
        r.forEach((a, index) => nextCall(() => {
            a(data);
            if (index === r.length - 1 && typeof cb === 'function') {
                cb(r.length); // finished sending
            }
        }));
        return r.length;
    }

    /**
     * Synchronous data broadcast.
     *
     * @param data
     * Data to be sent, according to the type template.
     *
     * @returns {number}
     * Number of clients that received the data.
     */
    public nextSync(data: T): number {
        const r = this.getRecipients();
        r.forEach(a => a(data));
        return r.length;
    }

    private getRecipients(): ((data: T) => void)[] {
        const end = this.max ? this.max : this.subs.length;
        return this.subs.slice(0, end);
    }

    protected createUnsub(cb: (data: T) => void) {
        return () => {
            this.subs.splice(this.subs.indexOf(cb), 1);
        };
    }
}

// for compatibility with web browsers:
const nextCall = typeof process === 'undefined' ? setTimeout : process.nextTick;
