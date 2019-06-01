import {expect, chai} from './';
import {Observable} from '../src';

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
    describe('nextSafe', () => {
        const err = new Error('Ops!');
        it('must handle errors from synchronous subscribers', done => {
            const a = new Observable();
            a.subscribe(() => {
                throw err;
            });
            const handler = () => 1;
            const s = chai.spy(handler);
            a.nextSafe(123, s);
            setTimeout(() => {
                expect(s).to.have.been.called.with(err);
                done();
            });
        });
        it('must handle errors from asynchronous subscribers', done => {
            const a = new Observable();
            a.subscribe(async () => {
                throw err;
            });
            const handler = () => 1;
            const s = chai.spy(handler);
            a.nextSafe(123, s);
            setTimeout(() => {
                expect(s).to.have.been.called.with(err);
                done();
            });
        });
    });
});
