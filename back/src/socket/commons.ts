import type { IoType, SocketType } from "../types/types";

import getQueryValue from "../utils/getQueryValue";
import { getRedisClient } from "../redis/db";
import logger from "../logger/logger";
import { v4 } from "uuid";

export default async function SocketCommons(socket: SocketType, io: IoType) {
	const db = getRedisClient();

	const roomUser = getQueryValue(socket.handshake.query.rooms);
	const nameUser = getQueryValue(socket.handshake.query.name);

	if (!roomUser || !nameUser) {
		socket.disconnect();
		return;
	}

	// Set name user to instance socket server
	socket.data.name = nameUser;

	// Join room
	socket.join(roomUser as string);

	// Add name to room on db
	try {
		await db.sAdd(`room:${roomUser}:users`, nameUser);
	} catch (error) {
		logger.error(`Error adding user to room on db: ${error}`);
	}

	/**
	 * When Someone is typing, the others users are notifield
	 */

	socket.on("userTyping", () => {
		io.to(roomUser as string)
			.except(socket.id)
			.emit("userTyping");
	});

	/**
	 * This event is returned when an user disconnect by Status Offline
	 */

	socket.on("UserOffline", () => {
		socket.disconnect();
	});

	/**
	 * This event is returned when an user disconnect from server
	 */

	socket.on("disconnect", async () => {
		try {
			await db.sRem(`room:${roomUser}:users`, nameUser);
		} catch (error) {
			logger.error(`Error removing user from room on db: ${error}`);
		}

		// get update info about the room
		const roomInfo = io.sockets.adapter.rooms.get(roomUser);

		if (roomInfo === undefined) {
			/**
			 * Clean db info about room when empty
			 */

			try {
				await db.sRem("rooms", roomUser as string);
				await db.del(`room:${roomUser}:users`);
				await db.sRem("rooms:private:code", roomUser);
			} catch (error) {
				logger.error(`Error cleaning room info from db: ${error}`);
			}
		}

		io.to(roomUser as string).emit("message", {
			type: "exit",
			id: socket.id,
			name: nameUser,
		});
	});

	/**
	 * Messages manager
	 */

	socket.on("message", (data) => {
		const hours = new Date().toLocaleTimeString("pt-BR", {
			timeZone: "America/Sao_Paulo",
			hour: "2-digit",
			minute: "2-digit",
		});

		io.to(roomUser as string).emit("message", {
			...data,
			idMessage: v4(),
			hours,
		});
	});
}
