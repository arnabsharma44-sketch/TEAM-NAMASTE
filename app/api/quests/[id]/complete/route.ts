// app/api/quests/[id]/complete/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  XP_REWARDS, GOLD_REWARDS, streakMultiplier,
  applyXP, updateStreak, ATTRIBUTE_MAP,
} from '@/lib/game';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  const { id } = await params;

  const quest = await prisma.quest.findFirst({
    where: { id, userId: session.userId, status: 'ACTIVE' },
  });
  if (!quest) return NextResponse.json({ error: 'Quest not found', code: 'NOT_FOUND' }, { status: 404 });

  const character = await prisma.character.findUnique({ where: { userId: session.userId } });
  if (!character) return NextResponse.json({ error: 'Character not found', code: 'NOT_FOUND' }, { status: 404 });

  // Calculate rewards
  const baseXP = XP_REWARDS[quest.difficulty];
  const multiplier = streakMultiplier(character.streak);
  const finalXP = Math.floor(baseXP * multiplier);
  const goldEarned = GOLD_REWARDS[quest.difficulty];

  // Mutate character state
  const char = {
    level: character.level, xp: character.xp, gold: character.gold,
    streak: character.streak, lastActive: character.lastActive,
    intellect: character.intellect, strength: character.strength,
    wisdom: character.wisdom, creativity: character.creativity, endurance: character.endurance,
  };

  updateStreak(char);
  const prevLevel = char.level;
  applyXP(char, finalXP);
  char.gold += goldEarned;

  const leveled = char.level > prevLevel;
  const attrKey = ATTRIBUTE_MAP[quest.category] as keyof typeof char;
  if (leveled) (char[attrKey] as number)++;

  // Persist all changes atomically
  const [updatedChar] = await prisma.$transaction([
    prisma.character.update({
      where: { userId: session.userId },
      data: {
        level: char.level, xp: char.xp, gold: char.gold,
        streak: char.streak, lastActive: char.lastActive,
        intellect: char.intellect, strength: char.strength,
        wisdom: char.wisdom, creativity: char.creativity, endurance: char.endurance,
      },
    }),
    prisma.quest.update({ where: { id }, data: { status: 'COMPLETED', completedAt: new Date() } }),
    prisma.questLog.create({
      data: { userId: session.userId, questId: id, xpEarned: finalXP, goldEarned, attribute: quest.category },
    }),
  ]);

  return NextResponse.json({ character: updatedChar, xpEarned: finalXP, goldEarned, leveled });
}
