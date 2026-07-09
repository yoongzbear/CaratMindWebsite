import { C } from '@/app/styles/styles';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-dvh min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        background: `linear-gradient(130deg, ${C.serenity}, ${C.roseQuartz})`,
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      {children}
    </div>
  );
}
