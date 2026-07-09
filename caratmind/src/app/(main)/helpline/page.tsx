import Link from 'next/link';
import { C, styles } from '@/app/styles/styles';
import { HELPLINES } from '@/app/copywriting/helpline';
import { Clock, Phone } from 'lucide-react';

export default function HelplinePage() {
  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-0.5"
            style={{ color: C.navy }}
          >
            Emergency Helplines
          </h1>
          <p
            className="mt-0 mb-2.5 text-[clamp(1rem,1.5vw,1.25rem)] font-medium"
            style={{ color: C.navy }}
          >
            If you are in crisis or need urgent support, reach out to a
            qualified professional or emergency service. <br />
            CaratMind is not a substitute for licensed care or emergency
            response.
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
                  className="font-semibold text-[clamp(1.1rem,4vw,1.65rem)]"
                  style={{ color: C.navy }}
                >
                  {line.name}
                </h4>
              </div>
              <p
                className="m-0 text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.65] flex-1"
                style={{
                  color: C.navy,
                }}
              >
                {line.description}
              </p>
              {line.available && (
                <p
                  className="inline-flex gap-1.5 font-semibold m-0 text-[clamp(0.875rem,1.5vw,1rem)]"
                  style={{ color: C.navy }}
                >
                  <Clock size={20} />
                  {line.available}
                </p>
              )}
              <a
                href={line.tel}
                className="inline-flex items-center gap-1.5 mt-1 text-[clamp(0.875rem,1.5vw,1rem)] font-bold no-underline"
                style={{
                  color: C.navy,
                }}
              >
                <Phone size={20} />
                {line.contact}
              </a>
              <a
                href={line.href}
                className="inline-flex items-center gap-1.5 mt-1 text-[clamp(0.875rem,1.5vw,1rem)] font-bold underline hover:no-underline"
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
          className="mt-7 text-[clamp(1rem,2vw,1.15rem)] text-center leading-[1.7]"
          style={{
            color: C.navy,
          }}
        >
          Numbers and availability may change. Verify details with the service
          provider.
        </p>
      </div>
    </section>
  );
}
