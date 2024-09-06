import { source } from "@rbxts/vide";
import { useEventListener } from "../use-event-listener";
import { RunService } from "@rbxts/services";

/**
 * Returns the lifetime of the component in seconds. Updates every frame on
 * the Heartbeat event.
 *
 * @returns A binding of the component's lifetime.
 */
export function useLifetime<T>() {
	const lifetime = source(0);

	useEventListener(RunService.Heartbeat, (delta) => {
		lifetime(lifetime() + delta);
	});

	return lifetime;
}
