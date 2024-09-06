import { Debounced, throttle, ThrottleOptions } from "@rbxts/set-timeout";
import { UseDebounceResult } from "../use-debounce-callback";
import { cleanup } from "@rbxts/vide";

export interface UseThrottleOptions extends ThrottleOptions {
	/**
	 * The amount of time to wait before the first call.
	 */
	wait?: number;
}

export function useThrottleCallback<T extends Callback>(
	callback: T,
	options: UseThrottleOptions = {},
): UseDebounceResult<T> {
	const throttled = throttle(
		(...args: unknown[]) => {
			return callback(...args);
		},
		options.wait,
		options,
	) as Debounced<T>;

	cleanup(() => throttled.cancel());

	return {
		run: throttled,
		cancel: throttled.cancel,
		flush: throttled.flush,
		pending: throttled.pending,
	};
}
