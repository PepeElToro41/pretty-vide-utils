import { RunService } from "@rbxts/services";
import { effect, root } from "@rbxts/vide";
import { useDeferSource } from ".";

export = () => {
	FOCUS();
	const wait = () => {
		RunService.Heartbeat.Wait();
		RunService.Heartbeat.Wait();
	};

	it("should return the source", () => {
		const [source, destroy] = root((destroy) => {
			const source = useDeferSource(0);
			return $tuple(source, destroy);
		});

		expect(source()).to.equal(0);
		destroy();
	});

	it("should update the source on heartbeat", () => {
		const [source, destroy] = root((destroy) => {
			const source = useDeferSource(0);
			return $tuple(source, destroy);
		});

		source(1);
		expect(source()).to.equal(0);

		wait();
		expect(source()).to.equal(1);
		destroy();
	});

	it("should only update the source once per frame", () => {
		const [source, destroy] = root((destroy) => {
			const source = useDeferSource(0);
			return $tuple(source, destroy);
		});

		source(1);
		source(2);
		source(3);
		expect(source()).to.equal(0);

		wait();
		expect(source()).to.equal(3);
		destroy();
	});

	it("should only rerender once per frame", () => {
		let renderCount = 0;
		const [source, destroy] = root((destroy) => {
			const source = useDeferSource(0);

			effect(() => {
				source();
				renderCount++;
			});

			return $tuple(source, destroy);
		});

		expect(renderCount).to.equal(1);

		source(1);
		source(2);
		source(3);
		expect(renderCount).to.equal(1);

		wait();
		expect(renderCount).to.equal(2);
		destroy();
	});

	it("should cancel the update on unmount", () => {
		const [source, destroy] = root((destroy) => {
			const source = useDeferSource(0);
			return $tuple(source, destroy);
		});

		source(1);
		expect(source()).to.equal(0);

		destroy();
		wait();
		expect(source()).to.equal(0);
	});
};
