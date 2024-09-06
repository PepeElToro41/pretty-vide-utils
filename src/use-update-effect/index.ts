import { effect } from "@rbxts/vide";

export function useUpdateEffect(callback: () => (() => void) | void) {
	let isMounted = false;

	effect(() => {
		if (isMounted) {
			return callback();
		} else {
			isMounted = true;
		}
	});
}
