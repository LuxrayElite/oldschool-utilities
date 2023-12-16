import CommandHandler from "../classes/CommandHandler";
import DiscordClient from "../structures/DiscordClient";
import Event from "../structures/Event";
import { botHandler } from "../utils/osbComponents/osbHandler";
import { Message, ChannelType } from "discord.js";
import { raidStart } from "../utils/raids/createRaid";

export default class MessageEvent extends Event {
	constructor(client: DiscordClient) {
		super(client, "messageCreate");
	}
	async run(message: Message) {
		if (message.content.includes("depart")) {
			return;
		}

		if (message.author.username === "Old School Bot" && message.author.bot) {
			return botConditions(message);
		}
		if (message.author.bot || message.channel.type === ChannelType.DM) {
			return;
		} else {
			await CommandHandler.handleCommand(message);
		}
	}
}

async function botConditions(message: Message) {
	if (
		["raid cox start", "raid tob start", "raid toa start"].some(
			(ele) => message.interaction?.commandName === ele,
		)
	) {
		return raidStart(
			message.interaction.commandName,
			message.interaction.user.username,
			message.channel.id,
		);
	}

	return botHandler(message);
}
