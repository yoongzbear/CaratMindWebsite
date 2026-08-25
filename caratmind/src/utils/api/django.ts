const djangoBase =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://localhost:8000';

export function djangoApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${djangoBase.replace(/\/$/, '')}${normalized}`;
}
