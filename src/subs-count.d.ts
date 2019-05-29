export declare class Subscription {
    private unsub;
    constructor(unsub: () => void);
    unsubscribe(): void;
}
export declare class Observable<T = any> {
    protected subs: ((data: T) => void)[];
    subscribe(cb: (data: T) => void): Subscription;
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
    next(data: T, cb?: (count: number) => void): number;
    /**
     * Synchronous data broadcast.
     *
     * @param data
     * Data to be sent, according to the type template.
     *
     * @returns {number}
     * Number of clients that received the data.
     */
    nextSync(data: T): number;
    protected createUnsub(cb: (data: T) => void): () => void;
}
export interface ISubsCount {
    newCount: number;
    prevCount: number;
}
/**
 * Observable, with support for the subscription count monitoring.
 */
export declare class CountedObservable<T = any> extends Observable<T> {
    protected send: (data: any) => number;
    /**
     * Event onCount(({newCount, prevCount})=>void)
     */
    readonly onCount: Observable<ISubsCount>;
    /**
     * Constructor.
     *
     * @param {} [options]
     *
     * @param {boolean} [options.sync=false]
     * Makes onCount calls synchronous.
     */
    constructor(options?: {
        sync?: boolean;
    });
    protected createUnsub(cb: (data: T) => void): () => void;
}
