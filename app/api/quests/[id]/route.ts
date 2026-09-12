// app/api/quests/[id]/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const patchSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(['INTELLECT', 'STRENGTH', 'WISDOM', 'CREATIVITY', 'ENDURANCE']).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
});

async function ownQuest(userId: string, id: string) {
  return prisma.quest.findFirst({ where: { id, userId, status: 'ACTIVE' } });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  const { id } = await params;

  const quest = await ownQuest(session.userId, id);
  if (!quest) return NextResponse.json({ error: 'Quest not found', code: 'NOT_FOUND' }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: 'VALIDATION_ERROR' }, { status: 400 });

  const updated = await prisma.quest.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  const { id } = await params;

  const quest = await ownQuest(session.userId, id);
  if (!quest) return NextResponse.json({ error: 'Quest not found', code: 'NOT_FOUND' }, { status: 404 });

  // Soft-delete → ABANDONED
  const updated = await prisma.quest.update({ where: { id }, data: { status: 'ABANDONED' } });
  return NextResponse.json(updated);
}
