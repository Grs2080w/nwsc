import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
	matcher: ["/r", "/c", "/p/:path*", "/"],
};

export async function middleware(request: NextRequest) {
	const cookieStore = await cookies();

	const token = cookieStore.has("nwsc-token");
	const auth = cookieStore.has("nwsc-auth");

	if (request.url.includes("/c") || request.url.endsWith("/")) {
		const response = NextResponse.next();
		response.cookies.delete("nwsc-auth");
		response.cookies.delete("nwsc-token");
		return response;
	}

	if (!token || !auth) {
		return NextResponse.redirect(new URL("/", request.url), 303);
	}

	return NextResponse.next();
}
