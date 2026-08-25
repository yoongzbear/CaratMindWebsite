import { Suspense } from 'react';
import { RegisterForm } from './RegisterForm';

function parseRequestedNext(
  next: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(next) ? next[0] : next;
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//')) {
    return null;
  }
  return raw;
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const sp = await searchParams;
  const requestedNext = parseRequestedNext(sp.next);

  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading registration...</div>}
    >
      <RegisterForm requestedNext={requestedNext ?? null} />
    </Suspense>
  );
  // return <RegisterForm requestedNext={requestedNext} />;
}
