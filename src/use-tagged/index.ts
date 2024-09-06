import { CollectionService } from "@rbxts/services";
import { source } from "@rbxts/vide";
import { useEventListener } from "../use-event-listener";
import { lockSource } from "../utils";

export function useTagged<T extends Instance = Instance>(tag: string) {
	const instances = source(CollectionService.GetTagged(tag));

	useEventListener(CollectionService.GetInstanceAddedSignal(tag), (instance) => {
		const nextInstances = table.clone(instances());
		nextInstances.push(instance);
		instances(nextInstances);
	});
	useEventListener(CollectionService.GetInstanceRemovedSignal(tag), (instance) => {
		const _instances = instances();
		const nextInstances = table.clone(_instances);
		nextInstances.unorderedRemove(_instances.indexOf(instance));
		instances(nextInstances);
	});

	return lockSource(instances) as () => T[];
}
