// This is the ROOT layout. It wraps EVERY page in the app.
// The MainLayout component (sidebar + topbar) lives here.

import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
// import Web3ContextProvider from '@/context/web3';
// import { ClientToastContainer } from '@/app/components/ClientToastContainer';
// import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaratMind',
  description: 'Mental Health Support System',
};

export default async function RootLayout({
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
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        {/* <Web3ContextProvider cookies={cookies}>{children}</Web3ContextProvider> */}
        {/* <ClientToastContainer /> */}
      </body>
    </html>
  );
}
