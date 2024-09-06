import { root, source } from "@rbxts/vide";
import { useDebounceEffect } from ".";

export = () => {
	it("should debounce the effect", () => {
		let count = 0;
		const [rerender, destroy] = root((destroy) => {
			const rerender = source(0);

			useDebounceEffect(
				() => {
					count += 1;
				},
				() => rerender(),
				{ wait: 0.02 },
			);
			return $tuple(rerender, destroy);
		});

		rerender(0);
		rerender(1);
		rerender(2);
		rerender(3);
		expect(count).to.equal(0);

		task.wait(0.04);
		expect(count).to.equal(1);
		rerender(2);
		expect(count).to.equal(1);

		task.wait(0.04);
		expect(count).to.equal(2);
		rerender(2);
		expect(count).to.equal(2);

		task.wait(0.04);
		expect(count).to.equal(2);
		rerender(3);
		expect(count).to.equal(2);
		rerender(4);
		expect(count).to.equal(2);

		task.wait(0.04);
		expect(count).to.equal(3);

		destroy();
	});
};
