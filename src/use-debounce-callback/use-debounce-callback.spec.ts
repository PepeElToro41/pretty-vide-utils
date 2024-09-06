import { root } from "@rbxts/vide";
import { useDebounceCallback } from ".";

export = () => {
	it("should run", () => {
		let count = 0;
		const [destroy, api] = root((destroy) => {
			const api = useDebounceCallback((amount: number) => (count += amount), { wait: 0.02 });
			return $tuple(destroy, api);
		});

		api.run(1);
		api.run(1);
		api.run(4);
		api.run(2);
		expect(count).to.equal(0);

		task.wait(0.04);
		expect(count).to.equal(2);
		api.run(4);
		expect(count).to.equal(2);

		task.wait(0.04);
		expect(count).to.equal(6);

		destroy();
	});
	it("should cancel", () => {
		let count = 0;
		const [destroy, api] = root((destroy) => {
			const api = useDebounceCallback((amount: number) => (count += amount), { wait: 0.01 });
			return $tuple(destroy, api);
		});
		api.run(2);
		expect(count).to.equal(0);

		task.wait(0.04);
		expect(count).to.equal(2);
		api.run(4);
		expect(count).to.equal(2);
		api.cancel();
		task.wait(0.04);
		expect(count).to.equal(2);

		destroy();
	});
	it("should flush", () => {
		let count = 0;
		const [destroy, api] = root((destroy) => {
			const api = useDebounceCallback((amount: number) => (count += amount), { wait: 0.02 });
			return $tuple(destroy, api);
		});
		api.run(2);
		expect(count).to.equal(0);

		task.wait(0.04);
		expect(count).to.equal(2);
		api.run(2);
		expect(count).to.equal(2);
		api.flush();
		expect(count).to.equal(4);
		task.wait(0.04);
		expect(count).to.equal(4);

		destroy();
	});
};
