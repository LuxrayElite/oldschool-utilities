import Registry from "../classes/Registry";
import { Client, GatewayIntentBits } from "discord.js";
import { IConfig } from "../utils/interfaces";

export default class DiscordClient extends Client {
	/**
	 * Registry of the client.
	 */
	readonly registry: Registry;

	/**
	 * Config of the client.
	 */
	readonly config: IConfig;

	constructor(intents: GatewayIntentBits[]) {
		super({ intents });

		/**
		 * Setting up client's config.
		 */
		this.config = {
			token: process.env.TOKEN,
			prefix: process.env.PREFIX,
		};

		/**
		 * Creating new registry class.
		 */
		this.registry = new Registry(this);

		/**
		 * Registering events and commands.
		 */
		this.registry.registerAll();
	}
}
