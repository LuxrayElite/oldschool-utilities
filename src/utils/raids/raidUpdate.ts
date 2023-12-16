import { prisma } from "../database/initHandle";
import { fetchTime } from "../database/timeKeeping";

export async function raidTyper(name: string, raid: string) {
	await prisma.raids.update({
		where: { host: name },
		data: {
			type: raid,
		},
	});
}

export async function raidWipe() {
	const timeGrab = await fetchTime();
	await prisma.raids.deleteMany({
		where: {
			endTime: {
				lt: timeGrab,
			},
		},
	});
}

export async function raidError(id: string) {
	await prisma.raids.delete({
		where: { host: id },
	});
}
