"use client";

import { useState } from "react";
import type { Socket } from "socket.io-client";
import type { DataMessage, Message } from "@/types/types";

// Hooks
import { useKeyboardStatus } from "./utils/useKeyboardStatus";

// Components
import SomeOnekeyPress from "../SomeoneKeyPress";
import InputMessage from "../InputMessage/Index";
import Switch_Messages from "../Switch_Messages/Index";

interface ViewAndInputPhoneProps {
	screenMessageRef: React.RefObject<HTMLDivElement | null>;
	name: string;
	conversation: React.MutableRefObject<Message[]>;
	someOnekeyPressed: boolean;
	messages: Message[];
	server: React.RefObject<Socket | null>;
	room: string;
}

export default function ViewAndInputPhone({
	screenMessageRef,
	name,
	conversation,
	someOnekeyPressed,
	messages,
	server,
	room,
}: ViewAndInputPhoneProps) {
	/**
	 *
	 *  The useKeyboardStatus hook and overflow-hidden style on layouts are so important to prevent the page from jumping when the keyboard appears on mobile devices.
	 *
	 */

	const { height } = useKeyboardStatus();

	const [messageToReply, setMessageToReply] = useState<DataMessage | null>(
		null,
	);

	const styles = {
		wrapper: "w-full",
		messagesContainer: "w-full p-3 overflow-y-auto flex-1",
		messageContainerInner: "flex flex-col justify-end",
		userEntry:
			"flex justify-center items-center text-gray-500 text-sm font-semibold",
		myContainerMessage: "flex justify-end w-full",
		friendContainerMessage: "flex justify-start items-start",
		typingIndicator: "w-12 rounded-2xl m-1 text-center bg-gray-800",
		inputWrapper: "w-[98%] flex-shrink-0 mx-auto mb-2",
	};

	return (
		<div
			className={styles.wrapper}
			style={{
				height: `${height}px`,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div ref={screenMessageRef} className={styles.messagesContainer}>
				<div className={styles.messageContainerInner}>
					{conversation.current.map((message, idx) => {
						const isEntryOrExit =
							message.type === "entry" || message.type === "exit";

						const containerClass = isEntryOrExit
							? styles.userEntry
							: message.name === name
								? styles.myContainerMessage
								: styles.friendContainerMessage;

						return (
							<div key={idx} className={containerClass}>
								<Switch_Messages
									message={message}
									name={name}
									setMessageToReply={setMessageToReply}
								/>
							</div>
						);
					})}
					{someOnekeyPressed && <SomeOnekeyPress />}
				</div>
			</div>

			<div className={styles.inputWrapper}>
				<InputMessage
					name={name}
					server={server}
					messages={messages}
					room={room}
					messageToReply={messageToReply}
					setMessageToReply={setMessageToReply}
				/>
			</div>
		</div>
	);
}
