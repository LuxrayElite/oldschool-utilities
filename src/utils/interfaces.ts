export interface IConfig {
	token: string;

	prefix: string;
}

export interface ICommandInfo {
	name: string;

	examples?: string[];

	description?: string;
}
