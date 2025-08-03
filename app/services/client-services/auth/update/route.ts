// app/api/auth/update/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

interface JwtPayload {
	id: string;
	iat?: number;
	exp?: number;
}

export async function PATCH(req: Request) {
	const token = (await cookies()).get("token")?.value;
	if (!token)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		// Verify token
		const payload = verify(token, process.env.JWT_SECRET!) as JwtPayload;

		// Parse request body (partial update)
		const body = await req.json();
		const { name } = body;

		if (!name) {
			return NextResponse.json(
				{ error: "No valid fields provided" },
				{ status: 400 }
			);
		}

		// Update the client in Supabase via Prisma
		const updatedUser = await prisma.client.update({
			where: { id: payload.id },
			data: { name },
			select: {
				id: true,
				email: true,
				name: true,
				isAdmin: true,
				isBlacklisted: true,
				createdAt: true,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Invalid token or update failed" },
			{ status: 401 }
		);
	}
}
