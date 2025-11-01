import type { IoType, SocketType } from "../types/types";
import getRandomFromSet from "../utils/getRandomFromSet";
import getQueryValue from "../utils/getQueryValue";
import jwt from "jsonwebtoken";

import config from "../config/config";
import logger from "../logger/logger";

export default async function SocketEntryAndTranfer(
	socket: SocketType,
	io: IoType,
) {
	const nameUser = getQueryValue(socket.handshake.query.name);
	const roomUser = getQueryValue(socket.handshake.query.rooms);

	if (!roomUser || !nameUser) {
		socket.disconnect();
		return;
	}

	const room = io.sockets.adapter.rooms.get(roomUser);

	if (!room) {
		socket.disconnect();
		return;
	}

	const roomSize = io.sockets.adapter.rooms.get(roomUser)?.size ?? 0;

	/**
	 * If the client is the first on the room, the server sends a message to all clients in the room
	 * If not the first, send to all clients in the room except the current client
	 * To prevent the duplicate entry on front
	 */

	const ID_USER = jwt.sign({ id: socket.id }, config.PASSWORD_KEY as string, {
		expiresIn: "1d",
	});

	roomSize === 1 &&
		io.to(roomUser).emit("message", {
			name: nameUser,
			type: "entry",
			id: ID_USER,
		});

	roomSize >= 2 &&
		io.to(roomUser).except(socket.id).emit("message", {
			name: nameUser,
			type: "entry",
			id: ID_USER,
		});

	/**
	 * The server sends the missing messages and logs to the ramdom client
	 */

	if (roomSize >= 2) {
		const token = jwt.sign({ id: socket.id }, config.PASSWORD_KEY as string, {
			expiresIn: 15,
			issuer: "nwsc-server",
			audience: "nwsc-server",
		});

		const ramdomIdUser: string = getRandomFromSet(room, socket.id);

		io.to(ramdomIdUser as string).emit("sendMessagesAndLogs", {
			id: token,
		});
	}

	/**
	 * Some Client sends the messages and Logs updated
	 * And this messages and logs are send to the recent client connected
	 * On front, this user will be updated with missing messages and logs
	 */

	socket.on("updatedLogsAndMessages", async (data) => {
		const logSet = new Set(data.logs);
		const logArray = Array.from(logSet);

		try {
			// biome-ignore lint/suspicious/noExplicitAny: Its correct
			const { id }: any = jwt.verify(
				data.idUser as string,
				config.PASSWORD_KEY as string,
			);
			io.to(id as string).emit("missingMessagesAndLogs", {
				messages: data.messages,
				logs: logArray,
			});
		} catch (err) {
			logger.error("Error verifying token for updatedLogsAndMessages:", err);
		}
	});
}
