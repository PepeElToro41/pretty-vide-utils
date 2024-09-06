import { source, Source } from "@rbxts/vide";
import { UseDebounceOptions } from "../use-debounce-callback";
import { useThrottleCallback } from "../use-throttle-callback";

export function useThrottleSource<T>(init: T, options?: UseDebounceOptions) {
	const throttleSource = source(init);
	const { run } = useThrottleCallback(throttleSource, options);

	const proxy: Source<T> = (value?: T) => {
		if (value === undefined) {
			return throttleSource();
		}

		run(value);
		return value;
	};

	return proxy;
}
