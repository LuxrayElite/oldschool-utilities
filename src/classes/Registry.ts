import Command from "../structures/Command";
import DiscordClient from "../structures/DiscordClient";
import Event from "../structures/Event";
import Logger from "./Logger";
import path from "path";
import RegistryError from "../errors/RegistryError";
import requireAll from "require-all";
import { Collection } from "discord.js";
import { isConstructor } from "../utils/functions";

export default class Registry {
	private client: DiscordClient;

	private commands: Collection<string, Command>;

	private commandPaths: string[] = [];

	private events: Collection<string, Event>;

	private eventPaths: string[] = [];

	private newCollections() {
		this.commands = new Collection<string, Command>();
		this.events = new Collection<string, Event>();
	}

	constructor(client: DiscordClient) {
		this.client = client;
		this.newCollections();
	}

	private registerEvent(event: Event) {
		if (this.events.some((e) => e.name === event.name))
			throw new RegistryError(`A event with the name "${event.name}" is already registered.`);

		this.events.set(event.name, event);
		this.client.on(event.name, event.run.bind(event));
		Logger.log("INFO", `Event "${event.name}" loaded.`);
	}

	private registerAllEvents() {
		const events: any[] = [];

		if (this.eventPaths.length)
			this.eventPaths.forEach((p) => {
				delete require.cache[p];
			});

		requireAll({
			dirname: path.join(__dirname, "../events"),
			recursive: true,
			filter: /\w*.[tj]s/g,
			resolve: (x) => events.push(x),
			map: (name, filePath) => {
				if (filePath.endsWith(".ts") || filePath.endsWith(".js"))
					this.eventPaths.push(path.resolve(filePath));
				return name;
			},
		});

		for (let event of events) {
			const valid =
				isConstructor(event, Event) ||
				isConstructor(event.default, Event) ||
				event instanceof Event ||
				event.default instanceof Event;
			if (!valid) continue;

			if (isConstructor(event, Event)) event = new event(this.client);
			else if (isConstructor(event.default, Event)) event = new event.default(this.client);
			if (!(event instanceof Event))
				throw new RegistryError(`Invalid event object to register: ${event}`);

			this.registerEvent(event);
		}
	}

	private registerCommand(command: Command) {
		if (
			this.commands.some((x) => {
				if (x.info.name === command.info.name) return true;
				else return false;
			})
		)
			throw new RegistryError(
				`A command with the name/alias "${command.info.name}" is already registered.`,
			);
		this.commands.set(command.info.name, command);
	}

	private registerAllCommands() {
		const commands: any[] = [];

		if (this.commandPaths.length)
			this.commandPaths.forEach((p) => {
				delete require.cache[p];
			});

		requireAll({
			dirname: path.join(__dirname, "../commands"),
			recursive: true,
			filter: /\w*.[tj]s/g,
			resolve: (x) => commands.push(x),
			map: (name, filePath) => {
				if (filePath.endsWith(".ts") || filePath.endsWith(".js"))
					this.commandPaths.push(path.resolve(filePath));
				return name;
			},
		});
		let i = 0;
		for (let command of commands) {
			const valid =
				isConstructor(command, Command) ||
				isConstructor(command.default, Command) ||
				command instanceof Command ||
				command.default instanceof Command;
			if (!valid) continue;

			if (isConstructor(command, Command)) command = new command(this.client);
			else if (isConstructor(command.default, Command))
				command = new command.default(this.client);
			if (!(command instanceof Command))
				throw new RegistryError(`Invalid command object to register: ${command}`);

			this.registerCommand(command);
			i++;
		}
		Logger.log("INFO", `${i} Commands loaded.`);
	}

	findCommand(command: string): Command | undefined {
		return this.commands.get(command);
	}

	registerAll() {
		this.registerAllCommands();
		this.registerAllEvents();
	}

	reregisterAll() {
		const allEvents = [...this.events.keys()];
		allEvents.forEach((event) => this.client.removeAllListeners(event));
		this.newCollections();
		this.registerAll();
	}
}
