import Command from "../structures/Command";
import DiscordClient from "../structures/DiscordClient";
import { Message } from "discord.js";
import { createUser } from "../utils/database/storeHandle";

export default class TimerCommand extends Command {
	constructor(client: DiscordClient) {
		super(client, {
			name: "track",
			description: "allows your trips to be tracked by the bot",
		});
	}

	async run(_commandName: string, message: Message, args: string[]) {
		const user = message.author.id;
		if (args.length > 1 || args.length === 0)
			return message.channel.send("Please only include your minion name e.g -track lux");
		const minionName = args[0].toLowerCase();
		await createUser(user, minionName);
		return message.channel.send("I am now tracking your trips");
	}
}
