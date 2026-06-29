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
      <div className="w-[80%] mx-auto">
        <header className="mb-3">
          <h1
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-0.5"
            style={{ color: C.navy }}
          >
            Emergency Helplines
          </h1>
          <p
            className="mt-0 mb-2.5 sm:text-[14px] md:text-[16px]"
            style={{ color: C.navy }}
          >
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
                <h4
                  className="font-semibold sm:text-[22px] md:text-[26px]"
                  style={{ color: C.navy }}
                >
                  {line.name}
                </h4>
              </div>
              <p
                className="m-0 sm:text-[14px] md:text-[16px] leading-[1.65] flex-1"
                style={{
                  color: C.navy,
                }}
              >
                {line.description}
              </p>
              {line.available && (
                <p
                  className="m-0 sm:text-[12px] md:text-[14px]"
                  style={{ color: C.muted }}
                >
                  {line.available}
                </p>
              )}
              <a
                href={line.tel}
                className="inline-flex items-center gap-1.5 mt-1 sm:text-[12px] md:text-[14px] font-bold no-underline"
                style={{
                  color: C.navy,
                }}
              >
                {line.contact}
              </a>
              <a
                href={line.href}
                className="inline-flex items-center gap-1.5 mt-1 sm:text-[12px] md:text-[14px] font-bold underline"
                style={{
                  color: C.serenity,
                }}
              >
                {line.web}
              </a>
            </article>
          ))}
        </div>

        <p
          className="mt-7 sm:text-[16px] md:text-[18px] text-center leading-[1.7]"
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
