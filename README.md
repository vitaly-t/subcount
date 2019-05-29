# subcount

[![Build Status](https://travis-ci.org/vitaly-t/subcount.svg?branch=master)](https://travis-ci.org/vitaly-t/subcount)

Simple observable, with support for subscriptions counter out of the box. 

Written in TypeScript, for Node.js v6 and later.

## Rationale

This module was written to avoid the overhead of [RXJS] when it comes to subscriptions with counters.

See the [following issue](https://stackoverflow.com/questions/56195932/how-to-monitor-number-of-rxjs-subscriptions) that precipitated this.

## Usage

You can either install this module via `npm i subcount`, or just copy [./src/subcount.ts](./src/subcount.ts) into your project.

### Simple Observable

Class [Observable] works just like in [RXJS]:

```ts
import {Observable} from 'subcount';

// declare observable with any type:
const a: Observable<string> = new Observable();

// subscribe for data:
const sub = a.subscribe((data: string) => {
  // data = 'hello'
});

// send data:
a.next('hello');

// unsubscribe:
sub.unsubscribe();
```

If you need to wait for `next` to finish, you can use method `nextSync` instead.

### Counted Observable

Class [CountedObservable] simply extends [Observable] with `onCount`:

```ts
import {CountedObservable, ISubCounts} from 'subcount';

// declare observable with any type:
const a: CountedObservable<string> = new CountedObservable();

// subscribe for the subscriptions counter:
const countSub = a.onCount.subscribe((info: ISubCounts) => {
    // info = {newCount, prevCount} 
});

// subscribe for data:
const sub = a.subscribe((data: string) => {
  // data = 'hello'
});

// send data:
a.next('hello');

// unsubscribe:
sub.unsubscribe();
countSub.unsubscribe();
```

If you need `onCount` sent synchronously, use `new CountedObservable({sync: true})`. 

[RXJS]:https://github.com/reactivex/rxjs
[Observable]:https://github.com/vitaly-t/subcount/blob/master/src/subcount.ts#L16
[CountedObservable]:https://github.com/vitaly-t/subcount/blob/master/src/subcount.ts#L80
