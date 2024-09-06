import { derive, effect } from "@rbxts/vide";
import { useAsyncCallback } from "../use-async-callback";

/**
 * Returns a tuple containing the result and status of a promise. dependencies will be tracked
 * and pending promises will be cancelled, and a new promise
 * will be started.
 * @param callback The async callback.
 * @returns The result and status of the promise.
 */
export function useAsync<T>(callback: () => Promise<T>) {
	const [state, caller] = useAsyncCallback(callback);

	const value = derive(() => state().value);
	const status = derive(() => state().status);
	const message = derive(() => state().message);

	effect(() => caller());

	return $tuple(value, status, message);
}
