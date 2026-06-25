import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jrnl_id: string }> },
) {
  const { jrnl_id } = await params;
  if (!jrnl_id || jrnl_id === 'undefined') {
    return NextResponse.json({ error: 'Missing journal id.' }, { status: 400 });
  }

  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const baseUrl = process.env.DJANGO_API_BASE_URL;
  let res;
  try {
    res = await fetch(`${baseUrl}/api/mood/${jrnl_id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
  } catch (err) {
    console.error('Fetch to Django failed:', err);
    return NextResponse.json(
      { error: 'Could not reach mood service.' },
      { status: 502 },
    );
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error(
      'Non-JSON response from Django:',
      res.status,
      text.slice(0, 200),
    );
    return NextResponse.json(
      { error: 'Upstream service error.' },
      { status: res.status === 200 ? 502 : res.status },
    );
  }

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error ?? 'Failed to load entry.' },
      { status: res.status },
    );
  }
  return NextResponse.json(data);
}
