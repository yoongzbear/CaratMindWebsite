import { LoginForm } from './LoginForm';

/** Valid explicit `?next=` path, or `null` to use role-based default after login. */
function parseRequestedNext(
  next: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(next) ? next[0] : next;
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//')) {
    return null;
  }
  return raw;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const sp = await searchParams;
  const requestedNext = parseRequestedNext(sp.next);
  return <LoginForm requestedNext={requestedNext} />;
}
