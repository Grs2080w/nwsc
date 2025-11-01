import type { DataMessage } from "@/types/types";

interface MessageChatProps {
	message: DataMessage;
}

export default function MessageChat({ message }: MessageChatProps) {
	if (message.message === undefined) {
		return <div className="rounded-full w-3 h-3 bg-message"></div>;
	} else {
		return (
			<div className={styles.main}>
				<div className={styles.first}>
					<div className={styles.message}>
						{message.type === "message" && message.message}
					</div>
					<div className={styles.hours}>{message.message && message.hours}</div>
				</div>
			</div>
		);
	}
}

const styles = {
	main: "bg-message text-primary-foreground text-[20px] max-w-[80%] rounded-[5px] p-1 m-0.5",
	first: "flex items-end justify-between",
	message: "w-[90%] break-words",
	hours: "text-[10px] flex justify-center w-10 font-mono font-bold",
};
