import type { DataEntryUser } from "@/types/types";

interface MessageUserEntryProps {
	message: DataEntryUser;
}

export default function MessageUserEntry({ message }: MessageUserEntryProps) {
	const style = {
		container:
			"m-1 text-center text-sm p-0 font-semibold bg-green-400 rounded-sm text-black",
		message: "text-center text-sm p-0.5 font-semibold",
	};

	return (
		<div className={style.container}>
			<div className={style.message}>{message.name} in</div>
		</div>
	);
}
