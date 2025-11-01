import { Suspense } from "react";

// Components
import ClientPage from "./ClientPage";

export default async function Page({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;

	// get the code on server, this code will just be used to join the room
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_URL_SOCKET}/rooms/room/private/${encodeURIComponent(token)}`,
	);
	const data: { success: boolean; code: string; err?: string } =
		await res.json();
	if (!data.success) {
		return;
	}

	return (
		<Suspense>
			<ClientPage room={data.code} error={data.err} token={token} />
		</Suspense>
	);
}
