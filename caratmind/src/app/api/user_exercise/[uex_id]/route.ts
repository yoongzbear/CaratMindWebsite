import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uex_id: string }> },
) {
  const { uex_id } = await params;

  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const baseUrl = process.env.DJANGO_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/user_exercise/${uex_id}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error ?? 'Failed to load entry.' },
      { status: res.status },
    );
  }
  return NextResponse.json(data);
}
