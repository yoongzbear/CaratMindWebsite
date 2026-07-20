'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const AUTH_PATHS = ['/login', '/register'];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}
