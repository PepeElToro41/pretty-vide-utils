## `useAsyncCallback`

```ts
function useAsyncCallback<T, U extends unknown[]>(
	callback: AsyncCallback<T, U>,
): [Source<AsyncState<T>>, AsyncCallback<T, U>];
```

A hook that wraps an async function and returns the current state in a source and an executor.

Calling the executor will cancel any pending promises and start a new one.

> **Warning:**  
> Cancelling a promise that yielded using `await` does not prevent the thread from resuming.  
> Avoid pairing `await` with functions that update state, as it might resume after unmount:
>
> ```ts
> const state = source("foo");
>
> useAsyncCallback(async () => {
> 	await Promise.delay(5);
> 	state("baz"); // unsafe
> });
> ```

### 📕 Parameters

-   `callback` - The async function to call.

### 📗 Returns

-   The current state of the async function in a source.
    -   `status` - The status of the last promise.
    -   `value` - The value if the promise resolved.
    -   `message` - The error message if the promise rejected.
-   A function that calls the async function.

## Example

```tsx
function Component() {
	const [state, caller] = useAsyncCallback(() => DoSomethingAsync());

	effect(() => print(state()));

	return (
		<textbutton
			Text={`Baseplate status: ${state.status}`}
			Event={{
				Activated: () => caller(),
			}}
		/>
	);
}
```
