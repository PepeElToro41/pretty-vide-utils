import { Source, source } from "@rbxts/vide";
import { useDeferCallback } from "../use-defer-callback";

/**
 * returns a source that will be updated on the next Heartbeat
 * frame. Only the latest update in a frame will run.
 *
 * This is useful for improving performance when updating state in response to
 * events that fire rapidly in succession.
 *
 * @param initialState Optional initial state
 * @returns A tuple containing the state and a function to update it
 */
export function useDeferSource<T>(init: T) {
	const deferSource = source(init);
	const [defer] = useDeferCallback<[T]>(deferSource);

	const proxy: Source<T> = (value?: T) => {
		if (value === undefined) {
			return deferSource();
		}

		defer(value);
		return value;
	};

	return proxy;
}
