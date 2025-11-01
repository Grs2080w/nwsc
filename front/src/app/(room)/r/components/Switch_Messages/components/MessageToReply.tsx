import { useState } from "react";
import { DataMessage } from "@/types/types";

// Components
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface MessageToReplyProps {
	me: boolean;
	isMyName: boolean;
	message: DataMessage & {
		message: {
			message: string;
			reply: DataMessage;
		};
	};
	setMessageToReply: React.Dispatch<React.SetStateAction<DataMessage | null>>;
}

export default function MessageToReply({
	message,
	me,
	setMessageToReply,
	isMyName,
}: MessageToReplyProps) {
	const [open, setOpen] = useState(false);

	// if is send by me
	if (me) {
		return (
			<div className={styles.main}>
				<div className={styles.first}>
					<div>
						<div>
							<div className={stylesFriend.main}>
								<div className={stylesFriend.first}>
									{message.message.reply.name}
								</div>
								<div className={stylesFriend.second}>
									<div className={styles.message}>
										{message.message.reply.message}
									</div>
									<div className={stylesFriend.hours}>
										{message.message.reply.hours}
									</div>
								</div>
							</div>
						</div>

						<div className={styles.message}>{message.message.message}</div>
					</div>
					<div className={styles.hours}>
						{message.message.message && message.hours}
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<ContextMenu onOpenChange={setOpen}>
				<ContextMenuTrigger asChild>
					<div
						className={
							open
								? `${stylesFriend.main} bg-message-friend/70 dark:bg-white/30`
								: stylesFriend.main
						}
					>
						<div className={stylesFriend.first}>{message.name}</div>
						{/* message to reply */}
						<div>
							<div className={styles.main}>
								{!isMyName && (
									<div className={stylesFriend.first}>
										{message.message.reply.name}
									</div>
								)}
								<div className={styles.first}>
									<div className={styles.message}>
										{message.message.reply.message}
									</div>
									<div className={styles.hours}>
										{message.message.reply.message &&
											message.message.reply.hours}
									</div>
								</div>
							</div>
						</div>
						<div className={stylesFriend.second}>
							<div className={stylesFriend.message}>
								{message.message.message}
							</div>
							<div className={stylesFriend.hours}>{message.hours}</div>
						</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						onClick={() =>
							setMessageToReply({
								...message,
								message: message.message.message,
							})
						}
					>
						Reply
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		);
	}
}

const styles = {
	main: "bg-message text-primary-foreground text-[20px] rounded-[5px] p-1 m-0.5",
	first: "flex items-end justify-between",
	message: "w-[90%] break-words p-1",
	hours: "text-[10px] flex justify-center w-10 font-mono font-bold",
};

const stylesFriend = {
	main: "text-white bg-message-friend rounded-[10px] m-0.5 pr-2 p-1",
	first: "text-[15px] font-bold text-left ml-1 mb-1",
	second: "flex items-end justify-between",
	message: "w-[90%] break-words  text-[20px] ml-1",
	hours: "text-[10px] flex justify-center w-10 font-mono font-bold",
};
