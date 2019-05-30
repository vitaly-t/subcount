import {Observable} from './observable';

export interface ISubCounts {
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
    readonly onCount: Observable<ISubCounts> = new Observable();

    /**
     * Constructor.
     *
     * @param {} [options]
     *
     * @param {boolean} [options.sync=false]
     * Makes onCount calls synchronous.
     */
    constructor(options?: { sync?: boolean }) {
        super();
        const c = this.onCount;
        const sync = options && options.sync;
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
