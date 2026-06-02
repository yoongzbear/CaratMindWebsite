'use client';
//
// Visual structure:
// ┌──────────────────────────────────────────────┐
// │                   HEADER                     │  ← sticky, 68px, white + serenity border
// ├──────────────────────────────────────────────┤
// │                                              │
// │               {children}                    │  ← your page content goes here
// │                                              │
// ├──────────────────────────────────────────────┤
// │                   FOOTER                     │  ← rose quartz → serenity gradient
// └──────────────────────────────────────────────┘
//
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD CONTENT IN THE BODY
// ─────────────────────────────────────────────────────────────────────────────
//
// The body renders {children} — each page you create is a "child" of this layout.
// Here's how to build each section of a page:
//
// 1. HERO SECTION (top banner with headline + CTA button)
//    → Create a full-width <section> with a soft gradient background, a large
//      heading, a subtitle paragraph, and a <Link> styled as a button.
//    → File suggestion: src/app/(public)/home/HeroSection.tsx
//
// 2. FEATURE / SERVICE CARDS (grid of cards explaining your services)
//    → Use a CSS grid (display:'grid', gridTemplateColumns:'repeat(3,1fr)')
//      with white cards, a subtle border, and an icon at the top.
//    → File suggestion: src/app/(public)/home/ServicesGrid.tsx
//
// 3. STATS / NUMBERS BAR (e.g. "500+ clients helped")
//    → A horizontal strip with 3–4 stat boxes; use the C.serenity colour for
//      the number and C.navy for the label.
//    → File suggestion: src/app/(public)/home/StatsBar.tsx
//
// 4. TESTIMONIALS (quotes from patients / users)
//    → A horizontal scroll or a 2-column grid of quote cards.
//      Each card: avatar initials circle + quote text + name.
//    → File suggestion: src/app/(public)/home/Testimonials.tsx
//
// 5. APPOINTMENT / CONTACT FORM
//    → A centered card with <input> / <textarea> / <select> fields using the
//      existing `styles.input`, `styles.label`, and `styles.button` from styles.ts.
//    → File suggestion: src/app/(public)/contact/ContactForm.tsx
//
// 6. RESOURCES / ARTICLES LIST
//    → A vertically stacked list or 2-column grid of article cards.
//      Each card: category tag + title + short excerpt + "Read more" link.
//    → File suggestion: src/app/(public)/resources/ArticleList.tsx
//
// 7. FAQ ACCORDION
//    → useState to track which item is open; map over a Q&A array and show
//      the answer only when the item is active.
//    → File suggestion: src/app/(public)/resources/FAQ.tsx
//
// 8. TEAM / THERAPIST PROFILES
//    → A 3-column grid of cards: photo (or initials avatar) + name + title +
//      short bio + "Book a session" link.
//    → File suggestion: src/app/(public)/about/TeamGrid.tsx
//
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE THIS LAYOUT IN app/layout.tsx (Next.js App Router)
// ─────────────────────────────────────────────────────────────────────────────
//
//   // app/(public)/layout.tsx
//   import MentalHealthLayout from '@/components/MentalHealthLayout';
//
//   export default function PublicLayout({ children }: { children: React.ReactNode }) {
//     return <MentalHealthLayout>{children}</MentalHealthLayout>;
//   }
//
//   Then every page inside app/(public)/ automatically gets the header + footer.
//
// ─────────────────────────────────────────────────────────────────────────────

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
      {/* Google Font import — move to a global CSS file if preferred */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`}</style>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <Header />

      {/* ── Page body ───────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1, // ← pushes footer to the bottom
          background: '#ffffff',
          width: '100%',
        }}
      >
        {/*
         * PLACEHOLDER — remove this block once you have real page content.
         * Each route inside app/(public)/ renders as {children} here.
         */}
        {children ?? (
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '80px 32px',
              textAlign: 'center',
              color: '#b0bcd4',
              fontSize: '15px',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧠</div>
            <div
              style={{
                fontWeight: 600,
                fontSize: '18px',
                color: '#3a4a6b',
                marginBottom: '8px',
              }}
            >
              Your content goes here
            </div>
            <div>
              Create a page component and pass it as a child to this layout.
              <br />
              See the comments in <code>MentalHealthLayout.tsx</code> for a full
              guide.
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
