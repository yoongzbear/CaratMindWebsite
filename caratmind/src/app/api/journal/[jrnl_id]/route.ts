import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jrnl_id: string }> },
) {
  const { jrnl_id } = await params;

  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const baseUrl = process.env.DJANGO_API_BASE_URL;
  console.log('at route', jrnl_id);
  const res = await fetch(`${baseUrl}/api/journals/${jrnl_id}/`, {
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
