'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { themes, ThemeName } from '@/styles/themes';
import {
  gradientButton,
  greenButton,
  greyButton,
  redButton,
} from '@/styles/ui';
import { Trash } from 'lucide-react';

const THEME_OPTIONS: { name: ThemeName; label: string }[] = [
  { name: 'light', label: 'Carat Light' },
  { name: 'dark', label: 'Dark' },
  { name: 'cherryBlossoms', label: 'Cherry Blossoms' },
  { name: 'ocean', label: 'Ocean' },
  { name: 'forest', label: 'Wicked Forest' },
  { name: 'sunset', label: 'Sunset' },
  { name: 'winter', label: 'Winter' },
  { name: 'emeraldSea', label: 'Emerald Sea' },
  { name: 'midnightSun', label: 'Midnight Sun' },
];

export default function ThemePage() {
  const { theme: savedTheme, setTheme, saving } = useTheme();

  const [previewTheme, setPreviewTheme] = useState<ThemeName>(savedTheme);

  const t = themes[previewTheme]; // preview panel
  const hasChanges = previewTheme !== savedTheme;

  const handleSave = () => {
    setTheme(previewTheme); // apply to actual theme
  };

  return (
    <section
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-12"
      style={{
        background: 'var(--bg)',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Theme
          </h1>
          <h5
            className="text-[clamp(0.875rem,1.5vw,1rem)] font-medium mt-0.5 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Pick a theme, preview it below, then save to sync it across your
            devices.
          </h5>
        </header>

        {/* theme sample */}
        <div
          className="mb-3 grid grid-cols-2 sm:grid-cols-3 gap-3"
          id="theme-list"
        >
          {THEME_OPTIONS.map((option) => {
            const optTheme = themes[option.name];
            const isSelected = previewTheme === option.name;
            return (
              <button
                key={option.name}
                onClick={() => setPreviewTheme(option.name)}
                className="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-0 rounded-md border-2 p-3 text-left transition-all"
                style={{
                  borderColor: isSelected ? optTheme.text : optTheme.border,
                  background: optTheme.bg,
                }}
              >
                <div
                  className="h-8 w-8 md:w-full rounded-full md:rounded-lg mb-2"
                  style={{
                    background: `linear-gradient(130deg, ${optTheme.secondColor}, ${optTheme.firstColor})`,
                  }}
                />
                <div className="flex items-center">
                  <span
                    className="text-[clamp(0.875rem,1.5vw,1rem)] font-medium"
                    style={{ color: optTheme.text }}
                  >
                    {option.label}
                  </span>

                  {option.name === savedTheme && (
                    <span
                      className="text-[clamp(0.7rem,1.5vw,0.85rem)] ml-2"
                      style={{ color: optTheme.muted }}
                    >
                      Current
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* preview */}
        <div
          className="rounded-[10px] border p-5 space-y-5"
          style={{ borderColor: t.border, background: t.bg }}
          id="theme-preview"
        >
          <h3
            className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
            style={{ color: t.text }}
          >
            Preview
          </h3>

          <div className="lg:grid lg:grid-cols-2 space-y-5">
            <p
              className="text-[clamp(1rem,2vw,1.15rem)]"
              style={{ color: t.text }}
            >
              This is body text in the selected theme.
            </p>
            <p
              className="text-[clamp(1rem,2vw,1.15rem)]"
              style={{ color: t.muted }}
            >
              This is muted text.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button {...gradientButton(previewTheme)}>Button</button>
              <button {...greenButton(previewTheme)}>Button</button>
              <button {...redButton(previewTheme)}>Button</button>
              <button {...greyButton(previewTheme)}>Button</button>
            </div>

            <input
              type="text"
              placeholder="Sample input"
              className="w-full h-min text-[clamp(0.875rem,1.5vw,1rem)] rounded-lg border px-3 py-2 outline-none"
              style={{
                borderColor: t.border,
                color: t.text,
                backgroundColor: t.bgDiv ? t.bgDiv : 'white',
              }}
            />
          </div>
        </div>

        {/* Save bar */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            {...gradientButton(savedTheme)}
            id="button-apply-theme"
          >
            {saving ? 'Applying...' : 'Apply Theme'}
          </button>

          {!saving && (
            <button
              onClick={() => setPreviewTheme(savedTheme)}
              className="flex gap-1 text-[clamp(0.875rem,1.5vw,1rem)]"
              style={{ color: 'var(--muted)' }}
              disabled={!hasChanges}
              id="button-discard"
            >
              <Trash />
              Discard Changes
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
