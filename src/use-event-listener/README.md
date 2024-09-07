## `useEventListener`

```ts
function useEventListener<T extends EventLike>(
	event?: T,
	listener?: T extends EventLike<infer U> ? U : never,
): ReturnType<T>;
```

Connects an event listener to the given event. The event can be any object with a `Connect` method that returns a Connection object or a cleanup function.

This returns what was returned after connecting the listener.

### 📕 Parameters

-   `event` - The event to listen to.
-   `listener` - The listener to call when the event fires.

### 📗 Returns

-   `ConnectionLike` - The connection object.

### 📘 Example

```tsx
function PlayerJoined() {
	useEventListener(Players.PlayerAdded, (player) => {
		print(`${player.DisplayName} joined!`);
	});

	return <frame />;
}
```
