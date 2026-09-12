import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=MissingAuthCode', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'OAuth credentials not configured' }, { status: 500 });
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to exchange code:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/login?error=OAuthTokenFailed', request.url));
    }

    const tokenData = await tokenResponse.json();

    // 2. Fetch user profile from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user info:', await userResponse.text());
      return NextResponse.redirect(new URL('/login?error=UserInfoFailed', request.url));
    }

    const userData = await userResponse.json();
    const email = userData.email;
    const name = userData.name || email.split('@')[0];

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=NoEmailProvided', request.url));
    }

    // 3. Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user without password Hash
      user = await prisma.user.create({
        data: {
          email,
          character: {
            create: {
              name: name,
              class: 'NOVICE',
              intellect: 1,
              strength: 1,
              wisdom: 1,
              creativity: 1,
              endurance: 1,
            },
          },
        },
      });
    }

    // 4. Sign JWT and set cookie
    const token = await signToken({ userId: user.id, email: user.email });

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
