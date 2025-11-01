import type { DataMessage } from "@/types/types";

// Components
import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import Image from "next/image";

interface MessageImageProps {
	message: DataMessage;
	name: string;
}

export default function MessageImage({ message, name }: MessageImageProps) {
	const notMyMessage = message.name !== name;

	const style = {
		main:
			"flex flex-col justify-between p-2 max-w-[40%] rounded-[10px] m-1" +
			(!notMyMessage ? " bg-message" : " bg-message-friend"),
		name: "text-[15px] text-white font-semibold text-left ml-1 mb-2",
		imageContainer: "w-[85%]",
		image: "rounded-md",
		time2: "text-[10px] w-full text-black flex justify-end font-mono font-bold",
		time: "text-[10px] w-full text-primary flex justify-end font-mono font-bold",
	};

	return (
		<div className={style.main}>
			{notMyMessage && <div className={style.name}>{message.name}</div>}
			<div className={style.imageContainer}>
				{/*eslint-disable-next-line @next/next/no-img-element*/}
				<ImageZoom>
					<Image
						src={message.message}
						className={style.image}
						alt="image-received"
						width={200}
						height={200}
					/>
				</ImageZoom>
			</div>
			<div className={notMyMessage ? style.time : style.time2}>
				{message.message && message.hours}
			</div>
		</div>
	);
}
