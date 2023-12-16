import "discord.js";

declare module "discord.js" {
	interface ClientEvents {
		raw: [packet: any];
	}

	interface Client {
		emit(event: "ready"): boolean;
	}
}
