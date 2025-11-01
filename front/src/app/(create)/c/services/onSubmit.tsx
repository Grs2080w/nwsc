"use client";

import { toast } from "sonner";

export async function onSubmit(e: FormData, isMobile: boolean) {
	e.append("isMobile", isMobile ? "true" : "false");
	const res = await fetch("/api/create", {
		method: "POST",
		body: e,
	}).then((res) => res.json());

	if (res?.error) {
		toast.error(res.error, { duration: 3000, position: "top-center" });
	}

	if (res.redirect) {
		window.location.href = res.redirect;
	}

	return res;
}
