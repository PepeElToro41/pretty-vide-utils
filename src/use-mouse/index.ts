import { UserInputService } from "@rbxts/services";
import { source } from "@rbxts/vide";
import { useEventListener } from "../use-event-listener";
import { lockSource } from "../utils";

/**
 * Returns a binding to the mouse position.
 * @param listener Optional listener to be called when the mouse position changes.
 * @returns A binding to mouse position.
 */
export function useMouse(listener?: (mouse: Vector2) => void) {
	const mouse = source(UserInputService.GetMouseLocation());

	useEventListener(UserInputService.InputBegan, (input) => {
		const mouseMovement = input.UserInputType === Enum.UserInputType.MouseMovement;
		const touch = input.UserInputType === Enum.UserInputType.Touch;

		if (mouseMovement || touch) {
			const location = UserInputService.GetMouseLocation();
			mouse(location);
			if (listener) {
				listener(location);
			}
		}
	});

	if (listener) {
		listener(mouse());
	}

	return lockSource(mouse);
}
