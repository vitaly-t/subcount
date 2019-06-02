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
    describe('unsubscribeAll', () => {
        it('must notify about zero clients', () => {
            const received: ISubCounts[] = [];
            const a = new CountedObservable<string>({sync: true});
            a.onCount.subscribe((data: ISubCounts) => {
                received.push(data);
            });
            a.subscribe(() => 123);
            a.subscribe(() => 456);
            a.unsubscribeAll();
            expect(received).to.eql([
                {newCount: 1, prevCount: 0},
                {newCount: 2, prevCount: 1},
                {newCount: 0, prevCount: 2}
            ]);
        });
    });
});
