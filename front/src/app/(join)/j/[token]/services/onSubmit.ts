"use client";

import { toast } from "sonner";

export async function onSubmit(e: FormData, isMobile: boolean) {
	try {
		e.append("isMobile", isMobile ? "true" : "false");

		const res = await fetch("/api/private", {
			method: "POST",
			body: e,
		});

		const response = await res.json();

		if (response.error) {
			return toast.error(response.error, {
				duration: 3000,
				position: "top-center",
			});
		}

		if (response.redirect) {
			window.location.href = response.redirect;
			return;
		}

		return;
	} catch (error) {
		console.error(error);

		return toast.error("Something went wrong, try again later", {
			duration: 3000,
			position: "top-center",
		});
	}
}
