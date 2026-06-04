import { NextResponse } from 'next/server';
import { updatePreferredUsername, mapCognitoError } from '@/lib/cognito/server';

export async function PATCH(request: Request) {
  try {
    const { preferredUsername } = (await request.json()) as {
      preferredUsername?: string;
    };

    if (!preferredUsername?.trim()) {
      return NextResponse.json(
        { error: 'Preferred username is required.' },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get('authorization');

    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await updatePreferredUsername(accessToken, preferredUsername);

    return NextResponse.json({
      preferredUsername: preferredUsername.trim(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: mapCognitoError(error),
        raw: String(error),
      },
      { status: 401 },
    );
  }
}
