import patches from "../../lib/filters/patches";
import { Message } from "discord.js";
import { updateTracker } from "../generic/trackers";
const herbs = [
	"watermelon",
	"snape grass",
	"guam",
	"marrentill",
	"tarromin",
	"harralander",
	"ranarr",
	"toadflax",
	"irit",
	"avantoe",
	"kwuarm",
	"snapdragon",
	"cadantine",
	"lantadyme",
	"dwarf",
	"torstol",
];

export async function trackers(message: Message, loweredMessageContent: string) {
	const isPlanting = loweredMessageContent.includes("then planting");
	const hasPlanted = loweredMessageContent.includes("finished planting");
	if (isPlanting || hasPlanted) {
		const patchFound = patches.find(
			(patch) =>
				patch.aliases.filter((alias) => loweredMessageContent.includes(alias)).length > 0,
		);
		if (patchFound) {
			const patchName = patchFound.name + "Harvest";
			await updateTracker(patchName, message.author.id);
		}
	}
	const isTog = loweredMessageContent.includes("visit juna");
	if (isTog) await updateTracker("togReady", message.author.id);
	const isBird = loweredMessageContent.includes(" baited the birdhouses");
	if (isBird) {
		const conditionalArray = [];
		herbs.forEach((herb) => {
			conditionalArray.push(loweredMessageContent.includes(herb));
		});
		if (conditionalArray.includes(true))
			message.channel.send("⚠️ You need to send a pp mf trip!⚠️ Now using herb seeds");
		await updateTracker("birdHarvest", message.author.id);
	}
}
