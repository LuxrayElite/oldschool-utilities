import dayjs from "dayjs";
import { EmbedBuilder } from "discord.js";

export function createMassEmbed(seconds: number) {
	const endTime = dayjs().unix() + seconds;

	const embed = new EmbedBuilder()
		.setColor("#0050FF")
		.setDescription(`Mass returning in <t:${endTime}:R> (<t:${endTime}:T>)`)
		.setTimestamp();

	return embed;
}
