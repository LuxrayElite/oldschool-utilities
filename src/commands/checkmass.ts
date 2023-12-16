import Command from "../structures/Command";
import DiscordClient from "../structures/DiscordClient";
import { Message } from "discord.js";
import { fetchRaids } from "../utils/raids/fetchRaid";
import { createMassList } from "../utils/raids/genericFunctions";

export default class CheckMassCommand extends Command {
	constructor(client: DiscordClient) {
		super(client, {
			name: "cm",
			description: "allows you to fetch an embed of on-going masses",
		});
	}

	async run(_commandName: string, message: Message) {
		const raids = await fetchRaids();
		if (raids.length === 0) return message.channel.send("There are no masses at the moment");
		else {
			const embed = await createMassList();
			return message.channel.send({ embeds: [embed] });
		}
	}
}
