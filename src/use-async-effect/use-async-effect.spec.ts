import Vide, { root, source } from "@rbxts/vide";
import { useAsyncEffect } from ".";

Vide.strict = false;

export = () => {
	it("should run the effect", () => {
		let calls = 0;
		const destroy = root((destroy) => {
			useAsyncEffect(async () => {
				calls++;
			});
			return destroy;
		});
		expect(calls).to.equal(1);
		destroy();
	});

	it("should run the effect when the dependencies change", () => {
		let calls = 0;
		const [destroy, rerender] = root((destroy) => {
			const rerender = source(0);
			useAsyncEffect(() => {
				rerender();
				return Promise.try(() => {
					calls++;
				});
			});
			return $tuple(destroy, rerender);
		});

		expect(calls).to.equal(1);
		rerender(1);
		expect(calls).to.equal(2);
		destroy();
	});

	it("should cancel the effect when unmounting", () => {
		let calls = 0;
		const [destroy, rerender] = root((destroy) => {
			const rerender = source(0);
			useAsyncEffect(() => {
				rerender();
				return Promise.delay(0).then(() => {
					calls++;
				});
			});
			return $tuple(destroy, rerender);
		});
		task.wait(0.04);
		expect(calls).to.equal(1);
		rerender(1);
		destroy();
		expect(calls).to.equal(1);
	});

	it("should allow promises to complete", () => {
		let calls = 0;

		const destroy = root((destroy) => {
			useAsyncEffect(async () => {
				calls++;
				return Promise.delay(0).then(() => {
					calls++;
				});
			});
			return destroy;
		});

		expect(calls).to.equal(1);
		task.wait(0.04);
		expect(calls).to.equal(2);
		destroy();
	});
};
