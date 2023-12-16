import dayjs from "dayjs";
import { EmbedBuilder } from "discord.js";
import { Emoji } from "../../lib/constants";
import { fetchTimers, fetchSlayer, fetchMinionUser } from "../database/fetchHandle";
import { clueAmounts } from "../clues/clueFunctions";

async function strEmbed(
	[task, bird, herb, tog, daily, hesp, hwood]: number[] = [],
	userId: string,
) {
	const user = await fetchMinionUser(userId);
	const hasClue = await clueAmounts(userId);
	const slayer = await fetchSlayer(userId);
	let tripStr = `${Emoji["minion"]} <t:${task}:R> (<t:${task}:T>)`;
	tripStr += bird > 0 ? `\n${Emoji["birdhouse"]} <t:${bird}:R> (<t:${bird}:T>)` : "";
	tripStr += herb > 0 ? `\n${Emoji["herblore"]} <t:${herb}:R> (<t:${herb}:T>)` : "";
	tripStr += daily > 0 ? `\n${Emoji["daily"]} <t:${daily}:R> (<t:${daily}:T>)` : "";
	tripStr += hesp > 0 ? `\n${Emoji["hespori"]} <t:${hesp}:R> (<t:${hesp}:T>)` : "";
	tripStr += hwood > 0 ? `\n${Emoji["hardwood"]} <t:${hwood}:R> (<t:${hwood}:T>)` : "";
	tripStr += tog > 0 ? `\n${Emoji["tears"]} <t:${tog}:R> (<t:${tog}:T>)` : "";
	tripStr += hasClue ? `\n${Emoji["clue"]} Clue in bank` : "";
	tripStr += slayer !== "No assignment" ? `\n${Emoji["slayer"]} ${slayer}` : "";
	const tripTime = new EmbedBuilder()
		.setColor("#00FF25")
		.setTitle(`${user}'s Timer`)
		.setDescription(`${tripStr}`)
		.setTimestamp();

	return tripTime;
}

export async function createEmbed(seconds: number, userId: string) {
	const endTime = dayjs().unix() + seconds;
	const [, bird, herb, tog, daily, hesp, hwood] = await fetchTimers(userId);
	return strEmbed([endTime, bird, herb, tog, daily, hesp, hwood], userId);
}

export async function fetchEmbed(userId: string) {
	const [task, bird, herb, tog, daily, hesp, hwood] = await fetchTimers(userId);
	return strEmbed([task, bird, herb, tog, daily, hesp, hwood], userId);
}
