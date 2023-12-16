import { Message } from "discord.js";
import Logger from "../../classes/Logger";
import { botHandler } from "../osbComponents/osbHandler";
import { createMassList } from "./genericFunctions";

export async function finalizeMass(message: Message) {
	Logger.log("INFO", `Creating raid list`);
	const embed = await createMassList();
	message.channel.send({ embeds: [embed] });
	botHandler(message);
}
