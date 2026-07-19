// import { styles } from '@/app/styles/styles';
import { HELPLINES } from '@/app/copywriting/helpline';
import { Clock, Phone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function HelplinePage() {
  // const { theme } = useTheme();
  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: 'var(--bg)',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-0.5"
            style={{ color: 'var(--text)' }}
          >
            Emergency Helplines
          </h1>
          <p
            className="mt-0 mb-2.5 text-[clamp(1rem,1.5vw,1.25rem)] font-medium"
            style={{ color: 'var(--text)' }}
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
              className="flex flex-col gap-2.5 rounded-[14px] mb-0 px-6 py-5.5"
              style={{
                backgroundColor: 'var(--bg-div)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              }}
            >
              <div className="flex justify-between items-start gap-3">
                <h4
                  className="font-semibold text-[clamp(1.1rem,4vw,1.65rem)]"
                  style={{ color: 'var(--text)' }}
                >
                  {line.name}
                </h4>
              </div>
              <p
                className="m-0 text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.65] flex-1"
                style={{
                  color: 'var(--text)',
                }}
              >
                {line.description}
              </p>
              {line.available && (
                <p
                  className="inline-flex gap-1.5 font-semibold m-0 text-[clamp(0.875rem,1.5vw,1rem)]"
                  style={{ color: 'var(--text)' }}
                >
                  <Clock size={20} />
                  {line.available}
                </p>
              )}
              <a
                href={line.tel}
                className="inline-flex items-center gap-1.5 mt-1 text-[clamp(0.875rem,1.5vw,1rem)] font-bold no-underline"
                style={{
                  color: 'var(--text)',
                }}
              >
                <Phone size={20} />
                {line.contact}
              </a>
              <a
                href={line.href}
                className="inline-flex items-center gap-1.5 mt-1 text-[clamp(0.875rem,1.5vw,1rem)] font-bold underline hover:no-underline"
                style={{
                  color: 'var(--second-color)',
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
            color: 'var(--text)',
          }}
        >
          Numbers and availability may change. Verify details with the service
          provider.
        </p>
      </div>
    </section>
  );
}
