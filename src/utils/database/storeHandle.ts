import { prisma } from "./initHandle";

export async function createUser(userId: string, minionName: string) {
	await prisma.user.upsert({
		where: {
			id: userId,
		},
		update: {
			minion: minionName,
		},
		create: {
			id: userId,
			minion: minionName,
		},
	});
	await prisma.timers.upsert({
		where: {
			authorId: userId,
		},
		update: {},
		create: {
			authorId: userId,
		},
	});
}
