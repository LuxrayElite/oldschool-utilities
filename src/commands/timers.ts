import Command from "../structures/Command";
import DiscordClient from "../structures/DiscordClient";
import { Message } from "discord.js";
import { fetchEmbed } from "../utils/generic/createEmbed";

export default class TimerCommand extends Command {
	constructor(client: DiscordClient) {
		super(client, {
			name: "t",
			description: "allows you to fetch an embed of the timers",
		});
	}

	async run(_commandName: string, message: Message) {
		const tripTime = await fetchEmbed(message.author.id);
		return message.channel.send({ embeds: [tripTime] });
	}
}
