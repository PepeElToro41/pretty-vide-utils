## 🪝 `useDebounceSource`

```ts
function useDebounceSource<T>(initialState: T, options?: UseDebounceOptions): Source<T>;
```

Delays updating the source until after `wait` seconds have elapsed since the last time it tried to update. Sets to the most recently applied value after the delay.

See [lodash.debounce](https://lodash.com/docs/4.17.15#debounce) for the function this hook is based on.

### 📕 Parameters

-   `initialState` - The initial state.
-   `options` - The options object.
    -   `wait` - The number of seconds to delay. Defaults to `0`.
    -   `leading` - Specify invoking on the leading edge of the timeout. Defaults to `false`.
    -   `trailing` - Specify invoking on the trailing edge of the timeout. Defaults to `true`.
    -   `maxWait` - The maximum time `state` is allowed to be delayed before invoking.

### 📗 Returns

-   A source that debounces updates.

## Example

Update the query after the user stops typing for 1 second.

```tsx
function SearchQuery() {
	const query = useDebounceState("", { wait: 1 });

	effect(() => print(query()));

	return <textbox TextChanged={(text) => query(text)} />;
}
```
