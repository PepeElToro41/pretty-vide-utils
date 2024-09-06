import { createMotion, Motion, MotionGoal } from "@rbxts/ripple";
import { LockedSource, lockSource } from "../utils";
import { source } from "@rbxts/vide";
import { useEventListener } from "../use-event-listener";
import { RunService } from "@rbxts/services";

export function useMotion(initialValue: number): LuaTuple<[LockedSource<number>, Motion]>;
export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[LockedSource<T>, Motion<T>]>;

export function useMotion<T extends MotionGoal>(initialValue: T) {
	const motion = createMotion(initialValue);
	const motionValue = source(initialValue);

	useEventListener(RunService.Heartbeat, (delta) => {
		const value = motion.step(delta);
		if (value !== motionValue()) {
			motionValue(value);
		}
	});

	return $tuple(lockSource(motionValue), motion);
}
