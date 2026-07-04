'use client';

import Header from './Header';
import Footer from './Footer';

export default function MentalHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: '"DM Sans", sans-serif',
        background: '#ffffff',
      }}
    >
      {/* Google Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`}</style>

      <Header />

      <main
        style={{
          flex: 1,
          background: '#ffffff',
          width: '100%',
        }}
      ></main>

      <Footer />
    </div>
  );
}
