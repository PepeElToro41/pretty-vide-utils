import { cleanup, effect, source } from "@rbxts/vide";
import { useCamera } from "../use-camera";
import { lockSource } from "../utils";

export function useViewport(listener?: (viewport: Vector2) => void) {
	const camera = useCamera();
	const viewport = source(camera().ViewportSize);

	effect(() => {
		const _camera = camera();

		const connection = _camera.GetPropertyChangedSignal("ViewportSize").Connect(function () {
			viewport(_camera.ViewportSize);
			listener?.(_camera.ViewportSize);
		});

		viewport(_camera.ViewportSize);
		listener?.(_camera.ViewportSize);

		cleanup(() => connection.Disconnect());
	});

	return lockSource(viewport);
}
