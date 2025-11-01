"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function useTimeoutStorage() {
	useEffect(() => {
		const raw = window.localStorage.getItem("toReload");
		const count = raw ? Number(raw) : 0;

		if (count >= 3) {
			window.localStorage.removeItem("toReload");
			window.location.href = "/";
			return;
		}

		const next = count + 1;
		window.localStorage.setItem("toReload", String(next));

		if (count === 2) {
			window.localStorage.removeItem("toReload");
			// biome-ignore lint/suspicious/noDocumentCookie: Just for safety
			document.cookie = "nwsc-auth=; path=/; max-age=0";
		}

		const message =
			3 - next > 0
				? `You have ${3 - next} more reloads, after that you will be logged out`
				: "You will be logged out on next reload";

		toast.info(message, {
			duration: 3000,
			position: "top-center",
		});
	}, []);

	return null;
}
