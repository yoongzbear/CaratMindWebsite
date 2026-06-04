import { C } from '@/app/styles/styles';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: `linear-gradient(130deg, ${C.serenity}, ${C.roseQuartz})`,
      }}
    >
      {children}
    </div>
  );
}
