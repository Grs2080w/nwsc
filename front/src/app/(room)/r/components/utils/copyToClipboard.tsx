import { toast } from "sonner";

export default function copyToClipboard(
	room: string,
	text: string = "Room code copied to clipboard",
) {
	navigator.clipboard.writeText(room).then(() => {
		toast.success(text, {
			duration: 3000,
			position: "top-center",
		});
	});
}
