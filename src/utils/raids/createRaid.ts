import { prisma } from "../database/initHandle";
import { fetchTime } from "../database/timeKeeping";

export async function raidStart(rType: string, name: string, channelSent: string) {
	const time = await fetchTime();
	const timeBuffer = time + 2500;
	const rTypeDb = rType.split(" ")[1];
	await prisma.raids.upsert({
		where: { host: name },
		update: {
			startTime: time,
			type: rTypeDb,
			endTime: timeBuffer,
		},
		create: {
			host: name,
			startTime: time,
			type: rTypeDb,
			endTime: timeBuffer,
			channel: channelSent,
		},
	});
}

export async function raidCreate(tripTime: number, id: string, rType: string, channelSent: string) {
	const time = await fetchTime();
	const fin = time + tripTime;
	await prisma.raids.upsert({
		where: {
			host: id,
		},
		update: {
			startTime: time,
			endTime: fin,
		},
		create: {
			host: id,
			startTime: time,
			endTime: fin,
			type: rType,
			channel: channelSent,
		},
	});
}
