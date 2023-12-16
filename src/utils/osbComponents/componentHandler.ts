import { Message } from "discord.js";
import { cluesTypes } from "../database/initHandle";
import { clueTracker } from "../clues/clueFunctions";

export async function componentHandler(message: Message) {
	if (
		message.content.includes("Nex") &&
		(message.content.includes("hosting") || message.content.includes("party"))
	)
		return;
	const compAmount = message.components[0].components.length;
	if (compAmount !== 0) {
		for (let i = 0; i < compAmount; i++) {
			const label = message.components[0].components[i].data["label"].toLowerCase();
			const clue = cluesTypes.find((ele) => `do ${ele} clue` === label);
			if (clue !== undefined)
				await clueTracker(clue, true, message.mentions.users.first()?.id);
		}
	}
}
