import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { ImageIcon, Send, Share2, X } from "lucide-react";

// types
import type { DataMessage, Message } from "@/types/types";

// Utils
import handleKeyDown from "@/app/(room)/r/components/InputMessage/utils/handleKeyDown";

// Components
import DialogShare from "./DialogShare";
import { Button } from "@/components/ui/button";
import DialogPhoto from "@/app/(room)/r/components/InputMessage/DialogPhoto";
import onSubmitMessage from "@/app/(room)/r/components/InputMessage/utils/onSubmitMessage";
import Message_Friend_Chat from "@/app/(room)/r/components/InputMessage/Message_Friend_Chat";

interface InputMessageProps {
	messages: Message[];
	name: string;
	server: React.RefObject<Socket | null>;
	messageToReply: DataMessage | null;
	setMessageToReply: React.Dispatch<React.SetStateAction<DataMessage | null>>;
	token?: string;
	isPhone?: boolean;
}


export default function InputMessage({
	name,
	server,
	messages,
	messageToReply,
	setMessageToReply,
	token = "",
	isPhone = false,
}: InputMessageProps) {
	const inputMessageRef = useRef<HTMLTextAreaElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [valueInput, setValueInput] = useState("");
	const [inputFileValue, setInputFileValue] = useState<string[]>([]);

	const [shareOpen, setShareOpen] = useState(false);

	const valueMessage =
		inputFileValue.length !== 0 ? inputFileValue : valueInput;

	const [dialogAddPhoto, setDialogAddPhoto] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Its correct
	useEffect(() => {
		if (inputMessageRef.current) {
			inputMessageRef.current.focus();
		}
	}, [messageToReply, inputMessageRef]);

	return (
		<div className="relative">
			{isPhone && (
				<DialogShare open={shareOpen} setOpen={setShareOpen} token={token} />
			)}
			<form
				onSubmit={(e) => {
					setMessageToReply(null);
					onSubmitMessage({
						e,
						name,
						server,
						valueMessage,
						setValueInput,
						messages,
						inputMessageRef,
						setInputFileValue,
						messageToReply,
					});
				}}
				className={styles.form}
			>
				<div className="flex flex-col justify-end size-full border border-muted rounded-md p-2 transition-all duration-300 ease-in-out">
					{messageToReply && (
						<div className="bg-primary p-2 text-primary-foreground min-w-24 mb-4 rounded-sm">
							<div className="relative">
								<div>
									<button
										type="button"
										className="absolute right-0 top-0 p-1 cursor-pointer rounded-md hover:bg-white/15 active:bg-white/30 dark:hover:bg-black/15 dark:active:bg-black/30"
										onClick={() => setMessageToReply(null)}
									>
										<X className="text-primary-foreground size-4" />
									</button>
								</div>
								<div className="font-semibold pl-1">Reply</div>

								<Message_Friend_Chat message={messageToReply} />
							</div>
						</div>
					)}
					<textarea
						autoFocus
						ref={inputMessageRef}
						value={valueInput}
						onKeyDown={(e) => handleKeyDown({ event: e, buttonRef })}
						onChange={(e) => setValueInput(e.target.value)}
						className="w-full h-10 resize-none outline-0 placeholder:text-text text-text"
						placeholder={"Type something..."}
						autoComplete="off"
						name="messageInput"
					/>
					<div className="w-full flex justify-between">
						<div className="flex gap-1">
							<Button
								variant={"outline"}
								size={"icon"}
								type="button"
								disabled={messageToReply !== null}
								onClick={() => setDialogAddPhoto(true)}
							>
								<ImageIcon className="text-text" />
							</Button>
							{isPhone && (
								<Button
									variant={"outline"}
									size={"icon"}
									type="button"
									onClick={() => setShareOpen(true)}
								>
									<Share2 className="text-text" />
								</Button>
							)}
						</div>
						<Button
							ref={buttonRef}
							variant={"outline"}
							size={"icon"}
							type="submit"
						>
							<Send className="text-text" />
						</Button>
					</div>
				</div>
				<DialogPhoto
					addDialogPhoto={dialogAddPhoto}
					setAddDialogPhoto={setDialogAddPhoto}
					setInputFileValue={setInputFileValue}
					buttonRef={buttonRef}
				/>
			</form>
		</div>
	);
}

const styles = {
	form: "flex justify-between items-center w-[100%] mt-1",
};
