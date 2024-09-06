import { RunService } from "@rbxts/services";
import { root } from "@rbxts/vide";
import { useDeferCallback } from ".";

export = () => {
	const wait = () => {
		RunService.Heartbeat.Wait();
		RunService.Heartbeat.Wait();
	};

	it("should return a callback and a cancel function", () => {
		const [result, destroy] = root((destroy) => {
			const [callback, cancel] = useDeferCallback(() => {});
			return $tuple({ callback, cancel }, destroy);
		});

		expect(result.callback).to.be.a("function");
		expect(result.cancel).to.be.a("function");
		destroy();
	});

	it("should execute the callback on the next heartbeat", () => {
		let calls = 0;

		const [result, destroy] = root((destroy) => {
			const [callback] = useDeferCallback(() => calls++);
			return $tuple({ callback }, destroy);
		});

		result.callback();
		expect(calls).to.equal(0);

		wait();
		expect(calls).to.equal(1);
		destroy();
	});

	it("should return a function that cancels the callback", () => {
		let calls = 0;

		const [result, destroy] = root((destroy) => {
			const [callback, cancel] = useDeferCallback(() => calls++);
			return $tuple({ callback, cancel }, destroy);
		});

		result.callback();
		expect(calls).to.equal(0);

		result.cancel();
		wait();
		expect(calls).to.equal(0);
		destroy();
	});

	it("should cancel the previous callback when called again", () => {
		let calls = 0;

		const [result, destroy] = root((destroy) => {
			const [callback] = useDeferCallback(() => calls++);
			return $tuple({ callback }, destroy);
		});

		result.callback();
		result.callback();
		result.callback();
		expect(calls).to.equal(0);

		wait();
		expect(calls).to.equal(1);
		destroy();
	});

	it("should execute the callback with the latest arguments", () => {
		let calls = 0;

		const [result, destroy] = root((destroy) => {
			const [callback] = useDeferCallback((value: number) => (calls += value));
			return $tuple({ callback }, destroy);
		});

		result.callback(1);
		result.callback(2);
		result.callback(3);
		expect(calls).to.equal(0);

		wait();
		expect(calls).to.equal(3);
		destroy();
	});
};
