import { useEffect } from "react";
import type { Socket } from "socket.io-client";

/**
 *
 *
 *  Hook Deprecaded
 *
 */

export default function useTimeOut(
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ server }: { server: React.RefObject<Socket | null> },
) {
	useEffect(() => {
		const firstTimeOut = setTimeout(() => {
			server.current?.emit("UserOffline");
		}, 5000);

		return () => clearTimeout(firstTimeOut);
	}, [server]);
}
