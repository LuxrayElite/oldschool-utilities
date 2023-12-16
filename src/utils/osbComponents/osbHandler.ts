import { tripHandler } from "./tripHandle";
import { trackers } from "./timerHandle";
import { Message, User } from "discord.js";
import { componentHandler } from "./componentHandler";
import { pingHandler } from "./pingHandler";
import { clearTask, updateSlayer } from "../database/taskHandler";
import { fetchMinionUser, fetchUser } from "../database/fetchHandle";
import { clueTracker } from "../clues/clueFunctions";
import { updateTracker } from "../generic/trackers";

export async function botHandler(message: Message) {
	let minionName = "";
	const [tracked, user] = await determineUser(message);
	if (!tracked) return;
	if (message.interaction?.commandName === "minion daily")
		return updateTracker("dailyReady", user.id);
	if (message.interaction?.commandName === "minion cancel") return clearTask(user.id);
	minionName = await fetchMinionUser(user.id);

	const loweredMessageContent = message.content.toLowerCase();
	if (
		["depart", "are you sure", "confirm that you"].some((ele) =>
			loweredMessageContent.includes(ele),
		)
	)
		return;
	await slayerHandler(loweredMessageContent, user);

	if (message.mentions?.users.first() !== undefined && !loweredMessageContent.includes("nex!"))
		return pingHandler(message, loweredMessageContent, user.id);

	if ([minionName, user.username].some((ele) => loweredMessageContent.includes(ele))) {
		return departHandler(loweredMessageContent, message, user.id);
	}
	if (user?.id && message.components?.length >= 1) return componentHandler(message);
}

async function departHandler(content: string, message: Message, userId: string) {
	if (content.includes("clues")) {
		const preclue = content.split(" clues")[0].split(" ");
		const clue = preclue[preclue.length - 1];
		await clueTracker(clue, false, userId);
	}
	await trackers(message, content);
	if (["remaining", "charges", "loot/cost"].every((ele) => !content.includes(ele))) {
		return tripHandler(message, userId);
	}
}

async function slayerHandler(loweredMessageContent: string, user: User): Promise<void> {
	if (loweredMessageContent.includes("assigned")) {
		const findAssignment = loweredMessageContent.split("kill ")[1];
		if (!findAssignment) return;
		const assignment = findAssignment.split("x ");
		const monster = assignment[1].split("(")[0].replace(".", "");
		const amount = parseInt(assignment[0].replace("x", ""));
		await updateSlayer(monster, amount, user.id);
	}
}

async function determineUser(message: Message): Promise<[boolean, User | undefined]> {
	const defaultUser = message.interaction?.user ?? message.mentions.users.first();
	let replyUser: User = undefined;
	if (!defaultUser) {
		const replyCheck = message.reference?.messageId;
		if (replyCheck) {
			const reply = await message.fetchReference();
			if (reply.author.bot) replyUser = reply.mentions.users.first();
			else if (reply.interaction) replyUser = reply.interaction.user;
			else replyUser = reply.author;
		}
	}
	let trackedUser = false;
	if (defaultUser || replyUser) {
		trackedUser = defaultUser ? await fetchUser(defaultUser.id) : await fetchUser(replyUser.id);
	}
	const user = defaultUser ?? replyUser;
	return [trackedUser, user];
}
