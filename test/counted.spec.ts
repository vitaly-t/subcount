import {expect, chai} from './';
import {CountedObservable, ISubCounts} from '../src';

describe('CountedObservable', () => {
    it('must notify about the count', () => {
        const a = new CountedObservable<string>({sync: true});
        const cb = (data: ISubCounts) => {
        };
        const s = chai.spy(cb);
        a.onCount.subscribe(s);
        a.subscribe(() => {
        });
        expect(s).to.have.been.called.with({newCount: 1, prevCount: 0});
        expect(s).to.have.been.called.once;
    });
});
