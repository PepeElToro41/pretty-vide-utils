import { effect } from "@rbxts/vide";

/**
 * Runs an async effect and cancels the promise when unmounting the effect.
 * Note that effects paused by `await` still run while cancelled, so prefer
 * to use promise chaining instead.
 * @param effect The async effect to run.
 * @param deps The dependencies to run the effect on.
 */
export function useAsyncEffect(callback: () => Promise<void>) {
	effect(() => {
		const async = callback();

		return () => {
			async.cancel();
		};
	});
}
