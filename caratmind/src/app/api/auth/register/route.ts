import { NextResponse } from 'next/server';
import {
  confirmSignUp,
  mapCognitoError,
  signUpUser,
} from '@/lib/cognito/server';

const PASSWORD_MIN = 8; // length of password

function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return 'Password must include uppercase, lowercase, and a number.';
  }
  return null;
}

async function provisionUser(input: {
  sub: string;
  email: string;
  preferredUsername: string;
}): Promise<void> {
  const baseUrl = process.env.DJANGO_API_BASE_URL;
  const internalKey = process.env.INTERNAL_API_KEY;
  if (!baseUrl || !internalKey) {
    console.error('Missing DJANGO_API_BASE_URL or INTERNAL_API_KEY');
    return;
  }

  console.log('Sending key:', JSON.stringify(internalKey));

  try {
    const res = await fetch(`${baseUrl}/api/users/provision/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': internalKey,
      },
      body: JSON.stringify(input),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to provision user record', await res.text());
    }
  } catch (err) {
    // Cognito confirmation already succeeded — don't fail the user-facing
    // request just because the provisioning call had an issue.
    console.error('Error calling provisioning endpoint', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      preferredUsername?: string;
      password?: string;
      confirmPassword?: string;
      confirmationCode?: string;
      sub?: string;
    };

    if (body.confirmationCode && body.username) {
      const sub = body.sub?.trim();
      const email = body.email?.trim();
      const preferredUsername = body.preferredUsername?.trim();

      if (!sub || !email || !preferredUsername) {
        return NextResponse.json(
          { error: 'Missing user details for confirmation.' },
          { status: 400 },
        );
      }

      await confirmSignUp(body.username, body.confirmationCode);
      await provisionUser({ sub, email, preferredUsername });
      return NextResponse.json({ confirmed: true });
    }

    const username = body.username?.trim();
    const email = body.email?.trim();
    const preferredUsername = body.preferredUsername?.trim();
    const password = body.password ?? '';
    const confirmPassword = body.confirmPassword ?? '';

    if (!username || !email || !preferredUsername || !password) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 },
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const result = await signUpUser({
      username,
      email,
      preferredUsername,
      password,
    });

    if (result.userConfirmed) {
      await provisionUser({ sub: result.userSub, email, preferredUsername });
    }

    return NextResponse.json({
      userConfirmed: result.userConfirmed,
      username,
      sub: result.userSub,
      message: result.userConfirmed
        ? 'Account created. You can sign in now.'
        : 'Account created. Check your email for a verification code.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: mapCognitoError(error) },
      { status: 400 },
    );
  }
}
