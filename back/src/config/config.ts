import dotenv from "dotenv";
dotenv.config();

const PASSWORD_KEY = process.env.PASSWORD_KEY;
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

export default {
	PASSWORD_KEY,
	PORT,
	NODE_ENV,
	REDIS_USERNAME,
	REDIS_PASSWORD,
	REDIS_HOST,
	REDIS_PORT,
};
