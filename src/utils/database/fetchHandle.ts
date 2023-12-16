import { prisma } from "./initHandle";

export async function fetchUser(userId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	const found = user !== undefined;
	return found;
}

export async function fetchMinionUser(userId: string) {
	const name = (await prisma.user.findUnique({ where: { id: userId } })).minion;
	return name;
}

export async function fetchTimers(userId: string) {
	const [timers, task] = await Promise.all([
		prisma.timers.findUnique({ where: { authorId: userId } }),
		prisma.user.findUnique({ where: { id: userId } }),
	]);
	const { birdHarvest, herbHarvest, togReady, dailyReady, hesporiHarvest, hardwoodHarvest } =
		timers;
	const trip = task.endTime;
	return [trip, birdHarvest, herbHarvest, togReady, dailyReady, hesporiHarvest, hardwoodHarvest];
}

export async function fetchSlayer(userId: string) {
	let slayerTask =
		(await prisma.user.findUnique({ where: { id: userId } })).slayerTask ?? "No assignment";
	if (slayerTask !== "No assignment")
		slayerTask =
			(await prisma.user.findUnique({ where: { id: userId } })).slayerAmount > 0
				? slayerTask
				: `No assignment`;
	return slayerTask;
}
