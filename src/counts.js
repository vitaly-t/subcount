"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = require("./observable");
/**
 * @class CountedObservable
 * @description
 * Extends `Observable` with `onCount` event to monitor subscriptions count.
 */
class CountedObservable extends observable_1.Observable {
    /**
     * @constructor
     *
     * @param {ICountedOptions} [options]
     * Configuration Options.
     */
    constructor(options) {
        super(options);
        /**
         * Event onCount(({newCount, prevCount}) => void)
         */
        this.onCount = new observable_1.Observable();
        const c = this.onCount;
        this.send = (options && options.sync ? c.nextSync : c.next).bind(c);
    }
    /**
     * Overrides base implementation to trigger event `onCount` during
     * subscribe and unsubscribe calls.
     *
     * @param {SubFunction} cb
     */
    createUnsub(cb) {
        const s = this.subs;
        this.send({ newCount: s.length, prevCount: s.length - 1 });
        return () => {
            s.splice(s.indexOf(cb), 1);
            this.send({ newCount: s.length, prevCount: s.length + 1 });
        };
    }
}
exports.CountedObservable = CountedObservable;
