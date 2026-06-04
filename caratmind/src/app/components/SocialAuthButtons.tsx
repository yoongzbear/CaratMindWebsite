'use client';

import { C } from '@/app/styles/styles';

export function SocialAuthButtons({ nextPath }: { nextPath?: string | null }) {
  const nextQuery = nextPath ? `&next=${encodeURIComponent(nextPath)}` : '';

  return (
    <div style={{ marginTop: '18px' }}>
      <p
        style={{
          margin: '0 0 12px',
          textAlign: 'center',
          fontSize: '12px',
          color: C.faint,
        }}
      >
        Or continue with
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a
          href={`/api/auth/oauth?provider=Google${nextQuery}`}
          style={socialButtonStyle}
        >
          Continue with Google
        </a>
        <a
          href={`/api/auth/oauth?provider=Facebook${nextQuery}`}
          style={socialButtonStyle}
        >
          Continue with Facebook
        </a>
      </div>
    </div>
  );
}

const socialButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '11px 14px',
  borderRadius: '10px',
  border: `1px solid ${C.border}`,
  background: 'white',
  color: C.navy,
  fontSize: '13px',
  fontWeight: 600,
  textDecoration: 'none',
  fontFamily: 'inherit',
};
