import { debounce, Debounced, DebounceOptions } from "@rbxts/set-timeout";
import { cleanup } from "@rbxts/vide";

export interface UseDebounceOptions extends DebounceOptions {
	/**
	 * The amount of time to wait before the first call.
	 */
	wait?: number;
}

export interface UseDebounceResult<T extends Callback> {
	/**
	 * The debounced function.
	 */
	run: Debounced<T>;
	/**
	 * Cancels delayed invocations to the callback.
	 */
	cancel: () => void;
	/**
	 * Immediately invokes delayed callback invocations.
	 */
	flush: () => void;
	/**
	 * Returns whether any invocations are pending.
	 */
	pending: () => boolean;
}

export function useDebounceCallback<T extends Callback>(callback: T, options?: UseDebounceOptions) {
	const debounced = debounce(
		(...args: unknown[]) => {
			callback(...args);
		},
		options?.wait,
		options,
	) as Debounced<T>;

	cleanup(() => debounced.cancel());

	return {
		run: debounced,
		cancel: debounced.cancel,
		flush: debounced.flush,
		pending: debounced.pending,
	};
}
