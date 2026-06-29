import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutShell } from './components/LayoutShell';
import { ClientToastContainer } from './components/ClientToastContainer';
import HelplineModal from './components/modal/HelplineModal';
import { useMoodStreakAlert } from './hooks/negativeMoodStreak';
import { HelplineModalProvider } from './components/HelplineModalProvider';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaratMind',
  description: 'Mental Health Support System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={dmSans.className}
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff8f8',
        }}
      >
        <AuthProvider>
          <LayoutShell>
            {children}
            <HelplineModalProvider />
          </LayoutShell>
          <ClientToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
