"use client";

import { useSearchParams } from "next/navigation";

// Components
import GatewayPage from "./components/GatewayPage";
import GatewayPagePhone from "./components/GatewayPagePhone";
import useTimeoutStorage from "@/app/utils/useTimeoutStorage";

export default function ClientPage() {
	const searchParams = useSearchParams();
	const room = searchParams.get("room") as string;
	const name = searchParams.get("name") as string;
	const mobile: boolean = (searchParams.get("mobile") as string) === "true";

	useTimeoutStorage();

	return (
		<div>
			{mobile ? (
				<GatewayPagePhone name={name} room={room} />
			) : (
				<GatewayPage name={name} room={room} />
			)}
		</div>
	);
}
