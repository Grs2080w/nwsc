"use client";

import { redirect, useSearchParams } from "next/navigation";

// Components
import GatewayPage from "./components/GatewayPage";
import GatewayPagePhone from "./components/GatewayPagePhone";
import useTimeoutStorage from "@/app/utils/useTimeoutStorage";

interface ClientPageProps {
	room: string;
	error?: string | null;
	token: string;
}

export default function ClientPage({
	room,
	error = null,
	token,
}: ClientPageProps) {
	const searchParams = useSearchParams();

	useTimeoutStorage();

	// If some error ocurred getting the code on server
	if (error) {
		redirect("/");
		return;
	}

	const name = searchParams.get("name") as string;
	const mobile: boolean = (searchParams.get("mobile") as string) === "true";

	return (
		<div>
			{" "}
			{mobile ? (
				<GatewayPagePhone name={name} room={room} token={token} />
			) : (
				<GatewayPage name={name} room={room} token={token} />
			)}{" "}
		</div>
	);
}
