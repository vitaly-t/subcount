import {expect, chai} from './';
import {CountedObservable, ISubCounts, Observable} from '../src';

describe('Observable', () => {
    it('must notify about subscriptions', () => {
        const a = new Observable<number>();
        const cb = () => 1;
        const s = chai.spy(cb);
        a.subscribe(s);
        a.next(123, (count: number) => {
            expect(count).to.be.equal(1);
            expect(s).to.have.been.called.with(123);
        });
    });
    it('must limit notifications according to the max option', () => {
        const a = new Observable<number>({max: 1});
        const cb1 = () => 1;
        const cb2 = () => 2;
        const s1 = chai.spy(cb1);
        const s2 = chai.spy(cb2);
        a.subscribe(s1);
        a.subscribe(s2);
        a.next(123, (count: number) => {
            expect(count).to.be.equal(1);
            expect(s1).to.have.been.called.with(123);
            expect(s2).to.not.have.been.called;
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
