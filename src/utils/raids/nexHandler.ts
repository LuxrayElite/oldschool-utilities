import { Message } from "discord.js";
import { findTime } from "../osbComponents/tripHandle";
import { finalizeMass } from "./finalize";
import { raidCreate } from "./createRaid";
import { fetchRaidByID } from "./fetchRaid";
import { raidTyper } from "./raidUpdate";

export async function nexHandler(message: Message): Promise<void> {
	const content = message.content;
	const host = findHost(content);
	if (content.includes("hosting")) {
		const newRaid = await fetchRaidByID(host, "Nex", message.channel.id);
		const raidType = "Nex";
		if (raidType === newRaid?.type) return;
		return raidTyper(host, raidType);
	} else {
		const raidTime = (await findTime(content)).totalTimeSecs;
		await raidCreate(raidTime, host, "Nex", message.channel.id);
		return finalizeMass(message);
	}
}

function findHost(content) {
	const regex = new RegExp(/\*\* (.+)\n/);
	const match = content.match(regex);
	if (!match) {
		return content.split("'s ")[0];
	} else {
		return match[1].split(", ")[0];
	}
}
