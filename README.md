# subs-count

Simple event subscription module, with support for subscription counter out of the box. 

Written in pure TypeScript, and strictly for Node.js

## Rationale

This module was written to avoid the overhead of [RXJS] when it comes to simple subscriptions and their counters.

See the [following issue](https://stackoverflow.com/questions/56195932/how-to-monitor-number-of-rxjs-subscriptions) that precipitated this.

## Usage

You can either install this module via `npm i subs-count`, or just copy [./src/index.ts](./src/index.ts) into your project.

### Simple Subscriptions

These work the same as with [RXJS]:

```ts
import {Observable} from 'subs-count';

// declare observable with any type:
const a: Observable<string> = new Observable();

// subscribe for the events:
const sub = a.subscrtibe((data: string) => {
  // data = 'hello'
});

// send data:
a.next('hello');

// unsubscribe:
sub.unsubscribe();
```

### Counted Subscriptions

```ts
import {CountedObservable, ISubCounts} from 'subs-count';

// declare observable with any type:
const a: CountedObservable<string> = new CountedObservable();

// subscribe to subscriptions counter:
const cSub = a.onCount.subscribe((info: ISubCounts) => {
    // info = {newCount, prevCount} 
});

// subscribe for the events:
const sub = a.subscrtibe((data: string) => {
  // data = 'hello'
});

// send data:
a.next('hello');

// unsubscribe:
sub.unsubscribe();
```

[RXJS]:https://github.com/reactivex/rxjs
