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
    protected _notify: (data: any) => number;

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
        this._notify = (options && options.sync ? c.nextSync : c.next).bind(c);
    }

    /**
     * Unsubscribes all clients.
     *
     * It overrides base implementation to trigger event `onCount`
     * when there is at least one subscribed client.
     */
    public unsubscribeAll(): void {
        const prevCount = this.count;
        if (prevCount) {
            super.unsubscribeAll();
            this._notify({newCount: 0, prevCount});
        }
    }

    /**
     * Overrides base implementation to trigger event `onCount` during
     * subscribe and unsubscribe calls.
     *
     * @param {SubFunction} cb
     */
    protected createUnsub(cb: SubFunction<T>): () => void {
        const s = this._subs;
        this._notify({newCount: s.length, prevCount: s.length - 1});
        return () => {
            this.removeSub(cb);
            this._notify({newCount: s.length, prevCount: s.length + 1});
        };
    }
}
