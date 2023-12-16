import { Message } from "discord.js";
import { raidTypes } from "../../lib/constants";
import { findTime } from "../osbComponents/tripHandle";
import { finalizeMass } from "./finalize";
import { raidCreate } from "./createRaid";
import { fetchRaidByID } from "./fetchRaid";
import { raidTyper } from "./raidUpdate";

export async function defaultRaidHandler(message: Message) {
	const content = message.content;
	const hosting = content.includes("depart");
	let raidType = raidTypes.find((a) => content.includes(a.name));
	if (
		content.includes("Theatre of blood") &&
		(content.includes("mass") || content.includes("raid"))
	)
		raidType = { name: "Theatre of blood", type: "Tob" };
	if (!raidType) return;
	if (hosting) {
		const host = content.split(" is hosting")[0];
		const newRaid = await fetchRaidByID(host, raidType.type, message.channel.id);
		if (raidType.type === newRaid?.type) return;
		await raidTyper(host, raidType.type);
	} else {
		const raidTime = (await findTime(content)).totalTimeSecs;
		let host = content.split("'s party")[0];
		if (host === content) {
			const fetch = content.split("\n");
			if (fetch.length === 3) {
				host = fetch[2].split(" ")[0];
			}
		}
		await raidCreate(raidTime, host, raidType.type, message.channel.id);

		return finalizeMass(message);
	}
}
