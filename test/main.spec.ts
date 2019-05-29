import {expect, chai} from './';
import {CountedObservable, ISubCounts, Observable} from '../src/subcount';

describe('Observable', () => {
    it('must notify about subscriptions', () => {
        const a = new Observable<number>();
        const cb = (data: number) => {
        };
        const s = chai.spy(cb);
        a.subscribe(s);
        a.next(123, (count: number) => {
            expect(count).to.be.equal(1);
            expect(s).to.have.been.called.with(123);
        });
    });
});

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
