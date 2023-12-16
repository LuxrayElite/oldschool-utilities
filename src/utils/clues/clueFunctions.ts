import { prisma } from "../database/initHandle";

export async function fetchClues(clue: string, userId: string) {
	const clueAmount = (await prisma.user.findUnique({ where: { id: userId } })).clues;
	return clueAmount[clue];
}

interface Clues {
	beginner: number;
	easy: number;
	medium: number;
	hard: number;
	elite: number;
	master: number;
	grandmaster: number;
}

export async function clueAmounts(userId: string) {
	let hasClues = false;
	const clueAmount = JSON.stringify(
		(await prisma.user.findUnique({ where: { id: userId } })).clues,
	);
	const clues: Clues = JSON.parse(clueAmount);
	for (const clue in clues) {
		if (clues[clue] > 0) hasClues = true;
	}
	return hasClues;
}

export async function clueTracker(clue: string, increase: boolean, userId: string) {
	const value = increase ? 1 : 0;
	const clueAmount = (await prisma.user.findUnique({ where: { id: userId } })).clues;
	clueAmount[clue] = value;
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			clues: clueAmount,
		},
	});
}
