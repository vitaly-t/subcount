# subs-count

[![Build Status](https://travis-ci.org/vitaly-t/subs-count.svg?branch=master)](https://travis-ci.org/vitaly-t/subs-count)

Simple observable, with support for subscriptions counter out of the box. 

Written in TypeScript, and strictly for Node.js

## Rationale

This module was written to avoid the overhead of [RXJS] when it comes to simple subscriptions with counters.

See the [following issue](https://stackoverflow.com/questions/56195932/how-to-monitor-number-of-rxjs-subscriptions) that precipitated this.

## Usage

You can either install this module via `npm i subs-count`, or just copy [./src/index.ts](./src/index.ts) into your project.

### Simple Observable

This works the same as with [RXJS]:

```ts
import {Observable} from 'subs-count';

// declare observable with any type:
const a: Observable<string> = new Observable();

// subscribe for events:
const sub = a.subscribe((data: string) => {
  // data = 'hello'
});

// send data:
a.next('hello');

// unsubscribe:
sub.unsubscribe();
```

### Counted Observable

```ts
import {CountedObservable, ISubsCount} from 'subs-count';

// declare observable with any type:
const a: CountedObservable<string> = new CountedObservable();

// subscribe to the subscriptions counter:
const countSub = a.onCount.subscribe((info: ISubsCount) => {
    // info = {newCount, prevCount} 
});

// subscribe for events:
const sub = a.subscribe((data: string) => {
  // data = 'hello'
});

// send data:
a.next('hello');

// unsubscribe:
sub.unsubscribe();
countSub.unsubscribe();
```

[RXJS]:https://github.com/reactivex/rxjs
