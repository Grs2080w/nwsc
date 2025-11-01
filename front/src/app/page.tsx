"use client";

import Link from "next/link";
import { useState } from "react";

// Hooks
import useIsMobile from "@/hooks/useIsMobile";

// Styles
import { muthiara } from "./styles/fonts";

// Components
import { onSubmit } from "./services/onSubmit";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
	const isMobile = useIsMobile();

	const [loading, setLoading] = useState(false);

	function Submit(e: FormData) {
		setLoading(true);
		onSubmit(e, isMobile).then(() => {
			setLoading(false);
		});
	}

	return (
		<div className="flex flex-col items-center justify-between h-dvh p-8">
			<div className="flex flex-col items-center justify-around flex-1">
				<div className={`${muthiara.className} text-7xl text-text`}>Nwsc</div>

				<div className={styles.container}>
					<div className="text-center">
						<form action={Submit}>
							<div>
								<input
									required
									autoFocus
									type="text"
									name="name"
									disabled={loading}
									autoComplete="off"
									placeholder="Your Name"
									className={styles.input}
								/>
							</div>

							<div>
								<div>
									<input
										required
										name="room"
										type="text"
										maxLength={6}
										minLength={6}
										autoComplete="off"
										disabled={loading}
										placeholder="Room Code"
										className={styles.input}
									/>
								</div>

								<Button disabled={loading} type="submit" className="mt-6">
									{loading ? (
										<div className="flex gap-2">
											<Spinner />
											<p>Entering...</p>
										</div>
									) : (
										"Enter"
									)}
								</Button>
							</div>
						</form>

						<Link href="/c">
							<p className={styles.createRoomLink}>
								Don&apos;t have a room? Create a room
							</p>
						</Link>
					</div>
				</div>
			</div>

			<footer className="text-text text-sm">
				© 2025 Nwsc. All rights reserved.
			</footer>
		</div>
	);
}

const styles = {
	container: "flex justify-center items-center w-full",
	textCenter: "text-center",

	input:
		"text-md text-(--primary) py-4 px-3 bg-transparent border border-(--border) rounded-[10px] h-9 w-full mt-2 placeholder:text-gray-400",

	createRoomLink:
		"text-sm text-primary font-bold cursor-pointer mt-5 font-mono hover:text-(--text) hover:cursor-pointer hover:underline",
};
