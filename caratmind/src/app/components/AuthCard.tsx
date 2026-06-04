import Image from 'next/image';
import { C } from '@/app/styles/styles';

export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '16px',
        border: `1px solid ${C.border}`,
        boxShadow: '0 8px 40px rgba(146,168,209,0.18)',
        padding: '32px 28px',
      }}
    >
      <h1
        style={{
          margin: '0 0 20px',
          textAlign: 'center',
          fontSize: '22px',
          fontWeight: 700,
          color: C.navy,
        }}
      >
        {title}
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <Image
          src="/assets/CM_long.png"
          alt="CaratMind"
          width={160}
          height={48}
          style={{ height: 'auto', width: 'auto', maxWidth: '200px' }}
          priority
        />
      </div>
      {children}
    </div>
  );
}
