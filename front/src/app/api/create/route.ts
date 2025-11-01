import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { v7 } from "uuid";
import { z } from "zod";

const schema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 3 characters")
		.max(20, "Name must be at most 20 characters"),
	room: z.number(),
	isMobile: z.boolean("Invalid mobile"),
	private: z.boolean("Invalid private"),
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const name = formData.get("name") as string;
		const isMobile = formData.get("isMobile") as string;
		const priv = formData.get("private");

		const randomRoom = Math.floor(Math.random() * 1000000)
			.toString()
			.padStart(6, "0");

		try {
			schema.parse({
				name,
				room: Number(randomRoom),
				isMobile: Boolean(isMobile),
				private: Boolean(priv),
			});
		} catch (error) {
			console.error(error);
			console.error(error instanceof z.ZodError);
			if (error instanceof z.ZodError) {
				return NextResponse.json(
					{ error: error.issues[0].message },
					{ status: 400 },
				);
			}
		}

		let tokenPrivate = "";

		if (priv === "true") {

			// Runs if the room to be created is private, in the end update 

			await fetch(
				`${process.env.NEXT_PUBLIC_URL_SOCKET}/rooms/create/private`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			)
				.then((res) => res.json())
				.then(({ token, success, err }) => {
					if (!success) {
						console.error(err);
						return NextResponse.json(
							{ error: "Error creating room, please try again" },
							{ status: 500 },
						);
					}

					tokenPrivate = token;
				});
		} else {
			await fetch(
				`${process.env.NEXT_PUBLIC_URL_SOCKET}/rooms/create/${randomRoom}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			)
				.then((res) => {
					return res;
				})
				.then((res) => {
					if (!res.status || res.status !== 200) {
						console.error("Error creating room:", res);
						return NextResponse.json(
							{ error: "Error creating room, please try again" },
							{ status: 500 },
						);
					}
				});
		}

		const token = jwt.sign(
			{ Sessionid: v7(), room: randomRoom, name },
			process.env.PASSWORD_KEY as string,
			{
				expiresIn: 60 * 60,
			},
		);

		const cookieStore = await cookies();

		cookieStore
			.set("nwsc-token", token, {
				path: "/",
				httpOnly: true,
				secure: true,
			})
			.set("nwsc-auth", "true", {
				path: "/",
				httpOnly: false,
				secure: true,
			});

		const url =
			priv === "true"
				? `/p/${tokenPrivate}?name=${name}&mobile=${isMobile}`
				: `/r?room=${randomRoom}&name=${name}&mobile=${isMobile}`;

		return NextResponse.json({ redirect: url }, { status: 200 });
	} catch (error) {
		console.error("Error creating room:", error);
		return NextResponse.json({ error: "Error creating room" }, { status: 500 });
	}
}
