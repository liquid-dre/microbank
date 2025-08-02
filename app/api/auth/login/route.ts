import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/auth';

// Verify Credentials and Return JWT

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.client.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signJwt({ id: user.id, email: user.email });

  const res = NextResponse.json({ success: true });
  res.cookies.set('token', token, { httpOnly: true, secure: true });

  return res;
}