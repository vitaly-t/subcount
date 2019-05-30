import {Observable} from './observable';

export interface ISubCounts {
    newCount: number;
    prevCount: number;
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
     *
     * @param {} [options]
     *
     * @param {boolean} [options.sync=false]
     * Makes onCount calls synchronous.
     *
     * @param {number} [options.max=0]
     * Maximum number of subscribers that can receive data.
     * It is passed into the parent class.
     */
    constructor(options?: { sync?: boolean, max?: number }) {
        const op = options ? options : {};
        super({max: op.max});
        this.onCount = new Observable();
        const c = this.onCount;
        this.send = (op.sync ? c.nextSync : c.next).bind(c);
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
