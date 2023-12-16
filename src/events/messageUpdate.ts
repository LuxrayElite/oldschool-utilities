import { Message } from "discord.js";
import DiscordClient from "../structures/DiscordClient";
import Event from "../structures/Event";
import Logger from "../classes/Logger";
import client from "../client";
import { fetchClues } from "../utils/clues/clueFunctions";
import { componentHandler } from "../utils/osbComponents/componentHandler";
import { botHandler } from "../utils/osbComponents/osbHandler";
import { defaultRaidHandler } from "../utils/raids/defaultHandler";
import { nexHandler } from "../utils/raids/nexHandler";

export default class MessageEvent extends Event {
	constructor(client: DiscordClient) {
		super(client, "messageUpdate");
	}
	async run(message: Message) {
		if (!message.author.bot) return;
		MessageQueue.instance.enqueueCommand(message);
	}
}

class QueuedEvent {
	message: Message;
	client: DiscordClient;

	constructor(message: Message) {
		this.message = message;
		this.client = client;
	}
	async runCommand(message: Message) {
		const newMessage = this.message.reactions.message;
		const content = newMessage.content;
		//Handles messages which are "defered"
		if (
			["killing", "planting", "harvesting", "birdhouse", "assign"].some(
				(ele) => content.includes(ele) && !content.includes("Nex"),
			)
		)
			return botHandler(newMessage);
		//Handles messages related to checking gear/CA's/raid errors
		if (
			[
				"Hall of Fame",
				"Streak for",
				"Uniques",
				"aren't able",
				"You completed",
				"ready to do",
			].some((ele) => content.includes(ele))
		)
			return;

		Logger.log("INFO", `Entering raid checkers`);
		if (content.includes("Nex")) {
			Logger.log("INFO", `Passing to nex handler`);
			if (message.content !== "") await nexHandler(message);
			await nexHandler(newMessage);
		} else if (
			message.interaction?.commandName === "open" ||
			newMessage.interaction?.commandName === "open"
		) {
			Logger.log("INFO", `Passing to opening handler`);
			return openablesHandler(message, newMessage);
		} else {
			Logger.log("INFO", `Passing to raid handler`);
			await defaultRaidHandler(newMessage);
		}
	}
}

export class MessageQueue {
	static instance: MessageQueue;
	private messageQueue: QueuedEvent[];
	private client: DiscordClient;
	private constructor() {
		this.messageQueue = [];
	}
	static SetupHandler(client: DiscordClient) {
		if (!MessageQueue.instance) {
			MessageQueue.instance = new MessageQueue();
		}
		MessageQueue.instance.client = client;
	}

	async enqueueCommand(message: Message) {
		this.messageQueue.push(new QueuedEvent(message));
		if (this.messageQueue.length === 1) {
			while (this.messageQueue.length >= 1) {
				const queuedCommand = this.messageQueue[0];
				await queuedCommand.runCommand(message);
				this.messageQueue.shift();
			}
		}
	}
}

async function openablesHandler(original: Message, message: Message): Promise<void> {
	await fetchClues("master", message.author.id);
	const buttons = message.components[0]?.components.length;
	const alt = message.components[0]?.components.length;
	if (buttons >= 1) {
		return componentHandler(message);
	}
	if (alt >= 1) {
		return componentHandler(original);
	}
}
