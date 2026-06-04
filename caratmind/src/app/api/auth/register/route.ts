import { NextResponse } from 'next/server';
import { confirmSignUp, mapCognitoError, signUpUser } from '@/lib/cognito/server';

const PASSWORD_MIN = 12;

function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include uppercase, lowercase, and a number.';
  }
  return null;
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
    };

    if (body.confirmationCode && body.username) {
      await confirmSignUp(body.username, body.confirmationCode);
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

    return NextResponse.json({
      userConfirmed: result.userConfirmed,
      username,
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
