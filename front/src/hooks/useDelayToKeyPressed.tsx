import { useEffect } from "react";
import type { Socket } from "socket.io-client";

/**
 * 
 * 
 *  Hook Deprecaded
 * 
 */

interface UseDelayToKeyPressedProps {
	keyPressed: boolean;
	setKeyPressed: React.Dispatch<React.SetStateAction<boolean>>;
	server: React.RefObject<Socket | null>;
}

export default function useDelayToKeyPressed({
	keyPressed,
	setKeyPressed,
	server,
}: UseDelayToKeyPressedProps) {
	useEffect(() => {
		if (keyPressed) {
			server.current?.emit("userTyping");
			setKeyPressed(false);
		}
	}, [keyPressed, setKeyPressed, server]);
}
