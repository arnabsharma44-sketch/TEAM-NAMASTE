// app/api/inventory/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const inventory = await prisma.inventoryItem.findMany({
    where: { userId: session.userId },
    orderBy: { purchasedAt: 'desc' },
  });
  return NextResponse.json(inventory);
}
