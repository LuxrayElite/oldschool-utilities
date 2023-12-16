import dotenv from "dotenv";
import EnvError from "../errors/EnvError";

export default class EnvLoader {
	static load() {
		dotenv.config();
		this.validate(process.env);
	}

	private static validate(env: any) {
		if (env.TOKEN === "") throw new EnvError("Discord token missing.");
	}
}
