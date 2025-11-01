import { NextResponse, type NextRequest } from "next/server";
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
	isMobile: z.boolean(),
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const isMobile = formData.get("isMobile");
		const name = formData.get("name");
		const room = formData.get("room");

		try {
			schema.parse({
				name,
				room: Number(room),
				isMobile: Boolean(isMobile),
			});
		} catch (error) {
			console.error(error);

			if (error instanceof z.ZodError) {
				console.error(error.issues[0].message);

				return NextResponse.json(
					{ error: error.issues[0].message },
					{ status: 400 },
				);
			}
		}

		// Verify if the room exists and if exists, verify if the user name is already used
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_URL_SOCKET}/${room}/new/${name}`,
		)
			.then((res) => res.json())
			.then(({ status }) => {
				if (!(status === "ok")) {
					return { err: status };
				}
			});

		if (res?.err) {
			return NextResponse.json(
				{ error: res.err.charAt(0).toUpperCase() + res.err.slice(1) },
				{ status: 400 },
			);
		}

		const token = jwt.sign(
			{ Sessionid: v7(), room, name },
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

		return NextResponse.json(
			{ redirect: `/r?room=${room}&name=${name}&mobile=${isMobile}` },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Error entering the room" },
			{ status: 400 },
		);
	}
}
