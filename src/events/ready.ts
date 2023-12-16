import DiscordClient from "../structures/DiscordClient";
import CommandHandler from "../classes/CommandHandler";
import Event from "../structures/Event";
import Logger from "../classes/Logger";
import { MessageQueue } from "./messageUpdate";

export default class ReadyEvent extends Event {
	constructor(client: DiscordClient) {
		super(client, "ready");
	}

	async run() {
		CommandHandler.SetupHandler(this.client);
		MessageQueue.SetupHandler(this.client);
		Logger.log("SUCCESS", `Logged in as "${this.client.user?.tag}".`);
	}
}
