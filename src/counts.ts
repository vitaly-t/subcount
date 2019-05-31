import {IObservableOptions, Observable, SubFunction} from './observable';

/**
 * @interface ISubCounts
 * @description
 * Type used for `onCount` subscriptions.
 */
export interface ISubCounts {
    newCount: number;
    prevCount: number;
}

/**
 * @interface ICountedOptions
 * @description
 * Constructor options for the `CountedObservable` class.
 */
export interface ICountedOptions extends IObservableOptions {
    /**
     * Makes `onCount` calls synchronous. Default is false.
     */
    sync?: boolean;
}

/**
 * @class CountedObservable
 * @description
 * Extends `Observable` with `onCount` event to monitor subscriptions count.
 */
export class CountedObservable<T = any> extends Observable<T> {
    protected send: (data: any) => number;

    /**
     * Event onCount(({newCount, prevCount}) => void)
     */
    readonly onCount: Observable<ISubCounts> = new Observable();

    /**
     * @constructor
     *
     * @param {ICountedOptions} [options]
     * Configuration Options.
     */
    constructor(options?: ICountedOptions) {
        super(options);
        const c = this.onCount;
        this.send = (options && options.sync ? c.nextSync : c.next).bind(c);
    }

    /**
     * Overrides base implementation to trigger event `onCount` during
     * subscribe and unsubscribe calls.
     *
     * @param {SubFunction} cb
     */
    protected createUnsub(cb: SubFunction<T>): () => void {
        const s = this.subs;
        this.send({newCount: s.length, prevCount: s.length - 1});
        return () => {
            s.splice(s.indexOf(cb), 1);
            this.send({newCount: s.length, prevCount: s.length + 1});
        };
    }
}
