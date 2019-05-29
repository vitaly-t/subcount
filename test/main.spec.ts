import {expect, chai} from './';
import {CountedObservable, Observable} from '../src';

describe('Observable', () => {
    it('must persist the type through subscription', () => {
        const a = new Observable<number>();
        const cb = () => {
        };
        const s = chai.spy(cb);
        a.subscribe(s);
        a.next(123, count => {
            expect(count).to.be.equal(1);
            expect(s).to.have.been.called.with(123);
        });
    });
});

describe('CountedObservable', () => {
    it('must notify about subscriptions', () => {
        const a = new CountedObservable<string>(true);
        const cb = count => {
        };
        const s = chai.spy(cb);
        a.onCount.subscribe(s);
        a.subscribe(() => {
        });
        expect(s).to.have.been.called.with({newCount: 1, prevCount: 0});
        expect(s).to.have.been.called.once;
    });
});
