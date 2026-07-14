import Image from 'next/image';
import { C } from '@/app/styles/styles';
import Link from 'next/link';

export function AuthCard({
  title,
  children,
  width = 420,
}: {
  title: string;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div
      className="w-full bg-white rounded-2xl shadow-[0_8px_40px_rgba(146,168,209,0.18)] px-5 py-5 sm:px-7 sm:py-8"
      style={{
        maxWidth: `${width}px`,
        border: `1px solid ${C.border}`,
        boxShadow: '0 8px 40px rgba(146,168,209,0.18)',
      }}
    >
      <h1
        className="text-[clamp(1.38rem,7vw,2rem)] mb-5 text-center font-bold"
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
