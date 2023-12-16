import DiscordClient from "./DiscordClient";
import Logger from "../classes/Logger";
import { Message } from "discord.js";
import { ICommandInfo } from "../utils/interfaces";

export default abstract class Command {
	/**
	 * Discord client.
	 */
	readonly client: DiscordClient;

	/**
	 * Information of the command.
	 */
	readonly info: ICommandInfo;

	constructor(client: DiscordClient, info: ICommandInfo) {
		this.client = client;
		this.info = info;
	}

	/**
	 * Executes when command throws an error.
	 * @param message Message object
	 * @param error Error message
	 */
	async onError(message: Message, error: any) {
		Logger.log("ERROR", `An error occurred in "${this.info.name}" command.\n${error}\n`, true);
		await message.channel.send({
			embeds: [
				{
					color: 0x2596be,
					title: "💥 Oops...",
					description: `${message.author}, an error occurred while running this command. Please try again later.`,
				},
			],
		});
	}

	abstract run(commandName: string, message: Message, args: string[]): Promise<any>;
}
