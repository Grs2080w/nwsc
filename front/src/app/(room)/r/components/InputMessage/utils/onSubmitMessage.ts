import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import type { DataMessage, Message } from "@/types/types";

// Components
import { toast } from "sonner";

// Utils
import { compress } from "../../utils/CompressAndDescompress";

interface Params {
	e: React.FormEvent<HTMLFormElement>;
	name: string;
	server: RefObject<Socket | null>;
	valueMessage: string | string[];
	setValueInput: Dispatch<SetStateAction<string>>;
	messages: Message[];
	inputMessageRef: RefObject<HTMLTextAreaElement | null>;
	setInputFileValue: Dispatch<SetStateAction<string[]>>;
	messageToReply: DataMessage | null;
}

const onSubmitMessage = ({
	e,
	name,
	server,
	valueMessage,
	setValueInput,
	messages,
	inputMessageRef,
	setInputFileValue,
	messageToReply,
}: Params) => {
	e.preventDefault();

	const messageOnUpload = {
		name: name,
		message: valueMessage,
	};

	if (server.current) {
		if (
			(typeof valueMessage === "string" && valueMessage.trim() === "") ||
			(typeof valueMessage === "object" && valueMessage.length === 0)
		) {
			toast.error("Please type a message or select an image to send.", {
				duration: 3000,
				position: "top-center",
			});
			return;
		}

		if (messages[messages.length - 1]?.name !== messageOnUpload.name) {
			server.current.emit("message", {
				name: name,
				message: "",
			});
		}

		if (valueMessage) {
			if (messageToReply !== null) {
				server.current.emit("message", {
					name: name,
					message: compress(
						JSON.stringify({
							message: valueMessage,
							reply: messageToReply,
						}),
					),
					type: "reply",
				});
			} else if (typeof valueMessage === "string" && messageToReply === null) {
				server.current.emit("message", {
					name,
					message: compress(valueMessage),
					type: "message",
				});
			} else if (valueMessage.length !== 0) {
				for (const file of valueMessage) {
					server.current.emit("message", {
						name: name,
						message: file,
						type: "image",
					});
				}
			} else {
				toast.error("Please type a message or select an image to send.", {
					duration: 3000,
					position: "top-center",
				});
			}
		}

		setInputFileValue([]);
		setValueInput("");

		inputMessageRef.current?.focus();

		setTimeout(() => {
			setValueInput("");
		}, 1);
	}
};

export default onSubmitMessage;
