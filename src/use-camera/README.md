## `useCamera`

```tsx
function useCamera(): Source<Camera>;
```

Returns the `CurrentCamera` in a source. If the current camera changes, the source will be updated.

## Example

```tsx
function CameraPortal() {
	const camera = useCamera();

	effect(() => print(camera()));

	return <></>;
}
```
