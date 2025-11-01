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
	token: z.jwt(),
	isMobile: z.boolean(),
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const token = formData.get("token") as string;
		const isMobile = formData.get("isMobile");
		const name = formData.get("name");

		try {
			await schema.parse({
				name,
				token: token,
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

		// Get the code of the room on server
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_URL_SOCKET}/rooms/room/private/${encodeURIComponent(token)}`,
		);
		const data: { success: boolean; code: string; err?: string } =
			await res.json();
		if (!data.success && data.err) {
			return NextResponse.json(
				{ error: data.err?.charAt(0).toUpperCase() + data.err?.slice(1) },
				{ status: 400 },
			);
		}

		const code = data.code;

		// Verify if the name is already used on the room
		const res2 = await fetch(
			`${process.env.NEXT_PUBLIC_URL_SOCKET}/${code}/private/${name}`,
		)
			.then((res) => res.json())
			.then(({ status }) => {
				if (!(status === "ok")) {
					return { error: status };
				}
			});

		if (res2?.error) {
			return NextResponse.json(
				{ error: res2.error.charAt(0).toUpperCase() + res2.error.slice(1) },
				{ status: 400 },
			);
		}

		const tokenAuth = jwt.sign(
			{ Sessionid: v7(), token, name },
			process.env.PASSWORD_KEY as string,
			{
				expiresIn: 60 * 60,
			},
		);

		const cookieStore = await cookies();
		cookieStore
			.set("nwsc-token", tokenAuth, {
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
			{ redirect: `/p/${token}?name=${name}&mobile=${isMobile}` },
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
