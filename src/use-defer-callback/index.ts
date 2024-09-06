import { RunService } from "@rbxts/services";
import { cleanup } from "@rbxts/vide";

/**
 * Defers a callback to be executed on the next Heartbeat frame. Consecutive
 * calls to the returned `execute` function will cancel the previous call.
 * @param callback The callback to defer
 * @returns A tuple containing the `execute` and `cancel` functions
 */
export function useDeferCallback<T extends unknown[]>(callback: (...args: T) => void) {
	let connection: RBXScriptConnection | undefined = undefined;

	function cancel() {
		if (connection !== undefined) {
			connection.Disconnect();
			connection = undefined;
		}
	}
	function execute(...args: T) {
		cancel();

		connection = RunService.Heartbeat.Once(() => {
			connection = undefined;
			callback(...args);
		});
	}

	cleanup(cancel);
	return $tuple(execute, cancel);
}
