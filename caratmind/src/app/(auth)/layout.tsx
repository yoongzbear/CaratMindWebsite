import { C } from '@/app/styles/styles';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: `linear-gradient(130deg, ${C.roseQuartz}, ${C.serenity})`,
      }}
    >
      {children}
    </div>
  );
}
