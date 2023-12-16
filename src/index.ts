// Getting and validating .env file
import EnvLoader from "./classes/EnvLoader";
EnvLoader.load();

// Setting up moment-timezone
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
dayjs.locale("en");
dayjs.tz.setDefault("Europe/London");

// Starting client
import client from "./client";
import Logger from "./classes/Logger";

client.once("ready", async () => {
	Logger.log("INFO", "Starting up");
	debugger;
});

client.login(client.config.token);
