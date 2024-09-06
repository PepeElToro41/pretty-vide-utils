import { root } from "@rbxts/vide";
import { useCamera } from ".";
import { RunService, Workspace } from "@rbxts/services";

export = () => {
	it("should return current camera", () => {
		const [destroy, result] = root((destroy) => {
			const camera = useCamera();
			return $tuple(destroy, camera);
		});
		expect(result()).to.equal(Workspace.CurrentCamera);
	});

	it("should update when current camera changes", () => {
		const [destroy, result] = root((destroy) => {
			const camera = useCamera();
			return $tuple(destroy, camera);
		});
		expect(result()).to.equal(Workspace.CurrentCamera);
		Workspace.CurrentCamera?.Destroy(); // force camera change
		RunService.Heartbeat.Wait(); // task.wait() unreliable here

		expect(result()).to.equal(Workspace.CurrentCamera);
		destroy();
	});
};
