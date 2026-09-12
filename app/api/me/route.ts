// app/api/me/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { character: true, inventory: true },
  });
  if (!user) return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 });

  return NextResponse.json({ character: user.character, inventory: user.inventory });
}
