// app/api/quests/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['INTELLECT', 'STRENGTH', 'WISDOM', 'CREATIVITY', 'ENDURANCE']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const status = searchParams.get('status') ?? 'ACTIVE';
  const category = searchParams.get('category');

  const where = {
    userId: session.userId,
    status: status as 'ACTIVE' | 'COMPLETED' | 'ABANDONED',
    ...(category ? { category: category as never } : {}),
  };

  const [quests, total] = await Promise.all([
    prisma.quest.findMany({ where, skip: (page - 1) * 20, take: 20, orderBy: { createdAt: 'desc' } }),
    prisma.quest.count({ where }),
  ]);

  return NextResponse.json({ quests, total, page });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const quest = await prisma.quest.create({
    data: { userId: session.userId, ...parsed.data },
  });
  return NextResponse.json(quest, { status: 201 });
}
