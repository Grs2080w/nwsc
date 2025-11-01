import type { DataExitUser } from "@/types/types";

interface MessageUserExitProps {
	message: DataExitUser;
}

export default function MessageUserExit({ message }: MessageUserExitProps) {
	const style = {
		container:
			"m-1 text-center text-sm font-semibold bg-red-600 rounded-md text-black",
		message: "text-center text-sm p-0.5 font-semibold",
	};

	return (
		<div className={style.container}>
			<div className={style.message}>{message.name} out</div>
		</div>
	);
}
