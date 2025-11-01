import type { TypeMessage, DataMessage } from "@/types/types";

// Utils
import { decompress } from "../utils/CompressAndDescompress";

// Components
import MessageFriendChat from "./components/MessageFriendChat";
import MessageUserEntry from "./components/MessageUserEntry";
import MessageUserExit from "./components/MessageUserExit";
import MessageToReply from "./components/MessageToReply";
import MessageImage from "./components/Messageimage";
import MessageChat from "./components/MessageChat";

interface SwitchMessagesProps {
	message: TypeMessage;
	name: string;
	setMessageToReply: React.Dispatch<React.SetStateAction<DataMessage | null>>;
}

export default function SwitchMessages({
	message,
	name,
	setMessageToReply,
}: SwitchMessagesProps) {
	switch (message.type) {
		case "message":
			return message.name !== name ? (
				<MessageFriendChat
					message={message}
					setMessageToReply={setMessageToReply}
				/>
			) : (
				<MessageChat message={message} />
			);
		case "entry":
			return <MessageUserEntry message={message} />;
		case "exit":
			return <MessageUserExit message={message} />;
		case "image":
			return <MessageImage message={message} name={name} />;
		case "reply":
			return message.name !== name ? (
				<MessageToReply
					message={{
						...message,
						message: JSON.parse(decompress(message.message)),
					}}
					setMessageToReply={setMessageToReply}
					me={false}
					isMyName={message.name !== name}
				/>
			) : (
				<MessageToReply
					message={{
						...message,
						message: JSON.parse(decompress(message.message)),
					}}
					setMessageToReply={setMessageToReply}
					me={true}
					isMyName={message.name !== name}
				/>
			);
	}
}
