import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const cluesTypes = ["beginner", "easy", "medium", "hard", "elite", "master"];

export { prisma };
