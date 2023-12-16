import { prisma } from "../database/initHandle";
import { fetchTime } from "../database/timeKeeping";

export async function fetchRaids() {
	const timeGrab = await fetchTime();
	return prisma.raids.findMany({ where: { endTime: { gt: timeGrab } } });
}

export async function fetchRaidByID(id: string, rType?: string, channelID?: string) {
	const time = await fetchTime();
	const timeBuffer = time + 250;
	await prisma.raids.upsert({
		where: { host: id },
		update: {},
		create: {
			host: id,
			startTime: time,
			endTime: timeBuffer,
			type: rType,
			channel: channelID,
		},
	});
	const raid = await prisma.raids.findUnique({ where: { host: id } });
	return raid;
}
