import type { Metadata, Viewport } from 'next';
import { DM_Sans, Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutShell } from '../components/LayoutShell';
import { ClientToastContainer } from '../components/ClientToastContainer';
import { HelplineModalProvider } from '../components/HelplineModalProvider';
import '@daypicker/react/style.css';
import { OnboardingProvider } from '../components/OnboardingProvider';
import '../styles/themes';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaratMind',
  description: 'Mental Health Support System',
  icons: {
    icon: '/assets/CM_mini.png',
    shortcut: '/assets/CM_mini.png',
    apple: '/assets/CM_mini.png',
  },
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
    <html
      lang="en"
      data-theme="light"
      className={cn('font-sans', geist.variable)}
    >
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
        <TooltipProvider>
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
        </TooltipProvider>
      </body>
    </html>
  );
}
