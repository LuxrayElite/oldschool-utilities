import { EmbedBuilder } from "discord.js";
import { fetchRaids } from "./fetchRaid";

export async function createMassList() {
	const raids = await fetchRaids();
	if (raids.length === 0) {
		return new EmbedBuilder()
			.setColor("#0050FF")
			.setDescription("No masses or broken code")
			.setTimestamp();
	}
	const massStr = raids
		.map(
			(raid) =>
				`${raid.type} in <#${raid.channel}> hosted by ${raid.host} returning <t:${raid.endTime}:R> (<t:${raid.endTime}:T>)`,
		)
		.join("\n");
	return new EmbedBuilder().setColor("#0050FF").setDescription(massStr).setTimestamp();
}
