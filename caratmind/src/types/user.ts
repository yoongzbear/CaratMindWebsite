export type SessionUser = {
  username: string;
  email?: string;
  preferredUsername?: string;
  // completedOnboarding?: string;
  onboarding: UserOnboarding;
};

export type UserOnboarding = {
  home: boolean;
  new_entry: boolean;
  edit_entry: boolean;
  past_entry: boolean;
  journal_insights: boolean;
  mood_charts: boolean;
  exc_track: boolean;
  exc_catalog: boolean;
  helpline: boolean;
  profile: boolean;
  theme: boolean;
};
