import type { DefaultEventsMap, Server, Socket } from "socket.io";

interface User {
	name: string;
	id: string;
}

interface DataEntryUser {
	name: string | string[] | undefined;
	type: "entry";
	id: string;
}

interface DataExitUser {
	type: "exit";
	id: string;
	name?: string | string[] | undefined;
}

interface DataMessage {
	name: string;
	message: string;
	type: "message" | "image" | "reply";
	idMessage: string;
	hours: string;
}

interface UserControlLog {
	name: string;
}

type UserEntryType = "entry" | "exit";

interface logsAndMessages {
	messages: string;
	logs: User[];
	idUser?: string;
}

interface ServerToClientEvents {
	message: (data: DataEntryUser | DataExitUser | DataMessage) => void;
	userDesconect: (data: string[]) => void;
	userConnect: (data: string[]) => void;
	usersOnline: (data: User[]) => void;
	sendMessagesAndLogs: ({ id }: { id: string }) => void;
	missingMessagesAndLogs: (data: logsAndMessages) => void;
	userTyping: () => void;
}

interface ClientToServerEvents {
	message: (data: {
		message: string;
		name: string;
		type: "message" | "image" | "reply";
	}) => void;
	userEntry: (data: { name: string; type?: UserEntryType }) => void;
	arrayUsersOnline: (data: User[]) => void;
	tabopen: (data: string) => void;
	updatedLogsAndMessages: (data: logsAndMessages) => void;
	userTyping: () => void;
	UserOffline: () => void;
}

type SocketType = Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	DefaultEventsMap
>;
type IoType = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	DefaultEventsMap
>;

export type {
	ServerToClientEvents,
	ClientToServerEvents,
	UserControlLog,
	SocketType,
	IoType,
};
