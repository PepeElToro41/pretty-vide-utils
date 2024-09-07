import { root, source } from "@rbxts/vide";
import { useAsync } from ".";

export = () => {
	FOCUS();
	it("should run the promise on mount", () => {
		const [destroy, result] = root((destroy) => {
			const [value, status, message] = useAsync(() => Promise.resolve("foo"));

			return $tuple(destroy, { value, status, message });
		});
		expect(result.status()).to.be.equal(Promise.Status.Resolved);
		expect(result.value()).to.be.equal("foo");
		expect(result.message()).to.never.be.ok();

		destroy();
	});

	it("should run the promise when the the effect re-runs", () => {
		const [destroy, result, sourceValue] = root((destroy) => {
			const sourceValue = source(0);
			const [value, status, message] = useAsync(() => {
				const value = sourceValue();
				return Promise.delay(0).then(() => value);
			});

			return $tuple(destroy, { value, status, message }, sourceValue);
		});

		task.wait(0.04);
		expect(result.status()).to.be.equal(Promise.Status.Resolved);
		expect(result.value()).to.be.equal(0);
		expect(result.message()).to.never.be.ok();

		sourceValue(1);
		task.wait(0.04);
		expect(result.status()).to.be.equal(Promise.Status.Resolved);
		expect(result.value()).to.be.equal(1);
		expect(result.message()).to.never.be.ok();
		destroy();
	});

	it("should cancel the previous promise", () => {
		let completions = 0;
		const [destroy, result, sourceValue] = root((destroy) => {
			const sourceValue = source(0);
			const [value, status, message] = useAsync(() => {
				sourceValue();
				return Promise.delay(0).then(() => ++completions);
			});

			return $tuple(destroy, { value, status, message }, sourceValue);
		});

		sourceValue(1);
		sourceValue(2);
		sourceValue(3);

		expect(completions).to.be.equal(0);
		expect(result.status()).to.be.equal(Promise.Status.Started);
		expect(result.value()).to.never.be.ok();
		expect(result.message()).to.never.be.ok();

		task.wait(0.04);
		expect(completions).to.be.equal(1);
		expect(result.status()).to.be.equal(Promise.Status.Resolved);
		expect(result.value()).to.be.equal(1);
		expect(result.message()).to.never.be.ok();

		destroy();
	});

	it("should update the state when the promise resolves", () => {
		const [destroy, result] = root((destroy) => {
			const [value, status, message] = useAsync(() => Promise.delay(0).then(() => "foo"));
			return $tuple(destroy, { value, status, message });
		});

		expect(result.status()).to.be.equal(Promise.Status.Started);
		expect(result.value()).to.never.be.ok();
		expect(result.message()).to.never.be.ok();

		task.wait(0.04);
		expect(result.status()).to.be.equal(Promise.Status.Resolved);
		expect(result.value()).to.be.equal("foo");
		expect(result.message()).to.never.be.ok();
		destroy();
	});

	it("should cancel the promise on cleanup", () => {
		let completions = 0;
		const destroy = root((destroy) => {
			useAsync(() => {
				return Promise.delay(0).then(() => {
					completions++;
				});
			});
			return destroy;
		});

		destroy();
		task.wait(0.04);
		expect(completions).to.be.equal(0);
	});
	it("should handle rejections", () => {
		let completions = 0;
		const [destroy, result] = root((destroy) => {
			const [value, status, message] = useAsync(() =>
				Promise.reject("rejection").then(() => ++completions),
			);
			return $tuple(destroy, { value, status, message });
		});

		task.wait(0.04);

		expect(completions).to.be.equal(0);
		expect(result.value()).to.never.be.ok();
		expect(result.message()).to.be.equal("rejection");
		expect(result.status()).to.be.equal(Promise.Status.Rejected);

		destroy();
	});
};
