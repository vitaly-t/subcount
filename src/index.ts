export class Subscription {
    private unsub: () => void;

    constructor(unsub: () => void) {
        this.unsub = unsub;
    }

    public unsubscribe(): void {
        if (this.unsub) {
            this.unsub();
            this.unsub = null;
        }
    }
}

export class Observable<T = any> {
    protected subs: ((data: T) => void)[] = [];

    public subscribe(cb: (data: T) => void): Subscription {
        this.subs.push(cb);
        return new Subscription(this.createUnsub(cb));
    }

    /**
     * Asynchronous data broadcast, in a separate processor tick
     * for each recipient.
     *
     * @param data
     * Data to be sent, according to the type template.
     *
     * @param {Function} [cb]
     * Optional callback function to be notified when the last
     * recipient has received the data. The function takes one
     * parameter - total number of clients that received the data.
     *
     * @returns {number}
     * Number of clients that will be receiving the data.
     */
    public next(data: T, cb?: (count: number) => void): number {
        const copy = [...this.subs];
        copy.forEach((a, index) => process.nextTick(() => {
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

export interface ISubsCount {
    newCount: number;
    prevCount: number;
}

/**
 * Observable, with support for the subscription count monitoring.
 */
export class CountedObservable<T = any> extends Observable<T> {
    protected send: (data: any) => number;

    /**
     * Event onCount(({newCount, prevCount})=>void)
     */
    readonly onCount: Observable<ISubsCount> = new Observable();

    /**
     * Constructor.
     *
     * @param {boolean} [sync=false]
     * Makes onCount calls synchronous.
     */
    constructor(sync: boolean = false) {
        super();
        const c = this.onCount;
        this.send = (sync ? c.nextSync : c.next).bind(c);
    }

    protected createUnsub(cb: (data: T) => void) {
        const s = this.subs;
        this.send({newCount: s.length, prevCount: s.length - 1});
        return () => {
            s.splice(s.indexOf(cb), 1);
            this.send({newCount: s.length, prevCount: s.length + 1});
        };
    }
}
