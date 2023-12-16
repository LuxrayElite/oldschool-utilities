import client from "../client";

export async function debug(log: string) {
	const channel = client.channels.cache.get("1109226283793141831");
	if (channel.isTextBased()) {
		channel.send({ content: log });
	}
}
