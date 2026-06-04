import Link from 'next/link';
import { C, styles } from '@/app/styles/styles';
import { HELPLINES } from '@/app/copywriting/helpline';

export default function HomePage() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - 140px)',
        padding: '32px 24px 48px',
        background: C.bgPage,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ marginBottom: '28px' }}>
          <h1 style={{ ...styles.header1, margin: '0 0 8px' }}>HOME!!</h1>
          <p style={{ ...styles.subtitle, fontSize: '14px' }}>
            If you are in crisis or need urgent support, reach out to a
            qualified professional or emergency service. CaratMind is not a
            substitute for licensed care or emergency response.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '18px',
          }}
        >
          {HELPLINES.map((line) => (
            <article
              // key={`${line.region}-${line.name}`}
              key={line.name}
              style={{
                ...styles.div,
                marginBottom: 0,
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <h2 style={{ ...styles.title, margin: 0, fontSize: '16px' }}>
                  {line.name}
                </h2>
                {/* <span
                  style={{
                    ...styles.statusLabel,
                    background: 'rgba(146,168,209,0.12)',
                    color: C.serenity,
                    flexShrink: 0,
                  }}
                >
                  {line.region}
                </span> */}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: C.muted,
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                {line.description}
              </p>
              {line.available && (
                <p style={{ margin: 0, fontSize: '11px', color: C.faint }}>
                  {line.available}
                </p>
              )}
              <a
                href={line.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: C.navy,
                  textDecoration: 'none',
                }}
              >
                {line.contact}
              </a>
            </article>
          ))}
        </div>

        <p
          style={{
            marginTop: '28px',
            fontSize: '12px',
            color: C.faint,
            textAlign: 'center',
            lineHeight: 1.7,
          }}
        >
          Numbers and availability may change. Verify details with the service
          provider.
        </p>
      </div>
    </section>
  );
}
