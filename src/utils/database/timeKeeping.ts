import dayjs from "dayjs";
import { prisma } from "./initHandle";

export async function fetchTime(): Promise<number> {
	const timeGrab = dayjs().unix();
	return timeGrab;
}

export async function overFive(userId: string): Promise<boolean> {
	const task = await prisma.user.findUnique({ where: { id: userId } });
	const taskLength = task.endTime - task.startTime;
	return taskLength > 600;
}

export async function underOne(userId: string): Promise<boolean> {
	const timeGrab = await fetchTime();
	const task = await prisma.user.findUnique({ where: { id: userId } });
	const timeSince = timeGrab - task.startTime;
	return timeSince < 15;
}
