import { effect } from "@rbxts/vide";
import { useDebounceCallback, UseDebounceOptions } from "../use-debounce-callback";

export function useDebounceEffect(debounced: () => void, callback: () => void, options?: UseDebounceOptions) {
	const { run } = useDebounceCallback(debounced, options);

	effect(() => {
		callback();
		run();
	});
}
