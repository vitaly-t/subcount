# subcount

[![Build Status](https://travis-ci.org/vitaly-t/subcount.svg?branch=master)](https://travis-ci.org/vitaly-t/subcount)

Simplified observable, with support for subscriptions + counters out of the box. 

## Rationale

This module was written to avoid the overhead of [RXJS] when all you need is basic subscriptions + counters.

See the [following issue](https://stackoverflow.com/questions/56195932/how-to-monitor-number-of-rxjs-subscriptions) that precipitated this.

## Usage

Install this module via `npm i subcount`.

### Simple Observable

Class [Observable] works very much like in [RXJS]: 

```ts
import {Observable} from 'subcount';

// declare observable with any type:
const a: Observable<string> = new Observable();

// subscribe for data:
const sub = a.subscribe((data: string) => {
  // data = 'hello'
});

a.next('hello'); // send data

sub.unsubscribe(); // unsubscribe
```

And if you need to wait for `next` to finish, you can use method `nextSync` instead.

### Counted Observable

Class [CountedObservable] extends [Observable] with `onCount`, to monitor the subscriptions counter:

```ts
import {CountedObservable, ISubCounts} from 'subcount';

// declare observable with any type:
const a: CountedObservable<string> = new CountedObservable();

// monitor the subscriptions counter:
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

## Browser

Including `./subcount/dist` in your HTML will give you access to all types under `subcount` namespace:

```html
<script src="./subcount/dist"></script>
<script>
    const a = new subcount.Observable();
    a.subscribe(data => {
        // data received
    });
</script>
``` 

This will work in all browsers, including ones as old as IE9.

And when using it directly in TypeScript, you can compile and bundle it any way you want.

**Example:**

```ts
function fromEvent(from: Node, event: string): Observable<Event> {
    const obs = new Observable<Event>();
    from.addEventListener(event, e => obs.next(e));
    return obs;
}

fromEvent(document, 'click').subscribe((e: Event) => {
    // handle the event
});
```

[RXJS]:https://github.com/reactivex/rxjs
[Observable]:https://github.com/vitaly-t/subcount/blob/master/src/observable.ts
[CountedObservable]:https://github.com/vitaly-t/subcount/blob/master/src/counts.ts
