import { Message } from "discord.js";
import { componentHandler } from "./componentHandler";
import { clearTask, updateSlayer } from "../database/taskHandler";
import { clueTracker } from "../clues/clueFunctions";

export async function pingHandler(message: Message, lowered: string, userId: string) {
	if (message.components?.length >= 1) await componentHandler(message);
	await clearTask(userId);
	if (lowered.includes("slayer master")) {
		await updateSlayer("", 0, userId);
	} else if (lowered.includes("clue scroll")) {
		const clues = lowered.match(/.{11} clue scroll/gm);
		if (clues) {
			for (const scroll of clues) {
				const tier = scroll.split(" clue scroll")[0].split(" ");
				const aTier = tier[tier.length - 1];
				await clueTracker(aTier, true, userId);
			}
		}
	}
}
