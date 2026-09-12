export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  characterName: z.string().min(1).max(30),
  characterClass: z.enum(['Warrior', 'Mage', 'Rogue', 'Sage']),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', code: 'VALIDATION_ERROR' }, { status: 400 });
  }
  const { characterName, characterClass } = parsed.data;

  const existingCharacter = await prisma.character.findUnique({
    where: { userId: session.userId },
  });

  if (existingCharacter) {
    return NextResponse.json({ error: 'Character already exists', code: 'ALREADY_EXISTS' }, { status: 409 });
  }

  const character = await prisma.character.create({
    data: {
      userId: session.userId,
      name: characterName,
      class: characterClass,
    },
  });

  return NextResponse.json({ character }, { status: 201 });
}
