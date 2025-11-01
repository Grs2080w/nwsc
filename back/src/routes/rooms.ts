import express from "express";

import { getRedisClient } from "../redis/db";
import logger from "../logger/logger";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { v7 } from "uuid";
import { z } from "zod";

export default function createRoutes() {
	const router = express.Router();

	const db = getRedisClient();

	/**
	 * Route to check if name is available in a private room
	 * */

	router.get("/:room/private/:name", async (req, res) => {
		try {
			const room = req.params.room as string;
			const name = req.params.name as string;

			try {
				SchemaEnterRoom.parse({ room, name });
			} catch (error) {
				logger.error(error);
				res.status(400).send({ status: "Bad request" });
				return;
			}

			const alreadyExists = await db.sIsMember(
				`room:${room}:users`,
				name.toLowerCase(),
			);

			if (alreadyExists) {
				res.status(400).send({ status: "Name already used" });
				return;
			}

			res.status(200).send({ status: "ok" });
		} catch (error) {
			logger.error(error);
			res.status(500).send({ err: "Error checking room, try again" });
			return;
		}
	});

	/**
	 * Route to check if name is available and if the room exists
	 * */

	router.get("/:room/new/:name", async (req, res) => {
		try {
			const room = req.params.room as string;
			const name = req.params.name as string;

			try {
				SchemaEnterRoom.parse({ room, name });
			} catch (error) {
				logger.error(error);
				res.status(400).send({ status: "Bad request" });
				return;
			}

			const roomExists = await db.sIsMember("rooms", room);

			if (!roomExists) {
				res.status(404).send({ status: "Room not found" });
				return;
			}

			const alreadyExists = await db.sIsMember(
				`room:${room}:users`,
				name.toLowerCase(),
			);

			if (alreadyExists) {
				res.status(400).send({ status: "Name already used" });
				return;
			}

			res.status(200).send({ status: "ok" });
		} catch (error) {
			logger.error(error);
			res.status(500).send({ err: "Error checking room, try again" });
			return;
		}
	});

	/**
	 * Route to create a private room
	 */

	router.post("/rooms/create/private", async (_, res) => {
		try {
			const idRoom = v7();

			async function getCode() {
				let code = "";
				let exists = true;
				while (exists) {
					code = Math.floor(Math.random() * 1000000)
						.toString()
						.padStart(6, "0");
					exists = Boolean(await db.sIsMember("rooms:private:code", code));
					exists = Boolean(await db.sIsMember("rooms", code));
				}
				return code;
			}

			const code = await getCode();

			// Storage the id of the room
			await db.zAdd("rooms:private:ids", {
				score: Date.now() + 1000 * 60 * 60 * 24 * 3,
				value: idRoom,
			});

			// Storage the code of the private room
			await db.sAdd("rooms:private:code", code);

			// Storage the code of the room, associated to the id
			await db.set(`rooms:private:${idRoom}`, code, { EX: 60 * 60 * 24 * 3 });

			/**
			 * Just the id goes to the client, the secret to connect on the room is the code,
			 * and its just can find on server with the id.
			 * This secret code is stored in a diferent database of the normal rooms,
			 * So the client cant connect on the room without the id
			 */

			const token = jwt.sign({ id: idRoom }, config.PASSWORD_KEY as string, {
				expiresIn: "1d",
			});

			res.status(200).send({ success: true, token });
			return;
		} catch (error) {
			logger.error(error);
			res.status(500).send({ err: "Error creating room, try again" });
			return;
		}
	});

	/**
	 * Route to Add a new Room
	 * */

	router.post("/rooms/create/:code", async (req, res) => {
		try {
			const code = req.params.code;

			try {
				SchemaCreateRoom.parse({ code });
			} catch (error) {
				logger.error(error);
				res.status(400).send({ err: "bad request" });
				return;
			}

			const roomExists = await db.sIsMember("rooms", code);
			const roomExistsPrivate = await db.sIsMember("rooms:private:code", code);

			if (roomExistsPrivate || roomExists) {
				return res.status(400).send({ err: "Room already exist" });
			}

			await db.sAdd("rooms", code);

			res.status(200).send({ success: true, code });
			return;
		} catch (error) {
			logger.error(error);
			res.status(500).send({ err: "Error creating room, try again" });
			return;
		}
	});

	/**
	 * Route to get the code of a private room
	 */

	router.get("/rooms/room/private/:token", async (req, res) => {
		try {
			const token = req.params.token;

			try {
				const tokenDecoded = jwt.verify(
					token,
					config.PASSWORD_KEY as string,
				) as {
					id: string;
				};

				const roomExists = await db.zScore(
					"rooms:private:ids",
					tokenDecoded.id,
				);

				if (!roomExists) {
					return res.status(400).send({ err: "Room not found" });
				}

				const code = await db.get(`rooms:private:${tokenDecoded.id}`);

				if (!code) {
					return res.status(400).send({ err: "Room not found" });
				}

				db.zRemRangeByScore("rooms:private:ids", 0, Date.now());

				res.status(200).send({ success: true, code });
				return;
			} catch (error) {
				logger.error(error);
				res.status(400).send({ err: "Bad request" });
				return;
			}
		} catch (error) {
			logger.error(error);
			res.status(500).send({ err: "Error creating room, try again" });
			return;
		}
	});

	/**
	 * Route to check if the server is working
	 * */

	router.get("/check", (_, res) => {
		res.status(200).send({ status: "ok" });
	});

	if (config.NODE_ENV === "development") {
		/**
		 * Route to get all rooms
		 * */

		router.get("/rooms", async (_, res) => {
			const rooms = await db.sMembers("rooms");
			res.status(200).send({ rooms });
		});

		/**
		 * Route to get all users in a room
		 */

		router.get("/rooms/:code", async (req, res) => {
			const code = req.params.code;

			const users = await db.sMembers(`room:${code}:users`);
			res.status(200).send({ users });
		});
	}

	return router;
}

export const SchemaEnterRoom = z.object({
	room: z
		.string()
		.min(5, "Room code must be at least 5 characters")
		.max(7, "Room code must be at most 7 characters"),
	name: z
		.string()
		.min(2, "Name must be at least 3 characters")
		.max(20, "Name must be at most 20 characters"),
});

export const SchemaCreateRoom = z.object({
	code: z
		.string()
		.min(5, "Room code must be at least 5 characters")
		.max(7, "Room code must be at most 7 characters"),
});
