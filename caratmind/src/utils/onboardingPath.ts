import { UserOnboarding } from '@/types/user';

export const ONBOARDING_KEY: Record<string, keyof UserOnboarding> = {
  '/home': 'home',
  '/journal/new': 'new_entry',
  '/journal/edit': 'edit_entry',
  '/journal/past': 'past_entry',
  '/journal/insight': 'journal_insights',
  '/mood': 'mood_charts',
  '/exercise/tracking': 'exc_track',
  '/exercise/catalog': 'exc_catalog',
  '/helpline': 'helpline',
  '/profile': 'profile',
  '/theme_select': 'theme',
};
