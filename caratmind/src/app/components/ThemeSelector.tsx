import { useTheme } from '@/context/ThemeContext';
import { ThemeName } from '../styles/themes';

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const options: ThemeName[] = [
    'light',
    'dark',
    'rose',
    'ocean',
    'forest',
    'sunset',
  ];

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemeName)}
    >
      {options.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
