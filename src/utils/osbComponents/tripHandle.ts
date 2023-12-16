import { Message } from "discord.js";
import client from "../../client";
import { createEmbed } from "../generic/createEmbed";
import { taskEnd } from "../database/taskHandler";

interface Time {
	hours: number;
	minutes: number;
	seconds: number;
}

interface FoundTime extends Time {
	hours: number;
	minutes: number;
	seconds: number;
	totalTimeSecs: number;
	timeFound: boolean;
}

export async function findTime(str) {
	const times = str.match(/\d{1,2} (hours?|minutes?|seconds?)/g) ?? [];

	let biggestTime: FoundTime = {
		hours: 0,
		minutes: 0,
		seconds: 0,
		totalTimeSecs: 0,
		timeFound: false,
	};
	let currentTime: Time = { hours: 0, minutes: 0, seconds: 0 },
		lastUnit = "";

	for (const time of times) {
		const [val, unit] = time.split(" ");
		if (unit.includes("hour")) {
			biggestTime = compareTimes(currentTime, biggestTime);
			currentTime = { hours: Number(val), minutes: 0, seconds: 0 };
		} else if (unit.includes("minute")) {
			if (lastUnit.includes("second") || lastUnit.includes("minute")) {
				biggestTime = compareTimes(currentTime, biggestTime);
				currentTime = { hours: 0, minutes: Number(val), seconds: 0 };
			} else {
				currentTime.minutes = Number(val);
			}
		} else {
			if (lastUnit.includes("second")) {
				biggestTime = compareTimes(currentTime, biggestTime);
				currentTime = { hours: 0, minutes: 0, seconds: Number(val) };
			} else {
				currentTime.seconds = Number(val);
			}
		}
		lastUnit = unit;
	}

	biggestTime = compareTimes(currentTime, biggestTime);

	return biggestTime;
}

function compareTimes(currentTime, biggestTime) {
	if (
		currentTime.hours * 3600 + currentTime.minutes * 60 + currentTime.seconds >
		biggestTime.totalTimeSecs
	) {
		return {
			...currentTime,
			totalTimeSecs:
				currentTime.hours * 3600 + currentTime.minutes * 60 + currentTime.seconds,
			timeFound: currentTime.hours + currentTime.minutes + currentTime.seconds > 0,
		};
	}
	return biggestTime;
}
export async function tripHandler(message: Message, userId: string) {
	const endTime = await findTime(message.content);
	if (!endTime.timeFound || endTime.totalTimeSecs <= 0) {
		return;
	}

	await taskEnd(endTime.totalTimeSecs, userId);
	const tripTime = await createEmbed(endTime.totalTimeSecs, userId);

	const tripsChannel = client.channels.cache.get(message.channel.id);
	if (tripsChannel.isTextBased()) {
		tripsChannel.send({
			content: "",
			embeds: [tripTime],
		});
	}
}
