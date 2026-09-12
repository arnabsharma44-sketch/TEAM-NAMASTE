// app/api/history/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));

  const [logs, total] = await Promise.all([
    prisma.questLog.findMany({
      where: { userId: session.userId },
      skip: (page - 1) * 20,
      take: 20,
      orderBy: { completedAt: 'desc' },
    }),
    prisma.questLog.count({ where: { userId: session.userId } }),
  ]);

  return NextResponse.json({ logs, total, page });
}
