import { source, Source } from "@rbxts/vide";
import { useDebounceCallback, UseDebounceOptions } from "../use-debounce-callback";

export function useDebounceSource<T>(init: T, options?: UseDebounceOptions) {
	const debounceSource = source(init);
	const { run } = useDebounceCallback(debounceSource, options);

	const proxy: Source<T> = (value?: T) => {
		if (value === undefined) {
			return debounceSource();
		}

		run(value);
		return value;
	};

	return proxy;
}
