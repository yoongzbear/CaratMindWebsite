import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const baseUrl = process.env.DJANGO_API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/mood/streak/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error ?? 'Failed to load streak.' },
      { status: res.status },
    );
  }
  return NextResponse.json(data);
}
