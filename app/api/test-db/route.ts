// This debug endpoint has been removed for security reasons.
// It previously exposed user data without authentication.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
