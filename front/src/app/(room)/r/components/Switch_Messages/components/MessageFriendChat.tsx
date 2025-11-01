import { useState } from "react";
import type { DataMessage } from "@/types/types";

// Components
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface MessageFriendChatProps {
	message: DataMessage;
	setMessageToReply: React.Dispatch<React.SetStateAction<DataMessage | null>>;
}
export default function MessageFriendChat({
	message,
	setMessageToReply,
}: MessageFriendChatProps) {
	const [open, setOpen] = useState(false);

	if (message === undefined) {
		return <div className="rounded-full w-3 h-3 bg-message-friend"></div>;
	} else {
		return (
			<ContextMenu onOpenChange={setOpen}>
				<ContextMenuTrigger asChild>
					<div className={open ? `${styles.main} bg-white/30` : styles.main}>
						<div className={styles.first}>{message.name}</div>
						<div className={styles.second}>
							<div className={styles.message}>
								{message.type === "message" && message.message}
							</div>
							<div className={styles.hours}>{message.hours}</div>
						</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => setMessageToReply(message)}>
						Reply
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		);
	}
}

const styles = {
	main: "text-white bg-message-friend rounded-[10px] m-0.5 pr-2 p-1 max-w-[80%]",
	first: "text-[15px] font-bold text-left ml-1 mb-1",
	second: "flex items-end justify-between",
	message: "w-[80%] break-words  text-[20px] ml-1",
	hours: "text-[10px] flex justify-center w-10 font-mono font-bold",
};
