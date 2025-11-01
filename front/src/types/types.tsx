interface DataEntryUser {
	name: string;
	type: "entry";
	id: string;
}

interface DataExitUser {
	type: "exit";
	id: string;
	name?: string;
}

interface DataMessage {
	name: string;
	message: string;
	type: "message" | "image" | "reply";
	hours: string;
	id: string;
}

interface User {
	name: string;
	id: string;
}

type TypeMessage = DataEntryUser | DataExitUser | DataMessage;

interface UserControl {
	name: string;
	id: string;
}

type Message = DataEntryUser | DataExitUser | DataMessage;

export type {
	DataEntryUser,
	DataExitUser,
	DataMessage,
	UserControl,
	TypeMessage,
	User,
	Message,
};
