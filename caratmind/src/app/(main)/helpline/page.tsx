import Link from 'next/link';
import { C, styles } from '@/app/styles/styles';
import { HELPLINES } from '@/app/copywriting/helpline';

export default function HelplinePage() {
  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[90%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0 0 8px' }}>
            Emergency Helplines
          </h1>
          <p style={{ ...styles.subtitle, fontSize: '14px' }}>
            If you are in crisis or need urgent support, reach out to a
            qualified professional or emergency service. CaratMind is not a
            substitute for licensed care or emergency response.
          </p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4.5">
          {HELPLINES.map((line) => (
            <article
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
              <div className="flex justify-between items-start gap-3">
                <h2 style={{ ...styles.title, margin: 0, fontSize: '16px' }}>
                  {line.name}
                </h2>
              </div>
              <p
                className="m-0 text-[13px] leading-[1.65] flex-1"
                style={{
                  color: C.muted,
                }}
              >
                {line.description}
              </p>
              {line.available && (
                <p className="m-0 text-[11px]" style={{ color: C.faint }}>
                  {line.available}
                </p>
              )}
              <a
                href={line.href}
                className="inline-flex items-center gap-1.5 mt-1 text-[15px] font-bold no-underline"
                style={{
                  color: C.navy,
                }}
              >
                {line.contact}
              </a>
            </article>
          ))}
        </div>

        <p
          className="mt-7 text-[12px] text-center leading-[1.7]"
          style={{
            color: C.faint,
          }}
        >
          Numbers and availability may change. Verify details with the service
          provider.
        </p>
      </div>
    </section>
  );
}
