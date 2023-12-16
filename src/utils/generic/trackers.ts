import { prisma } from "../database/initHandle";
import { fetchTime } from "../database/timeKeeping";

const additionalTime = {
	herbHarvest: 4980,
	birdHarvest: 3072,
	hesporiHarvest: 115370,
	togReady: 605100,
	hardwoodHarvest: 307250,
	dailyReady: 43210,
	seaweedHarvest: 2500,
	belladonnaHarvest: 19300,
	mushroomHarvest: 14500,
	vineHarvest: 2200,
	calquatHarvest: 76900,
	crystalHarvest: 28900,
	spiritHarvest: 230500,
	celastrusHarvest: 48100,
	redwoodHarvest: 384100,
	cactusHarvest: 4300,
	allotmentHarvest: 4900,
	flowerHarvest: 1300,
	hopsHarvest: 4900,
	treeHarvest: 28900,
	fruitHarvest: 57700,
	bushHarvest: 9700,
};

export async function updateTracker(trackerName: string, userId: string) {
	const timeGrab = await fetchTime();
	const readyAt = timeGrab + additionalTime[trackerName];
	const cached = await prisma.timers.findUnique({ where: { id: userId } });
	if (
		(trackerName === "birdHarvest" && cached.birdHarvest > timeGrab) ||
		(trackerName === "dailyReady" && cached.dailyReady > timeGrab)
	)
		return;
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			[trackerName]: readyAt,
		},
	});
}
