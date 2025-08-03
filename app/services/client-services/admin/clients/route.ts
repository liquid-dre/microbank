import { prisma } from "@/app/services/client-services/prisma/prisma";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

	// 	GET: Return all clients
	// 	POST: Toggle blacklist status of a client
	// 	Only admins allowed


export async function GET() {
	const token = (await cookies()).get("token")?.value;
	if (!token)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const payload: any = verify(token, process.env.JWT_SECRET!);
		const admin = await prisma.client.findUnique({ where: { id: payload.id } });

		if (!admin?.isAdmin)
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });

		const clients = await prisma.client.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				isBlacklisted: true,
				createdAt: true,
			},
		});

		return NextResponse.json(clients);
	} catch (err) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}

export async function POST(req: NextRequest) {
	const token = (await cookies()).get("token")?.value;
	if (!token)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const payload: any = verify(token, process.env.JWT_SECRET!);
		const admin = await prisma.client.findUnique({ where: { id: payload.id } });

		if (!admin?.isAdmin)
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });

		const { clientId } = await req.json();
		if (!clientId)
			return NextResponse.json(
				{ error: "Client ID is required" },
				{ status: 400 }
			);

		const client = await prisma.client.findUnique({ where: { id: clientId } });
		if (!client)
			return NextResponse.json({ error: "Client not found" }, { status: 404 });

		const updated = await prisma.client.update({
			where: { id: clientId },
			data: { isBlacklisted: !client.isBlacklisted },
		});

		return NextResponse.json({ success: true, updated });
	} catch (err) {
		return NextResponse.json(
			{ error: "Invalid token or server error" },
			{ status: 500 }
		);
	}
}
