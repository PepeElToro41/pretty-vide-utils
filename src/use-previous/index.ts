import { effect, source, untrack } from "@rbxts/vide";
import { lockSource } from "../utils";

function isStrictEqual(a: unknown, b: unknown) {
	return a === b;
}
type Predicate<T> = (previous: T | undefined, current: T) => boolean;

/**
 * Returns a source with the most recent value from the previous render. Is `undefined`
 * on the first render.
 *
 * Takes an optional `predicate` function as the second argument that receives
 * the previous and current value. If the predicate returns `false`, the values
 * are not equal, and the previous value is updated.
 *
 * @param value The source to update to on the next render if it changes.
 * @param predicate Optional function to determine whether the value changed.
 * Defaults to a strict equality check (`===`).
 * @returns Source with the previous value.
 */
export function usePrevious<T>(value: () => T, predicate?: Predicate<T>) {
	const previous = source<T>();
	predicate = predicate || isStrictEqual;

	effect(() => {
		const current = value();
		const old = untrack(previous);

		if (!predicate(old, current)) {
			previous(current);
		}
	});

	return lockSource(previous);
}
