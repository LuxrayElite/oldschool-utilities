import DiscordClient from "../structures/DiscordClient";
import { Message } from "discord.js";
import Command from "../structures/Command";
import { debug } from "../utils/debug";
import { raidWipe } from "../utils/raids/raidUpdate";

class QueuedCommand {
	message: Message;
	command: Command;

	private commandName: string;
	private args: string[];

	constructor(message: Message, command: Command, commandName: string, args: string[]) {
		this.message = message;
		this.command = command;
		this.commandName = commandName;
		this.args = args;
	}

	async runCommand() {
		await this.command.run(this.commandName, this.message, this.args);
	}
}

export default class CommandHandler {
	private static instance: CommandHandler;

	private commandQueue: QueuedCommand[];
	private client: DiscordClient;

	private constructor() {
		this.commandQueue = [];
	}

	static SetupHandler(client: DiscordClient) {
		if (!CommandHandler.instance) {
			CommandHandler.instance = new CommandHandler();
		}
		CommandHandler.instance.client = client;
	}

	static async handleCommand(message: Message) {
		await CommandHandler.instance.enqueueCommand(message);
	}

	async enqueueCommand(message: Message) {
		//Preprocess command
		const prefix = this.client.config.prefix;
		if (!message.content.toLowerCase().startsWith(prefix)) return;

		const messageParts = message.content.slice(prefix.length).trim().split(/ +/g);
		const args = messageParts.filter((a) => !a.includes("--") && !a.includes("—"));

		const commandName = args?.shift()?.toLowerCase();
		const command = this.client.registry.findCommand(commandName);

		if (command === undefined) {
			return message.channel.send("This command hasn't been implemented");
		}

		//Queue command if it's valid
		this.commandQueue.push(new QueuedCommand(message, command, commandName, args));
		//Start running the queue if we got an empty queue
		if (this.commandQueue.length === 1) {
			//Continue running the queue untill it's empty (it's possible that other commands get queued in the mean time)
			while (this.commandQueue.length >= 1) {
				const queuedCommand = this.commandQueue[0];
				await raidWipe();
				try {
					await queuedCommand.runCommand();
				} catch (err) {
					await debug(String(err));
					message.channel.send("Lux has broken something");
				}

				this.commandQueue.shift();
			}
		}
	}
}
