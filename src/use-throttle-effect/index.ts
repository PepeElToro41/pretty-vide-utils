import { effect } from "@rbxts/vide";
import { UseDebounceOptions } from "../use-debounce-callback";
import { useThrottleCallback } from "../use-throttle-callback";

export function useThrottleEffect(callback: () => void, debounced: () => void, options?: UseDebounceOptions) {
	const { run } = useThrottleCallback(debounced, options);

	effect(() => {
		callback();
		run();
	});
}
