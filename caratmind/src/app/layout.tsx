import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutShell } from '../components/LayoutShell';
import { ClientToastContainer } from '../components/ClientToastContainer';
import { HelplineModalProvider } from '../components/HelplineModalProvider';
import '@daypicker/react/style.css';
import { OnboardingProvider } from '../components/OnboardingProvider';
import '../styles/themes';
import { ThemeProvider } from '@/context/ThemeContext';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaratMind',
  description: 'Mental Health Support System',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
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
          <ThemeProvider>
            <OnboardingProvider>
              <LayoutShell>
                {children}
                <HelplineModalProvider />
              </LayoutShell>
            </OnboardingProvider>
            <ClientToastContainer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
