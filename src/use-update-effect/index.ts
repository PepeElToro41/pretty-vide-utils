import { effect } from "@rbxts/vide";

export function useUpdateEffect(callback: () => (() => void) | void) {
	let isMounted = false;

	effect(() => {
		if (isMounted) {
			callback();
		} else {
			isMounted = true;
		}
	});
}
