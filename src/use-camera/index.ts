import { Workspace } from "@rbxts/services";
import { source } from "@rbxts/vide";
import { useEventListener } from "../use-event-listener";
import { lockSource } from "../utils";

/**
 * Returns the current camera. Updates when the current camera changes.
 * @returns A camera instance.
 */
export function useCamera() {
	const camera = source(Workspace.CurrentCamera!);

	useEventListener(Workspace.GetPropertyChangedSignal("CurrentCamera"), () => {
		if (Workspace.CurrentCamera) {
			camera(Workspace.CurrentCamera);
		}
	});

	return lockSource(camera);
}
