import { LoginForm } from './LoginForm';

function parseRequestedNext(
  next: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(next) ? next[0] : next;
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//')) {
    return null;
  }
  return raw;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return <LoginForm requestedNext={searchParams.next ?? null} />;
}
