import { cleanup, source, untrack } from "@rbxts/vide";
import { LockedSource, lockSource } from "../utils";

export type AsyncCallback<T, U extends unknown[]> = (...args: U) => Promise<T>;

export type AsyncState<T> =
	| {
			status: PromiseConstructor["Status"]["Started"];
			message?: undefined;
			value?: undefined;
	  }
	| {
			status: PromiseConstructor["Status"]["Resolved"];
			message?: undefined;
			value: T;
	  }
	| {
			status: PromiseConstructor["Status"]["Cancelled"] | PromiseConstructor["Status"]["Rejected"];
			message: unknown;
			value?: undefined;
	  };

type AnyAsyncState<T> = {
	status: Promise.Status;
	message?: unknown;
	value?: T;
};

/**
 * Returns a tuple containing the current state of the promise and a callback
 * to start a new promise. Calling it will cancel any previous promise.
 * @param callback The async callback.
 * @returns The state and a new callback.
 */
export function useAsyncCallback<T, U extends unknown[]>(callback: AsyncCallback<T, U>) {
	let currentPromise: Promise<T> | undefined = undefined;
	const state = source<AnyAsyncState<T>>({
		status: "Started",
	});

	function caller(...args: U) {
		if (currentPromise !== undefined) {
			currentPromise.cancel();
		}

		if (untrack(state).status !== "Started") {
			state({ status: "Started" });
		}
		const promise = callback(...args);

		promise.then(
			(value) => state({ status: promise.getStatus(), value }),
			(message) => state({ status: promise.getStatus(), message }),
		);

		currentPromise = promise;
		return currentPromise;
	}

	cleanup(() => {
		if (currentPromise !== undefined) {
			currentPromise.cancel();
		}
	});

	return $tuple(lockSource(state) as LockedSource<AsyncState<T>>, caller);
}
