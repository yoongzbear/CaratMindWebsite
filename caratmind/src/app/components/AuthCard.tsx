import Image from 'next/image';
import { C } from '@/app/styles/styles';
import Link from 'next/link';

export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full max-w-105 bg-white rounded-2xl shadow-[0_8px_40px_rgba(146,168,209,0.18)] px-7 py-8"
      style={{
        border: `1px solid ${C.border}`,
        boxShadow: '0 8px 40px rgba(146,168,209,0.18)',
      }}
    >
      <h1
        className="mb-5 text-center text-[22px] font-bold"
        style={{
          color: C.navy,
        }}
      >
        {title}
      </h1>
      <div className="flex justify-center mb-6">
        <Link href="/" className="no-underline flex items-center">
          <Image
            src="/assets/CM_long.png"
            alt="CaratMind"
            width={160}
            height={48}
            style={{ height: 'auto', width: 'auto', maxWidth: '200px' }}
            priority
          />
        </Link>
      </div>
      {children}
    </div>
  );
}
