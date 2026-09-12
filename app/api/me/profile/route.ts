export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateProfileSchema = z.object({
  firstName: z.string().max(50).nullable().optional(),
  lastName: z.string().max(50).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.userId },
    data: parsed.data,
  });

  return NextResponse.json({
    user: {
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
    }
  });
}
