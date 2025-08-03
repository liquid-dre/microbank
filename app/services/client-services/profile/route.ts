import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma';

	// 	Read JWT from cookie
	// 	Decode and verify
	// 	Return user’s profile from DB

interface JwtPayload {
	id: string;
	iat?: number;
	exp?: number;
}

export async function GET() {
  const token = (await cookies()).get('token')?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.client.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isBlacklisted: true,
        createdAt: true,
      },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}