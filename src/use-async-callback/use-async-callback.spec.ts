import { root } from "@rbxts/vide";
import { useAsyncCallback } from ".";

export = () => {
	it("should return the current state and a callback", () => {
		const [destroy, result] = root((destroy) => {
			const [state, callback] = useAsyncCallback(() => Promise.resolve("foo"));
			return $tuple(destroy, { state, callback });
		});

		const state = result.state();

		expect(state.status).to.be.equal(Promise.Status.Started);
		expect(state.value).to.never.be.ok();
		expect(state.message).to.never.be.ok();
		expect(result.callback).to.be.a("function");
		destroy();
	});

	it("should update the state when the promise resolves", () => {
		const [destroy, result] = root((destroy) => {
			const [state, callback] = useAsyncCallback(() => Promise.resolve("foo"));
			return $tuple(destroy, { state, callback });
		});

		result.callback();
		const state = result.state();

		expect(state.status).to.be.equal(Promise.Status.Resolved);
		expect(state.value).to.be.equal("foo");
		expect(state.message).to.never.be.ok();
		destroy();
	});

	it("should update the state when the promise rejects", () => {
		const [destroy, result] = root((destroy) => {
			const [state, callback] = useAsyncCallback(() => Promise.reject("foo"));
			return $tuple(destroy, { state, callback });
		});

		result.callback();
		const state = result.state();

		expect(state.status).to.be.equal(Promise.Status.Rejected);
		expect(state.value).to.never.be.ok();
		expect(state.message).to.be.equal("foo");
		destroy();
	});

	it("should cancel the previous promise", () => {
		let completions = 0;
		const [destroy, result] = root((destroy) => {
			const [state, callback] = useAsyncCallback(() => Promise.delay(0).then(() => ++completions));
			return $tuple(destroy, { state, callback });
		});

		result.callback();
		result.callback();
		result.callback();

		expect(completions).to.be.equal(0);
		let state = result.state();

		expect(state.status).to.be.equal(Promise.Status.Started);
		expect(state.value).to.never.be.ok();
		expect(state.message).to.never.be.ok();

		task.wait(0.04);
		state = result.state();

		expect(completions).to.be.equal(1);
		expect(state.status).to.be.equal(Promise.Status.Resolved);
		expect(state.value).to.be.equal(1);
		expect(state.message).to.never.be.ok();
		destroy();
	});

	it("should cancel when unmounting", () => {
		let completions = 0;
		const [destroy, result] = root((destroy) => {
			const [state, callback] = useAsyncCallback(() => Promise.delay(0).then(() => ++completions));
			return $tuple(destroy, { state, callback });
		});

		result.callback();
		destroy();
		task.wait(0.04);
		expect(completions).to.be.equal(0);
	});
	it("should handle rejections", () => {
		let completions = 0;
		const [destroy, result] = root((destroy) => {
			const [state, callback] = useAsyncCallback(() =>
				Promise.reject("rejection").then(() => ++completions),
			);
			return $tuple(destroy, { state, callback });
		});

		result.callback();
		task.wait(0.04);
		expect(completions).to.be.equal(0);
		expect(result.state().status).to.be.equal(Promise.Status.Rejected);
		expect(result.state().value).to.never.be.ok();
		expect(result.state().message).to.be.equal("rejection");

		destroy();
	});
};
