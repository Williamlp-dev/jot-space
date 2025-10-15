import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { pathname } = request.nextUrl;

	if (!sessionCookie && pathname.startsWith("/notes")) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	if (sessionCookie && (pathname === "/signin" || pathname === "/signup")) {
		return NextResponse.redirect(new URL("/notes", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/notes/:path*", "/signin", "/signup"],
};