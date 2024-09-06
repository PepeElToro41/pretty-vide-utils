import { effect } from "@rbxts/vide";
import { useDeferCallback } from "../use-defer-callback";

/**
 * Like `useEffect`, but the callback is deferred to the next Heartbeat frame.
 * @param callback The callback to run
 * @param dependencies Optional dependencies to trigger the effect
 */
export function useDeferEffect(defered: () => void, callback: () => void) {
	const [defer, cancel] = useDeferCallback(defered);

	effect(() => {
		callback();
		defer();
		return cancel;
	});
}
