import { useState } from "react";
import type { Socket } from "socket.io-client";
import type { DataMessage, Message } from "@/types/types";

// Components
import InputMessage from "./InputMessage";
import Switch_Messages from "@/app/(room)/r/components/Switch_Messages/Index";
import SomeOneKeyPress from "@/app/(room)/r/components/SomeoneKeyPress";

interface ViewAndInputProps {
	screenMessageRef: React.RefObject<HTMLDivElement | null>;
	name: string;
	conversation: React.MutableRefObject<Message[]>;
	someOnekeyPressed: boolean;
	messages: Message[];
	server: React.RefObject<Socket | null>;
}

export default function ViewAndInput({
	screenMessageRef,
	name,
	conversation,
	someOnekeyPressed,
	messages,
	server,
}: ViewAndInputProps) {
	const [messageToReply, setMessageToReply] = useState<DataMessage | null>(
		null,
	);

	return (
		<div className={styles.main}>
			<div ref={screenMessageRef} className={styles.screenMessage}>
				<div className={styles.messageContainer}>
					{conversation.current.map((message, index) => {
						return (
							<div
								key={message.id || index}
								className={
									message?.type === "entry" || message?.type === "exit"
										? styles.userEntry
										: message.name === name
											? styles.myContainerMessage
											: styles.friendContainerMessage
								}
							>
								<Switch_Messages
									message={message}
									name={name}
									setMessageToReply={setMessageToReply}
								/>
							</div>
						);
					})}

					{someOnekeyPressed && <SomeOneKeyPress />}
				</div>
			</div>

			<InputMessage
				name={name}
				server={server}
				messages={messages}
				messageToReply={messageToReply}
				setMessageToReply={setMessageToReply}
			/>
		</div>
	);
}

const styles = {
	main: "w-[45%] h-[90vh] flex flex-col justify-around border border-muted p-3 rounded-2xl shadow-md",
	screenMessage: "w-full h-[70vh] p-3 overflow-y-scroll",
	messageContainer: "bg-transparent flex flex-col justify-end",
	userEntry: "flex justify-center text-center padding-0",
	myContainerMessage: "flex justify-end w-full",
	friendContainerMessage: "flex justify-start w-full",
	typingIndicator: "w-12 rounded-2xl m-1 text-center bg-gray-800",
};
