import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

// Db
import { ConnectRedis, getRedisClient } from "../redis/db";

// Socket handlers
import SocketCommons from "../socket/commons";
import SocketEntryAndTranfer from "../socket/entryAndTranfer";

// Routes
import createRoutes from "../routes/rooms";
import MountNextRoutes from "../routes/next";

// Types
import type {
	ClientToServerEvents,
	ServerToClientEvents,
} from "../types/types";

// Config
import config from "../config/config";

import cors from "cors";

export default async function main(withNext = false) {
	await ConnectRedis();

	const exapp = express();
	const server = createServer(exapp);
	const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
		path: "/ws",
	});

	exapp.use(cors());

	exapp.use("/", createRoutes());

	io.on("connection", async (socket) => {
		await SocketCommons(socket, io);
		await SocketEntryAndTranfer(socket, io);
	});

	const PORT = config.PORT || 3000;

	if (withNext) {
		const nextRoutes = await MountNextRoutes();
		exapp.use("/", nextRoutes);
	} else {
		exapp.get("*path", (_, res) => res.status(503).send("Service Unavailable"));
	}

	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}, withNext: ${withNext}`);
	});

	process.on("SIGINT", async () => {
		console.log("🛑 Closing Server...");
		server.close();
		io.close();
		await getRedisClient().quit();
		process.exit(0);
	});
}
