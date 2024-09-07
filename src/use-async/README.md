## `useAsync`

```ts
function useAsync<T>(
	callback: () => Promise<T>,
	deps: unknown[] = [],
): [result?: Source<T>, status: Source<Promise.Status>, message?: Source<unknown>];
```

A hook that runs an async function and returns the result and status in a readonly source.

> **Warning:**  
> To track dependencies, you should only call the sources in the callback, not in the Promise, as this can mess with tracking and reactivity.

## Example

> **Warning:**  
> Cancelling a promise that yielded using `await` does not prevent the thread from resuming.  
> Avoid pairing `await` with functions that update state, as it might resume after unmount:
>
> ```ts
> useAsync(async () => {
> 	await Promise.delay(5);
> 	setState("Hello World!"); // unsafe
> });
> ```
