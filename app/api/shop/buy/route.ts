// app/api/shop/buy/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SHOP_ITEMS } from '@/lib/shop-catalogue';

const schema = z.object({ itemId: z.string().min(1) });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: 'VALIDATION_ERROR' }, { status: 400 });

  const item = SHOP_ITEMS.find((i) => i.id === parsed.data.itemId);
  if (!item) return NextResponse.json({ error: 'Item not found', code: 'NOT_FOUND' }, { status: 404 });

  const character = await prisma.character.findUnique({ where: { userId: session.userId } });
  if (!character) return NextResponse.json({ error: 'Character not found', code: 'NOT_FOUND' }, { status: 404 });
  if (character.gold < item.price) {
    return NextResponse.json({ error: 'Not enough Gold', code: 'INSUFFICIENT_GOLD' }, { status: 402 });
  }

  // Check already owned
  const alreadyOwned = await prisma.inventoryItem.findFirst({
    where: { userId: session.userId, itemId: item.id },
  });
  if (alreadyOwned) return NextResponse.json({ error: 'Already owned', code: 'ALREADY_OWNED' }, { status: 409 });

  const [updatedChar, inventoryItem] = await prisma.$transaction([
    prisma.character.update({
      where: { userId: session.userId },
      data: { gold: character.gold - item.price },
    }),
    prisma.inventoryItem.create({
      data: { userId: session.userId, itemId: item.id },
    }),
  ]);

  return NextResponse.json({ character: updatedChar, item: inventoryItem });
}
