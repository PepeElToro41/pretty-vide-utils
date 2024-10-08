import { cleanup } from "@rbxts/vide";

type EventLike<T extends Callback = Callback> =
	| { Connect(callback: T): ConnectionLike }
	| { connect(callback: T): ConnectionLike }
	| { subscribe(callback: T): ConnectionLike };

type ConnectionLike = { Disconnect(): void } | { disconnect(): void } | (() => void);

const connect = (event: EventLike, callback: Callback): ConnectionLike => {
	if (typeIs(event, "RBXScriptSignal")) {
		// With deferred events, a "hard disconnect" is necessary to avoid causing
		// state updates after a component unmounts. Use 'Connected' to check if
		// the connection is still valid before invoking the callback.
		// https://devforum.roblox.com/t/deferred-engine-events/2276564/99
		const connection = event.Connect((...args: unknown[]) => {
			if (connection.Connected) {
				return callback(...args);
			}
		});
		return connection;
	} else if ("Connect" in event) {
		return event.Connect(callback);
	} else if ("connect" in event) {
		return event.connect(callback);
	} else if ("subscribe" in event) {
		return event.subscribe(callback);
	} else {
		throw "Event-like object does not have a supported connect method.";
	}
};

const disconnect = (connection: ConnectionLike) => {
	if (typeIs(connection, "function")) {
		connection();
	} else if (typeIs(connection, "RBXScriptConnection") || "Disconnect" in connection) {
		connection.Disconnect();
	} else if ("disconnect" in connection) {
		connection.disconnect();
	} else {
		throw "Connection-like object does not have a supported disconnect method.";
	}
};

/**
 * Subscribes to an event-like object. The subscription is automatically
 * disconnected when the scope cleans up.
 *
 * @param event The event-like object to subscribe to.
 * @param listener The listener to subscribe with.
 * @returns The connection object.
 */
export function useEventListener<T extends EventLike>(
	event: T,
	listener: T extends EventLike<infer U> ? U : never,
): ReturnType<T> {
	const connection = connect(event, listener);

	cleanup(() => disconnect(connection));
	return connection as ReturnType<T>;
}
