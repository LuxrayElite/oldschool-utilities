import chalk from "chalk";
import dayjs from "dayjs";
import { LogType } from "../utils/types";

export default class Logger {
	static log(type: LogType, message: string, spaces = false, format = "DD/MM/YYYY HH:mm:ss") {
		let color: "green" | "yellow" | "red" | "blue";

		switch (type) {
			case "SUCCESS":
				color = "green";
				break;
			case "WARNING":
				color = "yellow";
				break;
			case "ERROR":
				color = "red";
				break;
			case "INFO":
				color = "blue";
				break;
		}

		console.log(
			`${spaces ? "\n" : ""}${chalk.magenta(`${dayjs().format(format)}`)} ${chalk[color].bold(
				`${type}`,
			)} ${message}${spaces ? "\n" : ""}`,
		);
	}
}
