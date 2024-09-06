/// <reference types="@rbxts/testez/globals" />

import { root } from "@rbxts/vide";
import { useEventListener } from ".";

function createSignal<T extends unknown[] = []>() {
	const listeners = new Set<(...args: T) => void>();

	return {
		listeners() {
			return listeners;
		},

		connect(listener: (...args: T) => void) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},

		fire(...args: T) {
			for (const listener of listeners) {
				listener(...args);
			}
		},
	};
}

export = () => {
	it("should connect on mount", () => {
		const signal = createSignal();
		const destroy = root((destroy) => {
			useEventListener(signal, () => {});
			return destroy;
		});

		expect(signal.listeners().size()).to.equal(1);
		destroy();
	});
	it("should disconnect on unmount", () => {
		const signal = createSignal();
		const destroy = root((destroy) => {
			useEventListener(signal, () => {});
			return destroy;
		});

		expect(signal.listeners().size()).to.equal(1);
		destroy();
		expect(signal.listeners().size()).to.equal(0);
	});
	it("should call listener on event", () => {
		const signal = createSignal<[number]>();
		let result: number | undefined;

		const destroy = root((destroy) => {
			useEventListener(signal, (value) => (result = value));
			return destroy;
		});

		signal.fire(0);
		expect(result).to.equal(0);

		signal.fire(1);
		expect(result).to.equal(1);

		destroy();
	});
};
