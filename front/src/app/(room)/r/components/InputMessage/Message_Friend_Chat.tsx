import type { DataMessage } from "@/types/types";

interface MessageFriendChatProps {
	message: DataMessage;
}

export default function MessageFriendChat({ message }: MessageFriendChatProps) {
	if (message.message === undefined) {
		return <div className="rounded-full w-3 h-3 bg-message-friend"></div>;
	} else {
		return (
			<button
				type="button"
				className="text-left hover:bg-black max-w-[80%] rounded-[10px] bg-red-500"
			>
				<div className={styles.main}>
					<div className={styles.first}>{message.name}</div>
					<div className={styles.second}>
						<div className={styles.message}>
							{message.message.length > 30
								? `${message.message.slice(0, 30)}...`
								: message.message}
						</div>
						<div className={styles.hours}>
							{message.message && message.hours}
						</div>
					</div>
				</div>
			</button>
		);
	}
}

const styles = {
	main: "text-white bg-message-friend rounded-[10px] p-2 w-full hover:bg-white/20 cursor-pointer",
	first: "text-sm font-bold text-left ml-1 mb-1",
	second: "flex items-end justify-between gap-1",
	message: "w-[80%] text-xs ml-1",
	hours: "text-[10px] flex justify-center w-10 font-mono ",
};
