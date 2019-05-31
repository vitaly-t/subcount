import {IObservableOptions, Observable, SubFunction} from './observable';

export interface ISubCounts {
    newCount: number;
    prevCount: number;
}

export interface ICountedOptions extends IObservableOptions {
    /**
     * Makes onCount calls synchronous. Default is false.
     */
    sync?: boolean;
}

/**
 * @class CountedObservable
 * @description
 * Extends Observable with onCount event to monitor subscriptions count.
 */
export class CountedObservable<T = any> extends Observable<T> {
    protected send: (data: any) => number;

    /**
     * Event onCount(({newCount, prevCount})=>void)
     */
    readonly onCount: Observable<ISubCounts>;

    /**
     * @constructor
     * @param {ICountedOptions} [options]
     * Configuration Options.
     */
    constructor(options?: ICountedOptions) {
        const op = options ? options : {};
        super({max: op.max});
        this.onCount = new Observable();
        const c = this.onCount;
        this.send = (op.sync ? c.nextSync : c.next).bind(c);
    }

    protected createUnsub(cb: SubFunction<T>) {
        const s = this.subs;
        this.send({newCount: s.length, prevCount: s.length - 1});
        return () => {
            s.splice(s.indexOf(cb), 1);
            this.send({newCount: s.length, prevCount: s.length + 1});
        };
    }
}
