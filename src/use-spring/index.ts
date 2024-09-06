import { MotionGoal, SpringOptions } from "@rbxts/ripple";
import { Derivable, effect } from "@rbxts/vide";
import { getDerivable, LockedSource, lockSource } from "../utils";
import { useMotion } from "../use-motion";

export function useSpring(goal: Derivable<number>, options?: SpringOptions): LockedSource<number>;
export function useSpring<T extends MotionGoal>(goal: Derivable<T>, options?: SpringOptions): LockedSource<T>;
export function useSpring(goal: Derivable<MotionGoal>, options?: SpringOptions) {
	const [value, motion] = useMotion(getDerivable(goal));

	effect(() => {
		const _goal = getDerivable(goal);
		motion.spring(_goal, options);
	});

	return lockSource(value);
}
