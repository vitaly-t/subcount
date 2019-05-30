import {Subscription} from './subscription';

/**
 * @class Observable
 * @description
 * Basic implementation of subscribing to events and triggering them.
 */
export class Observable<T = any> {
    protected subs: ((data: T) => void)[] = [];

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
        const copy = [...this.subs];
        copy.forEach((a, index) => nextCall(() => {
            a(data);
            if (index === copy.length - 1 && typeof cb === 'function') {
                cb(copy.length); // finished sending
            }
        }));
        return copy.length;
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
        const copy = [...this.subs];
        copy.forEach(a => a(data));
        return copy.length;
    }

    protected createUnsub(cb: (data: T) => void) {
        return () => {
            this.subs.splice(this.subs.indexOf(cb), 1);
        };
    }
}

// for compatibility with web browsers:
const nextCall = typeof process === 'undefined' ? setTimeout : process.nextTick;
