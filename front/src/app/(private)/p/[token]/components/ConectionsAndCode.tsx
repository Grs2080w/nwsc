"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/types";
import { QrCode, Share2 } from "lucide-react";

// Components
import UsersLogView from "./UsersLogView";
import DialogShare from "./DialogShare";
import { Button } from "@/components/ui/button";

interface ConectionsAndCodeProps {
	usersOnline: React.RefObject<User[]>;
	token: string;
}

export default function ConectionsAndCode({ usersOnline, token }: ConectionsAndCodeProps) {
	const [copyClicked, setCopyClicked] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);

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
		<div className={styles.container}>
			<UsersLogView usersOnline={usersOnline.current} />

			<DialogShare open={shareOpen} setOpen={setShareOpen} token={token} />

			<div className={styles.roomCodeContainer}>
				<div className={styles.roomCodeTitle}>Room Code</div>
				<div className="flex justify-center items-center gap-2 mt-5">
					<Button
						className={copyClicked ? styles.copyButton2 : styles.copyButton}
						variant={"outline"}
						onClick={() => {
							navigator.share({
								title: "Nwsc",
								text: "Click to join on my private room!",
								url: url,
							});
						}}
					>
						<Share2 />
					</Button>

					<Button
						className={copyClicked ? styles.copyButton2 : styles.copyButton}
						variant={"outline"}
						onClick={() => {
							setShareOpen(true);
						}}
					>
						<QrCode />
					</Button>
				</div>
			</div>
		</div>
	);
}

const styles = {
	container: "w-[calc(fit-content)] p-2.5 flex flex-col items-center",
	roomCodeContainer: "w-[300px] p-2.5 rounded-[10px] text-center",
	roomCodeTitle: "text-xl font-bold",
	roomCode:
		"w-full/50 bg-(--code) text-black/80 font-mono font-semibold text-md p-2 rounded-[10px] items-center flex justify-center",
	copyButton:
		"w-22 font-mono text-md p-5 rounded-[10px] items-center flex justify-center cursor-pointer hover:bg-gray-400 transition-all duration-300 ease-in-out font-semibold",
	copyButton2:
		"w-22 text-primary font-mono text-md p-5 rounded-[10px] items-center flex justify-center cursor-pointer transition-all duration-300 ease-in-out",
};
