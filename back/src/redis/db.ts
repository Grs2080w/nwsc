import { createClient } from "redis";
import config from "../config/config";

const client = createClient({
	username: config.REDIS_USERNAME,
	password: config.REDIS_PASSWORD,
	socket: {
		host: config.REDIS_HOST,
		port: Number(config.REDIS_PORT),
	},
});

client.on("error", (err) => console.error("Redis Client Error", err));

export async function ConnectRedis() {
	await client.connect();

	client.del("rooms"); // clear rooms on server start
	const keys = await client.keys("rooms:*");
	if (keys.length) await client.del(keys); // clear room users on server start
}

export function getRedisClient() {
	return client;
}
