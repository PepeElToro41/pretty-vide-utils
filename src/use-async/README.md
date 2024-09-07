## `useAsync`

```ts
function useAsync<T>(
	callback: () => Promise<T>,
	deps: unknown[] = [],
): [result?: Source<T>, status: Source<Promise.Status>, message?: Source<unknown>];
```

A hook that runs an async function and returns the result and status in a readonly source.

> **Warning:**  
> To track dependencies, you must only call the sources instantly in the callback, not in the Promise, as this can mess with vide reactivity.
>
> ```ts
> const state = source("foo");
>
> useAsync(() => {
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
> useAsync(async () => {
> 	await Promise.delay(5);
> 	state("baz"); // unsafe
> });
> ```

---

## Example

```ts
async function GetUserId(name: string) {
	return Players.GetUserIdFromNameAsync(name);
}

function Component() {
	const username = source("PepeElToro41");
	const [userid] = useAsync(() => GetUserId(username()));

	effect(() => print(userid()));
}
```
