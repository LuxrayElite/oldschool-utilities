import DiscordClient from "./structures/DiscordClient";
import { GatewayIntentBits } from "discord.js";
const client = new DiscordClient([
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
]);
export default client;
