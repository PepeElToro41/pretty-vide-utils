## `useAsyncEffect`

```ts
function useAsyncEffect(effect: () => Promise<unknown>): void;
```

Runs an async effect and cancels the promise when unmounting the effect.

> **Warning:**  
> To track dependencies, you must only call the sources instantly in the callback, not in the Promise, as this can mess with vide reactivity.
>
> ```ts
> const state = source("foo");
>
> useAsyncEffect(() => {
> 	state(); // correct
> 	return Promise.try(() => {
> 		task.wait(2);
> 		state(); // incorrect
> 	});
> });
> ```

---

> **Warning:**  
> Cancelling a promise that yielded using `await` does not prevent the thread from resuming.  
> Avoid pairing `await` with functions that update state, as it might resume after unmount:
>
> ```ts
> const state = source("foo");
>
> useAsyncEffect(async () => {
> 	await Promise.delay(5);
> 	state("baz"); // unsafe
> }, []);
> ```
