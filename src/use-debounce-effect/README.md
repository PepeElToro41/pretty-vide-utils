## 🪝 `useDebounceEffect`

```ts
function useDebounceEffect(debounced: () => void, effect: () => void, options?: UseDebounceOptions): void;
```

Creates a debounced effect that delays invoking `debounced` until after `wait` seconds have elapsed since the last time the `effect` was run.

This separates it in two functions, `debounced` will be called after `wait` seconds have elapsed, and effect will be called like a normal effect, this one is used for tracking dependencies, `debounced` does not track dependencies.

See [lodash.debounce](https://lodash.com/docs/4.17.15#debounce) for the function this hook is based on.

### 📕 Parameters

-   `debounced` - The debounced function.
-   `effect` - The effect function.
-   `options` - The options object.
    -   `wait` - The number of seconds to delay. Defaults to `0`.
    -   `leading` - Specify invoking on the leading edge of the timeout. Defaults to `false`.
    -   `trailing` - Specify invoking on the trailing edge of the timeout. Defaults to `true`.
    -   `maxWait` - The maximum time `state` is allowed to be delayed before invoking.

## Example

Print the query after it stops changing for 1 second.

```tsx
function SearchQuery() {
	const query = source("");

	useDebounceEffect(
		() => print(query()), // this is untracked
		() => query(), // track dependencies only
		{ wait: 1 },
	);

	return <textbox TextChanged={(text) => query(text)} />;
}
```
