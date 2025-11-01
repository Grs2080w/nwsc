"use client";

import { useRef, useState } from "react";
import type { Socket } from "socket.io-client";

// Hooks
import useConnectServer from "@/hooks/Server/useConnectServer";
import useKeyPress from "@/hooks/useKeyPress";
import useDelayToKeyPressed from "@/hooks/useDelayToKeyPressed";
import useScrollToBottom from "@/hooks/useScrollToBottom";

/// imports deprecated
// import useDelayToKeyPressedFriend from "@/hooks/useDelayToKeyPressedFriend";
// import useTimeOut from "@/hooks/useTimeOut";

// Types
import type { Message, User } from "@/types/types";
import ViewAndInputPhone from "./ViewAndInputPhone";
import DialogProgress from "@/hooks/Server/utils/DialogProgress";
import ButtonLogout from "@/app/(room)/r/components/ButtonLogout";

interface GatewayPagePhoneProps {
	name: string;
	room: string;
	token: string;
}

export default function GatewayPagePhone({ name, room, token }: GatewayPagePhoneProps) {
	const server = useRef<Socket | null>(null);
	const conversation = useRef<Message[]>([]);
	const screenMessageRef = useRef<HTMLDivElement>(null);
	const usersOnline = useRef<User[]>([]);

	const [messages, setMessages] = useState<Message[]>([]);
	const [keyPressed, setKeyPressed] = useState(false);
	const [someOnekeyPressed, setsomeOnekeyPressed] = useState(false);
	const [openProgress, setOpenProgress] = useState(false);

	/* function deprecated
		useTimeOut({ conversation, server });
		useDelayToKeyPressedFriend({ setsomeOnekeyPressed, someOnekeyPressed });
	*/

	useKeyPress(setKeyPressed);
	useDelayToKeyPressed({ keyPressed, setKeyPressed, server });
	useScrollToBottom({ screenMessageRef, messages, someOnekeyPressed });
	useConnectServer({
		setMessages,
		usersOnline,
		conversation,
		name,
		room,
		setsomeOnekeyPressed,
		server,
		setOpenProgress,
	});

	return (
		<div className="flex justify-between w-full overflow-hidden">
			<ButtonLogout /> 

			<ViewAndInputPhone
				conversation={conversation}
				messages={messages}
				someOnekeyPressed={someOnekeyPressed}
				name={name}
				server={server}
				screenMessageRef={screenMessageRef}
				token={token}
			/>

			<DialogProgress open={openProgress} setOpen={setOpenProgress} />
		</div>
	);
}
