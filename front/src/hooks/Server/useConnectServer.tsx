"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type {
	Message,
	DataEntryUser,
	DataExitUser,
	User,
	DataMessage,
} from "../../types/types";
import {
	compress,
	decompress,
} from "@/app/(room)/r/components/utils/CompressAndDescompress";
import { toast } from "sonner";

interface UseConnectServerProps {
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	usersOnline: React.MutableRefObject<User[]>;
	conversation: React.MutableRefObject<Message[]>;
	name: string;
	room: string;
	setsomeOnekeyPressed: React.Dispatch<React.SetStateAction<boolean>>;
	server: React.RefObject<Socket | null>;
	setOpenProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useConnectServer({
	setMessages,
	usersOnline,
	conversation,
	name,
	room,
	setsomeOnekeyPressed,
	server,
	setOpenProgress,
}: UseConnectServerProps) {
	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const rooms: string[] = [];
	rooms.push(room);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Its correct
	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: Its correct
		const socket: Socket<any, any> = io(process.env.NEXT_PUBLIC_URL_SOCKET, {
			path: "/ws",
			query: {
				name: name,
				rooms: room,
			},

			transports: ["websocket"],
		});

		socket.on("disconnect", (reason) => {
			console.log(`Client disconnect: ${reason}`);
			window.location.href = "/";
		});

		socket.on(
			"message",
			(message: DataEntryUser | DataExitUser | DataMessage) => {
				setsomeOnekeyPressed(false);

				switch (message.type) {
					case "entry":
						usersOnline.current = [
							...usersOnline.current,
							{ name: message.name, id: message.id },
						];
						break;
					case "exit":
						usersOnline.current = usersOnline.current.filter(
							(user) => user.name !== message.name,
						);
						break;
				}

				let messageDescompressed = message;

				if (message.type === "message") {
					messageDescompressed = {
						...message,
						message: decompress(message.message),
					};
				}

				conversation.current = [...conversation.current, messageDescompressed];
				setMessages(conversation.current);
			},
		);

		socket.on("connect_error", (reason) => {
			console.error(`Client connect_error: ${reason}`);
			window.location.href = "/";
		});

		socket.on("sendMessagesAndLogs", ({ id }: { id: string }) => {
			const compressed = compress(JSON.stringify(conversation.current));

			const chunkSize = 200 * 1024; // 200 kb
			const totalChunks = Math.ceil(compressed.length / chunkSize);

			for (let i = 0; i < totalChunks; i++) {
				const start = i * chunkSize;
				const end = start + chunkSize;
				const chunk = compressed.slice(start, end);

				socket.emit(`updatedLogsAndMessages`, {
					messages: JSON.stringify({
						index: i,
						total: totalChunks,
						data: chunk,
					}),
					logs: usersOnline.current, // redundant data but its ok
					idUser: id,
				});
			}
		});

		let receivedChunks: string[] = [];
		let totalChunksExpected = 0;

		socket.on(
			"missingMessagesAndLogs",
			(newData: { messages: string; logs: User[] }) => {
				setOpenProgress(true);

				const {
					index,
					total,
					data,
				}: { index: number; total: number; data: string } = JSON.parse(
					newData.messages,
				);

				totalChunksExpected = total;
				receivedChunks[index] = data;

				if (receivedChunks.filter(Boolean).length === totalChunksExpected) {
					const fullData = receivedChunks.join("");

					try {
						const messagesFromServer: Message[] = JSON.parse(
							decompress(fullData),
						);

						receivedChunks = [];
						totalChunksExpected = 0;

						setOpenProgress(false);

						usersOnline.current = [...usersOnline.current, ...newData.logs];
						conversation.current = [
							...conversation.current,
							...messagesFromServer,
						];
						setMessages(conversation.current);
					} catch (err) {
						toast.error("Error decompressing data", {
							duration: 5000,
							position: "top-center",
						});
						console.error("Error decompressing data", err);
					}
				}
			},
		);

		socket.on("userTyping", () => {
			setsomeOnekeyPressed(true);

			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			typingTimeoutRef.current = setTimeout(() => {
				setsomeOnekeyPressed(false);
				typingTimeoutRef.current = null;
			}, 1000);
		});

		server.current = socket;
	}, []);
}
