import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	if (!token) return NextResponse.redirect(new URL("/login", request.url));

	console.log("Token:", token);

	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
		await jwtVerify(token, secret); 
		return NextResponse.next();
	} catch (err) {
		console.log("❌ Invalid token", err);
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"],
};
