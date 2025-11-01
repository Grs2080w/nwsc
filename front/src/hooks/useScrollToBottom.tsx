import { useEffect } from "react";
import type { Message } from "../types/types";

interface UseScrollToBottomProps {
	screenMessageRef: React.RefObject<HTMLDivElement | null>;
	messages: Message[];
	someOnekeyPressed: boolean;
}

export default function useScrollToBottom({
	screenMessageRef,
	messages,
	someOnekeyPressed,
}: UseScrollToBottomProps) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: It's necessary
	useEffect(() => {
		if (screenMessageRef.current) {
			screenMessageRef.current.scrollTop =
				screenMessageRef.current.scrollHeight;
		}
	}, [messages, someOnekeyPressed, screenMessageRef]);
}
