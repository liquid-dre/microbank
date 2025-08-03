import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/app/client/lib/auth';

// Api to Create User and Return JWT 

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;

  const existingUser = await prisma.client.findUnique({ where: { email } });
  if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.client.create({
    data: { email, name, password: hashedPassword },
  });

  const token = signJwt({ id: newUser.id, email: newUser.email });

  const res = NextResponse.json({ success: true });
  res.cookies.set('token', token, { httpOnly: true, secure: true });

  return res;
}