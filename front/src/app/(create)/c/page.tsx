"use client";

import { useState } from "react";
import Link from "next/link";

// hooks
import useIsMobile from "@/hooks/useIsMobile";

// Components
import { onSubmit } from "./services/onSubmit";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { muthiara } from "@/app/styles/fonts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Page() {
	const isMobile = useIsMobile();

	const [loading, setLoading] = useState(false);
	const [priv, setPriv] = useState(false);

	function Submit(e: FormData) {
		setLoading(true);
		e.append("private", priv ? "true" : "false");
		onSubmit(e, isMobile).then(() => {
			setLoading(false);
		});
	}

	return (
		<div className="flex flex-col items-center justify-between h-dvh p-8">
			<div className="flex flex-col items-center justify-around flex-1">
				<div className={`${muthiara.className} text-7xl text-text`}>Nwsc</div>

				<div className={styles.container}>
					<form action={Submit} className={styles.container}>
						<div className="flex items-center space-x-2">
							<Switch
								onCheckedChange={(checked) => setPriv(checked)}
								id="priv"
								name="priv"
							/>
							<Label htmlFor="priv">Private</Label>
						</div>

						<div>
							<input
								autoFocus
								required
								autoComplete="off"
								placeholder="Your Name"
								type="text"
								name="name"
								className={styles.input}
							/>
						</div>

						<Button disabled={loading} type="submit" className="mt-6">
							{loading ? (
								<div className="flex gap-2">
									<Spinner />
									<p>Creating...</p>
								</div>
							) : (
								"Create Room"
							)}
						</Button>
					</form>
					<Link href={"/"}>
						<p className={styles.enterRoomLink}>
							Already have a code? Entry on a existing room
						</p>
					</Link>
				</div>
			</div>

			<footer className="text-text text-sm">
				© 2025 Nwsc. All rights reserved.
			</footer>
		</div>
	);
}

const styles = {
	container: "flex flex-col justify-center items-center w-full ",
	input:
		"text-md text-(--primary) py-4 px-3 bg-transparent border border-(--border) rounded-[10px] h-9 w-full mt-2 placeholder:text-gray-400",
	enterRoomLink:
		"text-sm text-primary font-bold cursor-pointer mt-5 font-mono hover:text-(--text) hover:cursor-pointer hover:underline",
};
