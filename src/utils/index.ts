import { Derivable, Source } from "@rbxts/vide";

export type LockedSource<T> = () => T;

export function lockSource<T>(source: Source<T>): () => T {
	return () => source();
}

export function getDerivable<T>(value: Derivable<T>): T {
	if (typeIs(value, "function")) {
		return value() as T;
	} else {
		return value as T;
	}
}

export function listenSources(...sources: (() => unknown)[]) {
	sources.forEach((source) => source());
}
