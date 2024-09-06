import { setInterval } from "@rbxts/set-timeout";
import { Derivable, effect } from "@rbxts/vide";
import { getDerivable } from "../utils";

export function useInterval(callback: () => void, delay: Derivable<number>, immediate = false) {
	let cancel: (() => void) | undefined = undefined;
	function clear() {
		cancel?.();
	}

	effect(() => {
		const _delay = getDerivable(delay);
		if (_delay === undefined || _delay < 0) {
			return;
		}

		if (immediate) {
			callback();
		}

		cancel = setInterval(callback, _delay);
		return clear;
	});

	return clear;
}
