import { effect, source } from "@rbxts/vide";
import { useAsync } from ".";
import { Players } from "@rbxts/services";

async function GetUserId(name: string) {
	return Players.GetUserIdFromNameAsync(name);
}

function Component() {
	const username = source("PepeElToro41");

	const [userid] = useAsync(() => GetUserId(username()));
	effect(() => print(userid()));
}
