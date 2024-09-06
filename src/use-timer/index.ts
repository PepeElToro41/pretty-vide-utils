import { source } from "@rbxts/vide";
import { useEventListener } from "../use-event-listener";
import { RunService } from "@rbxts/services";
import { lockSource } from "../utils";

/**
 * Creates a timer that can be used to track a value over time.
 * @param initialValue The initial value of the timer.
 * @returns A timer object.
 */
export function useTimer(initial = 0) {
	const timer = source(initial);
	let started = true;

	useEventListener(RunService.Heartbeat, (delta) => {
		if (started) {
			timer(timer() + delta);
		}
	});

	function start() {
		started = true;
	}
	function stop() {
		started = false;
	}
	function reset() {
		timer(0);
	}
	function set(value: number) {
		timer(value);
	}

	return { timer: lockSource(timer), start, stop, reset, set };
}
