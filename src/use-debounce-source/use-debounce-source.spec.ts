import Vide, { effect, root } from "@rbxts/vide";
import { useDebounceSource } from ".";

Vide.strict = false;

export = () => {
	it("should debounce the state", () => {
		let called: number | undefined = undefined;

		const [result, destroy] = root((destoy) => {
			const source = useDebounceSource(0, { wait: 0.02 });
			effect(() => {
				source();
				called = called === undefined ? 0 : called + 1;
			});

			return $tuple(source, destoy);
		});

		expect(result()).to.equal(0);
		result(0);
		result(1);
		result(0);
		result(1);
		expect(result()).to.equal(0);
		expect(called).to.equal(0);

		task.wait(0.04);
		expect(result()).to.equal(1);
		result(2);
		expect(result()).to.equal(1);
		expect(called).to.equal(1);

		task.wait(0.04);
		expect(result()).to.equal(2);
		result(2);
		expect(result()).to.equal(2);
		expect(called).to.equal(2);

		task.wait(0.04);
		expect(result()).to.equal(2);
		result(3);
		expect(result()).to.equal(2);
		result(4);
		expect(result()).to.equal(2);

		task.wait(0.04);
		expect(result()).to.equal(4);
		expect(called).to.equal(3);

		destroy();
	});
};
