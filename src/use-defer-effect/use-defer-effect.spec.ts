import { RunService } from "@rbxts/services";
import { root, source } from "@rbxts/vide";
import { useDeferEffect } from ".";

export = () => {
	const wait = () => {
		RunService.Heartbeat.Wait();
		RunService.Heartbeat.Wait();
	};

	it("should run the effect on the next heartbeat", () => {
		let calls = 0;

		const [rerender, destroy] = root((destroy) => {
			const rerender = source(0);

			useDeferEffect(
				() => calls++,
				() => rerender(),
			);
			return $tuple(rerender, destroy);
		});

		expect(calls).to.equal(0);

		wait();
		expect(calls).to.equal(1);

		wait();
		expect(calls).to.equal(1);

		rerender(1);
		expect(calls).to.equal(1);

		wait();
		expect(calls).to.equal(2);

		destroy();
	});

	it("should run the effect on dependency change", () => {
		let calls = 0;

		const [rerender, destroy] = root((destroy) => {
			const rerender = source(0);
			useDeferEffect(
				() => calls++,
				() => rerender(),
			);
			return $tuple(rerender, destroy);
		});

		expect(calls).to.equal(0);

		wait();
		expect(calls).to.equal(1);

		rerender(1);
		expect(calls).to.equal(1);

		wait();
		expect(calls).to.equal(2);

		destroy();
	});

	it("should cancel the effect on unmount", () => {
		let calls = 0;

		const [rerender, destroy] = root((destroy) => {
			const rerender = source(0);
			useDeferEffect(
				() => calls++,
				() => rerender(),
			);
			return $tuple(rerender, destroy);
		});

		expect(calls).to.equal(0);

		wait();
		expect(calls).to.equal(1);

		rerender(1);
		destroy();

		wait();
		expect(calls).to.equal(1);
	});
};
