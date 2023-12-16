import Logger from "../../classes/Logger";
import { prisma } from "./initHandle";
import { fetchTime } from "./timeKeeping";

export async function clearTask(userId: string) {
	const timeGrab = await fetchTime();
	Logger.log("INFO", `Task has been cleared`);
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			endTime: timeGrab - 5,
		},
	});
}

export async function taskEnd(tripTime: number, userId: string) {
	const timeGrab = await fetchTime();
	const taskLength = timeGrab + tripTime + 10;
	Logger.log("INFO", `Activity time has been updated`);
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			startTime: timeGrab,
			endTime: taskLength,
		},
	});
}

export async function updateSlayer(assign: string, amount: number, userId: string) {
	await prisma.user.update({
		where: { id: userId },
		data: {
			slayerTask: assign,
			slayerAmount: amount,
		},
	});
}
