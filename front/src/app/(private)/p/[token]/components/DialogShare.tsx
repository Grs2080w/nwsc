import { useEffect, useState } from "react";

// Components
import { Check, Copy } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRCode } from "@/components/kibo-ui/qr-code";
import { Separator } from "@/components/ui/separator";
import copyToClipboard from "@/app/(room)/r/components/utils/copyToClipboard";

interface DialogShareProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	token: string;
}

export default function DialogShare({ open, setOpen, token }: DialogShareProps) {
	const [copyClicked, setCopyClicked] = useState(false);

	const [url, setUrl] = useState("");

	useEffect(() => {
		if (copyClicked) {
			const timeoutId = setTimeout(() => {
				setCopyClicked(false);
			}, 3000);
			return () => {
				clearTimeout(timeoutId);
			};
		}
		if (window) setUrl(`${window.location.origin}/j/${token}`);
	}, [copyClicked, token]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="flex flex-col justify-around gap-7">
				<div className="space-y-2">
					<DialogTitle>Share</DialogTitle>
					<DialogDescription>
						Share a Link or Qrcode to invite your friends.
					</DialogDescription>
				</div>
				<div className="w-full flex justify-center items-center">
					<QRCode
						background="#eee"
						data={url}
						foreground="#111"
						robustness="L"
						className="size-52 rounded-lg border bg-white p-4 shadow-xs"
					/>
				</div>
				<Separator />

				<div className="flex justify-between gap-2">
					<Input value={url} readOnly className="w-full" />
					<Button
						variant={"outline"}
						className="transition-all"
						onClick={() => {
							copyToClipboard(url, "Link copied to clipboard");
							setCopyClicked(true);
						}}
					>
						{copyClicked ? <Check /> : <Copy />}
					</Button>
				</div>
				<div className="w-full flex justify-end">
					<Button type="button" onClick={() => setOpen(false)}>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
