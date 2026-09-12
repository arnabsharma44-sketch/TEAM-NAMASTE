// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  characterName: z.string().min(1).max(30),
  characterClass: z.enum(['Warrior', 'Mage', 'Rogue', 'Sage']),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', code: 'VALIDATION_ERROR' }, { status: 400 });
  }
  const { email, password, characterName, characterClass } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered', code: 'EMAIL_EXISTS' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      character: {
        create: { name: characterName, class: characterClass },
      },
    },
    include: { character: true },
  });

  const token = await signToken({ userId: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });

  return NextResponse.json({ character: user.character }, { status: 201 });
}
