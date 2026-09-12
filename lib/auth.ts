// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? 'change-me-32-bytes-minimum-secret!!'
);

export async function signToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; email: string };
  } catch {
    return null;
  }
}

import { prisma } from './prisma';

export async function getSession(): Promise<{ userId: string; email: string } | null> {
  // DEV BYPASS: Auto-login
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        character: {
          create: {
            name: 'Test Hero',
            class: 'Warrior',
          }
        }
      }
    });
  }
  return { userId: user.id, email: user.email };
}
